<script setup lang="ts">
interface Settings {
  namespace: string;
  autoSetup: boolean;
  continuous: boolean | string;
  slidesPerView: number;
  sliderMove: string;
  spaceBetween: string;
  breakpoints: Array<any>;
  animation: string;
  direction: string;
  transitionDuration: number;
  autoslide: boolean;
  autoslideInterval: number;
  pauseOnHover: boolean;
  imageZoom: boolean;
  videoAutoPlay: boolean;
  videoMute: boolean;
  controllable: boolean;
}

interface Tmp {
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
  resizeTimeout?: number;
  breakpoint?: any;
  slideSize: number;
  minExt: number;
  maxExt: number;
  gestureTarget?: EventTarget | null;
  gT: number;
  updateSet?: number;
  autoslider?: number;
  spaceBetween: string;
  slidesPerView: number;
}

const carousel = useTemplateRef('carousel');
const props = defineProps<{ options?: Partial<Settings> }>();
const settings: Settings = {
  namespace: 'carousel',
  autoSetup: true,
  continuous: true,
  slidesPerView: 1,
  sliderMove: 'slide',
  spaceBetween: '0.5rem',
  breakpoints: [],
  animation: 'slide',
  direction: 'horizontal',
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

const tmp = reactive<Tmp>({
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
  slidesPerView: settings.slidesPerView,
  spaceBetween: settings.spaceBetween,
  uniqueId: '',
  continuous: settings.continuous && settings.continuous !== 'rewind',
});

let changeInSlides: MutationObserver,
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
  tmp.uniqueId = utils.getUniqueId(settings.namespace);
  viewbox = carousel.value?.querySelector(':scope > .cs-viewbox') || null;

  if (!viewbox) {
    console.error('A carousel in this page does not have it viewbox');
    return;
  }

  slider = viewbox.querySelector(':scope > .cs-slider') || null;

  if (!slider) {
    console.error('A carousel on this page does not have it slider');
    return;
  }

  prevBtn = carousel.value?.querySelector(':scope .cs-prev') || null;
  nextBtn = carousel.value?.querySelector(':scope .cs-next') || null;
  trackerCont = carousel.value?.querySelector(':scope .cs-trackers') || null;
  slider.style.transitionDuration = `${settings.transitionDuration}ms`;
  slider.setAttribute('data-anim', settings.animation);
  slider.ondragstart = () => false;
  slider.addEventListener('mousedown', gestureStart);
  slider.addEventListener('touchstart', gestureStart);

  if (settings.autoslide && settings.pauseOnHover) {
    slider.addEventListener('mouseenter', stopAutoslider);
    slider.addEventListener('mouseleave', startAutoslider);
  }

  prevBtn?.addEventListener('click', prevSlides);
  nextBtn?.addEventListener('click', nextSlides);
  trackerCont?.addEventListener('click', trackControl);

  changeInSlides = new MutationObserver(sizeResponse);
  window.addEventListener('resize', sizeResponse);
  sizeResponse();
});

onBeforeUnmount(() => {
  clearInterval(tmp.autoslider);
  clearTimeout(tmp.updateSet);
  stopAutoslider();
  window.removeEventListener('resize', sizeResponse);
});

function sizeResponse() {
  clearTimeout(tmp.resizeTimeout);
  tmp.resizeTimeout = window.setTimeout(() => {
    changeInSlides.disconnect();
    stopAutoslider();
    let mediaWidth = window.innerWidth;
    let matchedBreakpoints = settings.breakpoints.filter(
      (el) =>
        (el.minWidth || el.maxWidth) &&
        (!el.minWidth || el.minWidth <= mediaWidth) &&
        (!el.maxWidth || el.maxWidth >= mediaWidth)
    );
    let breakpoint =
      matchedBreakpoints
        .filter((el) => el.maxWidth)
        .sort((a, b) => a.maxWidth - b.maxWidth)[0] ||
      matchedBreakpoints
        .filter((el) => el.minWidth)
        .sort((a, b) => b.minWidth - a.minWidth)[0];

    tmp.breakpoint = {
      slidesPerView: settings.slidesPerView,
      spaceBetween: settings.spaceBetween,
      ...(breakpoint || {}),
    };
    init();
    if (!carousel.value) return;
    changeInSlides.observe(carousel.value, { subtree: true, childList: true });
  }, 350);
}

