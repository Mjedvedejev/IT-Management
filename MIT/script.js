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

window.onload = displayLogs;