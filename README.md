# VisionAstraa EV Academy — Interest Form

A conditional multi-step form with analytics dashboard built with Flask + HTML/CSS/JS.

---

## Project Structure

```
visionastraa-form/
├── app.py                    ← Flask backend (routes, DB, API)
├── requirements.txt
├── database/
│   └── submissions.db        ← SQLite (auto-created on first run)
├── templates/
│   ├── index.html            ← The Form
│   └── analytics.html        ← Analytics Dashboard
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

---

## Quick Start (Local)

```bash
# 1. Navigate to project folder
cd visionastraa-form

# 2. Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows

# 3. Install Flask
pip install -r requirements.txt

# 4. Run the server
python app.py
```

**Your links:**
| Page          | URL                                  |
|---------------|--------------------------------------|
| Form          | http://localhost:5000/form           |
| Analytics     | http://localhost:5000/analytics      |

---

## How to SHARE the Form Link

### Option A — Share on Local Network (LAN)
When you run `app.py` the server starts on `0.0.0.0:5000`.
Anyone on the same Wi-Fi can access:
```
http://<YOUR_IP_ADDRESS>:5000/form
```
Find your IP:
- Windows: `ipconfig` → IPv4 Address
- Mac/Linux: `ifconfig` or `ip addr`

Example: `http://192.168.1.5:5000/form`

### Option B — Public Sharing with ngrok (Free, Easy)
1. Download ngrok: https://ngrok.com/download
2. Run your server: `python app.py`
3. In another terminal: `ngrok http 5000`
4. Copy the HTTPS URL, e.g. `https://abc123.ngrok-free.app`
5. Share this link → anyone on the internet can open your form!

### Option C — Deploy to Render.com (Free Hosting)
1. Push this project to a GitHub repo
2. Go to https://render.com → New Web Service
3. Connect your repo, set:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
4. Deploy → get a permanent URL like `https://visionastraa-form.onrender.com/form`

---

## Form Conditional Logic

```
[Welcome Screen]
      ↓
[Q1: Are you interested in VisionAstraa EV Academy?]
      │
      ├── YES → [Name] → [Email + Phone] → [Education]
      │         → [Stream] → [Interests] → [Skills]
      │         → [Role] → [Review] → [Submit]
      │         → ✅ Thank You (Full Response)
      │
      └── NO  → Submit immediately (minimal data)
               → 🤝 Thank You (Short Response)
```

---

## Analytics Dashboard

Visit `http://localhost:5000/analytics` to see:
- Total submissions, conversion rate
- Yes vs No pie chart
- Education level breakdown
- Stream/branch distribution
- Desired roles
- Interest areas
- Skills distribution
- Recent submissions table
