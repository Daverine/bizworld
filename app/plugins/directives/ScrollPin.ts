import type { DirectiveBinding } from 'vue';

interface Breakpoint {
  minWidth?: number;
  maxWidth?: number;
  pinnable?: boolean;
  sticky?: boolean;
  top?: number;
  bottom?: number;
}

interface Settings {
  namespace: string;
  className: string;
  pinnable: boolean;
  pinPriority: 'top' | 'bottom';
  sticky: boolean;
  top: number;
  bottom: number;
  breakpoints: Breakpoint[];
  independent: boolean; // this option tells if the scrollpin element can stay pinned outside of it container.
  wrapper: string;
  streamHeightToWrapper: boolean;
  notifyStuckState: boolean;
}

interface Tmp {
  initStyle: string;
  pinnable: boolean;
  top: number;
  bottom: number;
  eBox: DOMRect;
  eOffset: { top: number; left: number };
  pBox?: DOMRect;
  windowHeight: number;
  clipBoxHeight: number;
  scrollPos: number;
  scrollAmt?: number;
  currState?: string;
  overflow?: boolean;
  needMonitoring: boolean; // if the element needs to be monitored for its stuck state
  isStuckChecker?: (rect: DOMRect) => boolean; // function to check if the element is pinned);
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<Settings>) {
    const settings: Settings = {
      namespace: 'scrollPin',
      className: 'sticky',
      pinnable: true,
      top: 0,
      bottom: 0,
      pinPriority: 'top',
      sticky: false,
      independent: false,
      wrapper: '.sp-wrapper',
      streamHeightToWrapper: true,
      notifyStuckState: false,
      breakpoints: [],
      ...(typeof binding.value === 'object' ? binding.value : {}),
    };
    let tmp: Tmp = {
      initStyle: el.getAttribute('style') || '',
      windowHeight: window.innerHeight,
      clipBoxHeight: window.innerHeight,
      scrollPos: window.scrollY,
      pinnable: settings.pinnable,
      top: settings.top,
      bottom: settings.bottom,
      eBox: el.getBoundingClientRect(),
      eOffset: utils.offsetPos(el),
      needMonitoring: false,
    };
    const guardian = el.parentNode as HTMLElement;
    let sizeStreamId: ReturnType<typeof requestAnimationFrame>;

    settings.pinPriority = settings.pinPriority !== 'bottom' ? 'top' : 'bottom';
    settings.independent = settings.sticky ? false : settings.independent;

    if (
      settings.independent &&
      settings.streamHeightToWrapper &&
      guardian.matches(settings.wrapper)
    ) {
      guardian.classList.add('clearfix');
      // ensure that the wrapper is a positioned Element
      if (utils.getCssVal(guardian, 'position') === 'static')
        guardian.style.position = 'relative';
    } else settings.streamHeightToWrapper = false;

    const stuckStateObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          tmp.needMonitoring = true;
          pinnedStatusCallback();
        } else {
          tmp.needMonitoring = false;
        }
      },
      {
        threshold: [0, 1],
        rootMargin: `-${tmp.top + 1}px 0px -${tmp.bottom + 1}px 0px`,
      }
    );

    window.addEventListener('resize', getGeometry);
    el.addEventListener('stopScrollPin', stopScrollPin);
    getGeometry();

    function getGeometry() {
      if (settings.streamHeightToWrapper) cancelAnimationFrame(sizeStreamId);
      window.removeEventListener('scroll', onScrollMtd, true);
      el.classList.remove('pinned', 'sticky');
      el.setAttribute('style', tmp.initStyle);
      tmp.currState = 'reset-state';
      const mediaWidth = window.innerWidth;
      const matchedBreakpoints = settings.breakpoints.filter(
        (bp) =>
          (bp.minWidth || bp.maxWidth) &&
          (!bp.minWidth || bp.minWidth <= mediaWidth) &&
          (!bp.maxWidth || bp.maxWidth >= mediaWidth)
      );
      const breakpoint =
        matchedBreakpoints
          .filter((bp) => bp.maxWidth)
          .sort((a, b) => a.maxWidth! - b.maxWidth!)[0] ||
        matchedBreakpoints
          .filter((bp) => bp.minWidth)
          .sort((a, b) => b.minWidth! - a.minWidth!)[0];

      tmp = {
        ...tmp,
        ...{
          pinnable: settings.pinnable,
          top: settings.top,
          bottom: settings.bottom,
        },
        ...(breakpoint || {}),
      };

      if (!tmp.pinnable) return;
      tmp.windowHeight = window.innerHeight;
      tmp.clipBoxHeight = tmp.windowHeight - tmp.top;

      if (settings.independent) {
        tmp.eBox = JSON.parse(JSON.stringify(el.getBoundingClientRect()));
        tmp.eOffset = utils.offsetPos(el);
        tmp.overflow =
          tmp.eBox.height + tmp.top >= tmp.clipBoxHeight ||
          tmp.eBox.height + tmp.bottom! >= tmp.clipBoxHeight;
      } else {
        el.classList.add('sticky');

        if (settings.pinPriority === 'bottom') {
          el.style.bottom = `${tmp.bottom}px`;
          if (settings.notifyStuckState) {
            tmp.isStuckChecker = (rect: DOMRect) => {
              return Math.abs(Math.round(rect.bottom) % tmp.bottom) <= 1;
            };
          }
        } else {
          el.style.top = `${tmp.top}px`;
          if (settings.notifyStuckState) {
            tmp.isStuckChecker = (rect: DOMRect) => {
              let topCheck = Math.round(rect.top) / tmp.top === 1;
              if (!tmp.overflow && !settings.sticky) return topCheck;
              let bottomCheck =
                (tmp.windowHeight - Math.round(rect.bottom)) / tmp.bottom === 1;
              return (topCheck && rect.top === tmp.top) || bottomCheck;
            };
          }
        }

        if (settings.notifyStuckState) {
          stuckStateObserver.unobserve(el);
          stuckStateObserver.observe(el);
        }
      }

      window.addEventListener('scroll', onScrollMtd, true);
      onScrollMtd();
      // start wrapperSize streaming if applicable
      if (settings.streamHeightToWrapper)
        sizeStreamId = requestAnimationFrame(streamCallback);
    }

    function pinnedStatusCallback() {
      el.classList.toggle(
        'is-stuck',
        tmp.isStuckChecker && tmp.isStuckChecker(el.getBoundingClientRect())
      );
      if (tmp.needMonitoring)
        setTimeout(() => requestAnimationFrame(pinnedStatusCallback), 30);
      else el.classList.remove('is-pinned');
    }

    function onScrollMtd() {
      let prevState = tmp.currState;
      let prevScrollPos = tmp.scrollPos;
      let positionedParent =
        utils
          .getParents(el)
          .find((el) => utils.getCssVal(el, 'position') !== 'static') ||
        document.body;
      let ppOffset = utils.offsetPos(positionedParent);
      tmp.scrollAmt = window.scrollY - tmp.scrollPos;
      tmp.scrollPos = window.scrollY;

      if (settings.independent) {
        if (tmp.overflow) {
          // dont change anyting if element is within free-zone area of moving in scroll-direction and it criteria of being in this zone is still meant.
          if (
            tmp.currState === 'reset-state' &&
            (prevState === 'dir-bottom-unpinned' ||
              prevState === 'dir-top-unpinned') &&
            tmp.scrollPos >= tmp.eOffset.top - tmp.top &&
            document.body.getBoundingClientRect().height - tmp.scrollPos >
              tmp.eBox.height + tmp.top
          ) {
            return;
          }
          // pin the element at the bottom
          // if element bottom and bottomSpacing is visible on the screen
          // and the user is scrolling down
          else if (
            !el.classList.contains('pinned') &&
            ((tmp.scrollAmt > 0 &&
              utils.offsetPos(el).top + tmp.eBox.height + tmp.bottom <=
                tmp.scrollPos + tmp.windowHeight) ||
              (tmp.currState === 'reset-state' &&
                document.body.getBoundingClientRect().height - tmp.scrollPos <=
                  tmp.eBox.height + tmp.top))
          ) {
            el.classList.add('pinned');
            el.style.top = 'auto';
            el.style.bottom = `${tmp.bottom}px`;
            el.style.left = `${tmp.eBox.left}px`;
            // fix for the use of relative width on the element.
            el.style.setProperty('width', tmp.eBox.width + 'px', 'important');
            tmp.currState = 'bottom-pinned';
          }
          // pin the element at the top
          // if element top and topSpacing is visible
          // and the user is scrolling up
          // while element have not reach its initial position
          else if (
            !el.classList.contains('pinned') &&
            ((tmp.scrollAmt < 0 &&
              utils.offsetPos(el).top > tmp.scrollPos + tmp.top) ||
              (tmp.currState === 'reset-state' &&
                document.body.getBoundingClientRect().height - tmp.scrollPos >
                  tmp.eBox.height + tmp.top)) &&
            tmp.scrollPos >= tmp.eOffset.top - tmp.top
          ) {
            el.classList.add('pinned');
            el.style.top = `${tmp.top}px`;
            el.style.bottom = 'auto';
            el.style.left = `${tmp.eBox.left}px`;
            // fix for the use of relative width on the element.
            el.style.setProperty('width', tmp.eBox.width + 'px', 'important');
            tmp.currState = 'top-pinned';
          }
          // unpin the element if the page scrolls to where the initial offset of the element is visible
          else if (tmp.scrollPos + tmp.top <= tmp.eOffset.top) {
            el.classList.remove('pinned');
            el.style.position = 'absolute';
            el.style.top = `${tmp.eOffset.top - ppOffset.top}px`;
            el.style.bottom = 'auto';
            el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
            // fix for the use of relative width on the element.
            el.style.setProperty('width', tmp.eBox.width + 'px', 'important');
            tmp.currState = 'top-unpinned';
          }
          // unpin element
          // if element was pinned by pin1
          // and the scroll direction for been pinned has changed
          else if (tmp.currState === 'bottom-pinned' && tmp.scrollAmt < 0) {
            el.classList.remove('pinned');
            el.style.position = 'absolute';
            el.style.top = `${
              prevScrollPos +
              tmp.windowHeight -
              tmp.eBox.height -
              tmp.bottom -
              ppOffset.top
            }px`;
            el.style.bottom = 'auto';
            el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
            // fix for the use of relative width on the element.
            el.style.setProperty('width', tmp.eBox.width + 'px', 'important');
            tmp.currState = 'dir-bottom-unpinned';
          }
          // unpin element
          // if element was pinned by pin2
          // and the scroll direction for been pinned has changed
          else if (tmp.currState === 'top-pinned' && tmp.scrollAmt > 0) {
            el.classList.remove('pinned');
            el.style.position = 'absolute';
            el.style.top = `${prevScrollPos + tmp.top - ppOffset.top}px`;
            el.style.bottom = 'auto';
            el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
            // fix for the use of relative width on the element.
            el.style.setProperty('width', tmp.eBox.width + 'px', 'important');
            tmp.currState = 'dir-top-unpinned';
          }
        } else {
          if (settings.pinPriority === 'bottom') {
            // pin element at the bottom if pinPriority is set to bottom
            if (tmp.currState !== 'bottom-pinned') {
              el.classList.add('pinned');
              el.style.bottom = `${tmp.bottom}px`;
              el.style.top = 'auto';
              el.style.left = `${tmp.eBox.left}px`;
              // fix for the use of relative width on the element.
              el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');
              tmp.currState = 'bottom-pinned';
            }
          } else {
            // pin element at the top if element has been scrolled out of page (from top)
            if (
              tmp.scrollPos > tmp.eOffset.top - tmp.top &&
              !el.classList.contains('pinned')
            ) {
              el.classList.add('pinned');
              el.style.top = `${tmp.top}px`;
              el.style.bottom = 'auto';
              el.style.left = `${tmp.eBox.left}px`;
              // fix for the use of relative width on the element.
              el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');
              tmp.currState = 'top-pinned';
            }
            // unpin the element if the page scrolls to where the initial offset of the element is visible
            else if (
              tmp.scrollPos + tmp.top <= tmp.eOffset.top &&
              el.classList.contains('pinned')
            ) {
              el.classList.remove('pinned');
              el.style.position = 'absolute';
              el.style.top = `${tmp.eOffset.top - ppOffset.top}px`;
              el.style.bottom = 'auto';
              el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
              // fix for the use of relative width on the element.
              el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');
              tmp.currState = 'top-unpinned';
            }
          }
        }
      } else {
        tmp.eBox = el.getBoundingClientRect();
        tmp.eOffset = utils.offsetPos(el);
        tmp.pBox = guardian.getBoundingClientRect();
        tmp.overflow =
          tmp.eBox.height + tmp.top >= tmp.clipBoxHeight ||
          tmp.eBox.height + tmp.bottom! >= tmp.clipBoxHeight;

        if (tmp.overflow) {
          el.style.top = `${Math.min(
            Math.max(
              parseFloat(getComputedStyle(el).top) - tmp.scrollAmt,
              tmp.windowHeight - tmp.eBox.height - tmp.bottom!
            ),
            tmp.top
          )}px`;
          el.style.bottom = 'auto';
        } else if (settings.sticky) {
          if (
            tmp.windowHeight >= tmp.pBox.bottom &&
            tmp.top + tmp.eBox.height > tmp.eBox.top + tmp.eBox.height &&
            tmp.currState !== 'bottom-pinned'
          ) {
            tmp.currState = 'bottom-unpinned';
          } else if (
            tmp.windowHeight - tmp.eBox.height - tmp.bottom! <
              el.getBoundingClientRect().top &&
            tmp.currState !== 'top-pinned'
          ) {
            tmp.currState = 'top-unpinned';
          } else if (tmp.scrollAmt < 0 && tmp.currState === 'bottom-unpinned') {
            el.style.top = `${
              tmp.windowHeight - tmp.eBox.height - tmp.bottom!
            }px`;
            tmp.currState = 'bottom-pinned';
          } else if (tmp.scrollAmt > 0 && tmp.currState === 'top-unpinned') {
            el.style.top = `${tmp.top!}px`;
            tmp.currState = 'top-pinned';
          }
          el.style.bottom = 'auto';
        }
      }
    }

    function streamCallback() {
      if (!el) return;
      let elHeight = el.getBoundingClientRect().height;
      // let parent take scrollPin element height + the parent padding top and bottom as min-height
      guardian.style.minHeight = `${
        elHeight +
        parseFloat(utils.getCssVal(el, 'margin-top')) +
        parseFloat(utils.getCssVal(el, 'margin-bottom')) +
        getTB(guardian, true) +
        getTB(guardian)
      }px`;

      if (elHeight && tmp.eBox && elHeight !== tmp.eBox.height) {
        tmp.eBox.height = elHeight;
        tmp.overflow =
          tmp.eBox.height + tmp.top >= tmp.clipBoxHeight ||
          tmp.eBox.height + tmp.bottom! >= tmp.clipBoxHeight;
        onScrollMtd();
        sizeStreamId = requestAnimationFrame(streamCallback);
      } else {
        setTimeout(() => {
          sizeStreamId = requestAnimationFrame(streamCallback);
        }, 30);
      }
    }

    function getTB(el: HTMLElement, top?: boolean) {
      if (top)
        return (
          parseFloat(utils.getCssVal(el, 'padding-top')) +
          parseFloat(utils.getCssVal(el, 'border-top-width'))
        );
      return (
        parseFloat(utils.getCssVal(el, 'padding-bottom')) +
        parseFloat(utils.getCssVal(el, 'border-bottom-width'))
      );
    }

    function stopScrollPin() {
      // stop height streaming if applicable
      if (settings.streamHeightToWrapper) cancelAnimationFrame(sizeStreamId);
      window.removeEventListener('resize', getGeometry);
      window.removeEventListener('scroll', onScrollMtd, true);
      el.removeEventListener('stopScrollPin', stopScrollPin);
    }
  },
  beforeUnmount(el: HTMLElement) {
    const event = new Event('stopScrollPin');
    el.dispatchEvent(event);
  },
};
