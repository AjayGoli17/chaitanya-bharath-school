/* =========================================================
   faculty-render.js
   Fetches content/faculty.json (managed via the Netlify CMS
   "Faculty Page" collection) and renders the leadership and
   teacher cards on the Faculty page. Once rendering is done,
   it hands off to initFacultyPage() in faculty.js to wire up
   the filter tabs, scroll reveals, and image skeletons.
   ========================================================= */

// Tell faculty.js not to auto-run on the (now empty) static markup.
window.__facultyRenderPending = true;

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function leaderCardHtml(person) {
  return `
    <div class="leader-card">
        <img src="${escapeHtml(person.photo)}" alt="${escapeHtml(person.name)}">
        <div class="leader-info">
            <h3>${escapeHtml(person.name)}</h3>
            <div class="leader-role">${escapeHtml(person.role)}</div>
            <div class="leader-edu">${escapeHtml(person.education)}</div>
        </div>
    </div>`;
}

function teacherCardHtml(person) {
  return `
    <div class="teacher-card">
        <img src="${escapeHtml(person.photo)}" alt="${escapeHtml(person.name)}">
        <div class="teacher-info">
            <h3>${escapeHtml(person.name)}</h3>
            <div class="teacher-role">${escapeHtml(person.role)}</div>
            <div class="teacher-edu">${escapeHtml(person.education)}</div>
        </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("content/faculty.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load content/faculty.json");
    const data = await res.json();

    const leaderGrid = document.getElementById("leaderGrid");
    if (leaderGrid && Array.isArray(data.leadership)) {
      leaderGrid.innerHTML = data.leadership.map(leaderCardHtml).join("");
    }

    const stages = ["Foundation", "Preparatory", "Middle"];
    const teachers = Array.isArray(data.teachers) ? data.teachers : [];

    stages.forEach((stage) => {
      const grid = document.getElementById("teacherGrid" + stage);
      if (!grid) return;
      const members = teachers.filter((t) => t.category === stage);
      grid.innerHTML = members.map(teacherCardHtml).join("");
    });
  } catch (err) {
    console.error("Could not render faculty data:", err);
  } finally {
    if (typeof window.initFacultyPage === "function") {
      window.initFacultyPage();
    }
  }
});
