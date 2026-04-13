const path = require("path");
const crypto = require("crypto");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "lagersync.db");

const db = new sqlite3.Database(dbPath, error => {
if(error) {
console.error("Failed to connect to SQLite:", error.message);
process.exit(1);
}
});

function hashPassword(password) {
return crypto.createHash("sha256").update(password).digest("hex");
}

function randomToken() {
return crypto.randomBytes(24).toString("hex");
}

function runAsync(sql, params = []) {
return new Promise((resolve, reject) => {
db.run(sql, params, function onRun(error) {
if(error) {
reject(error);
return;
}

resolve(this);
});
});
}

function getAsync(sql, params = []) {
return new Promise((resolve, reject) => {
db.get(sql, params, (error, row) => {
if(error) {
reject(error);
return;
}

resolve(row);
});
});
}

function allAsync(sql, params = []) {
return new Promise((resolve, reject) => {
db.all(sql, params, (error, rows) => {
if(error) {
reject(error);
return;
}

resolve(rows);
});
});
}

async function ensureColumn(tableName, columnName, alterSql) {
const columns = await allAsync(`PRAGMA table_info(${tableName})`);
const hasColumn = columns.some(column => column.name === columnName);

if(!hasColumn) {
await runAsync(alterSql);
}
}

async function initializeDatabase() {
await runAsync(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
role TEXT NOT NULL CHECK(role IN ('owner', 'driver', 'admin')),
created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`);

await runAsync(`
CREATE TABLE IF NOT EXISTS auth_tokens (
token TEXT PRIMARY KEY,
user_id INTEGER NOT NULL,
created_at TEXT DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(user_id) REFERENCES users(id)
)
`);

await runAsync(`
CREATE TABLE IF NOT EXISTS logs (
id INTEGER PRIMARY KEY AUTOINCREMENT,
owner TEXT NOT NULL,
location TEXT NOT NULL,
volume REAL NOT NULL,
date TEXT NOT NULL,
status TEXT NOT NULL DEFAULT 'pending',
created_by INTEGER,
created_at TEXT DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(created_by) REFERENCES users(id)
)
`);

await runAsync(`
CREATE TABLE IF NOT EXISTS transport_decisions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
status TEXT NOT NULL CHECK(status IN ('accepted', 'declined')),
decided_by TEXT NOT NULL DEFAULT 'Unknown',
reason TEXT DEFAULT '',
created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`);

await runAsync(`
CREATE TABLE IF NOT EXISTS chat_messages (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user TEXT NOT NULL,
text TEXT NOT NULL,
created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`);

await ensureColumn(
"logs",
"status",
"ALTER TABLE logs ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'"
);

await ensureColumn(
"logs",
"created_by",
"ALTER TABLE logs ADD COLUMN created_by INTEGER"
);

await ensureColumn(
"transport_decisions",
"decided_by",
"ALTER TABLE transport_decisions ADD COLUMN decided_by TEXT NOT NULL DEFAULT 'Unknown'"
);

await ensureColumn(
"transport_decisions",
"reason",
"ALTER TABLE transport_decisions ADD COLUMN reason TEXT DEFAULT ''"
);

const existingUsers = await allAsync("SELECT id FROM users LIMIT 1");
if(existingUsers.length === 0) {
const seedUsers = [
["owner", hashPassword("owner123"), "owner"],
["driver", hashPassword("driver123"), "driver"],
["admin", hashPassword("admin123"), "admin"]
];

for(const [username, passwordHash, role] of seedUsers) {
await runAsync(
"INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
[username, passwordHash, role]
);
}
}
}

app.use(express.json());
app.use(express.static(__dirname));

async function authenticate(req, res, next) {
const header = req.headers.authorization || "";
const token = header.startsWith("Bearer ") ? header.slice(7) : "";

if(!token) {
return res.status(401).json({ error: "Authentication required" });
}

try {
const session = await getAsync(
`SELECT users.id, users.username, users.role
FROM auth_tokens
JOIN users ON users.id = auth_tokens.user_id
WHERE auth_tokens.token = ?`,
[token]
);

if(!session) {
return res.status(401).json({ error: "Invalid session" });
}

req.user = session;
req.token = token;
next();
}
catch(error) {
res.status(500).json({ error: "Authentication failed" });
}
}

function requireRole(roles) {
return (req, res, next) => {
if(!req.user || !roles.includes(req.user.role)) {
return res.status(403).json({ error: "Insufficient permissions" });
}

next();
};
}

app.post("/api/auth/register", async (req, res) => {
const { username, password, role } = req.body;
const normalizedUsername = String(username || "").trim();
const normalizedRole = String(role || "").trim();

if(!normalizedUsername || !password || password.length < 6) {
return res.status(400).json({ error: "Username and password (min 6 chars) are required" });
}

if(!["owner", "driver"].includes(normalizedRole)) {
return res.status(400).json({ error: "Role must be owner or driver" });
}

try {
await runAsync(
"INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
[normalizedUsername, hashPassword(password), normalizedRole]
);

res.status(201).json({ message: "Registered successfully" });
}
catch(error) {
if(String(error.message).includes("UNIQUE")) {
return res.status(409).json({ error: "Username already exists" });
}

res.status(500).json({ error: "Registration failed" });
}
});

app.post("/api/auth/login", async (req, res) => {
const { username, password } = req.body;
const normalizedUsername = String(username || "").trim();

if(!normalizedUsername || !password) {
return res.status(400).json({ error: "Username and password are required" });
}

try {
const user = await getAsync(
"SELECT id, username, role, password_hash FROM users WHERE username = ?",
[normalizedUsername]
);

if(!user || user.password_hash !== hashPassword(password)) {
return res.status(401).json({ error: "Invalid credentials" });
}

const token = randomToken();
await runAsync("INSERT INTO auth_tokens (token, user_id) VALUES (?, ?)", [token, user.id]);

res.json({
token,
user: {
id: user.id,
username: user.username,
role: user.role
}
});
}
catch(error) {
res.status(500).json({ error: "Login failed" });
}
});

app.get("/api/auth/me", authenticate, (req, res) => {
res.json({ user: req.user });
});

app.post("/api/auth/logout", authenticate, async (req, res) => {
try {
await runAsync("DELETE FROM auth_tokens WHERE token = ?", [req.token]);
res.json({ message: "Logged out" });
}
catch(error) {
res.status(500).json({ error: "Logout failed" });
}
});

app.get("/api/logs", async (req, res) => {
try {
const rows = await allAsync(
"SELECT id, owner, location, volume, date, status, created_at FROM logs ORDER BY id DESC"
);
res.json({ logs: rows });
}
catch(error) {
res.status(500).json({ error: "Failed to load logs" });
}
});

app.post("/api/logs", authenticate, requireRole(["owner", "admin"]), async (req, res) => {
const { owner, location, volume, date } = req.body;

if(!owner || !location || volume === undefined || !date) {
return res.status(400).json({ error: "Missing required log fields" });
}

try {
const result = await runAsync(
"INSERT INTO logs (owner, location, volume, date, status, created_by) VALUES (?, ?, ?, ?, 'pending', ?)",
[owner, location, volume, date, req.user.id]
);

res.status(201).json({ id: result.lastID });
}
catch(error) {
res.status(500).json({ error: "Failed to save log" });
}
});

app.patch("/api/logs/:id/status", authenticate, requireRole(["driver", "admin"]), async (req, res) => {
const logId = Number(req.params.id);
const { status } = req.body;

if(!Number.isInteger(logId) || logId <= 0) {
return res.status(400).json({ error: "Invalid log id" });
}

if(!["pending", "accepted", "declined", "completed"].includes(String(status))) {
return res.status(400).json({ error: "Invalid status" });
}

try {
const result = await runAsync("UPDATE logs SET status = ? WHERE id = ?", [status, logId]);

if(result.changes === 0) {
return res.status(404).json({ error: "Log not found" });
}

res.json({ message: "Status updated" });
}
catch(error) {
res.status(500).json({ error: "Failed to update status" });
}
});

app.post("/api/transport/decision", authenticate, requireRole(["driver", "admin"]), async (req, res) => {
const { status, decidedBy, reason } = req.body;

if(status !== "accepted" && status !== "declined") {
return res.status(400).json({ error: "Invalid transport status" });
}

if(!decidedBy || !String(decidedBy).trim()) {
return res.status(400).json({ error: "Decision user is required" });
}

try {
const result = await runAsync(
"INSERT INTO transport_decisions (status, decided_by, reason) VALUES (?, ?, ?)",
[status, String(decidedBy).trim(), String(reason || "").trim()]
);

res.status(201).json({ id: result.lastID, status });
}
catch(error) {
res.status(500).json({ error: "Failed to save transport decision" });
}
});

app.get("/api/transport/latest", async (req, res) => {
try {
const row = await getAsync(
"SELECT id, status, decided_by, reason, created_at FROM transport_decisions ORDER BY id DESC LIMIT 1"
);
res.json({ decision: row || null });
}
catch(error) {
res.status(500).json({ error: "Failed to load transport decision" });
}
});

app.get("/api/transport/history", async (req, res) => {
const limit = Math.min(Number(req.query.limit) || 20, 100);

try {
const rows = await allAsync(
"SELECT id, status, decided_by, reason, created_at FROM transport_decisions ORDER BY id DESC LIMIT ?",
[limit]
);
res.json({ decisions: rows });
}
catch(error) {
res.status(500).json({ error: "Failed to load transport history" });
}
});

app.get("/api/transport/history.csv", async (req, res) => {
try {
const rows = await allAsync(
"SELECT id, status, decided_by, reason, created_at FROM transport_decisions ORDER BY id DESC"
);

const header = "id,status,decided_by,reason,created_at";
const body = rows.map(row => {
const escapedReason = String(row.reason || "").replace(/\"/g, "\"\"");
const escapedUser = String(row.decided_by || "").replace(/\"/g, "\"\"");
return `${row.id},${row.status},\"${escapedUser}\",\"${escapedReason}\",${row.created_at}`;
}).join("\n");

res.setHeader("Content-Type", "text/csv");
res.setHeader("Content-Disposition", "attachment; filename=transport-history.csv");
res.send(`${header}\n${body}`);
}
catch(error) {
res.status(500).json({ error: "Failed to export CSV" });
}
});

