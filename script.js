const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const links = document.querySelectorAll(".site-nav a");

toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});

const sections = [...links]
  .map((link) => document.querySelector(link.getAttribute("href") || ""))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-40% 0px -48% 0px", threshold: [0.15, 0.35, 0.6] },
);

sections.forEach((section) => navObserver.observe(section));

const projects = {
  imyeon: {
    accent: "#2f7d7b",
    index: "01 / 스마트 웰니스",
    title: "입면",
    category: "제품 디자인 / 스마트 웰니스",
    description:
      "촉각적인 제품 언어, 은은한 피드백, 차분한 침대 옆 인터페이스를 통해 더 부드러운 수면 루틴을 제안하는 스마트 웰니스 제품 콘셉트입니다.",
    image: "./assets/project-imyeon.webp",
    alt: "입면 스마트 웰니스 제품 프레젠테이션",
    tags: ["스마트 제품", "UI", "UX", "수면 루틴"],
    role: "제품 콘셉트, UX 흐름, 비주얼 시스템",
    output: "물리적 제품 스토리와 인터페이스 방향성",
    theme: "회복적인 루틴과 부드러운 피드백",
  },
  bob: {
    accent: "#5a4d72",
    index: "02 / 사회적 성찰",
    title: "Bob",
    category: "인터랙티브 설치 / 사회적 성찰",
    description:
      "도파민 중심의 시간 보상, 사회적 압박, 신체적 건강 사이의 긴장을 시각화하는 인터랙티브 설치 작업입니다.",
    image: "./assets/project-bob.webp",
    alt: "Bob 인터랙티브 설치 프로젝트 프레젠테이션",
    tags: ["설치", "인터랙션", "소셜 디자인", "사변적 디자인"],
    role: "콘셉트, 인터랙션 로직, 비주얼 내러티브",
    output: "몰입형 설치 제안과 시스템 스토리",
    theme: "시간 압박, 스트레스, 행동 피드백",
  },
  mindchat: {
    accent: "#d97373",
    index: "03 / 서비스 디자인",
    title: "MindChat",
    category: "서비스 디자인 / 모바일 인터페이스",
    description:
      "고령 사용자의 사회적 장벽을 낮추기 위해 익숙한 상호작용, 친근한 추천, 온라인과 오프라인의 연결을 설계한 모바일 서비스 콘셉트입니다.",
    image: "./assets/project-mindchat.webp",
    alt: "MindChat 모바일 서비스 디자인 프레젠테이션",
    tags: ["서비스 디자인", "모바일 UI", "포용적 UX", "커뮤니티"],
    role: "서비스 여정, 모바일 인터페이스, 접근성 방향성",
    output: "앱 콘셉트, 핵심 화면, 서비스 접점",
    theme: "사회적 연결과 자신감 형성",
  },
};

const stage = document.querySelector(".case-stage");
const title = document.querySelector(".featured-title");
const index = document.querySelector(".featured-index");
const category = document.querySelector(".featured-category");
const description = document.querySelector(".featured-description");
const image = document.querySelector(".featured-image");
const tags = document.querySelector(".case-tags");
const tabs = document.querySelectorAll(".case-tab");
const briefRole = document.querySelector(".brief-role");
const briefOutput = document.querySelector(".brief-output");
const briefTheme = document.querySelector(".brief-theme");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const closeLightbox = document.querySelector(".lightbox-close");
let activeProject = "imyeon";
let lightboxCloseTimer;

function setProject(projectId) {
  const project = projects[projectId];
  if (!project || !stage || !title || !index || !category || !description || !image || !tags) {
    return;
  }

  activeProject = projectId;
  stage.style.setProperty("--case-accent", project.accent);
  title.textContent = project.title;
  index.textContent = project.index;
  category.textContent = project.category;
  description.textContent = project.description;
  image.style.opacity = "0";

  window.setTimeout(() => {
    image.src = project.image;
    image.alt = project.alt;
    image.style.opacity = "1";
  }, 120);

  tags.replaceChildren(
    ...project.tags.map((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      return item;
    }),
  );

  briefRole.textContent = project.role;
  briefOutput.textContent = project.output;
  briefTheme.textContent = project.theme;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.project === projectId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.style.setProperty("--case-accent", project.accent);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setProject(tab.dataset.project || "imyeon");
  });
});

function openLightbox() {
  const project = projects[activeProject];
  if (!lightbox || !lightboxImage || !lightboxCaption || !project) return;

  window.clearTimeout(lightboxCloseTimer);
  lightboxImage.src = project.image;
  lightboxImage.alt = project.alt;
  lightboxCaption.textContent = `${project.title} \u00B7 ${project.category}`;
  lightbox.hidden = false;
  lightbox.classList.remove("is-closing");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    lightbox.classList.add("is-open");
  });
  closeLightbox?.focus();
}

function hideLightbox() {
  if (!lightbox || lightbox.hidden) return;
  lightbox.classList.remove("is-open");
  lightbox.classList.add("is-closing");
  document.body.classList.remove("modal-open");
  lightboxCloseTimer = window.setTimeout(() => {
    lightbox.hidden = true;
    lightbox.classList.remove("is-closing");
  }, 260);
}

document.querySelectorAll("[data-open-image]").forEach((button) => {
  button.addEventListener("click", openLightbox);
});

closeLightbox?.addEventListener("click", hideLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideLightbox();
});

stage?.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(max-width: 1040px)").matches) return;
  const bounds = stage.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  stage.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
  stage.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
});

stage?.addEventListener("pointerleave", () => {
  stage.style.setProperty("--tilt-x", "0deg");
  stage.style.setProperty("--tilt-y", "0deg");
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

revealItems.forEach((item) => revealObserver.observe(item));
