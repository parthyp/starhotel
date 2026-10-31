(() => {
  const doc = document.documentElement;
  doc.classList.add("js");

  // Header style on scroll + mobile booking bar
  const header = document.querySelector(".site-header");
  const mobileBook = document.querySelector(".mobile-book");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    if (mobileBook) mobileBook.classList.toggle("show", y > window.innerHeight * 0.7);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const setNav = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
  };
  toggle.addEventListener("click", () => setNav(!document.body.classList.contains("nav-open")));
  document.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

  // Active nav link
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  // Reveal on scroll
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

  // Gallery filters
  const figures = [...document.querySelectorAll(".gallery figure")];
  document.querySelectorAll(".filters button").forEach((btn, _, all) => {
    btn.addEventListener("click", () => {
      all.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const f = btn.dataset.filter;
      figures.forEach((fig) => { fig.hidden = f !== "all" && fig.dataset.cat !== f; });
    });
  });

  // Lightbox
  const lb = document.querySelector(".lightbox");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("p");
  let current = 0;
  const visible = () => figures.filter((f) => !f.hidden);
  const show = (fig) => {
    const img = fig.querySelector("img");
    lbImg.src = fig.querySelector("button").dataset.full;
    lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector("figcaption").textContent;
    current = visible().indexOf(fig);
  };
  const step = (d) => {
    const v = visible();
    show(v[(current + d + v.length) % v.length]);
  };
  figures.forEach((fig) => fig.querySelector("button").addEventListener("click", () => { show(fig); lb.showModal(); }));
  lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
  lb.querySelector(".lb-prev").addEventListener("click", () => step(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  // Load Google Map only when asked (keeps the page fast)
  const mapBtn = document.querySelector(".map-load");
  if (mapBtn) {
    mapBtn.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = mapBtn.dataset.src;
      iframe.title = "Map showing Star Hotel at 128 E Route 66, Williams, Arizona";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.allowFullscreen = true;
      mapBtn.replaceWith(iframe);
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
