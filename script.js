const $ = (s) => document.querySelector(s);
const thumb = (p) => p.cover || `https://i.ytimg.com/vi/${p.youtube}/maxresdefault.jpg`;
const label = (p) => [p.artist, p.title].filter(Boolean).join(" – ");

document.querySelectorAll(".ig").forEach((a) => (a.href = SITE.instagram));
document.querySelectorAll(".mail").forEach((a) => { a.href = "mailto:" + SITE.email; a.textContent = SITE.email; });

const grid = $("#grid");
if (grid) {
  const cats = ["Tout", ...new Set(PROJECTS.map((p) => p.category))];
  const nav = $("#filters");
  const draw = (cat) => {
    grid.innerHTML = PROJECTS.filter((p) => cat === "Tout" || p.category === cat).map((p) => `
      <a class="card" href="project.html?p=${p.slug}">
        <img src="${thumb(p)}" alt="${label(p)}" loading="lazy" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${p.youtube}/hqdefault.jpg'">
        <span class="cap">${label(p)}</span>
        <span class="sub">${p.category}${p.year ? " · " + p.year : ""}</span>
      </a>`).join("");
    nav.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.c === cat));
  };
  nav.innerHTML = cats.map((c) => `<button data-c="${c}">${c}</button>`).join("");
  nav.addEventListener("click", (e) => e.target.dataset.c && draw(e.target.dataset.c));
  draw("Tout");
}

const stage = $("#project");
if (stage) {
  const i = Math.max(0, PROJECTS.findIndex((p) => p.slug === new URLSearchParams(location.search).get("p")));
  const p = PROJECTS[i], next = PROJECTS[(i + 1) % PROJECTS.length];
  document.title = label(p) + " — SMB";
  const src = p.vimeo ? `https://player.vimeo.com/video/${p.vimeo}` : `https://www.youtube-nocookie.com/embed/${p.youtube}?rel=0`;
  const credits = Object.entries(p.credits || {}).filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  stage.innerHTML = `
    <div class="player"><iframe src="${src}" title="${label(p)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
    <div class="meta"><h1>${label(p)}</h1><p>${p.category}${p.year ? " · " + p.year : ""}</p><dl>${credits}</dl></div>
    <a class="next" href="project.html?p=${next.slug}">Projet suivant<strong>${label(next)}</strong></a>`;
}
