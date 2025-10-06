<script setup lang="ts">
interface ScrollerOptions {
  namespace: string;
  autoSetup: boolean;
  scrollBody: string;
  scrollChildren: string;
  prevCtrlBtn: string;
  nextCtrlBtn: string;
  autoProvideCtrls: boolean;
  scrollwithVerticalWheel: boolean;
  scrollwithHorizontalWheel: boolean;
  controlOverlay: boolean;
  duration: number;
}

interface Rect {
  width: number;
  left: number;
  scrollPos: number;
  sWidth: number;
  maxScroll: number;
}

interface Coords {
  start?: number;
  end?: number;
  change?: boolean;
  scrollPos?: number;
  velocity?: number;
}

const { $anime } = useNuxtApp();
const el = useTemplateRef('el');
const props = defineProps<{ options?: Partial<ScrollerOptions> }>();

const settings: ScrollerOptions = {
  ...{
    namespace: 'iScroller',
    autoSetup: false,
    scrollBody: '.scroll-items',
    scrollChildren: '.item',
    prevCtrlBtn: '.l-scroll',
    nextCtrlBtn: '.r-scroll',
    autoProvideCtrls: true,
    scrollwithVerticalWheel: false,
    scrollwithHorizontalWheel: true,
    controlOverlay: true,
    duration: 300,
  },
  ...(props.options || {}),
};
const coords: Coords = {};
let contentSizeObserver: MutationObserver;
let sizeObserver: ResizeObserver;

let scrollElem: HTMLElement | null = null;

onMounted(async () => {
  if (!el.value) return;

  scrollElem = el.value.querySelector(`:scope > ${settings.scrollBody}`);

  if (!scrollElem) {
    console.warn('An IScrollable element does not exist');
    return;
  }
  scrollElem.addEventListener('scroll', onScrollMtd);
  contentSizeObserver = new MutationObserver(() => onScrollMtd());
  contentSizeObserver.observe(scrollElem, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  sizeObserver = new ResizeObserver(() => onScrollMtd());
  sizeObserver.observe(scrollElem);

  el.value.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const rect = getRect();
    const items = [
      ...scrollElem!.querySelectorAll(`:scope ${settings.scrollChildren}`),
    ] as HTMLElement[];
    let checker: number[] = [];

    if (target.closest(settings.prevCtrlBtn)) {
      let tolerance = settings.controlOverlay
        ? (target.closest(settings.prevCtrlBtn) as HTMLElement).offsetWidth
        : 0;

      if (items[0]) {
        checker = items.reduce((acc, el) => {
          if (
            utils.offsetPos(el).left - rect.left > tolerance ||
            utils.offsetPos(el).left +
              el.getBoundingClientRect().width -
              rect.left <
              tolerance
          )
            return acc;
          else
            return [
              ...acc,
              rect.scrollPos -
                (rect.left +
                  rect.width -
                  utils.offsetPos(el).left -
                  el.getBoundingClientRect().width),
            ];
        }, [] as number[]);
      }
      animateScroll(
        checker.length &&
          Math.abs(Math.min(...checker) + tolerance - rect.scrollPos) > 4
          ? Math.min(...checker) + tolerance
          : rect.scrollPos - rect.width + tolerance > 0
          ? rect.scrollPos - rect.width + tolerance
          : 0
      );
    } else if (target.closest(settings.nextCtrlBtn)) {
      let tolerance = settings.controlOverlay
        ? (target.closest(settings.nextCtrlBtn) as HTMLElement).offsetWidth
        : 0;
        
      if (items[0]) {
        checker = items.reduce((acc, el) => {
          if (
            utils.offsetPos(el).left - rect.left < tolerance ||
            utils.offsetPos(el).left + el.getBoundingClientRect().width <
              rect.left + rect.width - tolerance
          )
            return acc;
          else
            return [
              ...acc,
              rect.scrollPos + utils.offsetPos(el).left - rect.left,
            ];
        }, [] as number[]);
      }

      animateScroll(
        checker.length &&
          Math.abs(Math.min(...checker) - tolerance - rect.scrollPos) > 4
          ? Math.min(...checker) - tolerance
          : rect.maxScroll > rect.scrollPos + rect.width - tolerance
          ? rect.scrollPos + rect.width - tolerance
          : rect.maxScroll + 10 // overscroll to prevent not reaching the end
      );
    }
  });

  el.value.addEventListener('activeView', (e: Event) => {
    const items = [
      ...scrollElem!.querySelectorAll(`:scope ${settings.scrollChildren}`),
    ] as HTMLElement[];
    let activeItem =
      (e as CustomEvent).detail ||
      items.find((el) => el.classList.contains('active'));

    if (!activeItem || !scrollElem?.contains(activeItem)) return;
    const rect = getRect();

    let aeProp = {
      left: utils.offsetPos(activeItem).left,
      width: activeItem.getBoundingClientRect().width,
    };

    animateScroll(
      rect.scrollPos -
        (rect.width / 2 - aeProp.left + rect.left - aeProp.width / 2)
    );
  });
  await nextTick();
  onScrollMtd();
});

