<script setup lang="ts">
type BrainBox = {
  namespace: string;
  autoSetup: boolean;
  continuous: boolean | "rewind";
  sliderMove: "slide" | "view";
  slidesPerView: number;
  spaceBetween: string;
  breakpoints: {
    minWidth?: number;
    maxWidth?: number;
    slidesPerView?: number;
    spaceBetween?: string;
  }[];
  animation: string;
  direction: "horizontal" | "vertical";
  transitionDuration: number;
  autoslide: boolean;
  autoslideInterval: number;
  pauseOnHover: boolean;
  imageZoom: boolean;
  videoAutoPlay: boolean;
  videoMute: boolean;
  controllable: boolean;
};

type reactiveBrainBox = {
  newCoord: number;
  startCoord: number;
  endCoord: number;
  initCoord: number;
  movePastSlides: number;
  coordChange: boolean;
  moveDir: number;
  autosliding: boolean;
  slidesNo: number;
  currSlideNo: number;
  continuous: boolean | string;
  uniqueId: string;
  resizeTimeout?: ReturnType<typeof setTimeout>;
  breakpoint?: any;
  slideSize: number;
  minExt: number;
  maxExt: number;
  gestureTarget?: EventTarget | null;
  gT: number;
  updateSet?: ReturnType<typeof setTimeout>;
  autoslider?: ReturnType<typeof setInterval>;
  spaceBetween: string;
  slidesPerView: number;
};

const carousel = useTemplateRef("carousel");
const props = defineProps<{
  options?: Partial<BrainBox>;
  trackerPosition?: "left" | "right" | "bottom" | "top";
}>();
const bb: BrainBox = {
  namespace: "carousel",
  autoSetup: true,
  continuous: true,
  slidesPerView: 1,
  sliderMove: "slide",
  spaceBetween: "0.5rem",
  breakpoints: [],
  animation: "slide",
  direction: "horizontal",
  transitionDuration: 500,
  autoslide: false,
  autoslideInterval: 5000,
  pauseOnHover: true,
  imageZoom: true,
  videoAutoPlay: false,
  videoMute: true,
  controllable: true,
  ...props.options,
};

const rbb = reactive<reactiveBrainBox>({
  newCoord: 0,
  startCoord: 0,
  endCoord: 0,
  initCoord: 0,
  minExt: 0,
  maxExt: 0,
  slideSize: 0,
  gT: Infinity,
  movePastSlides: 0,
  coordChange: false,
  moveDir: 0,
  autosliding: false,
  slidesNo: 0,
  currSlideNo: 0,
  slidesPerView: bb.slidesPerView,
  spaceBetween: bb.spaceBetween,
  uniqueId: "",
  continuous: bb.continuous && bb.continuous !== "rewind",
});

let changeInSlides: MutationObserver,
  sizeObserver: ResizeObserver,
  viewbox: HTMLElement | null,
  slider: HTMLElement | null,
  slides: HTMLElement[],
  currSlide: HTMLElement | null,
  prevSlide: HTMLElement | null,
  trackerCont: HTMLElement | null,
  prevBtn: HTMLElement | null,
  nextBtn: HTMLElement | null,
  initialized: boolean;

