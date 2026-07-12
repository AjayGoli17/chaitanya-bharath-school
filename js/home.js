/* =========================================================
   home.js
   Reads content/home.json (CMS-managed) and applies the
   Principal photo/name/role to the homepage leadership
   section. Falls back to whatever is already in the HTML
   if the fetch fails, so the page never breaks.
   ========================================================= */

(function () {
  fetch("content/home.json", { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("home.json not found");
      return res.json();
    })
    .then(data => {
      const img = document.getElementById("principalPhoto");
      if (img && data.principal_photo) {
        img.src = data.principal_photo;
      }
      if (img && data.principal_name) {
        img.alt = data.principal_name + ", Principal of Chaitanya Bharath School";
      }

      const nameEl = document.querySelector(".lead-name h4");
      if (nameEl && data.principal_name) {
        nameEl.textContent = data.principal_name;
      }

      const roleEl = document.querySelector(".lead-name p");
      if (roleEl && data.principal_role) {
        roleEl.textContent = data.principal_role;
      }
    })
    .catch(err => {
      console.warn("home.js: could not load content/home.json —", err.message);
    });
})();
