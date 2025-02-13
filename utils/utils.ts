declare global {
  interface Window {
    lui_EscTracker?: string[];
    lui_ScrollLockers?: string[];
    lui_uuid?: number;
  }
}

export const utils = {
  trackEscOn(trackId: string): void {
    if (!window.lui_EscTracker) window.lui_EscTracker = [];

    if (window.lui_EscTracker.includes(trackId)) {
      console.warn(`The passed trackId is been tracked already`, trackId);
      return;
    }

    window.lui_EscTracker.push(trackId);
  },
  checkEscStatus(trackId: string, byForce: boolean): boolean | undefined {
    if (!window.lui_EscTracker) {
      window.lui_EscTracker = [];
      return;
    }

    if (!window.lui_EscTracker.includes(trackId) && !byForce) {
      console.warn("The passed TrackId is not tracked", trackId);
      return;
    }

    if (window.lui_EscTracker.slice(-1)[0] === trackId || byForce) {
      window.lui_EscTracker = window.lui_EscTracker.filter(
        (el: string) => el !== trackId
      );
      return true;
    }
  },
  getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
  },
  lockWindowScroll(lockerId: string): void {
    if (!window.lui_ScrollLockers) window.lui_ScrollLockers = [];
    if (!window.lui_ScrollLockers.length) {
      let scrollBarWidth = `${this.getScrollbarWidth()}px`;
      document.documentElement.classList.add("scroll-locked");
      document.documentElement.style.marginRight = scrollBarWidth;
      document.documentElement.style.overflow = "hidden";
      [...document.querySelectorAll(".respect-lock")].forEach((el) => {
        const elem = el as HTMLElement;
        elem.setAttribute(
          "data-lui-styleBeforeLock",
          elem.getAttribute("style") || ""
        );
        elem.style.maxWidth = `calc(100% - ${scrollBarWidth})`;
        elem.style.marginRight = scrollBarWidth;
      });
    }
    if (!window.lui_ScrollLockers.includes(lockerId))
      window.lui_ScrollLockers.push(lockerId);
  },
  unlockWindowScroll(lockerId: string): void {
    if (
      window.lui_ScrollLockers &&
      window.lui_ScrollLockers.includes(lockerId)
    ) {
      window.lui_ScrollLockers = window.lui_ScrollLockers.filter(
        (el: string) => el !== lockerId
      );

      if (!window.lui_ScrollLockers.length) {
        document.documentElement.style.marginRight = "";
        document.documentElement.style.overflow = "";
        document.documentElement.classList.remove("scroll-locked");
        [...document.querySelectorAll(".respect-lock")].forEach((el) => {
          el.setAttribute(
            "style",
            el.getAttribute("data-lui-styleBeforeLock") || ""
          );
          el.removeAttribute("data-lui-styleBeforeLock");
        });
      }
    }
  },
  getUniqueId(nameSpace: string): string {
    if (typeof window.lui_uuid !== "number") window.lui_uuid = 0;
    window.lui_uuid++;
    nameSpace =
      nameSpace != undefined && typeof nameSpace === "string"
        ? nameSpace
        : "unique-id";

    return nameSpace + window.lui_uuid;
  },
  getCssVal(el: HTMLElement, prop: string): string {
    return window.getComputedStyle(el).getPropertyValue(prop);
  },
  contentSize(el: HTMLElement): { height: number; width: number } {
    let styleList = window.getComputedStyle(el),
      box = el.getBoundingClientRect();
    return {
      height:
        box.height -
        parseFloat(styleList.paddingTop) -
        parseFloat(styleList.paddingBottom) -
        parseFloat(styleList.borderTopWidth) -
        parseFloat(styleList.borderBottomWidth),
      width:
        box.width -
        parseFloat(styleList.paddingLeft) -
        parseFloat(styleList.paddingRight) -
        parseFloat(styleList.borderLeftWidth) -
        parseFloat(styleList.borderRightWidth),
    };
  },
  offsetPos(el: HTMLElement): { top: number; left: number } {
    let box = el.getBoundingClientRect();
    let docElem = document.documentElement;
    return {
      top: box.top + window.scrollY - docElem.clientTop,
      left: box.left + window.scrollX - docElem.clientLeft,
    };
  },
  getParents(
    el: HTMLElement,
    selector?: string,
    until?: HTMLElement | string
  ): HTMLElement[] {
    if (until) {
      if (typeof until === "string") {
        until = [...document.querySelectorAll(until)].filter((elem) =>
          (elem as HTMLElement).contains(el)
        )[0] as HTMLElement || document.documentElement;
      } else if (!until.contains(el)) until = document.documentElement;
    } else until = document.documentElement;

    let parents: HTMLElement[] = [];

    while ((el = el.parentNode as HTMLElement) && el !== until) {
      if (selector) {
        if (el.matches(selector)) parents.push(el);
        continue;
      }
      parents.push(el);
    }

    return parents;
  },
  nextAll(el: HTMLElement): HTMLElement[] {
    const nextElements: HTMLElement[] = [];
    let nextElement = el;

    while (nextElement.nextElementSibling) {
      nextElements.push(nextElement.nextElementSibling as HTMLElement);
      nextElement = nextElement.nextElementSibling as HTMLElement;
    }

    return nextElements;
  },
  triggerEvent(
    el: HTMLElement,
    eventType: string | Event,
    customData?: any
  ): void {
    if (typeof eventType === "string") {
      if (customData !== undefined)
        el.dispatchEvent(new CustomEvent(eventType, { detail: customData }));
      else if (typeof (el as any)[eventType] === "function")
        (el as any)[eventType]();
      else el.dispatchEvent(new Event(eventType, { bubbles: true }));
    } else el.dispatchEvent(eventType);
  },
  isObject(value: any): boolean {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  },
  isClose(elem: HTMLElement, selectors: string | string[]): boolean {
    function checkElem(elem: HTMLElement | null): boolean {
      return typeof elem != "undefined" && elem != null;
    }

    if (typeof selectors === "string") {
      return checkElem(elem.closest(selectors));
    }

    let isClose = false;

    selectors.forEach(function (node) {
      isClose = checkElem(elem.closest(node));
    });

    return isClose;
  },
  focusRangeOnTab(range: HTMLElement, e: KeyboardEvent): void {
    let focusableElements: HTMLElement[] = [];
    [
      ...range.querySelectorAll(
        '[href], button, input, textarea, select, details, object, [tabindex]:not([tabindex="-1"])'
      ),
    ].forEach((el) => {
      if (!el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"))
        focusableElements.push(el as HTMLElement);
    });

    if (focusableElements.length < 1) {
      e.preventDefault();
      return;
    }

    let first = focusableElements[0],
      last = focusableElements[focusableElements.length - 1];

    if (document.activeElement === last && !e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      first.focus();
    } else if (
      document.activeElement === first &&
      e.shiftKey &&
      e.key === "Tab"
    ) {
      e.preventDefault();
      last.focus();
    }
  },
  setHighlightRange(el: HTMLElement): void {
    let range, selection;

    if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(el);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  },
  afterNextRepaint(func: () => void): void {
    requestAnimationFrame(() => requestAnimationFrame(func));
  },
  compareArrays: (a: any[], b: any[]): boolean =>
    a.length === b.length && a.every((element, index) => element === b[index]),
  durationInMilliseconds: (duration: string): number =>
    parseFloat(duration) * (duration.includes("ms") ? 1 : 1000),
};
