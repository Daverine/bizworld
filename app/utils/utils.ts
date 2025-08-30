declare global {
  interface Window {
    lui_EscTracker?: string[];
    lui_ScrollLockers?: string[];
    lui_uuid?: number;
    lui_ScollbarSize?: number;
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
  checkEscStatus(trackId: string, byForce?: boolean): boolean | undefined {
    if (!window.lui_EscTracker) {
      window.lui_EscTracker = [];
      return;
    }

    if (!window.lui_EscTracker.includes(trackId) && !byForce) {
      console.warn('The passed TrackId is not tracked', trackId);
      return;
    }

    if (window.lui_EscTracker.slice(-1)[0] === trackId || byForce) {
      window.lui_EscTracker = window.lui_EscTracker.filter(
        (el: string) => el !== trackId
      );
      return true;
    }
  },
  getScrollbarSize() {
    if (!window.lui_ScollbarSize) {
      const el = document.createElement('div');
      el.style.cssText =
        'overflow: scroll; visibility: hidden; position: absolute;';
      document.body.appendChild(el);
      const scrollbarHeight = el.offsetHeight - el.clientHeight;
      document.body.removeChild(el);
      return scrollbarHeight;
    }
    return window.lui_ScollbarSize;
  },
  winScrollbarSize(): { x: number; y: number } {
    return {
      x: window.innerWidth - document.documentElement.clientWidth,
      y: window.innerHeight - document.documentElement.clientHeight,
    };
  },
  lockWindowScroll(lockerId: string): void {
    if (!window.lui_ScrollLockers) window.lui_ScrollLockers = [];
    if (!window.lui_ScrollLockers.length) {
      let scrollBarWidth = `${this.winScrollbarSize().x}px`;
      document.documentElement.classList.add('scroll-locked');
      document.documentElement.style.marginRight = scrollBarWidth;
      document.documentElement.style.overflow = 'hidden';
      (
        [...document.querySelectorAll('.respect-lock')] as HTMLElement[]
      ).forEach((el) => {
        el.setAttribute(
          'data-lui-styleBeforeLock',
          el.getAttribute('style') || ''
        );
        el.style.maxWidth = `calc(100% - ${scrollBarWidth})`;
        el.style.marginRight = scrollBarWidth;
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
        document.documentElement.style.marginRight = '';
        document.documentElement.style.overflow = '';
        document.documentElement.classList.remove('scroll-locked');
        [...document.querySelectorAll('.respect-lock')].forEach((el) => {
          el.setAttribute(
            'style',
            el.getAttribute('data-lui-styleBeforeLock') || ''
          );
          el.removeAttribute('data-lui-styleBeforeLock');
        });
      }
    }
  },
  getUniqueId(nameSpace: string): string {
    if (typeof window.lui_uuid !== 'number') window.lui_uuid = 0;
    window.lui_uuid++;
    nameSpace =
      nameSpace != undefined && typeof nameSpace === 'string'
        ? nameSpace
        : 'unique-id';

    return nameSpace + window.lui_uuid;
  },
  getCssVal(el: Element, prop: string): string {
    return window.getComputedStyle(el).getPropertyValue(prop);
  },
  contentSize(el: Element): { height: number; width: number } {
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
  offsetPos(el: Element): { top: number; left: number } {
    let box = el.getBoundingClientRect();
    let docElem = document.documentElement;
    return {
      top: box.top + window.scrollY - docElem.clientTop,
      left: box.left + window.scrollX - docElem.clientLeft,
    };
  },
  getParents(
    el: Element,
    selector?: string,
    until?: Element | string
  ): Element[] {
    if (until) {
      if (typeof until === 'string') {
        until =
          [...document.querySelectorAll(until)].find((elem) =>
            elem.contains(el)
          ) || document.documentElement;
      } else if (!until.contains(el)) until = document.documentElement;
    } else until = document.documentElement;

    let parents: Element[] = [];
    while ((el = el.parentNode as Element) && el !== until) {
      if (selector) {
        if (el.matches(selector)) parents.push(el);
        continue;
      }
      parents.push(el);
    }

    return parents;
  },
  nextAll(el: Element): Element[] {
    const nextElements = [];
    let nextElement = el;

    while (nextElement.nextElementSibling) {
      nextElements.push(nextElement.nextElementSibling);
      nextElement = nextElement.nextElementSibling;
    }

    return nextElements;
  },
  triggerEvent(
    el: Element | Window,
    eventType: string | Event,
    customData?: any
  ): void {
    if (typeof eventType === 'string') {
      if (customData !== undefined)
        el.dispatchEvent(new CustomEvent(eventType, { detail: customData }));
      else if (typeof (el as any)[eventType] === 'function')
        (el as any)[eventType]();
      else el.dispatchEvent(new Event(eventType, { bubbles: true }));
    } else el.dispatchEvent(eventType);
  },
  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  },
  isClose(elem: Element, selectors: string | string[]): boolean {
    if (typeof selectors === 'string') return Boolean(elem.closest(selectors));

    let isClose = false;
    selectors.forEach((node) => (isClose = Boolean(elem.closest(node))));

    return isClose;
  },
  focusRangeOnTab(range: Element, e: KeyboardEvent): void {
    let focusableElements = [
      ...range.querySelectorAll(
        ':scope [href], :scope button, :scope input, :scope textarea, :scope select, :scope details, :scope object, :scope [tabindex]:not([tabindex="-1"])'
      ),
    ].filter(
      (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    ) as HTMLElement[];

    if (!focusableElements[0]) {
      e.preventDefault();
      return;
    }

    let first = focusableElements[0];
    let last = focusableElements.slice(-1)[0];

    if (document.activeElement === last && !e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      first.focus();
    } else if (
      document.activeElement === first &&
      e.shiftKey &&
      e.key === 'Tab'
    ) {
      e.preventDefault();
      last?.focus();
    }
  },
  setHighlightRange(el: Element): void {
    let range, selection;

    if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(el);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  },
  afterNextRepaint(func?: () => void) {
    return new Promise((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (func) func();
          resolve('void');
        })
      )
    );
  },
  compareArrays: (a: any[], b: any[]): boolean =>
    a.length === b.length && a.every((element, index) => element === b[index]),
  durationInMilliseconds: (duration: string): number =>
    parseFloat(duration) * (duration.includes('ms') ? 1 : 1000),
};
