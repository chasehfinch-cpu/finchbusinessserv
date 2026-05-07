(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  // --- Reveal on scroll -----------------------------------------------------
  const revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  if (reduceMotion) return;

  // --- Cursor spotlight + nav scroll state ---------------------------------
  const spotlight = document.querySelector(".spotlight");
  const orbA = document.querySelector(".orb-a");
  const orbB = document.querySelector(".orb-b");
  const nav = document.getElementById("nav");

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight * 0.3;
  let scrollY = window.scrollY;
  let ticking = false;

  function render() {
    ticking = false;

    if (spotlight && !isTouch) {
      spotlight.style.setProperty("--cx", pointerX + "px");
      spotlight.style.setProperty("--cy", pointerY + "px");
    }

    if (orbA) orbA.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0)`;
    if (orbB) orbB.style.transform = `translate3d(0, ${scrollY * -0.10}px, 0)`;

    if (nav) {
      if (scrollY > 8) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    }
  }

  function schedule() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }

  if (!isTouch) {
    window.addEventListener("pointermove", (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      schedule();
    }, { passive: true });
  }

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    schedule();
  }, { passive: true });

  // --- Card hover lighting --------------------------------------------------
  if (!isTouch) {
    document.querySelectorAll(".cap-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty("--mx", mx + "%");
        card.style.setProperty("--my", my + "%");
      }, { passive: true });
    });
  }

  // Initial paint
  render();
})();