app.get("/api/stats", async (req, res) => {
try {
const totalLogsRow = await getAsync("SELECT COUNT(*) AS total_logs FROM logs");
const acceptedRow = await getAsync("SELECT COUNT(*) AS accepted_count FROM transport_decisions WHERE status = 'accepted'");
const declinedRow = await getAsync("SELECT COUNT(*) AS declined_count FROM transport_decisions WHERE status = 'declined'");
const completedRow = await getAsync("SELECT COUNT(*) AS completed_count FROM logs WHERE status = 'completed'");
const pendingRow = await getAsync("SELECT COUNT(*) AS pending_count FROM logs WHERE status = 'pending'");

res.json({
stats: {
totalLogs: totalLogsRow ? totalLogsRow.total_logs : 0,
acceptedDecisions: acceptedRow ? acceptedRow.accepted_count : 0,
declinedDecisions: declinedRow ? declinedRow.declined_count : 0,
completedLogs: completedRow ? completedRow.completed_count : 0,
pendingLogs: pendingRow ? pendingRow.pending_count : 0
}
});
}
catch(error) {
res.status(500).json({ error: "Failed to load stats" });
}
});

app.get("/api/chat", async (req, res) => {
try {
const rows = await allAsync(
"SELECT id, user, text, created_at FROM chat_messages ORDER BY id DESC LIMIT 200"
);

res.json({ messages: rows.reverse() });
}
catch(error) {
res.status(500).json({ error: "Failed to load chat messages" });
}
});

app.post("/api/chat", async (req, res) => {
const { user, text } = req.body;

if(!user || !text) {
return res.status(400).json({ error: "User and text are required" });
}

try {
const result = await runAsync(
"INSERT INTO chat_messages (user, text) VALUES (?, ?)",
[user, text]
);

res.status(201).json({ id: result.lastID });
}
catch(error) {
res.status(500).json({ error: "Failed to save chat message" });
}
});

initializeDatabase()
.then(() => {
app.listen(PORT, () => {
console.log(`LagerSync server is running on http://localhost:${PORT}`);
});
})
.catch(error => {
console.error("Database initialization failed:", error.message);
process.exit(1);
});

process.on("SIGINT", () => {
db.close();
process.exit(0);
});
