function acceptTransport(){

const check=document.getElementById("acceptCheck");
const msg=document.getElementById("acceptMsg");

if(check.checked){
msg.textContent="Transport accepted successfully.";
msg.style.color="green";
}
else{
msg.textContent="Please accept the conditions first.";
msg.style.color="red";
}

}


function addLogs(event) {

event.preventDefault();

const owner = document.getElementById("ownerType").value;
const location = document.getElementById("location").value;
const volume = document.getElementById("volume").value;
const date = document.getElementById("date").value;

const newLog = {
owner: owner,
location: location,
volume: volume,
date: date
};

let logs = JSON.parse(localStorage.getItem("logs")) || [];

logs.push(newLog);

localStorage.setItem("logs", JSON.stringify(logs));

alert("Logs added successfully!");

document.getElementById("logForm").reset();
}

function displayLogs() {

const container = document.getElementById("logsContainer");

if(!container) return;

const logs = JSON.parse(localStorage.getItem("logs")) || [];

container.innerHTML = "";

logs.forEach(log => {

const card = document.createElement("div");
card.classList.add("card");

card.innerHTML = `
<h3>${log.location}</h3>
<p>Owner: ${log.owner}</p>
<p>Volume: ${log.volume} m³</p>
<p>Pickup Date: ${log.date}</p>
<a class="button" href="accept.html">View Transport</a>
`;

container.appendChild(card);

});

}

function registerUser(event) {

if (event) event.preventDefault();

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;

const roleElements = document.querySelectorAll('input[name="role"]:checked');
const roles = Array.from(roleElements).map(el => el.value);

// Validation
if (!username || !password || !confirmPassword) {
alert("Please fill in all fields!");
return;
}

if (password !== confirmPassword) {
alert("Passwords do not match!");
return;
}

if (roles.length === 0) {
alert("Please select at least one role!");
return;
}

// Create user object
const user = {
username: username,
password: password,
roles: roles
};

// Get existing users
let users = JSON.parse(localStorage.getItem("users")) || [];

// Check if user already exists
const exists = users.some(u => u.username === username);
if (exists) {
alert("Username already exists!");
return;
}

// Save user
users.push(user);
localStorage.setItem("users", JSON.stringify(users));

alert("User registered successfully!");

// Redirect to login page
window.location.href = "login.html";
}

function loginUser(event) {

if (event) event.preventDefault();

const username = document.getElementById("loginUsername").value.trim();
const password = document.getElementById("loginPassword").value;

let users = JSON.parse(localStorage.getItem("users")) || [];

// Find user
const user = users.find(u => u.username === username && u.password === password);

if (!user) {
alert("Invalid username or password!");
return;
}

// Save logged-in user (session)
localStorage.setItem("loggedInUser", JSON.stringify(user));

alert("Login successful!");

// Redirect to dashboard
window.location.href = "index.html";
}

function updateUserMenu() {

const dropdown = document.getElementById("userDropdown");
if (!dropdown) return;

const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (user) {
// Logged in → show logout only
dropdown.innerHTML = `
<a href="#" onclick="logoutUser()">Logout</a>
`;
} else {
// Not logged in → show login/register
dropdown.innerHTML = `
<a href="registration.html">Register</a>
<a href="login.html">Login</a>
`;
}
}

function logoutUser() {
localStorage.removeItem("loggedInUser");
alert("Logged out successfully!");
window.location.href = "login.html";
}

window.onload = function () {
updateUserMenu();
displayLogs();
};