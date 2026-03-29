# LagerSync - Planned Implementation of the Solution

## Project Description
LagerSync is a web application designed to improve lumber transport organization between private forest owners, SIDG, and truck drivers. The goal is to reduce empty truck trips, improve communication, and make transport more efficient.

---

## Planned Features

### User Registration and Login
Users will be able to create accounts and log in.

User roles:
- Private Forest Owner
- SIDG Representative
- Truck Driver
- Administrator

### Add Logs for Transport
Users can add a transport request with:
- Owner type
- Location
- Volume of logs
- Pickup date
- Destination

### Dashboard of Available Loads
The dashboard will show all available transport requests.

Users will be able to:
- View all loads
- Search by location
- Filter by date
- Filter by minimum volume

### Accept Transport Requests
Truck drivers can accept transport jobs.

The system will:
- Mark accepted loads
- Prevent multiple users from accepting the same transport
- Store the name of the accepted driver

### Messaging System
Users will be able to communicate with each other through an internal messaging page.

The messaging system will help with:
- Pickup coordination
- Questions about delivery
- Communication between SIDG, truck drivers, and forest owners

### Reports and Feedback
Administrators and SIDG will be able to:
- Review transport activity
- Export reports
- Receive bug reports
- Receive user feedback

---

## Planned Pages

| Page | Purpose |
|------|---------|
| index.html | Dashboard with available loads |
| add.html | Add transport requests |
| accept.html | Accept transport jobs |
| messages.html | User communication |
| login.html | User login |
| register.html | User registration |

---

## Technologies and Tools

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Design and Planning Tools
- Figma
- Canva
- Draw.io

### Development Tools
- Visual Studio Code
- GitHub
- LocalStorage (for prototype testing)
- Jira

---

## Database Structure

The system will contain the following database tables:

### Users Table
Stores:
- Username
- Email
- Password
- User role

### Logs Table
Stores:
- Owner type
- Location
- Volume
- Pickup date
- Status
- Accepted driver

### Messages Table
Stores:
- Sender
- Receiver
- Message content
- Date and time

---

## Team Roles

| Team Member | Role |
|------------|------|
| Tilen Tratnik | Developer |
| Florijan Peric | Developer |
| Vid Brložnik | HR / Presenter / UI |