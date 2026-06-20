const data = [
    {
        place:'Switzerland Alps',
        title:'SAINT',
        title2:'ANTONIEN',
        description:'Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It\'s a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.',
        image:'images/timed-cards-1.jpg'
    },
    {
        place:'Japan Alps',
        title:'NANGANO',
        title2:'PREFECTURE',
        description:'Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country\'s best powder.',
        image:'images/timed-cards-2.jpg'
    },
    {
        place:'Sahara Desert - Morocco',
        title:'MARRAKECH',
        title2:'MEROUGA',
        description:'The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.',
        image:'images/timed-cards-3.jpg'
    },
    {
        place:'Sierra Nevada - USA',
        title:'YOSEMITE',
        title2:'NATIONAL PARAK',
        description:'Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.',
        image:'images/timed-cards-4.jpg'
    },
    {
        place:'Tarifa - Spain',
        title:'LOS LANCES',
        title2:'BEACH',
        description:'Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach\'s long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.',
        image:'images/timed-cards-5.jpg'
    },
    {
        place:'Cappadocia - Turkey',
        title:'Göreme',
        title2:'Valley',
        description:'Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.',
        image:'images/timed-cards-6.jpg'
    },
]

const _ = (id)=>document.getElementById(id)
const cards = data.map((i, index)=>`<div class="card" id="card${index}" style="background-image:url(${i.image})"  ></div>`).join('')



const cardContents = data.map((i, index)=>`<div class="card-content" id="card-content-${index}">
<div class="content-start"></div>
<div class="content-place">${i.place}</div>
<div class="content-title-1">${i.title}</div>
<div class="content-title-2">${i.title2}</div>

</div>`).join('')


const sildeNumbers = data.map((_, index)=>`<div class="item" id="slide-item-${index}" >${index+1}</div>`).join('')
_('demo').innerHTML =  cards + cardContents
_('slide-numbers').innerHTML =  sildeNumbers


/* =========================================================
   Tiny GSAP-like animation engine (no dependency)
   Supports: gsap.set(target, props) / gsap.to(target, props {duration, delay, ease, onComplete})
   Props supported: x, y, width, height, opacity, zIndex, borderRadius, scale
   ========================================================= */

const EASES = {
  "sine.inOut": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
  "linear": "linear",
};

function els(target) {
  if (typeof target !== "string") return [target];
  return Array.from(document.querySelectorAll(target));
}

// per-element current animated-prop state, so we can compose transform from x/y/scale
const stateMap = new WeakMap();

function getState(el) {
  let s = stateMap.get(el);
  if (!s) {
    s = { x: 0, y: 0, scale: 1 };
    stateMap.set(el, s);
  }
  return s;
}

function applyTransform(el) {
  const s = getState(el);
  el.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.scale})`;
}

function applyImmediate(el, props) {
  const s = getState(el);
  for (const key in props) {
    const val = props[key];
    if (key === "x" || key === "y" || key === "scale") {
      s[key] = val;
    } else if (key === "width" || key === "height") {
      el.style[key] = typeof val === "number" ? val + "px" : val;
    } else if (key === "opacity") {
      el.style.opacity = val;
    } else if (key === "zIndex") {
      el.style.zIndex = val;
    } else if (key === "borderRadius") {
      el.style.borderRadius = (typeof val === "number" ? val + "px" : val);
    }
  }
  applyTransform(el);
}

function setProps(target, props) {
  els(target).forEach((el) => {
    if (!el) return;
    el.style.transition = "none";
    applyImmediate(el, props);
    void el.offsetWidth;
    el.style.transition = "";
  });
}

function toProps(target, props) {
  const { duration = 0.5, delay = 0, ease = "sine.inOut", onComplete } = props;
  const targets = els(target).filter(Boolean);
  if (targets.length === 0) {
    if (onComplete) onComplete();
    return Promise.resolve();
  }

  const animProps = { ...props };
  delete animProps.duration;
  delete animProps.delay;
  delete animProps.ease;
  delete animProps.onComplete;

  const cssEase = EASES[ease] || "ease";
  let remaining = targets.length;

  return new Promise((resolve) => {
    const finish = () => {
      remaining -= 1;
      if (remaining <= 0) {
        if (onComplete) onComplete();
        resolve();
      }
    };

    targets.forEach((el) => {
      const s = getState(el);
      const transitionProps = [];
      if ("x" in animProps || "y" in animProps || "scale" in animProps) {
        transitionProps.push("transform");
      }
      if ("opacity" in animProps) transitionProps.push("opacity");
      if ("width" in animProps) transitionProps.push("width");
      if ("height" in animProps) transitionProps.push("height");
      if ("borderRadius" in animProps) transitionProps.push("border-radius");

      window.setTimeout(() => {
        el.style.transition = transitionProps
          .map((p) => `${p} ${duration}s ${cssEase}`)
          .join(", ");

        let handled = false;
        const onEnd = (e) => {
          if (e.target !== el) return;
          handled = true;
          el.removeEventListener("transitionend", onEnd);
          finish();
        };
        el.addEventListener("transitionend", onEnd);

        if ("x" in animProps) s.x = animProps.x;
        if ("y" in animProps) s.y = animProps.y;
        if ("scale" in animProps) s.scale = animProps.scale;
        applyTransform(el);

        if ("width" in animProps) {
          el.style.width = (typeof animProps.width === "number" ? animProps.width + "px" : animProps.width);
        }
        if ("height" in animProps) {
          el.style.height = (typeof animProps.height === "number" ? animProps.height + "px" : animProps.height);
        }
        if ("opacity" in animProps) el.style.opacity = animProps.opacity;
        if ("zIndex" in animProps) el.style.zIndex = animProps.zIndex;
        if ("borderRadius" in animProps) {
          el.style.borderRadius = (typeof animProps.borderRadius === "number" ? animProps.borderRadius + "px" : animProps.borderRadius);
        }

        window.setTimeout(() => {
          if (!handled) {
            el.removeEventListener("transitionend", onEnd);
            finish();
          }
        }, duration * 1000 + 60);
      }, delay * 1000);
    });
  });
}

const gsap = {
  set: setProps,
  to: (target, props) => toProps(target, props),
};
const set = gsap.set;

/* ========================================================= */

function getCard(index) {
  return `#card${index}`;
}
function getCardContent(index) {
  return `#card-content-${index}`;
}
function getSliderItem(index) {
  return `#slide-item-${index}`;
}