onMounted(() => {
  rbb.uniqueId = utils.getUniqueId(bb.namespace);
  viewbox = carousel.value?.querySelector(":scope > .cs-viewbox") || null;

  if (!viewbox) {
    console.error("A carousel in this page does not have it viewbox");
    return;
  }

  slider = viewbox.querySelector(":scope > .cs-slider") || null;

  if (!slider) {
    console.error("A carousel on this page does not have it slider");
    return;
  }

  prevBtn = carousel.value?.querySelector(":scope .cs-prev") || null;
  nextBtn = carousel.value?.querySelector(":scope .cs-next") || null;
  trackerCont = carousel.value?.querySelector(":scope .cs-trackers") || null;
  slider.style.transitionDuration = `${bb.transitionDuration}ms`;
  slider.setAttribute("data-anim", bb.animation);
  slider.ondragstart = () => false;
  slider.addEventListener("mousedown", gestureStart);
  slider.addEventListener("touchstart", gestureStart);

  if (bb.autoslide && bb.pauseOnHover) {
    slider.addEventListener("mouseenter", stopAutoslider);
    slider.addEventListener("mouseleave", startAutoslider);
  }

  prevBtn?.addEventListener("click", prevSlides);
  nextBtn?.addEventListener("click", nextSlides);
  trackerCont?.addEventListener("click", trackControl);

  changeInSlides = new MutationObserver(sizeResponse);
  sizeObserver = new ResizeObserver(sizeResponse);
  sizeObserver.observe(viewbox);
  sizeResponse();
});

onBeforeUnmount(() => {
  clearInterval(rbb.autoslider);
  clearTimeout(rbb.updateSet);
  stopAutoslider();
  sizeObserver?.disconnect();
});

function sizeResponse() {
  clearTimeout(rbb.resizeTimeout);
  rbb.resizeTimeout = setTimeout(() => {
    changeInSlides.disconnect();
    stopAutoslider();
    let mediaWidth = window.innerWidth;
    let matchedBreakpoints = bb.breakpoints.filter(
      (el) =>
        (el.minWidth || el.maxWidth) &&
        (!el.minWidth || el.minWidth <= mediaWidth) &&
        (!el.maxWidth || el.maxWidth >= mediaWidth),
    );
    let breakpoint =
      matchedBreakpoints.filter((el) => el.maxWidth).sort((a, b) => a.maxWidth! - b.maxWidth!)[0] ||
      matchedBreakpoints.filter((el) => el.minWidth).sort((a, b) => b.minWidth! - a.minWidth!)[0];

    rbb.breakpoint = {
      slidesPerView: bb.slidesPerView,
      spaceBetween: bb.spaceBetween,
      ...(breakpoint || {}),
    };
    init();
    if (!carousel.value) return;
    changeInSlides.observe(carousel.value, { subtree: true, childList: true });
  }, 350);
}

function init() {
  slides = [...(slider?.querySelectorAll(`:scope > .cs-slide`) || [])].filter(
    (el) => !el.matches(`[data-creator='${rbb.uniqueId}']`),
  ) as HTMLElement[];
  if (!slides[0]) return;
  slider?.classList.add("ghost-walk");

  if (!initialized || rbb.slidesNo !== slides.length) {
    [...(slider?.querySelectorAll(`:scope [data-creator='${rbb.uniqueId}']`) || [])].forEach((el) =>
      el.remove(),
    );
    rbb.continuous = bb.continuous && bb.continuous !== "rewind" && slides.length > 1;
    slides.forEach((slide, index) => {
      slide.setAttribute("data-csid", `${index + 1}`);

      if (rbb.continuous) {
        let slideClone = slide.cloneNode(true) as HTMLElement;
        slideClone.setAttribute("data-creator", rbb.uniqueId);
        [...slideClone.querySelectorAll(":scope *")].forEach((el) => {
          el.removeAttribute("data-lightbox");
          el.removeAttribute("data-find-lightbox-content");
        });
        slideClone.classList.remove("active");
        slider?.append(slideClone);
        if (!index) slider?.prepend(slideClone.cloneNode(true));
        else slider?.insertBefore(slideClone.cloneNode(true), slider.children[index] as Node);
      }
    });
    initialized = true;
  }

  rbb.slidesNo = slides.length;
  rbb.currSlideNo = Number(
    slides.find((el) => el.classList.contains("active"))?.getAttribute("data-csid") || 1,
  );
  currSlide = slides[rbb.currSlideNo - 1] as HTMLElement;
  rbb.spaceBetween =
    typeof rbb.breakpoint.spaceBetween === "number"
      ? `${rbb.breakpoint.spaceBetween}px`
      : rbb.breakpoint.spaceBetween;
  rbb.slidesPerView =
    rbb.continuous && rbb.breakpoint.slidesPerView > rbb.slidesNo
      ? rbb.slidesNo
      : rbb.breakpoint.slidesPerView;

  let rawSlides = [...(slider?.querySelectorAll(`:scope > .cs-slide`) || [])] as HTMLElement[];
  rawSlides.forEach((el) => {
    el.style.width = `calc(((100% + ${rbb.spaceBetween}) / ${rbb.slidesPerView}) - ${rbb.spaceBetween})`;
    el.style.marginRight = rbb.spaceBetween;
  });

  rbb.slideSize =
    currSlide.getBoundingClientRect().width +
    parseFloat(utils.getCssVal(currSlide, "margin-right"));
  rbb.minExt = rbb.continuous ? -(rbb.slideSize * rbb.slidesNo) : 0;
  rbb.maxExt = rbb.minExt - rbb.slideSize * (rbb.slidesNo - rbb.slidesPerView);

  update();
  utils.afterNextRepaint(() => slider?.classList.remove("ghost-walk"));
  if (bb.autoslide) startAutoslider();
}