onBeforeUnmount(() => contentSizeObserver.disconnect());

function getRect(): Rect {
  return {
    width: scrollElem!.clientWidth,
    left: utils.offsetPos(scrollElem!).left,
    scrollPos: scrollElem!.scrollLeft,
    sWidth: scrollElem!.scrollWidth,
    maxScroll: scrollElem!.scrollWidth - scrollElem!.clientWidth,
  };
}

function onScrollMtd(): void {
  if (!scrollElem || !el.value) return;

  const rect = getRect();
  if (Math.floor(scrollElem.scrollLeft) === 0)
    [...el.value.querySelectorAll(`:scope ${settings.prevCtrlBtn}`)].forEach(
      (el) => el.classList.remove('active')
    );
  else
    [...el.value.querySelectorAll(`:scope ${settings.prevCtrlBtn}`)].forEach(
      (el) => el.classList.add('active')
    );

  if (Math.ceil(scrollElem.scrollLeft) >= rect.maxScroll) {
    [...el.value.querySelectorAll(`:scope ${settings.nextCtrlBtn}`)].forEach(
      (el) => el.classList.remove('active')
    );
  } else
    [...el.value.querySelectorAll(`:scope ${settings.nextCtrlBtn}`)].forEach(
      (el) => el.classList.add('active')
    );
}

function gestureStart(e: TouchEvent): void {
  if (!scrollElem) return;

  if (scrollElem.contains(e.target as Node) || e.target === scrollElem) {
    coords.start = e.touches[0]!.clientX;
    coords.end = e.touches[0]!.clientX;
    coords.change = false;
    coords.scrollPos = getRect().scrollPos;
    coords.velocity = 0; // reset velocity
    scrollElem.classList.add('swiping');
    document.addEventListener('touchmove', gestureMove);
    document.addEventListener('touchend', gestureEnd);
  }
}

function gestureMove(e: TouchEvent): void {
  if (!scrollElem) return;
  coords.velocity = e.touches[0]!.clientX - coords.end!; // update velocity
  coords.end = e.touches[0]!.clientX;
  if (Math.abs(coords.end! - coords.start!) > 5 && !coords.change)
    coords.change = true;
  if (coords.change)
    scrollElem.scrollLeft = coords.scrollPos! - (coords.end! - coords.start!);
}

function gestureEnd(): void {
  if (!scrollElem) return;
  document.removeEventListener('touchmove', gestureMove);
  document.removeEventListener('touchend', gestureEnd);
  scrollElem.classList.remove('swiping');

  // Apply momentum
  const applyMomentum = () => {
    if (Math.abs(coords.velocity!) > 0.1) {
      scrollElem!.scrollLeft -= coords.velocity!; // Apply velocity to scroll position
      coords.velocity! *= 0.975; // Reduce velocity (deceleration)
      requestAnimationFrame(applyMomentum); // Continue animation
    }
  };

  applyMomentum();
}

function wheelControl(e: WheelEvent): void {
  if (!scrollElem) return;

  const rect = getRect();

  if (
    (settings.scrollwithVerticalWheel || e.shiftKey) &&
    ((e.deltaY > 0 && Math.ceil(rect.scrollPos) < rect.maxScroll) ||
      (e.deltaY < 0 && rect.scrollPos !== 0))
  ) {
    e.preventDefault();
    scrollElem.scrollLeft = rect.scrollPos + e.deltaY;
  }

  if (
    settings.scrollwithHorizontalWheel &&
    ((e.deltaX > 0 && Math.ceil(rect.scrollPos) < rect.maxScroll) ||
      (e.deltaX < 0 && rect.scrollPos !== 0))
  ) {
    e.preventDefault();
    scrollElem.scrollLeft = rect.scrollPos + e.deltaX;
  }
}

function animateScroll(scrollExt: number): void {
  $anime({
    targets: scrollElem!,
    scrollLeft: scrollExt,
    duration: settings.duration,
    easing: 'linear',
  });
}
</script>

<template>
  <div
    ref="el"
    class="i-scroller"
    @touchstart="gestureStart"
    @wheel="wheelControl"
  >
    <template v-if="settings.autoSetup">
      <div class="scroll-items">
        <slot />
      </div>
      <button class="l-scroll">
        <Icon name="material-symbols:keyboard-double-arrow-left" />
      </button>
      <button class="r-scroll">
        <Icon name="material-symbols:keyboard-double-arrow-right" />
      </button>
    </template>
    <slot v-else />
  </div>
</template>
