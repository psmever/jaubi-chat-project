import { Controller, Get, Header } from '@nestjs/common';
import { cpus, freemem, hostname, platform, totalmem, uptime } from 'node:os';
import { version } from 'node:process';

const startedAt = Date.now();

@Controller()
export class AppController {
    @Get()
    @Header('Content-Type', 'text/html; charset=utf-8')
    getRoot(): string {
        const memoryTotalMb = Math.round(totalmem() / 1024 / 1024);
        const memoryFreeMb = Math.round(freemem() / 1024 / 1024);
        const uptimeSeconds = Math.floor(uptime());

        return `<!doctype html>
  <html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>jaubi-chat backend</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        max-width: 720px;
        margin: 48px auto;
        padding: 0 20px;
        color: #1f2937;
        background: #f9fafb;
      }
      h1 {
        margin-bottom: 8px;
        font-size: 28px;
      }
      .status {
        display: inline-block;
        margin: 12px 0 24px;
        padding: 6px 10px;
        border-radius: 6px;
        background: #dcfce7;
        color: #166534;
        font-weight: 700;
      }
      dl {
        display: grid;
        grid-template-columns: 160px 1fr;
        gap: 10px 16px;
        padding: 20px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: white;
      }
      dt {
        color: #6b7280;
      }
      dd {
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
    </style>
  </head>
  <body>
    <h1>jaubi-chat backend</h1>
    <div class="status">running</div>

    <dl>
      <dt>Hostname</dt>
      <dd>${hostname()}</dd>

      <dt>Platform</dt>
      <dd>${platform()}</dd>

      <dt>Node.js</dt>
      <dd>${version}</dd>

      <dt>CPU cores</dt>
      <dd>${cpus().length}</dd>

      <dt>Memory</dt>
      <dd>${memoryFreeMb}MB free / ${memoryTotalMb}MB total</dd>

      <dt>System uptime</dt>
      <dd>${uptimeSeconds}s</dd>

      <dt>Started at</dt>
      <dd>${startedAt.toString()}</dd>
    </dl>
  </body>
  </html>`;
    }
}