function syncCardContentWidth() {
  document.querySelectorAll(".card-content").forEach((el) => {
    el.style.setProperty("--card-w", cardWidth + "px");
  });
}

function animate(target, duration, properties) {
  return gsap.to(target, { ...properties, duration });
}

let order = [0, 1, 2, 3, 4, 5];
let detailsEven = true;

let offsetTop = 200;
let offsetLeft = 700;
let paginationLeft = 700;
let cardWidth = 200;
let cardHeight = 300;
let gap = 40;
let numberSize = 50;
let progressWidth = 500;
const ease = "sine.inOut";

function isMobile() {
  return window.innerWidth <= 760;
}
    
function computeLayout() {
  const { innerHeight: height, innerWidth: width } = window;

  if (isMobile()) {
    cardWidth = Math.round(width * 0.26);
    cardHeight = Math.round(cardWidth * 1.45);
    gap = Math.round(width * 0.025);
    numberSize = 36;
    offsetTop = height - (cardHeight + 90);
    const visibleCount = Math.min(2, order.length - 1);
    offsetLeft = width - 16 - cardWidth - (visibleCount - 1) * (cardWidth + gap);
    paginationLeft = 20;
    // arrows (~36px each + gaps) + slide-numbers margin eat into the row;
    // progress bar fills what's left before the right edge.
    progressWidth = Math.max(80, width - paginationLeft - 36 - 10 - 36 - 24 - 20);
  } else {
    cardWidth = 200;
    cardHeight = 300;
    gap = 40;
    numberSize = 50;
    progressWidth = 500;
    offsetTop = height - 430;
    offsetLeft = width - 830;
    paginationLeft = offsetLeft;
  }
}

