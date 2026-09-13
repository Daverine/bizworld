<script setup lang="ts">
type ScrollerOptions = {
  autoSetup: boolean;
  scrollBody: string;
  scrollChildren: string;
  prevCtrlBtn: string;
  nextCtrlBtn: string;
  controlOverlay: boolean;
};

const el = useTemplateRef("el");
const props = defineProps<{ options?: Partial<ScrollerOptions>; vertical?: boolean }>();

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
let contentSizeObserver: MutationObserver;
let sizeObserver: ResizeObserver;

let scrollElem: HTMLElement;

function currentRect() {
  return props.vertical
    ? {
        length: scrollElem.clientHeight,
        offset: utils.offsetPos(scrollElem!).top,
        scrollOffset: scrollElem!.scrollTop,
        maxScroll: scrollElem!.scrollHeight - scrollElem!.clientHeight,
      }
    : {
        length: scrollElem!.clientWidth,
        offset: utils.offsetPos(scrollElem!).left,
        scrollOffset: scrollElem!.scrollLeft,
        maxScroll: scrollElem!.scrollWidth - scrollElem!.clientWidth,
      };
}
function getRect(el: HTMLElement) {
  return props.vertical
    ? {
        offset: utils.offsetPos(el).top,
        length: el.getBoundingClientRect().height,
        offsetLength: el.offsetHeight,
      }
    : {
        offset: utils.offsetPos(el).left,
        length: el.getBoundingClientRect().width,
        offsetLength: el.offsetWidth,
      };
}
function onScrollMtd() {
  if (!scrollElem || !el.value) return;

  const rect = currentRect();
  if (Math.floor(rect.scrollOffset) === 0)
    [...el.value.querySelectorAll(`:scope ${settings.prevCtrlBtn}`)].forEach((el) =>
      el.classList.remove("active"),
    );
  else
    [...el.value.querySelectorAll(`:scope ${settings.prevCtrlBtn}`)].forEach((el) =>
      el.classList.add("active"),
    );

  if (Math.ceil(rect.scrollOffset) >= rect.maxScroll) {
    [...el.value.querySelectorAll(`:scope ${settings.nextCtrlBtn}`)].forEach((el) =>
      el.classList.remove("active"),
    );
  } else
    [...el.value.querySelectorAll(`:scope ${settings.nextCtrlBtn}`)].forEach((el) =>
      el.classList.add("active"),
    );
}

