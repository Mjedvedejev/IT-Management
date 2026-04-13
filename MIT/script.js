const API_BASE = "";

function getToken() {
return localStorage.getItem("authToken") || "";
}

function getCurrentUser() {
const raw = localStorage.getItem("authUser");
if(!raw) return null;

try {
return JSON.parse(raw);
}
catch(error) {
return null;
}
}

function setSession(token, user) {
localStorage.setItem("authToken", token);
localStorage.setItem("authUser", JSON.stringify(user));
}

function clearSession() {
localStorage.removeItem("authToken");
localStorage.removeItem("authUser");
}

function escapeHtml(value) {
return String(value)
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/\"/g, "&quot;")
.replace(/'/g, "&#039;");
}

async function requestJson(url, options = {}) {
const token = getToken();
const headers = {
"Content-Type": "application/json",
...(options.headers || {})
};

if(token) {
headers.Authorization = `Bearer ${token}`;
}

const response = await fetch(`${API_BASE}${url}`, {
...options,
headers
});

let data = {};
try {
data = await response.json();
}
catch(error) {
// Non-JSON responses are handled by status checks below.
}

if(!response.ok) {
const message = data && data.error ? data.error : `Request failed: ${response.status}`;
throw new Error(message);
}

return data;
}

function setAuthMessage(text, isError) {
const messageEl = document.getElementById("authMsg");
if(!messageEl) return;

messageEl.textContent = text;
messageEl.style.color = isError ? "#b00020" : "#1f6f43";
}

function renderUserBadge() {
const badge = document.getElementById("userBadge");
if(!badge) return;

const user = getCurrentUser();
if(!user) {
badge.textContent = "Not signed in";
return;
}

badge.textContent = `Signed in as ${user.username} (${user.role})`;
}

async function registerUser(event) {
event.preventDefault();

const username = document.getElementById("registerUsername").value.trim();
const password = document.getElementById("registerPassword").value;
const role = document.getElementById("registerRole").value;

if(!username || !password || !role) {
setAuthMessage("Please fill in all register fields.", true);
return;
}

try {
await requestJson("/api/auth/register", {
method: "POST",
body: JSON.stringify({ username, password, role })
});

setAuthMessage("Registered successfully. You can now sign in.", false);
(event.target).reset();
}
catch(error) {
setAuthMessage(error.message, true);
}
}

async function loginUser(event) {
event.preventDefault();

const username = document.getElementById("loginUsername").value.trim();
const password = document.getElementById("loginPassword").value;

if(!username || !password) {
setAuthMessage("Please enter username and password.", true);
return;
}

try {
const data = await requestJson("/api/auth/login", {
method: "POST",
body: JSON.stringify({ username, password })
});

setSession(data.token, data.user);
renderUserBadge();
setAuthMessage("Signed in successfully.", false);
}
catch(error) {
setAuthMessage(error.message, true);
}
}

async function logoutUser() {
try {
if(getToken()) {
await requestJson("/api/auth/logout", { method: "POST" });
}
}
catch(error) {
// We still clear local session even when server token cleanup fails.
}

clearSession();
renderUserBadge();
setAuthMessage("Signed out.", false);
}

function initAuthPage() {
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const logoutBtn = document.getElementById("logoutBtn");

if(!loginForm || !registerForm || !logoutBtn) return;

loginForm.addEventListener("submit", loginUser);
registerForm.addEventListener("submit", registerUser);
logoutBtn.addEventListener("click", logoutUser);

renderUserBadge();
}

async function setTransportDecision(status) {
const check = document.getElementById("acceptCheck");
const msg = document.getElementById("acceptMsg");
const userInput = document.getElementById("transportUser");
const reasonInput = document.getElementById("transportReason");

if(!msg) return;

const decidedBy = userInput ? userInput.value.trim() : "";
const reason = reasonInput ? reasonInput.value.trim() : "";

if(!getToken()) {
msg.textContent = "Please sign in as driver/admin first.";
msg.style.color = "red";
return;
}

if(!decidedBy) {
msg.textContent = "Please enter who made the decision.";
msg.style.color = "red";
return;
}

if(status === "accepted" && (!check || !check.checked)) {
msg.textContent = "Please accept the conditions first.";
msg.style.color = "red";
return;
}

try {
await requestJson("/api/transport/decision", {
method: "POST",
body: JSON.stringify({
status,
decidedBy,
reason
})
});

msg.textContent = status === "accepted"
? "Transport accepted successfully."
: "Transport declined successfully.";
msg.style.color = status === "accepted" ? "green" : "#b00020";

displayTransportStatus();
displayTransportHistory();
}
catch(error) {
msg.textContent = error.message;
msg.style.color = "red";
}
}

function acceptTransport() {
setTransportDecision("accepted");
}

function declineTransport() {
setTransportDecision("declined");
}

async function displayTransportStatus() {
const statusEl = document.getElementById("transportStatus");
if(!statusEl) return;

try {
const data = await requestJson("/api/transport/latest");
if(!data.decision) {
statusEl.textContent = "No decision has been submitted yet.";
return;
}

const label = data.decision.status === "accepted" ? "Accepted" : "Declined";
const reasonText = data.decision.reason ? ` Reason: ${data.decision.reason}.` : "";
statusEl.textContent = `${label} by ${data.decision.decided_by} at ${data.decision.created_at}.${reasonText}`;
}
catch(error) {
statusEl.textContent = "Unable to load transport status.";
}
}

async function displayTransportHistory() {
const historyEl = document.getElementById("transportHistory");
if(!historyEl) return;

try {
const data = await requestJson("/api/transport/history");
const decisions = data.decisions || [];

if(decisions.length === 0) {
historyEl.innerHTML = "<p>No decisions yet.</p>";
return;
}

historyEl.innerHTML = "";

decisions.forEach(decision => {
const row = document.createElement("div");
row.classList.add("decision-row");

const status = decision.status === "accepted" ? "Accepted" : "Declined";
const reason = decision.reason ? `<span class=\"decision-reason\">Reason: ${escapeHtml(decision.reason)}</span>` : "";

row.innerHTML = `
<div class="decision-main">${status} by ${escapeHtml(decision.decided_by)}</div>
<div class="decision-time">${escapeHtml(decision.created_at)}</div>
${reason}
`;

historyEl.appendChild(row);
});
}
catch(error) {
historyEl.innerHTML = "<p>Unable to load decision history.</p>";
}
}

async function addLogs(event) {
event.preventDefault();

if(!getToken()) {
alert("Sign in as owner/admin before adding logs.");
return;
}

const owner = document.getElementById("ownerType").value;
const location = document.getElementById("location").value;
const volume = document.getElementById("volume").value;
const date = document.getElementById("date").value;

const newLog = {
owner,
location,
volume: Number(volume),
date
};

try {
await requestJson("/api/logs", {
method: "POST",
body: JSON.stringify(newLog)
});

alert("Logs added successfully!");

const form = document.getElementById("logForm");
if(form) {
form.reset();
}
}
catch(error) {
alert(error.message);
}
}

async function updateLogStatus(logId, status) {
try {
await requestJson(`/api/logs/${logId}/status`, {
method: "PATCH",
body: JSON.stringify({ status })
});

displayLogs();
displayStats();
}
catch(error) {
alert(error.message);
}
}

function getStatusActions(log) {
const user = getCurrentUser();
if(!user || (user.role !== "driver" && user.role !== "admin")) {
return "";
}

return `
<div class="status-actions">
<button class="button" onclick="updateLogStatus(${log.id}, 'accepted')">Accept</button>
<button class="button button-danger" onclick="updateLogStatus(${log.id}, 'declined')">Decline</button>
<button class="button button-secondary" onclick="updateLogStatus(${log.id}, 'completed')">Complete</button>
</div>
`;
}

async function displayLogs() {
const container = document.getElementById("logsContainer");
if(!container) return;

try {
const data = await requestJson("/api/logs");
const logs = data.logs || [];

container.innerHTML = "";

logs.forEach(log => {
const card = document.createElement("div");
card.classList.add("card");

card.innerHTML = `
<h3>${escapeHtml(log.location)}</h3>
<p>Owner: ${escapeHtml(log.owner)}</p>
<p>Volume: ${escapeHtml(log.volume)} m3</p>
<p>Pickup Date: ${escapeHtml(log.date)}</p>
<p>Status: <span class="status-pill status-${escapeHtml(log.status)}">${escapeHtml(log.status)}</span></p>
<a class="button" href="accept.html">View Transport</a>
${getStatusActions(log)}
`;

container.appendChild(card);
});
}
catch(error) {
container.innerHTML = "<p>Unable to load logs. Start the server to use SQLite storage.</p>";
}
}

async function displayStats() {
const panel = document.getElementById("statsPanel");
if(!panel) return;

try {
const data = await requestJson("/api/stats");
const stats = data.stats || {};

panel.innerHTML = `
<div class="stats-grid">
<div class="stat-item"><span>Total logs</span><strong>${stats.totalLogs || 0}</strong></div>
<div class="stat-item"><span>Accepted</span><strong>${stats.acceptedDecisions || 0}</strong></div>
<div class="stat-item"><span>Declined</span><strong>${stats.declinedDecisions || 0}</strong></div>
<div class="stat-item"><span>Completed logs</span><strong>${stats.completedLogs || 0}</strong></div>
<div class="stat-item"><span>Pending logs</span><strong>${stats.pendingLogs || 0}</strong></div>
</div>
`;
}
catch(error) {
panel.innerHTML = "<p>Unable to load stats.</p>";
}
}

async function renderChatMessages() {
const list = document.getElementById("chatMessages");
if(!list) return;

try {
const data = await requestJson("/api/chat");
const messages = data.messages || [];

list.innerHTML = "";

if(messages.length === 0) {
const empty = document.createElement("p");
empty.classList.add("chat-empty");
empty.textContent = "No messages yet. Start the conversation.";
list.appendChild(empty);
return;
}

messages.forEach(message => {
const item = document.createElement("div");
item.classList.add("chat-message");

item.innerHTML = `
<div class="chat-meta">${escapeHtml(message.user)} • ${escapeHtml(message.created_at)}</div>
<div class="chat-text">${escapeHtml(message.text)}</div>
`;

list.appendChild(item);
});
}
catch(error) {
list.innerHTML = "<p>Unable to load chat messages.</p>";
}
}

async function addChatMessage(event) {
event.preventDefault();

const usernameInput = document.getElementById("chatUsername");
const messageInput = document.getElementById("chatInput");
if(!usernameInput || !messageInput) return;

const user = usernameInput.value.trim();
const text = messageInput.value.trim();

if(!user || !text) return;

localStorage.setItem("chatUsername", user);

try {
await requestJson("/api/chat", {
method: "POST",
body: JSON.stringify({ user, text })
});

messageInput.value = "";
renderChatMessages();
}
catch(error) {
alert(error.message);
}
}

function initChat() {
const usernameInput = document.getElementById("chatUsername");
const form = document.getElementById("chatForm");
if(!usernameInput || !form) return;

const storedName = localStorage.getItem("chatUsername");
if(storedName) {
usernameInput.value = storedName;
}

form.addEventListener("submit", addChatMessage);
renderChatMessages();
}

window.addEventListener("load", () => {
renderUserBadge();
initAuthPage();
displayLogs();
displayStats();
displayTransportStatus();
displayTransportHistory();
initChat();
});