function init() {
  slides = [...(slider?.querySelectorAll(`:scope > .cs-slide`) || [])].filter(
    (el) => !el.matches(`[data-creator='${tmp.uniqueId}']`)
  ) as HTMLElement[];
  if (!slides[0]) return;
  slider?.classList.add('ghost-walk');

  if (!initialized || tmp.slidesNo !== slides.length) {
    [
      ...(slider?.querySelectorAll(`:scope [data-creator='${tmp.uniqueId}']`) ||
        []),
    ].forEach((el) => el.remove());
    tmp.continuous =
      settings.continuous &&
      settings.continuous !== 'rewind' &&
      slides.length > 1;
    slides.forEach((slide, index) => {
      slide.setAttribute('data-csid', `${index + 1}`);

      if (tmp.continuous) {
        let slideClone = slide.cloneNode(true) as HTMLElement;
        slideClone.setAttribute('data-creator', tmp.uniqueId);
        [...slideClone.querySelectorAll(':scope *')].forEach((el) => {
          el.removeAttribute('data-lightbox');
          el.removeAttribute('data-find-lightbox-content');
        });
        slideClone.classList.remove('active');
        slider?.append(slideClone);
        if (!index) slider?.prepend(slideClone.cloneNode(true));
        else
          slider?.insertBefore(
            slideClone.cloneNode(true),
            slider.children[index] as Node
          );
      }
    });
    initialized = true;
  }

  tmp.slidesNo = slides.length;
  tmp.currSlideNo = Number(
    slides
      .find((el) => el.classList.contains('active'))
      ?.getAttribute('data-csid') || 1
  );
  currSlide = slides[tmp.currSlideNo - 1] as HTMLElement;
  tmp.spaceBetween =
    typeof tmp.breakpoint.spaceBetween === 'number'
      ? `${tmp.breakpoint.spaceBetween}px`
      : tmp.breakpoint.spaceBetween;
  tmp.slidesPerView =
    tmp.continuous && tmp.breakpoint.slidesPerView > tmp.slidesNo
      ? tmp.slidesNo
      : tmp.breakpoint.slidesPerView;

  let rawSlides = [
    ...(slider?.querySelectorAll(`:scope > .cs-slide`) || []),
  ] as HTMLElement[];
  rawSlides.forEach((el) => {
    el.style.width = `calc(((100% + ${tmp.spaceBetween}) / ${tmp.slidesPerView}) - ${tmp.spaceBetween})`;
    el.style.marginRight = tmp.spaceBetween;
  });

  tmp.slideSize =
    currSlide.getBoundingClientRect().width +
    parseFloat(utils.getCssVal(currSlide, 'margin-right'));
  tmp.minExt = tmp.continuous ? -(tmp.slideSize * tmp.slidesNo) : 0;
  tmp.maxExt = tmp.minExt - tmp.slideSize * (tmp.slidesNo - tmp.slidesPerView);

  update();
  utils.afterNextRepaint(() => slider?.classList.remove('ghost-walk'));
  if (settings.autoslide) startAutoslider();
}

function update(newSlideNo: number = tmp.currSlideNo || 1) {
  clearTimeout(tmp.updateSet);

  newSlideNo = !tmp.continuous
    ? newSlideNo < 1
      ? 1
      : newSlideNo > tmp.slidesNo
      ? tmp.slidesNo
      : newSlideNo
    : newSlideNo < 1
    ? tmp.slidesNo + newSlideNo
    : newSlideNo > tmp.slidesNo
    ? newSlideNo - tmp.slidesNo
    : newSlideNo;

  prevSlide = currSlide;
  tmp.currSlideNo = newSlideNo;
  currSlide = slides[tmp.currSlideNo - 1] as HTMLElement;

  tmp.newCoord = Math.min(
    tmp.minExt,
    Math.max(tmp.minExt - (newSlideNo - 1) * tmp.slideSize, tmp.maxExt)
  );
  if (slider) slider.style.transform = `translateX(${tmp.newCoord}px)`;
  tmp.updateSet = window.setTimeout(() => {
    [...(slider?.querySelectorAll(`:scope > .cs-slide`) || [])].forEach((el) =>
      el.classList.remove('active')
    );
    [
      ...(slider?.querySelectorAll(
        `:scope > .cs-slide[data-csid='${newSlideNo}']`
      ) || []),
    ].forEach((el) => el.classList.add('active'));
  }, settings.transitionDuration);

  if (!settings.continuous && tmp.slidesNo > 1) {
    if (tmp.currSlideNo === 1) {
      prevBtn?.classList.add('disabled');
      nextBtn?.classList.remove('disabled');
    } else if (tmp.currSlideNo === tmp.slidesNo) {
      nextBtn?.classList.add('disabled');
      prevBtn?.classList.remove('disabled');
    } else {
      prevBtn?.classList.remove('disabled');
      nextBtn?.classList.remove('disabled');
    }
  }

  if (tmp.slidesNo === 1) {
    prevBtn?.classList.add('disabled');
    nextBtn?.classList.add('disabled');
  }

  if (trackerCont) {
    let trackers = [...trackerCont.querySelectorAll(`:scope > .cs-tracker`)];
    trackers.forEach((el) => el.classList.remove('active'));
    let tracker = trackers[newSlideNo - 1];

    if (tracker) {
      tracker.classList.add('active');
      utils.triggerEvent(trackerCont.parentElement!, 'activeView', tracker);
    }
  }
  tmp.coordChange = false;
}

