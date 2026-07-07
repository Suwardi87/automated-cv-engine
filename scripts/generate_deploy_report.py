#!/usr/bin/env python3
import argparse
import html
import os
import sys
from datetime import datetime

def generate_deploy_report():
    parser = argparse.ArgumentParser(description="Generate Deploy Report HTML")
    parser.add_argument("--commit", required=True, help="Commit SHA")
    parser.add_argument("--branch", required=True, help="Branch name")
    parser.add_argument("--actor", required=True, help="GitHub Actor/User")
    parser.add_argument("--status", required=True, help="Job Status (success/failure)")
    parser.add_argument("--output", default="reports/deploy/index.html", help="Output path")

    args = parser.parse_args()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    is_success = args.status.lower() == "success"
    status_text = "SUCCESS" if is_success else "FAILED"
    status_class = "success" if is_success else "danger"
    status_icon = "✓" if is_success else "✗"

    # A10.2 — HTML-escape user-controlled fields (branch, commit, actor) — CWE-79
    branch_escaped = html.escape(str(args.branch))
    commit_escaped = html.escape(str(args.commit))
    actor_escaped = html.escape(str(args.actor))
    commit_short = commit_escaped[:8] if len(commit_escaped) > 8 else commit_escaped

    html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deployment Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg-primary: #0b0f19;
            --bg-secondary: #161b26;
            --bg-tertiary: #1f2638;
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --primary: #6366f1;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --border: #2d3748;
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}

        body {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.5;
            padding: 4rem 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }}

        .card {{
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 16px;
            width: 100%;
            max-width: 550px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
        }}

        .status-header {{
            padding: 2.5rem 2rem;
            text-align: center;
            position: relative;
        }}

        .status-header.success {{
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.2) 100%);
            border-bottom: 2px solid var(--success);
        }}

        .status-header.danger {{
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.2) 100%);
            border-bottom: 2px solid var(--danger);
        }}

        .status-circle {{
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: bold;
            margin: 0 auto 1.25rem;
        }}

        .success .status-circle {{
            background-color: rgba(16, 185, 129, 0.2);
            color: var(--success);
            border: 2px solid var(--success);
        }}

        .danger .status-circle {{
            background-color: rgba(239, 68, 68, 0.2);
            color: var(--danger);
            border: 2px solid var(--danger);
        }}

        .status-title {{
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 0.05em;
        }}

        .success .status-title {{ color: var(--success); }}
        .danger .status-title {{ color: var(--danger); }}

        .status-subtitle {{
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }}

        .info-body {{
            padding: 2rem;
        }}

        .info-grid {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.25rem;
        }}

        .info-item {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 0.75rem;
        }}

        .info-item:last-child {{
            border-bottom: none;
            padding-bottom: 0;
        }}

        .info-label {{
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-weight: 500;
        }}

        .info-val {{
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
        }}

        .info-val.commit {{
            font-family: monospace;
            background-color: var(--bg-tertiary);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.85rem;
        }}

        .footer-link {{
            display: block;
            text-align: center;
            padding: 1.25rem;
            background-color: var(--bg-tertiary);
            color: var(--primary);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            border-top: 1px solid var(--border);
            transition: background-color 0.2s;
        }}

        .footer-link:hover {{
            background-color: rgba(99, 102, 241, 0.1);
        }}
    </style>
</head>
<body>
    <div class="card">
        <div class="status-header {status_class}">
            <div class="status-circle">{status_icon}</div>
            <div class="status-title">DEPLOYMENT {status_text}</div>
            <div class="status-subtitle">Production Environment</div>
        </div>
        <div class="info-body">
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Tanggal & Waktu</div>
                    <div class="info-val">{timestamp}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Branch</div>
                    <div class="info-val">{branch_escaped}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Commit SHA</div>
                    <div class="info-val commit">{commit_short}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Pemicu (Actor)</div>
                    <div class="info-val">@{actor_escaped}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Target Server</div>
                    <div class="info-val">VPS-Production (docker-compose)</div>
                </div>
            </div>
        </div>
        <a href="/" class="footer-link">Buka Aplikasi POS &rarr;</a>
    </div>
</body>
</html>
"""

    try:
        os.makedirs(os.path.dirname(args.output), exist_ok=True)
        with open(args.output, 'w') as f:
            f.write(html_content)
        print(f"Deployment report generated successfully at {args.output}")
    except Exception as e:
        print(f"Error writing deployment report: {e}")
        sys.exit(1)

if __name__ == "__main__":
    generate_deploy_report()
