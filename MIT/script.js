/* =========================================================
   LAGERSYNC FRONTEND CONTROLLER
   - Handles auth
   - Handles logs
   - Handles transport
   - Handles chat
   - Handles UI rendering
========================================================= */

/* =========================
   CONFIG
========================= */

const API_BASE = "";
// When true the frontend will use a client-side mock backend
// backed by `localStorage` so the app can run as a static site
// (e.g. GitHub Pages) without a server or database.
const USE_LOCAL_BACKEND = true;

/* =========================
   AUTH STORAGE HELPERS
========================= */

function getToken() {
  return localStorage.getItem("authToken") || "";
}

function getCurrentUser() {
  const raw = localStorage.getItem("authUser");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
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

/* =========================
   SECURITY HELPERS
========================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================
   API WRAPPER
========================= */

async function requestJson(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // If running in static/local mode, route requests to the in-browser
  // mock backend implemented below.
  if (USE_LOCAL_BACKEND) {
    return handleLocalRequest(url, { ...options, headers });
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  let data = {};
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
}

/* =========================================================
   LOCALSTORAGE MOCK BACKEND (for static hosting)
   Implements a tiny subset of the server API so the UI works
   without Node/MySQL. Data is persisted in localStorage keys.
========================================================= */

function nowISO() { return new Date().toISOString(); }

function loadLocal(key, def) {
  const raw = localStorage.getItem(key);
  if (!raw) return def;
  try { return JSON.parse(raw); } catch { return def; }
}

function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureLocalData() {
  if (loadLocal("ls_users", null) === null) {
    // basic sample users (passwords plain-text for prototype only)
    saveLocal("ls_users", [
      { id: 1, username: "owner1", password: "pass", role: "Private Forest Owner" },
      { id: 2, username: "driver1", password: "pass", role: "Truck Driver" },
      { id: 3, username: "sidg", password: "pass", role: "SIDG Representative" }
    ]);
  }

  if (loadLocal("ls_logs", null) === null) {
    saveLocal("ls_logs", []);
  }

  if (loadLocal("ls_chat", null) === null) {
    saveLocal("ls_chat", []);
  }

  if (loadLocal("ls_transport", null) === null) {
    saveLocal("ls_transport", []);
  }
}

function makeId(prefix = "id") {
  return `${prefix}_${Math.floor(Math.random()*1e9)}_${Date.now()}`;
}

async function handleLocalRequest(url, options = {}) {
  ensureLocalData();

  const method = (options.method || "GET").toUpperCase();
  const path = url.split("?")[0];
  const body = options.body ? JSON.parse(options.body) : null;
  const currentUser = getCurrentUser();

  // Auth
  if (path === "/api/auth/login" && method === "POST") {
    const users = loadLocal("ls_users", []);
    const u = users.find(x => x.username === body.username && x.password === body.password);
    if (!u) throw new Error("Invalid username or password (local)");
    return { token: "local-token", user: { username: u.username, role: u.role } };
  }

  if (path === "/api/auth/register" && method === "POST") {
    const users = loadLocal("ls_users", []);
    if (users.find(x => x.username === body.username)) throw new Error("Username exists");
    const id = users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1;
    users.push({ id, username: body.username, password: body.password, role: body.role });
    saveLocal("ls_users", users);
    return { ok: true };
  }

  if (path === "/api/auth/logout" && method === "POST") {
    return { ok: true };
  }

  // Logs
  if (path === "/api/logs" && method === "GET") {
    const logs = loadLocal("ls_logs", []);
    return { logs };
  }

  if (path === "/api/logs" && method === "POST") {
    if (!currentUser) throw new Error("Not authenticated (local)");
    const logs = loadLocal("ls_logs", []);
    const newLog = {
      id: makeId('log'),
      owner: body.owner,
      location: body.location,
      volume: body.volume,
      date: body.date,
      status: "open",
      accepted_driver: null,
      created_at: nowISO()
    };
    logs.unshift(newLog);
    saveLocal("ls_logs", logs);
    return { ok: true, log: newLog };
  }

  // Chat
  if (path === "/api/chat" && method === "GET") {
    const messages = loadLocal("ls_chat", []);
    return { messages };
  }

  if (path === "/api/chat" && method === "POST") {
    const messages = loadLocal("ls_chat", []);
    const username = (currentUser && currentUser.username) || (body && body.user) || "anonymous";
    const msg = { id: makeId('msg'), user: username, text: body.text, created_at: nowISO() };
    messages.push(msg);
    saveLocal("ls_chat", messages);
    return { ok: true, message: msg };
  }

  // Transport decisions / stats
  if (path === "/api/transport/decision" && method === "POST") {
    const transport = loadLocal("ls_transport", []);
    const decidedBy = (body && body.decidedBy) || (currentUser && currentUser.username) || "unknown";
    const rec = { id: makeId('dec'), status: body.status, decided_by: decidedBy, reason: body.reason || null, created_at: nowISO() };
    transport.unshift(rec);
    saveLocal("ls_transport", transport);
    return { ok: true };
  }

  if (path === "/api/transport/latest" && method === "GET") {
    const transport = loadLocal("ls_transport", []);
    return { decision: transport[0] || null };
  }

  if (path === "/api/transport/history" && method === "GET") {
    const transport = loadLocal("ls_transport", []);
    return { decisions: transport };
  }

  if (path === "/api/stats" && method === "GET") {
    const logs = loadLocal("ls_logs", []);
    const transport = loadLocal("ls_transport", []);
    const s = {
      totalLogs: logs.length,
      acceptedDecisions: transport.filter(t => t.status === 'accepted').length,
      declinedDecisions: transport.filter(t => t.status === 'declined').length,
      completedLogs: logs.filter(l => l.status === 'completed').length
    };
    return { stats: s };
  }

  // fallback
  throw new Error(`No local handler for ${method} ${path}`);
}

/* =========================================================
   AUTH UI
========================================================= */

/* Show user in header */
function renderUserBadge() {
  const el = document.getElementById("userBadge");
  if (!el) return;

  const user = getCurrentUser();

  el.textContent = user
    ? `Signed in as ${user.username} (${user.role})`
    : "Not signed in";
}

/* Smart navbar (login/register OR logout) */
function renderNavAuthState() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  const user = getCurrentUser();

  let html = `
    <a href="index.html">Dashboard</a>
    <a href="add.html">Add Logs</a>
    <a href="accept.html">Accept Transport</a>
    <a href="chat.html">Community Chat</a>
    <a href="admin.html">Admin Panel</a>
  `;

  if (user) {
    html += `<a href="#" onclick="logoutUser()">Logout</a>`;
  } else {
    html += `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }

  nav.innerHTML = html;
}

/* LOGIN */
async function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!username || !password) return;

  try {
    const data = await requestJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });

    setSession(data.token, data.user);

    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}

/* REGISTER */
async function registerUser(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername")?.value.trim();
  const password = document.getElementById("registerPassword")?.value;
  const role = document.getElementById("registerRole")?.value;

  try {
    await requestJson("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, role })
    });

  const msgEl = document.getElementById("authMsg");

  if (msgEl) {
    msgEl.textContent = "Account created. Redirecting to login...";
    msgEl.style.color = "#1f6f43";
  }

  // redirect after short delay (no blocking popup)
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
  } catch (err) {
    alert(err.message);
  }
}

/* LOGOUT */
async function logoutUser() {
  try {
    if (getToken()) {
      await requestJson("/api/auth/logout", { method: "POST" });
    }
  } catch {}

  clearSession();
  window.location.href = "login.html";
}

/* =========================================================
   AUTH INIT
========================================================= */

function initAuthPage() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) loginForm.addEventListener("submit", loginUser);
  if (registerForm) registerForm.addEventListener("submit", registerUser);
}

/* =========================================================
   LOGS
========================================================= */

async function addLogs(event) {
  event.preventDefault();

  if (!getToken()) {
    alert("Please log in first.");
    return;
  }

  const owner = document.getElementById("ownerType")?.value;
  const location = document.getElementById("location")?.value;
  const volume = document.getElementById("volume")?.value;
  const date = document.getElementById("date")?.value;

  try {
    await requestJson("/api/logs", {
      method: "POST",
      body: JSON.stringify({
        owner,
        location,
        volume: Number(volume),
        date
      })
    });

    alert("Log added!");
    document.getElementById("logForm")?.reset();
  } catch (err) {
    alert(err.message);
  }
}

async function displayLogs() {
  const container = document.getElementById("logsContainer");
  if (!container) return;

  try {
    const data = await requestJson("/api/logs");

    container.innerHTML = "";

    (data.logs || []).forEach(log => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${escapeHtml(log.location)}</h3>
        <p>Owner: ${escapeHtml(log.owner)}</p>
        <p>Volume: ${escapeHtml(log.volume)} m³</p>
        <p>Date: ${escapeHtml(log.date)}</p>
        <p>Status: ${escapeHtml(log.status)}</p>
        <a class="button" href="accept.html">View</a>
      `;

      container.appendChild(div);
    });
  } catch {
    container.innerHTML = "<p>Failed to load logs.</p>";
  }
}

