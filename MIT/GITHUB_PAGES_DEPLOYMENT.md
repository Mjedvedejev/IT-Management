# Quick Start for GitHub Pages Deployment

## Step 1: Verify the App Works Locally

Open `index.html` in your browser:
```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### Quick test:
1. Visit `/login.html`
2. Use credentials: **Username:** `driver1` **Password:** `pass`
3. Click "Add Logs" and submit a sample log
4. Visit `/admin.html` → "Toggle Data View" to see stored data
5. The log should appear in localStorage

✅ If this works, the app is ready to deploy.

---

## Step 2: Deploy to GitHub Pages

### Option A: Using the `/docs` folder (recommended)

1. **Copy all static files** from `/MIT/` to `/docs/`:
   ```bash
   # In your repo root
   mkdir -p docs
   cp MIT/*.html MIT/*.css MIT/*.js MIT/*.md docs/
   cp MIT/sw.js docs/
   ```

2. **Commit and push:**
   ```bash
   git add docs/
   git commit -m "Add LagerSync static site for GitHub Pages"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repo **Settings** → **Pages**
   - Source: `main` branch
   - Folder: `/docs`
   - Save

4. **Access your site:**
   ```
   https://<your-username>.github.io/<your-repo>/
   ```

### Option B: Using a `gh-pages` branch

1. **Create orphan branch:**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   ```

2. **Copy files:**
   ```bash
   cp ../MIT/* .
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "LagerSync static site"
   git push origin gh-pages
   ```

4. **Enable Pages:**
   - Settings → Pages → Source: `gh-pages` → Save

5. **Access:**
   ```
   https://<your-username>.github.io/<your-repo>/
   ```

---

## Step 3: Share the Link

Send users this URL:
```
https://<your-username>.github.io/<your-repo>/
```

Or point them to `/login.html` directly if you prefer.

---

## Demo Account Credentials

Pre-seeded users (no registration needed):

| Role | Username | Password |
|------|----------|----------|
| Forest Owner | `owner1` | `pass` |
| Truck Driver | `driver1` | `pass` |
| SIDG Rep | `sidg` | `pass` |

---

## Troubleshooting Deployment

### "404 - page not found"
- Check that files are in `/docs` folder
- Verify GitHub Pages is enabled in Settings
- Wait 1–2 minutes for Pages to rebuild

### "Data not persisting"
- Check browser localStorage: DevTools → Application → Local Storage
- Make sure `USE_LOCAL_BACKEND = true` in `script.js`
- Clear cache (Settings → Pages → Rebuild)

### "Service Worker cache issues"
- Open DevTools → Application → Service Workers
- Click "Unregister" and hard-refresh the page
- Or clear cache entirely: DevTools → Storage → Clear Site Data

---

## Making Changes After Deployment

1. Edit files in `/docs/`
2. Commit and push:
   ```bash
   git add docs/
   git commit -m "Update LagerSync"
   git push origin main
   ```
3. Pages will auto-rebuild (1–2 min)

---

## Production Notes (When Ready to Scale)

- **Switch to real backend:** Set `USE_LOCAL_BACKEND = false` in `script.js`
- **Update API_BASE:** Point to your server (e.g., `https://api.example.com`)
- **Move to a server:** Deploy the Node.js backend separately (Heroku, AWS, etc.)
- **Add database:** Set up MySQL on your backend

See `README.md` for production migration steps.

---

**You're done!** 🎉 Your LagerSync app is now live on GitHub Pages.
