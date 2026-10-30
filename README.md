# RML Insurances – Website

A modern, simple and mobile-friendly website for **RML Insurances – Insurance Advisory** (Amarnath).

**Features:** free quote via WhatsApp · insurance plans by type · cover calculator (Term Life & Health) ·
free policy review · renewal reminder (calendar alert or WhatsApp) · claim document checklist ·
FAQ · light/dark mode · works on phones, tablets and computers.

---

## ▶️ How to run it (no technical knowledge needed)

Works on **Windows 10 / 11**. Needs internet the **first time** only.

1. On this GitHub page click the green **`<> Code`** button → **Download ZIP**.
2. Open your **Downloads** folder, right-click the ZIP → **Extract All…** → **Extract**.
   (Pick a simple place such as `C:\RML-Website`. Do **not** run it from inside the ZIP.)
3. Open the extracted folder and **double-click `START-WEBSITE.bat`**.
   - If Windows shows *"Windows protected your PC"*, click **More info → Run anyway**.
4. Wait. The **first time takes about 5–10 minutes** (it downloads everything it needs by itself).
   Your browser opens the website automatically when it is ready.
5. **Keep the black window open** while you want the website running. Close it to stop the website.

Next time, just double-click **`START-WEBSITE.bat`** again. It starts in a few seconds.

> 💡 Nothing is installed on your computer. Everything stays inside this folder
> (to remove it, just delete the folder).

### Open it on a phone (same Wi-Fi)

The black window shows a line like `Other devices (Wi-Fi): http://192.168.1.7`.
Type that address in your phone's browser. If it does not open, allow Node.js when Windows Firewall asks.

---

## ✏️ Change phone numbers, email, services, etc.

Open **`src\app\site-data.ts`** with Notepad, edit the text between the quotes `'...'`, save,
then run **`START-WEBSITE.bat`** again.

| What | Where |
| --- | --- |
| Phone numbers, WhatsApp, email, map link | `src\app\site-data.ts` → `SITE` |
| Insurance types, partners, points | `src\app\site-data.ts` → `SERVICES` |
| Claim documents list | `src\app\site-data.ts` → `CLAIM_DOCS` |
| FAQ | `src\app\site-data.ts` → `FAQS` |
| Logo | `public\rml-logo.svg` |

For live preview while editing, double-click `scripts\edit-mode.bat`.

---

## 🌐 Put it online with your own domain (hosting from this PC)

1. Buy a domain and point its **A record** to your internet (public) IP.
   If your IP changes, use a Dynamic DNS service (e.g. No-IP, DuckDNS).
2. In your Wi-Fi router, **port-forward port 80** to this PC's local IP (shown in the black window).
3. Allow the port in Windows Firewall (run Command Prompt **as Administrator**):
   `netsh advfirewall firewall add rule name="RML Website" dir=in action=allow protocol=TCP localport=80`
4. Run `START-WEBSITE.bat` and keep the PC switched on.

Easier, free alternative with HTTPS and no router changes: **Cloudflare Tunnel** pointing to `http://localhost:80`.

---

## 🛠️ Troubleshooting

| Problem | Fix |
| --- | --- |
| "Could not set up Node.js" | Check internet and run again, or install **Node.js LTS** from <https://nodejs.org> and run again. |
| Window closes immediately | Make sure you extracted the ZIP first (step 2). |
| Website opens on `:8080` | Normal. Port 80 was busy, so it used 8080 instead. |
| Changes not showing | Close the black window and run `START-WEBSITE.bat` again, then refresh the browser (Ctrl+F5). |

---

## 👩‍💻 For developers

Angular 22 standalone app. Requires Node.js `^22.22.3 || ^24.15.0 || >=26` (see `.nvmrc`).

```bash
npm ci              # install exact dependencies from package-lock.json
npm start           # dev server at http://localhost:4200
npm run build       # production build -> dist/rml-insurances/browser
npm run serve:site  # host the built site (node server.cjs, port 80 or 8080; PORT env var to override)
```

Project layout: `src/app/app.*` (main page), `src/app/sections/*` (calculator, reminder, checklist),
`src/app/shared/*` (helpers), `src/app/site-data.ts` (all business content), `server.cjs` (zero-dependency static server),
`scripts/get-node.ps1` (portable Node.js download with checksum verification).