function update(newSlideNo: number = rbb.currSlideNo || 1) {
  clearTimeout(rbb.updateSet);

  newSlideNo = !rbb.continuous
    ? newSlideNo < 1
      ? 1
      : newSlideNo > rbb.slidesNo
        ? rbb.slidesNo
        : newSlideNo
    : newSlideNo < 1
      ? rbb.slidesNo + newSlideNo
      : newSlideNo > rbb.slidesNo
        ? newSlideNo - rbb.slidesNo
        : newSlideNo;

  prevSlide = currSlide;
  rbb.currSlideNo = newSlideNo;
  currSlide = slides[rbb.currSlideNo - 1] as HTMLElement;

  rbb.newCoord = Math.min(
    rbb.minExt,
    Math.max(rbb.minExt - (newSlideNo - 1) * rbb.slideSize, rbb.maxExt),
  );
  if (slider) slider.style.transform = `translateX(${rbb.newCoord}px)`;
  rbb.updateSet = setTimeout(() => {
    [...(slider?.querySelectorAll(`:scope > .cs-slide`) || [])].forEach((el) =>
      el.classList.remove("active"),
    );
    [...(slider?.querySelectorAll(`:scope > .cs-slide[data-csid='${newSlideNo}']`) || [])].forEach(
      (el) => el.classList.add("active"),
    );
  }, bb.transitionDuration);

  if (!bb.continuous && rbb.slidesNo > 1) {
    if (rbb.currSlideNo === 1) {
      prevBtn?.classList.add("disabled");
      nextBtn?.classList.remove("disabled");
    } else if (rbb.currSlideNo === rbb.slidesNo) {
      nextBtn?.classList.add("disabled");
      prevBtn?.classList.remove("disabled");
    } else {
      prevBtn?.classList.remove("disabled");
      nextBtn?.classList.remove("disabled");
    }
  }

  if (rbb.slidesNo === 1) {
    prevBtn?.classList.add("disabled");
    nextBtn?.classList.add("disabled");
  }

  if (trackerCont) {
    let trackers = [...trackerCont.querySelectorAll(`:scope > .cs-tracker`)];
    trackers.forEach((el) => el.classList.remove("active"));
    let tracker = trackers[newSlideNo - 1];

    if (tracker) {
      tracker.classList.add("active");
      utils.triggerEvent(trackerCont.parentElement!, "activeView", tracker);
    }
  }
  rbb.coordChange = false;
}

function dist(e: MouseEvent | TouchEvent) {
  if (bb.direction === "vertical") return "touches" in e ? e.touches[0]?.clientY || 0 : e.clientY;
  return "touches" in e ? e.touches[0]?.clientX || 0 : e.clientX;
}