onMounted(async () => {
  let sce = el.value?.querySelector(`:scope > ${settings.scrollBody}`);

  if (!sce) {
    console.warn("A IScrollable element does not exist");
    return;
  }

  scrollElem = sce as HTMLElement;
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
    const rect = currentRect();
    const items = [
      ...scrollElem!.querySelectorAll(`:scope ${settings.scrollChildren}`),
    ] as HTMLElement[];
    const prevBtn = target.closest(settings.prevCtrlBtn) as HTMLElement;
    const nextBtn = target.closest(settings.nextCtrlBtn) as HTMLElement;

    if (prevBtn) {
      const tolerance = settings.controlOverlay ? getRect(prevBtn).offsetLength : 0;
      const checker = items.reduce((acc, el) => {
        if (
          getRect(el).offset - rect.offset > tolerance ||
          getRect(el).offset + getRect(el).length - rect.offset < tolerance
        )
          return acc;
        else
          return Math.min(
            acc,
            rect.scrollOffset -
              (rect.offset + rect.length - getRect(el).offset - getRect(el).length),
          );
      }, Infinity);
      const length =
        isFinite(checker) && Math.abs(checker + tolerance - rect.scrollOffset) > 4
          ? checker + tolerance
          : rect.scrollOffset - rect.length + tolerance > 0
            ? rect.scrollOffset - rect.length + tolerance
            : 0;

      props.vertical
        ? scrollElem?.scroll({
            top: length,
            behavior: "smooth",
          })
        : scrollElem?.scroll({
            left: length,
            behavior: "smooth",
          });
    } else if (nextBtn) {
      const tolerance = settings.controlOverlay ? getRect(nextBtn).offsetLength : 0;
      const checker = items.reduce((acc, el) => {
        if (
          getRect(el).offset - rect.offset < tolerance ||
          getRect(el).offset + getRect(el).length < rect.offset + rect.length - tolerance
        )
          return acc;
        else return Math.min(acc, rect.scrollOffset + getRect(el).offset - rect.offset);
      }, Infinity);
      const length =
        isFinite(checker) && Math.abs(checker - tolerance - rect.scrollOffset) > 4
          ? checker - tolerance
          : rect.maxScroll > rect.scrollOffset + rect.length - tolerance
            ? rect.scrollOffset + rect.length - tolerance
            : rect.maxScroll + 10; // overscroll to prevent not reaching the end

      props.vertical
        ? scrollElem?.scroll({
            top: length,
            behavior: "smooth",
          })
        : scrollElem?.scroll({
            left: length,
            behavior: "smooth",
          });
    }
  });

  el.value!.addEventListener("activeView", ((e: CustomEvent) => {
    const items = [
      ...scrollElem!.querySelectorAll(`:scope ${settings.scrollChildren}`),
    ] as HTMLElement[];
    let activeItem = e.detail || items.find((el) => el.classList.contains("active"));

    if (!activeItem || !scrollElem?.contains(activeItem)) return;
    const rect = currentRect();
    const length =
      rect.scrollOffset -
      (rect.length / 2 - getRect(activeItem).offset + rect.offset - getRect(activeItem).length / 2);

    props.vertical
      ? scrollElem?.scroll({
          left: length,
          behavior: "smooth",
        })
      : scrollElem?.scroll({
          top: length,
          behavior: "smooth",
        });
  }) as EventListener);
  await nextTick();
  onScrollMtd();
});

onBeforeUnmount(() => contentSizeObserver?.disconnect());
</script>

<template>
  <div ref="el" class="i-scroller" :class="{ vertical }">
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
<style>
.i-scroller {
  position: relative;

  & > .scroll-items {
    width: max-content;
    max-width: 100%;
    gap: calc(var(--spacing) * 2);
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    & > * {
      flex: 0 0 auto;
    }
  }

  & > .l-scroll,
  & > .r-scroll {
    display: flex;
    position: absolute;
    background: var(--color-surface);
    color: var(--color-on-surface);
    align-items: center;
    justify-content: center;
    z-index: 300;

    &:not(.active) {
      display: none;
    }
  }

  &:not(.vertical) {
    & > .scroll-items {
      display: flex;
      flex-flow: row nowrap;
      overflow: auto hidden;
    }

    & > .l-scroll,
    & > .r-scroll {
      height: 100%;
      width: 2em;
      top: 50%;
      transform: translateY(-50%);
    }

    & > .l-scroll {
      left: 0px;
      padding-right: 0.5em;
      background: linear-gradient(-90deg, transparent 0%, var(--color-surface) 50%);
    }

    & > .r-scroll {
      right: 0px;
      padding-left: 0.5em;
      background: linear-gradient(90deg, transparent 0%, var(--color-surface) 50%);
    }
  }

  &.vertical {
    display: flex;
    flex-flow: column nowrap;

    & > .scroll-items {
      flex: 1 1 0;
      overflow: hidden auto;
      display: flex;
      flex-flow: column nowrap;
    }

    & > .l-scroll,
    & > .r-scroll {
      width: 100%;
      height: 2em;
      left: 50%;
      transform: translateX(-50%);
    }

    & > .l-scroll {
      top: 0px;
      padding-bottom: 0.5em;
      background: linear-gradient(0deg, transparent 0%, var(--color-surface) 50%);
    }

    & > .r-scroll {
      bottom: 0px;
      padding-top: 0.5em;
      background: linear-gradient(180deg, transparent 0%, var(--color-surface) 50%);
    }
  }
}
</style>
