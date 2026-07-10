/**
 * cms-content.js
 * Fetches Decap CMS-managed Markdown content directly from GitHub
 * and renders it into the page using the site's existing card styles.
 * No build step required.
 */

const CMS_REPO_OWNER = "AjayGoli17";
const CMS_REPO_NAME = "chaitanya-bharath-school";
const CMS_BRANCH = "main";

/**
 * Small frontmatter parser.
 * Expects files shaped like:
 * ---
 * title: "Something"
 * date: 2026-07-01T10:00:00.000Z
 * ---
 * Body text here...
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const [, frontmatterBlock, body] = match;
  const data = {};

  frontmatterBlock.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  });

  return { data, body: body.trim() };
}

async function fetchCollection(folder) {
  const listUrl = `https://api.github.com/repos/${CMS_REPO_OWNER}/${CMS_REPO_NAME}/contents/${folder}?ref=${CMS_BRANCH}`;
  const listRes = await fetch(listUrl);
  if (!listRes.ok) {
    console.error(`Failed to list ${folder}:`, listRes.status);
    return [];
  }

  const files = await listRes.json();
  const mdFiles = Array.isArray(files)
    ? files.filter((f) => f.name.endsWith(".md"))
    : [];

  const entries = await Promise.all(
    mdFiles.map(async (file) => {
      const res = await fetch(file.download_url);
      const raw = await res.text();
      return parseFrontmatter(raw);
    })
  );

  entries.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  return entries;
}

function formatDate(dateStr, opts) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", opts || { day: "numeric", month: "short", year: "numeric" });
}

/** Announcements -> fills #announcements-list (keeps .ann-card / .ann-date styling) */
async function renderAnnouncements() {
  const container = document.getElementById("announcements-list");
  if (!container) return;

  const entries = await fetchCollection("content/announcements");
  if (entries.length === 0) {
    container.innerHTML = `<p style="padding:20px;">No announcements posted yet. Check back soon.</p>`;
    return;
  }

  container.innerHTML = entries
    .map((entry, i) => {
      const urgentBadge =
        String(entry.data.urgent).toLowerCase() === "true"
          ? `<span class="badge badge-urgent">Urgent</span>`
          : "";
      return `
        <div class="ann-card">
          <div class="ann-top">
            ${urgentBadge}
            <span class="ann-date">${formatDate(entry.data.date)}</span>
          </div>
          <h3>${entry.data.title || "Untitled"}</h3>
          <p>${(entry.body || "").replace(/\n/g, "<br>")}</p>
        </div>
      `;
    })
    .join("");
}

/** Exam schedules -> fills #exam-schedules-list (keeps .exam-card styling) */
async function renderExamSchedules() {
  const container = document.getElementById("exam-schedules-list");
  if (!container) return;

  const entries = await fetchCollection("content/exam-schedules");
  if (entries.length === 0) {
    container.innerHTML = `<p style="padding:20px;">No examination schedules published yet.</p>`;
    return;
  }

  container.innerHTML = entries
    .map((entry, i) => {
      const pdfBtn = entry.data.pdf
        ? `<a class="icon-btn" href="${entry.data.pdf}" target="_blank" rel="noopener" title="Download PDF">↓</a>`
        : "";
      return `
        <div class="exam-card light">
          <span class="exam-tag upcoming">${entry.data.class || "ALL CLASSES"}</span>
          <h3>${entry.data.title || "Untitled"}</h3>
          <p>${entry.data.description || ""}</p>
          <p class="ann-date">${formatDate(entry.data.date)}</p>
          <div class="exam-btn-row">
            ${entry.data.pdf ? `<button class="btn-exam-navy" onclick="window.open('${entry.data.pdf}','_blank')">View PDF</button>` : ""}
            ${pdfBtn}
          </div>
        </div>
      `;
    })
    .join("");
}

/** Events -> fills #events-list (keeps .timeline / .timeline-item styling) */
async function renderEvents() {
  const container = document.getElementById("events-list");
  if (!container) return;

  const entries = await fetchCollection("content/events");
  if (entries.length === 0) {
    container.innerHTML = `<p style="padding:20px;">No upcoming events posted yet.</p>`;
    return;
  }

  container.innerHTML = entries
    .map(
      (entry, i) => `
      <div class="timeline-item">
        <span class="timeline-dot"></span>
        <div class="timeline-date">${formatDate(entry.data.date, { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</div>
        <h4>${entry.data.title || "Untitled"}</h4>
        <p>${entry.data.description || ""}</p>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAnnouncements();
  renderExamSchedules();
  renderEvents();
});
