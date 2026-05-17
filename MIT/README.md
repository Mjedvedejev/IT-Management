# LagerSync - Quick Start Guide for GitHub Pages

## Overview

LagerSync is a web app for organizing lumber transport between forest owners, SIDG, and truck drivers. This version runs entirely in the browser using localStorage—**no database or backend server required**. Perfect for prototyping, demos, and GitHub Pages deployment.

---

## Quick Start

### Option 1: Run Locally (No Build)
Simply open `index.html` in a browser:
```bash
# Navigate to the MIT folder
cd path/to/MIT

# Open in your default browser
start index.html
# or on Mac/Linux:
open index.html
```

The app will work immediately. Data persists in your browser's localStorage.

### Option 2: Deploy to GitHub Pages

1. **Enable GitHub Pages** in your repository settings:
   - Go to *Settings* → *Pages*
   - Select `main` branch and `/root` (or `/docs`) folder
   - Save

2. **Access your site:**
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

3. **Register and log in:**
   - Go to the **Register** page to create an account
   - Or use a pre-seeded demo account (see below)

---

## Demo Accounts (Pre-seeded)

Login with any of these:

| Username | Password | Role |
|----------|----------|------|
| `owner1` | `pass` | Private Forest Owner |
| `driver1` | `pass` | Truck Driver |
| `sidg` | `pass` | SIDG Representative |

All accounts are pre-loaded automatically. You can also register new accounts.

---

## Admin Panel

Visit `admin.html` to:
- **Reset demo data** with one click
- **View stored data** in localStorage
- **Understand** how the app stores information
- **Clear cache** to start fresh

Example: `https://<your-username>.github.io/<repo-name>/admin.html`

---

## Features

### ✅ User Management
- Register new accounts
- Login with username/password
- Assign role (Forest Owner, Truck Driver, SIDG, Admin)

### ✅ Logs / Transport Requests
- Add new logs with location, volume, pickup date
- View all available loads on the dashboard
- Search and filter loads

### ✅ Accept Transport
- Truck drivers can accept loads
- Track accepted jobs
- View transport decision history

### ✅ Chat / Messaging
- Community messaging system
- Discuss pickups and deliveries
- Real-time message rendering

### ✅ Reports & Stats
- Dashboard stats: total logs, accepted/declined counts
- Transport history timeline

---

## How It Works (Technical Details)

### Data Storage
All data lives in the browser's `localStorage` under these keys:
- `authToken` – JWT-like session token
- `authUser` – Current user object
- `ls_users` – User accounts (username, password, role)
- `ls_logs` – Transport logs
- `ls_chat` – Messages
- `ls_transport` – Transport decisions

### API Simulation
The frontend (`script.js`) intercepts API calls and routes them to a mock backend handler (`handleLocalRequest`) that reads/writes to localStorage. No fetch calls leave the browser.

### Service Worker (Optional Offline)
`sw.js` caches HTML, CSS, JS files for offline access. To enable:
- Add this to your `<head>` in `index.html`:
  ```html
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js');
    }
  </script>
  ```

---

## Important Limitations (Demo Mode)

⚠️ **This is a prototype. For production:**

- **Passwords are plain-text** in localStorage – never use for real data
- **No encryption** – anyone with browser access can see all data
- **Single browser** – data doesn't sync across devices or browsers
- **No real-time** – changes don't push to other users
- **No notifications** – email/SMS not implemented
- **No server validation** – client-side validation only
- **No backups** – clearing browser cache = data loss

For a production app:
1. Set up a real backend (Node.js + Express recommended)
2. Use a proper database (MySQL, PostgreSQL, etc.)
3. Add bcrypt password hashing
4. Use JWT tokens with expiration
5. Implement HTTPS
6. Add rate limiting and security headers
7. Set up proper error logging and monitoring

---

## Project Pages

| Page | Purpose | Access |
|------|---------|--------|
| `index.html` | Dashboard – view all loads | All users |
| `add.html` | Add new transport request | After login |
| `accept.html` | Accept a transport job | Truck drivers |
| `chat.html` | Community messaging | After login |
| `login.html` | User login | Not logged in |
| `register.html` | Create new account | Not logged in |
| `admin.html` | Demo admin panel | All users |

---

## File Structure

```
MIT/
├── index.html          # Dashboard
├── add.html            # Add logs form
├── accept.html         # Accept jobs form
├── chat.html           # Chat/messaging
├── login.html          # Login form
├── register.html       # Registration form
├── admin.html          # Admin panel
├── script.js           # Frontend logic + localStorage backend
├── style.css           # Styles
├── sw.js               # Service Worker (offline caching)
├── package.json        # Metadata
└── server.js           # Node.js backend (optional, not needed for GitHub Pages)
```

---

## Development

### To customize:
1. Edit `script.js` to change API routes or mock backend behavior
2. Edit `style.css` for styling
3. Edit individual HTML files for layout/content
4. Commit and push to GitHub to auto-deploy

### To switch to a real backend:
1. Set `USE_LOCAL_BACKEND = false` in `script.js`
2. Update `API_BASE` to your server URL
3. Run Node.js server (see `server.js` for reference)
4. Deploy backend to Heroku, Vercel, or your own server

---

## Troubleshooting

### "Data disappeared"
- Browser cache was cleared, or localStorage was manually deleted
- Click "Reset" on the admin panel to reseed demo accounts

### "Can't log in"
- Check username/password spelling (case-sensitive)
- Use one of the pre-seeded accounts above
- Or register a new account on the Register page

### "Chat isn't real-time"
- Demo mode has no backend – messages appear only when you refresh
- Reload the page to see new messages from other browsers

### "Accept isn't preventing duplicates"
- This is the localStorage prototype – multiple drivers can accept the same load
- A real backend would use database transactions to prevent race conditions

---

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (vanilla – no frameworks)
- **Data Storage:** Browser localStorage (prototype) or MySQL (production)
- **Backend:** Node.js + Express (optional, for real deployment)
- **Hosting:** GitHub Pages (static) or your own server

---

## Next Steps

1. **Test the demo:** Register an account, add a log, accept a job, chat.
2. **Explore the admin panel:** See what data is stored.
3. **Customize:** Update HTML/CSS to match your branding.
4. **Deploy:** Push to GitHub and enable Pages.
5. **Scale up:** When ready, implement a real backend with a database.

---

## Questions?

- Check `planned_implementation.md` for the original design spec
- Review `script.js` comments for code details
- See `admin.html` for demo data structure

---

**Happy transporting! 🚚🌲**
