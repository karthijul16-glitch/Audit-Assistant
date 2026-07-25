# Site Auditor

A simple web tool that audits any URL — checks HTTP status, response time, title, meta description, H1 count, missing image alt text, and word count.

## Features
- Backend: Node.js + Express endpoint `/api/audit` that fetches and parses the page
- Frontend: single-page UI to enter a URL and view results
- Handles invalid URLs, timeouts, and non-HTML responses gracefully


## API
`POST /api/audit` with `{ "url": "https://example.com" }` → returns JSON report or error.

## Tech Stack
Node.js, Express, Cheerio, HTML/CSS/JS
