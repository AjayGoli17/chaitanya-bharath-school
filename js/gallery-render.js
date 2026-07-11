/* =========================================================
   gallery-render.js
   Fetches content/gallery.json (managed via the Netlify CMS
   "Gallery Page" collection) and renders the gallery grid on
   the Gallery page. Once rendering is done, it hands off to
   initGalleryPage() in gallery.js to wire up the filter tabs,
   scroll reveals, video sliders, and image skeletons.
   ========================================================= */

// Tell gallery.js not to auto-run on the (now empty) static markup.
window.__galleryRenderPending = true;

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("content/gallery.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load content/gallery.json");
    const data = await res.json();

    const grid = document.getElementById("galleryGrid");
    const images = Array.isArray(data.images) ? data.images : [];
    const activeTab = document.querySelector(".filter-tabs button.active");
    const activeCategory = activeTab ? activeTab.getAttribute("data-filter") : null;

    if (grid) {
      grid.innerHTML = images
        .map((item) => {
          const hidden = item.category !== activeCategory ? ' style="display:none;"' : "";
          return `
        <div class="g-item reveal-item" data-category="${escapeHtml(item.category)}"${hidden}>
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.caption)}" loading="lazy">
            <div class="g-overlay"><span>${escapeHtml(item.caption)}</span></div>
        </div>`;
        })
        .join("");
    }
  } catch (err) {
    console.error("Could not render gallery data:", err);
  } finally {
    if (typeof window.initGalleryPage === "function") {
      window.initGalleryPage();
    }
  }
});
