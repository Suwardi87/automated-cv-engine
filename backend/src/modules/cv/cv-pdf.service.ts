import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import puppeteer, { Browser } from 'puppeteer-core';
import { CvData } from '../../services/ai.service';

const ESC = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export interface CvPdfMeta {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

@Injectable()
export class CvPdfService {
  private readonly logger = new Logger(CvPdfService.name);

  private resolveChromePath(): string {
    const candidates = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
    ];
    for (const p of candidates) {
      if (p && existsSync(p)) return p;
    }
    throw new Error('Chrome/Chromium executable not found');
  }

  async renderPdf(data: CvData, meta: CvPdfMeta): Promise<Buffer> {
    const executablePath = this.resolveChromePath();
    const html = this.buildHtml(data, meta);

    let browser: Browser | null = null;
    try {
      browser = await puppeteer.launch({
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
      const buffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '14mm', right: '13mm', bottom: '14mm', left: '13mm' },
      });
      return Buffer.from(buffer);
    } finally {
      if (browser) {
        try { await browser.close(); } catch { /* ignore */ }
      }
    }
  }

  private buildHtml(data: CvData, meta: CvPdfMeta): string {
    const contactLine = [
      meta.location,
      meta.phone,
      meta.email,
      meta.linkedin,
      meta.github,
    ].filter(Boolean).map(ESC).join('  •  ');

    const skills = (data.technicalSkills ?? [])
      .slice(0, 24)
      .map(ESC)
      .join(', ');

    const expHtml = (data.experiences ?? [])
      .map(
        (e) => `
      <div class="item">
        <div class="row"><span class="role">${ESC(e.role)}</span><span class="period">${ESC(e.period)}</span></div>
        <div class="company">${ESC(e.company)}</div>
        <ul>${(e.bullets ?? []).map((b) => `<li>${ESC(b)}</li>`).join('')}</ul>
      </div>`,
      )
      .join('');

    const eduHtml = (data.education ?? [])
      .map(
        (e) => `
      <div class="item">
        <div class="row"><span class="role">${ESC(e.degree)}</span><span class="period">${ESC(e.period)}</span></div>
        <div class="company">${ESC(e.school)}</div>
        ${e.note ? `<div class="note">${ESC(e.note)}</div>` : ''}
      </div>`,
      )
      .join('');

    const orgHtml = (data.organizations ?? [])
      .map(
        (o) => `
      <div class="item">
        <div class="row"><span class="role">${ESC(o.role)}</span><span class="period">${ESC(o.period)}</span></div>
        <div class="company">${ESC(o.company)}</div>
        <ul>${(o.bullets ?? []).map((b) => `<li>${ESC(b)}</li>`).join('')}</ul>
      </div>`,
      )
      .join('');

    const certHtml = (data.certificates ?? [])
      .map((c) => `<li>${ESC(c)}</li>`)
      .join('');

    const softHtml = (data.softSkills ?? []).map((s) => `<li>${ESC(s)}</li>`).join('');

    const portfolioHtml = (data.portfolioLinks ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `<li>${ESC(l)}</li>`)
      .join('');

    const section = (title: string, body: string) =>
      body.trim() ? `<section><h2>${ESC(title)}</h2>${body}</section>` : '';

    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10.2pt; color: #1a1a1a; line-height: 1.5; }
  .header { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px; margin-bottom: 14px; }
  .header h1 { font-size: 19pt; letter-spacing: 0.5px; }
  .header .headline { font-size: 11pt; color: #333; margin-top: 3px; font-weight: 600; }
  .header .contact { font-size: 8.8pt; color: #444; margin-top: 6px; }
  h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #bbb; padding-bottom: 3px; margin: 14px 0 8px; }
  section { page-break-inside: avoid; }
  .item { margin-bottom: 9pt; page-break-inside: avoid; }
  .row { display: flex; justify-content: space-between; align-items: baseline; }
  .role { font-weight: 700; font-size: 10.5pt; }
  .period { font-size: 8.8pt; color: #555; white-space: nowrap; margin-left: 12px; }
  .company { font-size: 9.5pt; color: #333; font-style: italic; margin-top: 1px; }
  ul { margin: 4px 0 0 16px; }
  li { margin-bottom: 2.5pt; }
  .skills-line { font-size: 9.8pt; }
  .note { font-size: 9pt; color: #444; margin-top: 2px; }
  a { color: #1a1a1a; text-decoration: none; }
</style>
</head>
<body>
  <div class="header">
    <h1>${ESC(meta.name)}</h1>
    ${meta.jobTitle ? `<div class="headline">${ESC(meta.jobTitle)}</div>` : ''}
    ${contactLine ? `<div class="contact">${contactLine}</div>` : ''}
  </div>

  ${data.profil ? `<section><p>${ESC(data.profil)}</p></section>` : ''}

  ${section('Keahlian Teknis', `<p class="skills-line">${skills}</p>`)}

  ${section('Pengalaman Profesional', expHtml)}

  ${section('Pendidikan', eduHtml)}

  ${section('Pengalaman Organisasi', orgHtml)}

  ${section('Sertifikat & Pelatihan', `<ul>${certHtml}</ul>`)}

  ${section('Keahlian Non-Teknis', `<ul>${softHtml}</ul>`)}

  ${section('Portofolio', `<ul>${portfolioHtml}</ul>`)}
</body>
</html>`;
  }
}
