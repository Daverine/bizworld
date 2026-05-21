<script setup lang="ts">
type ScrollerOptions = {
  autoSetup: boolean;
  scrollBody: string;
  scrollChildren: string;
  prevCtrlBtn: string;
  nextCtrlBtn: string;
  controlOverlay: boolean;
};

type Coords = {
  start?: number;
  end?: number;
  change?: boolean;
  scrollPos?: number;
  velocity?: number;
};

const el = useTemplateRef("el");
const props = defineProps<{ options?: Partial<ScrollerOptions> }>();

const settings: ScrollerOptions = {
  ...{
    autoSetup: false,
    scrollBody: ".scroll-items",
    scrollChildren: ".item",
    prevCtrlBtn: ".l-scroll",
    nextCtrlBtn: ".r-scroll",
    controlOverlay: true,
  },
  ...(props.options || {}),
};
const coords: Coords = {};
let contentSizeObserver: MutationObserver;
let sizeObserver: ResizeObserver;

let scrollElem: HTMLElement | null = null;

onMounted(async () => {
  scrollElem = el.value!.querySelector(`:scope > ${settings.scrollBody}`);

  if (!scrollElem) {
    console.warn("A IScrollable element does not exist");
    return;
  }
  scrollElem.addEventListener("scroll", onScrollMtd);
  contentSizeObserver = new MutationObserver(() => onScrollMtd());
  contentSizeObserver.observe(scrollElem, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  sizeObserver = new ResizeObserver(() => onScrollMtd());
  sizeObserver.observe(scrollElem);

  el.value!.addEventListener("click", (e: MouseEvent) => {
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
            utils.offsetPos(el).left + el.getBoundingClientRect().width - rect.left < tolerance
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
      scrollElem?.scroll({
        left:
          checker.length && Math.abs(Math.min(...checker) + tolerance - rect.scrollPos) > 4
            ? Math.min(...checker) + tolerance
            : rect.scrollPos - rect.width + tolerance > 0
              ? rect.scrollPos - rect.width + tolerance
              : 0,
        behavior: "smooth",
      });
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
          else return [...acc, rect.scrollPos + utils.offsetPos(el).left - rect.left];
        }, [] as number[]);
      }

      scrollElem?.scroll({
        left:
          checker.length && Math.abs(Math.min(...checker) - tolerance - rect.scrollPos) > 4
            ? Math.min(...checker) - tolerance
            : rect.maxScroll > rect.scrollPos + rect.width - tolerance
              ? rect.scrollPos + rect.width - tolerance
              : rect.maxScroll + 10, // overscroll to prevent not reaching the end
        behavior: "smooth",
      });
    }
  });

  el.value!.addEventListener("activeView", (e: Event) => {
    const items = [
      ...scrollElem!.querySelectorAll(`:scope ${settings.scrollChildren}`),
    ] as HTMLElement[];
    let activeItem =
      (e as CustomEvent).detail || items.find((el) => el.classList.contains("active"));

    if (!activeItem || !scrollElem?.contains(activeItem)) return;
    const rect = getRect();

    let aeProp = {
      left: utils.offsetPos(activeItem).left,
      width: activeItem.getBoundingClientRect().width,
    };

    scrollElem?.scroll({
      left: rect.scrollPos - (rect.width / 2 - aeProp.left + rect.left - aeProp.width / 2),
      behavior: "smooth",
    });
  });
  await nextTick();
  onScrollMtd();
});

onBeforeUnmount(() => contentSizeObserver?.disconnect());

const getRect = () => ({
  width: scrollElem!.clientWidth,
  left: utils.offsetPos(scrollElem!).left,
  scrollPos: scrollElem!.scrollLeft,
  sWidth: scrollElem!.scrollWidth,
  maxScroll: scrollElem!.scrollWidth - scrollElem!.clientWidth,
});

function onScrollMtd() {
  if (!scrollElem || !el.value) return;

  const rect = getRect();
  if (Math.floor(scrollElem.scrollLeft) === 0)
    [...el.value.querySelectorAll(`:scope ${settings.prevCtrlBtn}`)].forEach((el) =>
      el.classList.remove("active"),
    );
  else
    [...el.value.querySelectorAll(`:scope ${settings.prevCtrlBtn}`)].forEach((el) =>
      el.classList.add("active"),
    );

  if (Math.ceil(scrollElem.scrollLeft) >= rect.maxScroll) {
    [...el.value.querySelectorAll(`:scope ${settings.nextCtrlBtn}`)].forEach((el) =>
      el.classList.remove("active"),
    );
  } else
    [...el.value.querySelectorAll(`:scope ${settings.nextCtrlBtn}`)].forEach((el) =>
      el.classList.add("active"),
    );
}
</script>

<template>
  <div ref="el" class="i-scroller">
    <template v-if="settings.autoSetup">
      <button class="r-scroll" aria-label="Next">
        <Icon name="material-symbols:keyboard-double-arrow-right" />
      </button>
      <div class="scroll-items">
        <slot />
      </div>
      <button class="l-scroll" aria-label="Previous">
        <Icon name="material-symbols:keyboard-double-arrow-left" />
      </button>
    </template>
    <slot v-else />
  </div>
</template>