function gestureStart(e: MouseEvent | TouchEvent) {
  if (e.type === "mousedown" && (e as MouseEvent).button != 0) return;

  if (bb.autoslide) stopAutoslider();
  rbb.gestureTarget = e.target;
  rbb.gT = new Date().getTime();
  rbb.initCoord = rbb.newCoord;
  rbb.startCoord = dist(e);
  rbb.coordChange = false;
  rbb.endCoord = rbb.startCoord;

  slider?.classList.add("swiping");

  if (e.type === "touchstart") {
    document.addEventListener("touchmove", gestureMove);
    document.addEventListener("touchend", gestureEnd);
  } else if (e.type === "mousedown") {
    document.addEventListener("mousemove", gestureMove);
    document.addEventListener("mouseup", gestureEnd);
  }
}

function gestureMove(e: MouseEvent | TouchEvent) {
  rbb.moveDir = rbb.endCoord > dist(e) ? 1 : rbb.endCoord < dist(e) ? -1 : rbb.moveDir;
  rbb.endCoord = dist(e);
  if (Math.abs(rbb.endCoord - rbb.startCoord) > 5) rbb.coordChange = true;

  if (rbb.coordChange) {
    rbb.newCoord =
      rbb.initCoord + rbb.endCoord - rbb.startCoord + rbb.movePastSlides * Math.abs(rbb.minExt);

    if (rbb.continuous) {
      if (rbb.moveDir === 1 && rbb.newCoord < rbb.maxExt) rbb.movePastSlides += 1;
      else if (rbb.moveDir === -1 && rbb.newCoord > rbb.minExt) rbb.movePastSlides -= 1;
      rbb.newCoord =
        rbb.initCoord + rbb.endCoord - rbb.startCoord + rbb.movePastSlides * Math.abs(rbb.minExt);
    }

    if (slider) slider.style.transform = `translateX(${rbb.newCoord}px)`;
  }
}

function gestureEnd(e: MouseEvent | TouchEvent) {
  if (e.type === "touchend") {
    document.removeEventListener("touchmove", gestureMove);
    document.removeEventListener("touchend", gestureEnd);
  } else {
    document.removeEventListener("mousemove", gestureMove);
    document.removeEventListener("mouseup", gestureEnd);
  }

  rbb.moveDir = 0;
  rbb.movePastSlides = 0;

  if (slider?.classList.contains("swiping") && rbb.coordChange) {
    let changeExt = rbb.endCoord - rbb.startCoord;
    let movedSlidesCount = Math.ceil(Math.abs(changeExt / rbb.slideSize));

    if (
      Math.abs(changeExt) > rbb.slideSize / 3 ||
      (Math.abs(changeExt) > rbb.slideSize / 20 && new Date().getTime() - rbb.gT < 300)
    ) {
      slider.classList.remove("swiping");
      movedSlidesCount = bb.continuous
        ? movedSlidesCount > rbb.slidesNo
          ? movedSlidesCount % rbb.slidesNo
          : movedSlidesCount
        : movedSlidesCount;
      update(rbb.currSlideNo + (changeExt > 0 ? -movedSlidesCount : movedSlidesCount));
    } else {
      rbb.newCoord = rbb.initCoord + changeExt;
      if (slider) slider.style.transform = `translateX(${rbb.newCoord}px)`;
      utils.afterNextRepaint(() => {
        slider?.classList.remove("swiping");
        update(rbb.currSlideNo);
      });
    }
  } else {
    if (
      rbb.gestureTarget instanceof HTMLElement &&
      rbb.gestureTarget.closest("[data-lightbox], [data-find-lightbox-content]")
    ) {
      let toggler = rbb.gestureTarget.closest(
        "[data-lightbox], [data-find-lightbox-content]",
      ) as HTMLElement;
      let lightboxElem = document.querySelector(
        `#${toggler.getAttribute("data-target")}`,
      ) as HTMLElement;
      if (lightboxElem)
        utils.triggerEvent(lightboxElem, "lbconsole", {
          command: "view in lightbox",
          el: toggler,
        });
    }
    slider?.classList.remove("swiping");
    update(rbb.currSlideNo);
  }

  if (bb.pauseOnHover && slider?.contains(e.target as Node) && e.type !== "touchend") return;
  if (bb.autoslide) startAutoslider();
}

