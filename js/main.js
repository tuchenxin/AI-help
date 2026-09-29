/* ==========================================================
   页面逻辑：项目渲染 → 导航交互 → 滚动高亮 → 进场动效
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. 渲染项目列表（数据驱动，便于扩展） ---------- */
  const list = document.getElementById("work-list");

  if (list && typeof PROJECTS !== "undefined") {
    const VARIANTS = ["feature", "split", "collage"];
    let splitCount = 0;

    const html = PROJECTS.map(function (p, i) {
      const variant = p.layout || VARIANTS[i % VARIANTS.length];
      const num = "P." + String(i + 1).padStart(2, "0");
      // split 版式自动左右交替，避免连续两个项目同向
      const splitAlt = variant === "split" && splitCount++ % 2 === 1 ? " alt" : "";

      const media =
        '<div class="project-media">' +
        '<span class="project-page">' + num + "</span>" +
        '<img src="' + p.image + '" alt="' + p.alt + '" loading="lazy">' +
        "</div>";

      const body =
        '<div class="project-body">' +
        '<span class="project-cat">' + p.category + "</span>" +
        '<h3 class="project-title">' + p.title + "</h3>" +
        '<p class="project-desc">' + p.desc + "</p>" +
        '<ul class="project-meta">' +
        "<li><span>完成时间</span>" + p.date + "</li>" +
        "<li><span>技术栈</span>" + p.stack.join(" / ") + "</li>" +
        "</ul>" +
        "</div>";

      const cls =
        "project reveal project--" + variant + (splitAlt ? " " + splitAlt.trim() : "");

      // collage 版式把图片包一层 fig，用于色块衬底定位
      const inner =
        variant === "collage" ? '<div class="project-fig">' + media + "</div>" + body : media + body;

      return '<article class="' + cls + '">' + inner + "</article>";
    }).join("");

    list.innerHTML = html;

    const count = document.getElementById("works-count");
    if (count) {
      count.textContent = "共 " + PROJECTS.length + " 个项目 · 持续更新";
    }
  }

  /* ---------- 2. 移动端导航开合 ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    const closeNav = function () {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", function () {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- 3. 滚动高亮当前区块 ---------- */
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = ["works", "about", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 4. 进场动效 ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 5. 页脚年份 ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 6. 深浅色主题切换（初始状态由 index.html 中的内联脚本设置） ---------- */
  const themeBtn = document.querySelector(".theme-toggle");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* 存储不可用时忽略 */ }
    });
  }
})();
