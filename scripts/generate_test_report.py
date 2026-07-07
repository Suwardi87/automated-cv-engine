#!/usr/bin/env python3
import html
import json
import os
import sys
from datetime import datetime

def generate_report(json_path="reports/test/result.json", html_path="reports/test/index.html"):
    if not os.path.exists(json_path):
        print(f"Error: JSON source file not found at {json_path}")
        sys.exit(1)

    try:
        with open(json_path, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON source file: {e}")
        sys.exit(1)

    total = data.get("total", 0)
    passed = data.get("passed", 0)
    failed = data.get("failed", 0)
    total_duration = data.get("total_duration", 0.0)
    success_rate = (passed / total * 100) if total > 0 else 0.0

    # Group results by type
    by_type = {}
    for r in data.get("results", []):
        t_type = r.get("type", "General")
        if t_type not in by_type:
            by_type[t_type] = {"total": 0, "passed": 0, "failed": 0, "duration": 0.0}
        by_type[t_type]["total"] += 1
        if r.get("passed", False):
            by_type[t_type]["passed"] += 1
        else:
            by_type[t_type]["failed"] += 1
        by_type[t_type]["duration"] += r.get("duration", 0.0)

    # Group results by module (based on name prefix)
    by_module = {}
    for r in data.get("results", []):
        name = r.get("name", "")
        module = name.split(":")[0].strip() if ":" in name else "General"
        if module not in by_module:
            by_module[module] = {"total": 0, "passed": 0, "failed": 0}
        by_module[module]["total"] += 1
        if r.get("passed", False):
            by_module[module]["passed"] += 1
        else:
            by_module[module]["failed"] += 1

    # Format current time
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Generate rows
    test_rows_html = ""
    for r in data.get("results", []):
        is_passed = r.get("passed", False)
        status_badge = '<span class="badge badge-success">Passed</span>' if is_passed else '<span class="badge badge-danger">Failed</span>'
        row_class = "row-passed" if is_passed else "row-failed"
        # A10.1 — HTML-escape user-controlled 'details' to prevent CWE-79 XSS
        details_raw = r.get("details", "")
        details = html.escape(str(details_raw)) if details_raw else ''
        details_html = f'<div class="test-details">{details}</div>' if details else ''
        status_code = r.get("status_code", 0)
        status_code_html = f'<span class="badge badge-info">HTTP {status_code}</span>' if status_code > 0 else ''

        # Also escape test name to be safe
        test_name_escaped = html.escape(str(r.get('name', '')))
        test_type_escaped = html.escape(str(r.get('type', '')))

        test_rows_html += f"""
        <tr class="{row_class}">
            <td>{status_badge}</td>
            <td>
                <span class="test-name">{test_name_escaped}</span>
                {details_html}
            </td>
            <td><span class="badge badge-outline">{test_type_escaped}</span></td>
            <td>{r.get('duration', 0.0):.3f}s</td>
            <td>{status_code_html}</td>
        </tr>
        """

    # Generate Type summaries (escape type names)
    type_cards_html = ""
    for t_type, stats in sorted(by_type.items()):
        pass_ratio = f"{stats['passed']}/{stats['total']}"
        pct = (stats['passed'] / stats['total'] * 100) if stats['total'] > 0 else 0
        card_class = "border-success" if stats['failed'] == 0 else "border-danger"
        text_class = "text-success" if stats['failed'] == 0 else "text-danger"
        t_type_escaped = html.escape(str(t_type))
        type_cards_html += f"""
        <div class="summary-card {card_class}">
            <div class="card-title">{t_type_escaped}</div>
            <div class="card-value {text_class}">{pass_ratio}</div>
            <div class="card-desc">{pct:.1f}% Success | {stats['duration']:.2f}s</div>
        </div>
        """

    # Generate Module summaries (escape module names)
    module_badges_html = ""
    for mod, stats in sorted(by_module.items()):
        is_ok = stats['failed'] == 0
        badge_class = "module-badge-success" if is_ok else "module-badge-danger"
        icon = "✓" if is_ok else "✗"
        mod_escaped = html.escape(str(mod))
        module_badges_html += f"""
        <div class="module-badge {badge_class}">
            <span class="module-icon">{icon}</span>
            <span class="module-name">{mod_escaped}</span>
            <span class="module-count">{stats['passed']}/{stats['total']}</span>
        </div>
        """

    html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Suite Report</title>
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
            --info: #3b82f6;
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
            padding: 2rem 1rem;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}

        header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2.5rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
        }}

        .title-group h1 {{
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.25rem;
        }}

        .title-group p {{
            color: var(--text-secondary);
            font-size: 0.95rem;
        }}

        .meta-info {{
            text-align: right;
        }}

        .meta-info .timestamp {{
            font-size: 0.9rem;
            color: var(--text-secondary);
        }}

        .meta-info .status-pill {{
            display: inline-block;
            margin-top: 0.5rem;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
        }}

        .status-pill.success {{
            background-color: rgba(16, 185, 129, 0.15);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }}

        .status-pill.failed {{
            background-color: rgba(239, 68, 68, 0.15);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }}

        /* Stats Grid */
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }}

        .stat-card {{
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }}

        .stat-card::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
        }}

        .stat-card.primary::before {{ background-color: var(--primary); }}
        .stat-card.success::before {{ background-color: var(--success); }}
        .stat-card.danger::before {{ background-color: var(--danger); }}
        .stat-card.info::before {{ background-color: var(--info); }}

        .stat-label {{
            font-size: 0.85rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }}

        .stat-value {{
            font-size: 2rem;
            font-weight: 700;
        }}

        /* Section Layout */
        .section-title {{
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }}

        .grid-layout {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 2.5rem;
        }}

        /* Summary Cards */
        .summary-cards {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }}

        .summary-card {{
            background-color: var(--bg-secondary);
            border-left: 4px solid var(--border);
            border-radius: 8px;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }}

        .summary-card.border-success {{ border-left-color: var(--success); }}
        .summary-card.border-danger {{ border-left-color: var(--danger); }}

        .summary-card .card-title {{
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-weight: 500;
        }}

        .summary-card .card-value {{
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0.5rem 0;
        }}

        .summary-card .card-desc {{
            font-size: 0.8rem;
            color: var(--text-secondary);
        }}

        .text-success {{ color: var(--success) !important; }}
        .text-danger {{ color: var(--danger) !important; }}

        /* Module Breakdown */
        .module-section {{
            margin-bottom: 2.5rem;
        }}

        .module-list {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
        }}

        .module-badge {{
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 0.5rem 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }}

        .module-badge-success {{ border-color: rgba(16, 185, 129, 0.4); }}
        .module-badge-danger {{ border-color: rgba(239, 68, 68, 0.4); }}

        .module-icon {{
            font-weight: 700;
        }}
        .module-badge-success .module-icon {{ color: var(--success); }}
        .module-badge-danger .module-icon {{ color: var(--danger); }}

        .module-name {{
            font-weight: 500;
        }}

        .module-count {{
            background-color: var(--bg-tertiary);
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
            font-size: 0.8rem;
            color: var(--text-secondary);
        }}

        /* Table Card */
        .card-table-wrapper {{
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 2rem;
        }}

        .card-table-header {{
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .card-table-header h3 {{
            font-size: 1.1rem;
            font-weight: 600;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }}

        th {{
            background-color: var(--bg-tertiary);
            color: var(--text-secondary);
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border);
        }}

        td {{
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border);
            font-size: 0.9rem;
            vertical-align: top;
        }}

        tr:last-child td {{
            border-bottom: none;
        }}

        tr:hover td {{
            background-color: rgba(255, 255, 255, 0.02);
        }}

        .test-name {{
            font-weight: 600;
            color: var(--text-primary);
        }}

        .test-details {{
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
            font-family: monospace;
            background-color: rgba(0, 0, 0, 0.2);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            display: inline-block;
            max-width: 100%;
            word-break: break-all;
        }}

        /* Badges */
        .badge {{
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }}

        .badge-success {{
            background-color: rgba(16, 185, 129, 0.15);
            color: var(--success);
        }}

        .badge-danger {{
            background-color: rgba(239, 68, 68, 0.15);
            color: var(--danger);
        }}

        .badge-outline {{
            border: 1px solid var(--border);
            color: var(--text-secondary);
        }}

        .badge-info {{
            background-color: rgba(59, 130, 246, 0.15);
            color: var(--info);
        }}

        /* Row highlights */
        .row-failed td {{
            background-color: rgba(239, 68, 68, 0.02);
        }}
        .row-failed:hover td {{
            background-color: rgba(239, 68, 68, 0.04);
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-group">
                <h1>Test Report</h1>
                <p>Hasil eksekusi test suite otomatis</p>
            </div>
            <div class="meta-info">
                <div class="timestamp">Dijalankan pada: <strong>{timestamp}</strong></div>
                <span class="status-pill {'success' if failed == 0 else 'failed'}">
                    {'✓ SEMUA LULUS' if failed == 0 else f'✗ {failed} TEST GAGAL'}
                </span>
            </div>
        </header>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-label">Total Test</div>
                <div class="stat-value">{total}</div>
            </div>
            <div class="stat-card success">
                <div class="stat-label">Lulus</div>
                <div class="stat-value">{passed}</div>
            </div>
            <div class="stat-card danger">
                <div class="stat-label">Gagal</div>
                <div class="stat-value">{failed}</div>
            </div>
            <div class="stat-card info">
                <div class="stat-label">Tingkat Kelulusan</div>
                <div class="stat-value">{success_rate:.1f}%</div>
            </div>
            <div class="stat-card primary">
                <div class="stat-label">Total Durasi</div>
                <div class="stat-value">{total_duration:.2f}s</div>
            </div>
        </div>

        <div class="grid-layout">
            <!-- Summary Section -->
            <div>
                <h2 class="section-title">Ringkasan per Tipe Test</h2>
                <div class="summary-cards">
                    {type_cards_html}
                </div>
            </div>

            <!-- Module Section -->
            <div class="module-section">
                <h2 class="section-title">Ringkasan per Modul</h2>
                <div class="module-list">
                    {module_badges_html}
                </div>
            </div>

            <!-- Detailed List -->
            <div>
                <h2 class="section-title">Daftar Detail Eksekusi</h2>
                <div class="card-table-wrapper">
                    <div class="card-table-header">
                        <h3>Semua Test Case ({total})</h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 100px;">Status</th>
                                <th>Test Case</th>
                                <th style="width: 150px;">Tipe</th>
                                <th style="width: 100px;">Durasi</th>
                                <th style="width: 120px;">Info Tambahan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {test_rows_html}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"""

    try:
        os.makedirs(os.path.dirname(html_path), exist_ok=True)
        with open(html_path, 'w') as f:
            f.write(html_content)
        print(f"HTML report generated successfully at {html_path}")
    except Exception as e:
        print(f"Error writing HTML report: {e}")
        sys.exit(1)

if __name__ == "__main__":
    generate_report()