function prevSlides() {
  let newSlideNo = rbb.currSlideNo - (bb.sliderMove === "view" ? rbb.slidesPerView : 1);

  if (rbb.continuous && newSlideNo < 1) {
    slider?.classList.add("ghost-walk");
    if (slider) slider.style.transform = `translateX(${rbb.newCoord + rbb.minExt}px)`;
    utils.afterNextRepaint(() => {
      slider?.classList.remove("ghost-walk");
      utils.afterNextRepaint(() => update(newSlideNo));
    });
  } else {
    if (bb.continuous && newSlideNo < 1) newSlideNo = rbb.slidesNo;
    update(newSlideNo);
  }
  if (rbb.autosliding) startAutoslider();
}

function nextSlides() {
  let newSlideNo = rbb.currSlideNo + (bb.sliderMove === "view" ? rbb.slidesPerView : 1);

  if (rbb.continuous && newSlideNo > rbb.slidesNo) {
    slider?.classList.add("ghost-walk");
    if (slider) slider.style.transform = `translateX(${rbb.newCoord - rbb.minExt}px)`;
    utils.afterNextRepaint(() => {
      slider?.classList.remove("ghost-walk");
      utils.afterNextRepaint(() => update(newSlideNo));
    });
  } else {
    if (bb.continuous && newSlideNo > rbb.slidesNo) newSlideNo = 1;
    update(newSlideNo);
  }
  if (rbb.autosliding) startAutoslider();
}

function trackControl(e: MouseEvent) {
  let tracker = (e.target as HTMLElement).closest(".cs-trackers > .cs-tracker");

  if (tracker) {
    update([...(trackerCont?.querySelectorAll(`:scope > .cs-tracker`) || [])].indexOf(tracker) + 1);
    if (rbb.autosliding) startAutoslider();
  }
}

function startAutoslider() {
  if (slider?.classList.contains("swiping")) return;
  stopAutoslider();
  rbb.autoslider = setInterval(() => {
    let newSlideNo = rbb.currSlideNo + (bb.sliderMove === "view" ? rbb.slidesPerView : 1);

    if (rbb.continuous && newSlideNo > rbb.slidesNo) {
      slider?.classList.add("ghost-walk");
      if (slider) slider.style.transform = `translateX(${rbb.newCoord - rbb.minExt}px)`;
      utils.afterNextRepaint(() => slider?.classList.remove("ghost-walk"));
    } else if (!rbb.continuous && newSlideNo > rbb.slidesNo) newSlideNo = 1;
    utils.afterNextRepaint(() => update(newSlideNo));
  }, bb.autoslideInterval);
  rbb.autosliding = true;
}

