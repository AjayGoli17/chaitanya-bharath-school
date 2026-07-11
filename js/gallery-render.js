/* =========================================================
   gallery-render.js
   Fetches content/gallery.json (managed via the Netlify CMS
   "Gallery Page" collection) and renders:
     1. The photo grid — five separate tab lists (Academics,
        Sports, Events, Trips, Celebrations) tagged with
        data-category so the existing filter-tab logic in
        gallery.js still works unchanged.
     2. The video section — one featured video plus a row of
        video cards, built from the "videos" sub-collection.
   Once rendering is done, it hands off to initGalleryPage()
   in gallery.js to wire up filter tabs, scroll reveals, video
   play/pause, and image skeletons.
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

const GALLERY_TABS = [
  { key: "academics", category: "Academics" },
  { key: "sports", category: "Sports" },
  { key: "events", category: "Events" },
  { key: "trips", category: "Trips" },
  { key: "celebrations", category: "Celebrations" },
];

function photoItemHtml(item, category, hidden) {
  const style = hidden ? ' style="display:none;"' : "";
  return `
        <div class="g-item reveal-item" data-category="${escapeHtml(category)}"${style}>
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.caption)}" loading="lazy">
            <div class="g-overlay"><span>${escapeHtml(item.caption)}</span></div>
        </div>`;
}

function videoWrapHtml(videoCls, video, poster) {
  return `
        <div class="video-wrap">
            <video class="${videoCls}" src="${escapeHtml(video)}" poster="${escapeHtml(poster)}" playsinline preload="metadata"></video>
            <button class="video-toggle-btn" type="button" aria-label="Play video">
                <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
            </button>
        </div>`;
}

function featuredVideoHtml(item) {
  return `
${videoWrapHtml("featured-video-el", item.video, item.poster)}
        <div class="featured-caption">${escapeHtml(item.title)}</div>`;
}

function videoCardHtml(item) {
  return `
        <div class="video-card scroll-reveal">
            ${videoWrapHtml("video-card-el", item.video, item.poster)}
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.description || "")}</p>
        </div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("content/gallery.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load content/gallery.json");
    const data = await res.json();

    /* ---- Photo grid (tab-based) ---- */
    const grid = document.getElementById("galleryGrid");
    const activeTab = document.querySelector(".filter-tabs button.active");
    const activeCategory = activeTab ? activeTab.getAttribute("data-filter") : GALLERY_TABS[0].category;

    if (grid) {
      let html = "";
      GALLERY_TABS.forEach(({ key, category }) => {
        const items = Array.isArray(data[key]) ? data[key] : [];
        const hidden = category !== activeCategory;
        items.forEach((item) => {
          html += photoItemHtml(item, category, hidden);
        });
      });
      grid.innerHTML = html;
    }

    /* ---- Video section ---- */
    const videos = Array.isArray(data.videos) ? data.videos : [];
    const featured = videos.find((v) => v.featured) || videos[0];
    const cards = videos.filter((v) => v !== featured);

    const featuredEl = document.getElementById("featuredVideo");
    if (featuredEl && featured) {
      featuredEl.innerHTML = featuredVideoHtml(featured);
    }

    const videoGrid = document.getElementById("videoGrid");
    if (videoGrid) {
      videoGrid.innerHTML = cards.map(videoCardHtml).join("");
    }
  } catch (err) {
    console.error("Could not render gallery data:", err);
  } finally {
    if (typeof window.initGalleryPage === "function") {
      window.initGalleryPage();
    }
  }
});