function init() {
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

  computeLayout();
  syncCardContentWidth();

  gsap.set("#pagination", {
    top: offsetTop + cardHeight + 30,
    left: paginationLeft,
    y: 200,
    opacity: 0,
    zIndex: 60,
  });
  gsap.set("nav", { y: -200, opacity: 0 });

  gsap.set(getCard(active), {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(`${detailsInactive} .text`, { y: 100 });
  gsap.set(`${detailsInactive} .title-1`, { y: 100 });
  gsap.set(`${detailsInactive} .title-2`, { y: 100 });
  gsap.set(`${detailsInactive} .desc`, { y: 50 });
  gsap.set(`${detailsInactive} .cta`, { y: 60 });

  gsap.set(".progress-sub-foreground", {
    width: progressWidth * (1 / order.length) * (active + 1),
  });

  rest.forEach((i, index) => {
    gsap.set(getCard(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      y: offsetTop,
      width: cardWidth,
      height: cardHeight,
      zIndex: 30,
      borderRadius: 10,
    });
    gsap.set(getCardContent(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      zIndex: 40,
      y: offsetTop + cardHeight - 100,
    });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });

  gsap.set(".indicator", { x: -window.innerWidth });

  const startDelay = 0.6;

  gsap.to(".cover", {
    x: window.innerWidth + 400,
    delay: 0.5,
    ease,
    onComplete: () => {
      setTimeout(() => {
        loop();
      }, 500);
    },
  });
  rest.forEach((i, index) => {
    gsap.to(getCard(i), {
      x: offsetLeft + index * (cardWidth + gap),
      zIndex: 30,
      ease,
      delay: startDelay,
    });
    gsap.to(getCardContent(i), {
      x: offsetLeft + index * (cardWidth + gap),
      zIndex: 40,
      ease,
      delay: startDelay,
    });
  });
  gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to("nav", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
}

let clicks = 0;

function step() {
  return new Promise((resolve) => {
    order.push(order.shift());
    detailsEven = !detailsEven;

    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

    document.querySelector(`${detailsActive} .place-box .text`).textContent =
      data[order[0]].place;
    document.querySelector(`${detailsActive} .title-1`).textContent =
      data[order[0]].title;
    document.querySelector(`${detailsActive} .title-2`).textContent =
      data[order[0]].title2;
    document.querySelector(`${detailsActive} .desc`).textContent =
      data[order[0]].description;

    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
    gsap.to(`${detailsActive} .text`, {
      y: 0,
      delay: 0.1,
      duration: 1.5,
      ease,
    });
    gsap.to(`${detailsActive} .title-1`, {
      y: 0,
      delay: 0.15,
      duration: 1.5,
      ease,
    });
    gsap.to(`${detailsActive} .title-2`, {
      y: 0,
      delay: 0.15,
      duration: 1.5,
      ease,
    });   
    gsap.to(`${detailsActive} .desc`, {
      y: 0,
      delay: 0.3,
      duration: 1.2,
      ease,
    });
    gsap.to(`${detailsActive} .cta`, {
      y: 0,
      delay: 0.35,
      duration: 1.2,
      onComplete: resolve,
      ease,
    });
    gsap.set(detailsInactive, { zIndex: 12 });

    const [active, ...rest] = order;
    const prv = rest[rest.length - 1];

    gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(prv), { scale: 1.5, ease });

    gsap.to(getCardContent(active), {
      y: offsetTop + cardHeight - 10,
      opacity: 0,
      duration: 0.3,
      ease,
    });
    gsap.to(getSliderItem(active), { x: 0, ease });
    gsap.to(getSliderItem(prv), { x: -numberSize, ease });
    gsap.to(".progress-sub-foreground", {
      width: progressWidth * (1 / order.length) * (active + 1),
      ease,
    });

    gsap.to(getCard(active), {
      x: 0,
      y: 0,
      ease,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
        gsap.set(getCard(prv), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 30,
          borderRadius: 10,
          scale: 1,
        });

        gsap.set(getCardContent(prv), {
          x: xNew,
          y: offsetTop + cardHeight - 100,
          opacity: 1,
          zIndex: 40,
        });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });

        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .text`, { y: 100 });
        gsap.set(`${detailsInactive} .title-1`, { y: 100 });
        gsap.set(`${detailsInactive} .title-2`, { y: 100 });
        gsap.set(`${detailsInactive} .desc`, { y: 50 });
        gsap.set(`${detailsInactive} .cta`, { y: 60 });
        clicks -= 1;
        if (clicks > 0) {
          step();
        }
      },
    });

    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          ease,
          delay: 0.1 * (index + 1),
        });

        gsap.to(getCardContent(i), {
          x: xNew,
          y: offsetTop + cardHeight - 100,
          opacity: 1,
          zIndex: 40,
          ease,
          delay: 0.1 * (index + 1),
        });
        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
      }
    });
  });
}

async function loop() {
  await animate(".indicator", 20, { x: 0 });

  await animate(".indicator", 1.2, {
    x: window.innerWidth,
    delay: 0.5
  });

  set(".indicator", { x: -window.innerWidth });

  await step();

  setTimeout(loop, 2000);
}  

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function loadImages() {
  const promises = data.map(({ image }) => loadImage(image));
  return Promise.all(promises);
}

async function start() {
  try {
    await loadImages();
    init();
  } catch (error) {
    console.error("One or more images failed to load", error);
  }
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const [active, ...rest] = order;
    computeLayout();
    syncCardContentWidth();

    gsap.set(getCard(active), {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    gsap.set("#pagination", {
      top: offsetTop + cardHeight + 30,
      left: paginationLeft,
    });
    rest.forEach((i, index) => {
      const xNew = offsetLeft + index * (cardWidth + gap);
      gsap.set(getCard(i), {
        x: xNew,    
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
      });
      gsap.set(getCardContent(i), {
        x: xNew,
        y: offsetTop + cardHeight - 100,
      });
    });
    gsap.set(".progress-sub-foreground", {
      width: progressWidth * (1 / order.length) * (active + 1),
    });
  }, 150);
});

start()