function stopAutoslider() {
  clearInterval(rbb.autoslider);
  rbb.autosliding = false;
}
</script>
<template>
  <div
    ref="carousel"
    class="carousel"
    :class="{
      lui: bb.autoSetup,
    }"
    :tracker-position
  >
    <template v-if="bb.autoSetup">
      <div class="cs-viewbox">
        <div class="cs-slider">
          <slot></slot>
        </div>
        <div class="cs-controls">
          <button type="button" class="cs-nav cs-prev">
            <Icon mode="svg" name="material-symbols:chevron-left" class="icon" />
          </button>
          <button type="button" class="cs-nav cs-next">
            <Icon mode="svg" name="material-symbols:chevron-right" />
          </button>
        </div>
      </div>
      <LimbIScroller
        :options="{
          autoSetup: false,
          scrollBody: '.cs-trackers',
          scrollChildren: '.cs-tracker',
        }"
        :vertical="trackerPosition === 'left' || trackerPosition === 'right'"
      >
        <div class="scroll-items cs-trackers mx-auto gap-1 p-1">
          <slot name="trackers">
            <button
              class="cs-tracker"
              v-for="n in rbb.slidesNo"
              :data-csid="n"
              :data-creator="rbb.uniqueId"
            ></button>
          </slot>
        </div>
        <div class="l-scroll">
          <Icon
            v-if="trackerPosition === 'left' || trackerPosition === 'right'"
            name="material-symbols:arrow-upward-alt"
          />
          <Icon v-else name="material-symbols:arrow-left-alt" />
        </div>
        <div class="r-scroll">
          <Icon
            v-if="trackerPosition === 'left' || trackerPosition === 'right'"
            name="material-symbols:arrow-downward-alt"
          />
          <Icon v-else name="material-symbols:arrow-right-alt" />
        </div>
      </LimbIScroller>
    </template>
    <slot v-else></slot>
  </div>
</template>
<style>
.carousel {
  position: relative;
  max-width: 100%;

  .cs-viewbox {
    display: block;
    position: relative;
    overflow: hidden;
    user-select: none;
    width: 100%;
    border-radius: var(--radius-block);
  }

  .cs-slider {
    display: flex;
    align-items: stretch;
    backface-visibility: hidden;
    list-style: none;
    overflow: visible;
    margin: 0px;
    padding: 0px;
    width: 100%;
    transition: transform 500ms cubic-bezier(0, 0, 0.25, 1);

    &[data-anim="slide"] {
      flex-flow: row nowrap;
    }

    &.swiping,
    &.ghost-walk {
      transition-duration: 0ms !important;
    }

    .cs-slide {
      display: flex;
      flex: 0 0 auto;
      justify-content: center;
      align-items: center;
      text-align: center;
      overflow: hidden;
      list-style: none;
      position: relative;
      width: 100%;
      height: auto;
      z-index: 0;
    }
  }

  .cs-trackers {
    pointer-events: none;

    .cs-tracker {
      pointer-events: auto;
      cursor: pointer;
    }
  }
}

/* apply default style on cs-tracker, cs-prev, and cs-next. */
.carousel.lui {
  display: flex;
  flex-flow: column nowrap;
  gap: var(--spacing);

  &[tracker-position="left"],
  &[tracker-position="right"] {
    .cs-viewbox {
      flex: 1 1 0;
    }
    .cs-tracker {
      flex: 0 0 auto;
    }
  }

  &[tracker-position="top"] {
    flex-direction: column-reverse;
  }

  &[tracker-position="right"] {
    flex-direction: row;
  }

  &[tracker-position="left"] {
    flex-direction: row-reverse;
  }

  .cs-trackers {
    & .cs-tracker:not(.thumbnail) {
      display: inline-block;
      position: relative;
      background-color: var(--color-outline);
      border: 0;
      border-radius: 50%;
      height: 0.625em;
      width: 0.625em;
      margin: 0;
      padding: 0;
      opacity: 0.75;
      transition:
        background-color 0.2s ease,
        color 0.2s ease;

      &.active {
        background-color: var(--color-primary);
        opacity: 1;
      }
    }
  }

  .cs-prev,
  .cs-next {
    background: var(--color-surface);
    width: 2em;
    height: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    opacity: 0.5;
    padding: 0px;
    margin: 0;
    color: var(--color-on-surface);
    cursor: pointer;
    font-size: 1.25rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: opacity ease 0.2s;

    &:hover {
      opacity: 1;
    }

    &.disabled {
      opacity: 0;
      pointer-events: none;
    }
  }

  .cs-prev {
    left: 0px;
  }

  .cs-next {
    right: 0px;
  }

  &:not(:hover) > .cs-prev,
  &:not(:hover) > .cs-next {
    opacity: 0;
  }
}
</style>