function dist(e: MouseEvent | TouchEvent) {
  if (settings.direction === 'vertical')
    return 'touches' in e ? e.touches[0]?.clientY || 0 : e.clientY;
  return 'touches' in e ? e.touches[0]?.clientX || 0 : e.clientX;
}

function gestureStart(e: MouseEvent | TouchEvent) {
  if (e.type === 'mousedown' && (e as MouseEvent).button != 0) return;

  if (settings.autoslide) stopAutoslider();
  tmp.gestureTarget = e.target;
  tmp.gT = new Date().getTime();
  tmp.initCoord = tmp.newCoord;
  tmp.startCoord = dist(e);
  tmp.coordChange = false;
  tmp.endCoord = tmp.startCoord;

  slider?.classList.add('swiping');

  if (e.type === 'touchstart') {
    document.addEventListener('touchmove', gestureMove);
    document.addEventListener('touchend', gestureEnd);
  } else if (e.type === 'mousedown') {
    document.addEventListener('mousemove', gestureMove);
    document.addEventListener('mouseup', gestureEnd);
  }
}

function gestureMove(e: MouseEvent | TouchEvent) {
  tmp.moveDir =
    tmp.endCoord > dist(e) ? 1 : tmp.endCoord < dist(e) ? -1 : tmp.moveDir;
  tmp.endCoord = dist(e);
  if (Math.abs(tmp.endCoord - tmp.startCoord) > 5) tmp.coordChange = true;

  if (tmp.coordChange) {
    tmp.newCoord =
      tmp.initCoord +
      tmp.endCoord -
      tmp.startCoord +
      tmp.movePastSlides * Math.abs(tmp.minExt);

    if (tmp.continuous) {
      if (tmp.moveDir === 1 && tmp.newCoord < tmp.maxExt)
        tmp.movePastSlides += 1;
      else if (tmp.moveDir === -1 && tmp.newCoord > tmp.minExt)
        tmp.movePastSlides -= 1;
      tmp.newCoord =
        tmp.initCoord +
        tmp.endCoord -
        tmp.startCoord +
        tmp.movePastSlides * Math.abs(tmp.minExt);
    }

    if (slider) slider.style.transform = `translateX(${tmp.newCoord}px)`;
  }
}

function gestureEnd(e: MouseEvent | TouchEvent) {
  if (e.type === 'touchend') {
    document.removeEventListener('touchmove', gestureMove);
    document.removeEventListener('touchend', gestureEnd);
  } else {
    document.removeEventListener('mousemove', gestureMove);
    document.removeEventListener('mouseup', gestureEnd);
  }

  tmp.moveDir = 0;
  tmp.movePastSlides = 0;

  if (slider?.classList.contains('swiping') && tmp.coordChange) {
    let changeExt = tmp.endCoord - tmp.startCoord;
    let movedSlidesCount = Math.ceil(Math.abs(changeExt / tmp.slideSize));

    if (
      Math.abs(changeExt) > tmp.slideSize / 3 ||
      (Math.abs(changeExt) > tmp.slideSize / 20 &&
        new Date().getTime() - tmp.gT < 300)
    ) {
      slider.classList.remove('swiping');
      movedSlidesCount = settings.continuous
        ? movedSlidesCount > tmp.slidesNo
          ? movedSlidesCount % tmp.slidesNo
          : movedSlidesCount
        : movedSlidesCount;
      update(
        tmp.currSlideNo + (changeExt > 0 ? -movedSlidesCount : movedSlidesCount)
      );
    } else {
      tmp.newCoord = tmp.initCoord + changeExt;
      if (slider) slider.style.transform = `translateX(${tmp.newCoord}px)`;
      utils.afterNextRepaint(() => {
        slider?.classList.remove('swiping');
        update(tmp.currSlideNo);
      });
    }
  } else {
    if (
      tmp.gestureTarget instanceof HTMLElement &&
      tmp.gestureTarget.closest('[data-lightbox], [data-find-lightbox-content]')
    ) {
      let toggler = tmp.gestureTarget.closest(
        '[data-lightbox], [data-find-lightbox-content]'
      ) as HTMLElement;
      let lightboxElem = document.querySelector(
        `#${toggler.getAttribute('data-target')}`
      ) as HTMLElement;
      if (lightboxElem)
        utils.triggerEvent(lightboxElem, 'lbconsole', {
          command: 'view in lightbox',
          el: toggler,
        });
    }
    slider?.classList.remove('swiping');
    update(tmp.currSlideNo);
  }

  if (
    settings.pauseOnHover &&
    slider?.contains(e.target as Node) &&
    e.type !== 'touchend'
  )
    return;
  if (settings.autoslide) startAutoslider();
}