/* =========================================================
   STATS
========================================================= */

async function displayStats() {
  const el = document.getElementById("statsPanel");
  if (!el) return;

  try {
    const data = await requestJson("/api/stats");

    const s = data.stats || {};

    el.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item"><span>Total</span><strong>${s.totalLogs || 0}</strong></div>
        <div class="stat-item"><span>Accepted</span><strong>${s.acceptedDecisions || 0}</strong></div>
        <div class="stat-item"><span>Declined</span><strong>${s.declinedDecisions || 0}</strong></div>
        <div class="stat-item"><span>Completed</span><strong>${s.completedLogs || 0}</strong></div>
      </div>
    `;
  } catch {
    el.innerHTML = "<p>Stats unavailable.</p>";
  }
}

/* =========================================================
   TRANSPORT
========================================================= */

async function displayTransportStatus() {
  const el = document.getElementById("transportStatus");
  if (!el) return;

  try {
    const data = await requestJson("/api/transport/latest");

    if (!data.decision) {
      el.textContent = "No decision yet.";
      return;
    }

    el.textContent = `${data.decision.status} by ${data.decision.decided_by}`;
  } catch {
    el.textContent = "Failed to load status.";
  }
}

async function displayTransportHistory() {
  const el = document.getElementById("transportHistory");
  if (!el) return;

  try {
    const data = await requestJson("/api/transport/history");

    el.innerHTML = "";

    (data.decisions || []).forEach(d => {
      const row = document.createElement("div");
      row.className = "decision-row";

      row.innerHTML = `
        <div class="decision-main">${escapeHtml(d.status)} by ${escapeHtml(d.decided_by)}</div>
        <div class="decision-time">${escapeHtml(d.created_at)}</div>
      `;

      el.appendChild(row);
    });
  } catch {
    el.innerHTML = "<p>Error loading history.</p>";
  }
}

function acceptTransport() {
  setTransportDecision("accepted");
}

function declineTransport() {
  setTransportDecision("declined");
}

async function setTransportDecision(status) {
  const user = document.getElementById("transportUser")?.value.trim();
  const reason = document.getElementById("transportReason")?.value.trim();
  const msg = document.getElementById("acceptMsg");

  if (!msg) return;

  try {
    await requestJson("/api/transport/decision", {
      method: "POST",
      body: JSON.stringify({ status, decidedBy: user, reason })
    });

    msg.textContent = "Success!";
  } catch (err) {
    msg.textContent = err.message;
  }
}

/* =========================================================
   CHAT
========================================================= */

async function initChat() {
  const form = document.getElementById("chatForm");
  if (!form) return;

  form.addEventListener("submit", addChatMessage);

  renderChatMessages();
}

async function addChatMessage(event) {
  event.preventDefault();

  const user = document.getElementById("chatUsername")?.value;
  const text = document.getElementById("chatInput")?.value;

  if (!user || !text) return;

  try {
    await requestJson("/api/chat", {
      method: "POST",
      body: JSON.stringify({ user, text })
    });

    document.getElementById("chatInput").value = "";
    renderChatMessages();
  } catch (err) {
    alert(err.message);
  }
}

async function renderChatMessages() {
  const el = document.getElementById("chatMessages");
  if (!el) return;

  try {
    const data = await requestJson("/api/chat");

    el.innerHTML = "";

    (data.messages || []).forEach(m => {
      const div = document.createElement("div");
      div.className = "chat-message";

      div.innerHTML = `
        <div class="chat-meta">${escapeHtml(m.user)} • ${escapeHtml(m.created_at)}</div>
        <div class="chat-text">${escapeHtml(m.text)}</div>
      `;

      el.appendChild(div);
    });
  } catch {
    el.innerHTML = "<p>Chat unavailable.</p>";
  }
}

/* =========================================================
   APP INIT (IMPORTANT)
========================================================= */

renderUserBadge();
renderNavAuthState();

initAuthPage();
displayLogs();
displayStats();
displayTransportStatus();
displayTransportHistory();
initChat();