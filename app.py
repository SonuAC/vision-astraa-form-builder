from flask import Flask, render_template, request, jsonify
import sqlite3
import json
import os
from datetime import datetime

app = Flask(__name__)

# ✅ FIXED: Proper absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'database', 'submissions.db')


# ── DB SETUP ─────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    # ✅ Ensure folder exists
    db_folder = os.path.dirname(DATABASE)
    if not os.path.exists(db_folder):
        os.makedirs(db_folder)

    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                interested TEXT NOT NULL,
                name TEXT,
                email TEXT,
                phone TEXT,
                education TEXT,
                stream TEXT,
                interests TEXT,
                skills TEXT,
                role TEXT,
                submitted_at TEXT NOT NULL
            )
        ''')
        conn.commit()


# ── ROUTES ───────────────────────────────────────────

@app.route('/')
@app.route('/form')
def index():
    return render_template('index.html')


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data received'}), 400

    interested  = data.get('interested', 'No')
    name        = data.get('name', '')
    email       = data.get('email', '')
    phone       = data.get('phone', '')
    education   = data.get('education', '')
    stream      = data.get('stream', '')
    interests   = json.dumps(data.get('interests', []))
    skills      = json.dumps(data.get('skills', []))
    role        = data.get('role', '')
    submitted_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    with get_db() as conn:
        conn.execute('''
            INSERT INTO submissions
            (interested, name, email, phone, education, stream, interests, skills, role, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (interested, name, email, phone, education, stream, interests, skills, role, submitted_at))
        conn.commit()

    return jsonify({'success': True, 'message': 'Submission saved successfully!'})


@app.route('/analytics')
def analytics():
    return render_template('analytics.html')


@app.route('/api/analytics')
def api_analytics():
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM submissions ORDER BY submitted_at DESC').fetchall()

    submissions = [dict(r) for r in rows]
    total = len(submissions)
    yes_count = sum(1 for s in submissions if s['interested'] == 'Yes')
    no_count  = total - yes_count

    edu_counts = {}
    stream_counts = {}
    role_counts = {}
    interest_counts = {}
    skill_counts = {}

    for s in submissions:
        if s['interested'] == 'Yes':
            if s['education']:
                edu_counts[s['education']] = edu_counts.get(s['education'], 0) + 1
            if s['stream']:
                stream_counts[s['stream']] = stream_counts.get(s['stream'], 0) + 1
            if s['role']:
                role_counts[s['role']] = role_counts.get(s['role'], 0) + 1

            if s['interests']:
                for item in json.loads(s['interests']):
                    interest_counts[item] = interest_counts.get(item, 0) + 1

            if s['skills']:
                for sk in json.loads(s['skills']):
                    skill_counts[sk] = skill_counts.get(sk, 0) + 1

    recent = [{
        'name': s['name'] or '—',
        'email': s['email'] or '—',
        'interested': s['interested'],
        'role': s['role'] or '—',
        'submitted_at': s['submitted_at']
    } for s in submissions[:10]]

    return jsonify({
        'total': total,
        'interested_yes': yes_count,
        'interested_no': no_count,
        'conversion_rate': round((yes_count / total * 100), 1) if total else 0,
        'education': edu_counts,
        'stream': stream_counts,
        'roles': role_counts,
        'interests': interest_counts,
        'skills': skill_counts,
        'recent': recent
    })


# ── MAIN ─────────────────────────────────────────────

if __name__ == '__main__':
    init_db()
    print("\n" + "="*55)
    print("  VisionAstraa EV Academy — Form Server")
    print("="*55)
    print("  Form Link     : http://localhost:5000/form")
    print("  Analytics     : http://localhost:5000/analytics")
    print("="*55 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)