function prevSlides() {
  let newSlideNo =
    tmp.currSlideNo - (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

  if (tmp.continuous && newSlideNo < 1) {
    slider?.classList.add('ghost-walk');
    if (slider)
      slider.style.transform = `translateX(${tmp.newCoord + tmp.minExt}px)`;
    utils.afterNextRepaint(() => {
      slider?.classList.remove('ghost-walk');
      utils.afterNextRepaint(() => update(newSlideNo));
    });
  } else {
    if (settings.continuous && newSlideNo < 1) newSlideNo = tmp.slidesNo;
    update(newSlideNo);
  }
  if (tmp.autosliding) startAutoslider();
}

function nextSlides() {
  let newSlideNo =
    tmp.currSlideNo + (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

  if (tmp.continuous && newSlideNo > tmp.slidesNo) {
    slider?.classList.add('ghost-walk');
    if (slider)
      slider.style.transform = `translateX(${tmp.newCoord - tmp.minExt}px)`;
    utils.afterNextRepaint(() => {
      slider?.classList.remove('ghost-walk');
      utils.afterNextRepaint(() => update(newSlideNo));
    });
  } else {
    if (settings.continuous && newSlideNo > tmp.slidesNo) newSlideNo = 1;
    update(newSlideNo);
  }
  if (tmp.autosliding) startAutoslider();
}

function trackControl(e: MouseEvent) {
  let tracker = (e.target as HTMLElement).closest('.cs-trackers > .cs-tracker');

  if (tracker) {
    update(
      [
        ...(trackerCont?.querySelectorAll(`:scope > .cs-tracker`) || []),
      ].indexOf(tracker) + 1
    );
    if (tmp.autosliding) startAutoslider();
  }
}

function startAutoslider() {
  if (slider?.classList.contains('swiping')) return;
  stopAutoslider();
  tmp.autoslider = window.setInterval(() => {
    let newSlideNo =
      tmp.currSlideNo +
      (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

    if (tmp.continuous && newSlideNo > tmp.slidesNo) {
      slider?.classList.add('ghost-walk');
      if (slider)
        slider.style.transform = `translateX(${tmp.newCoord - tmp.minExt}px)`;
      utils.afterNextRepaint(() => slider?.classList.remove('ghost-walk'));
    } else if (!tmp.continuous && newSlideNo > tmp.slidesNo) newSlideNo = 1;
    utils.afterNextRepaint(() => update(newSlideNo));
  }, settings.autoslideInterval);
  tmp.autosliding = true;
}

function stopAutoslider() {
  clearInterval(tmp.autoslider);
  tmp.autosliding = false;
}
</script>
<template>
  <div ref="carousel" class="carousel" :class="{ lui: settings.autoSetup }">
    <template v-if="settings.autoSetup">
      <div class="cs-viewbox">
        <div class="cs-slider">
          <slot></slot>
        </div>
        <div class="cs-controls">
          <button type="button" class="cs-nav cs-prev">
            <Icon
              mode="svg"
              name="material-symbols:chevron-left"
              class="icon"
            />
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
        style="display: flex"
      >
        <div class="cs-trackers">
          <slot name="trackers">
            <button
              class="cs-tracker"
              v-for="n in tmp.slidesNo"
              :data-csid="n"
              :data-creator="tmp.uniqueId"
            ></button>
          </slot>
        </div>
        <div class="l-scroll">
          <Icon name="material-symbols:keyboard-double-arrow-left" />
        </div>
        <div class="r-scroll">
          <Icon name="material-symbols:keyboard-double-arrow-right" />
        </div>
      </LimbIScroller>
    </template>
    <slot v-else></slot>
  </div>
</template>
