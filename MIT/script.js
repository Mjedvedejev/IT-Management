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