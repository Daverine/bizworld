import type { DirectiveBinding } from 'vue';

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const settings = {
      namespace: 'tooltip',
      delay: 150,
      offset: 10,
      unblocking: binding.modifiers.hasOwnProperty('unblocking'),
    };
    const uniqueId = utils.getUniqueId(settings.namespace);
    let tooltip: HTMLElement;
    let observer: MutationObserver;
    let renderer: ReturnType<typeof setTimeout>;
    let hider: ReturnType<typeof setTimeout>;
    let coords = { x: 0, y: 0 };

    if (binding.value) el.setAttribute('data-tooltip', binding.value);
    createTooltip();
    el.addEventListener('pointerenter', showTooltip);
    el.addEventListener('removeTooltip', removeTooltip);

    function createTooltip() {
      tooltip = document.createElement('div');
      tooltip.classList.add('plain', 'tooltip');
      tooltip.setAttribute('data-tooltip-id', uniqueId);
      tooltip.textContent = el.getAttribute('data-tooltip');
      document.body.append(tooltip);

      observer = new MutationObserver(updateTooltip);
      observer.observe(el, { attributes: true });
    }
    function updateTooltip() {
      tooltip.textContent = el.getAttribute('data-tooltip');
    }
    function showTooltip(e: PointerEvent) {
      if (e.pointerType === 'touch') return;
      coords = getCoords(e);
      calcPosition();
      el.addEventListener('mouseleave', hideTooltip);
      window.addEventListener('scroll', validatePointerenter);
      el.addEventListener('mousemove', mousePosition);
    }
    function validatePointerenter() {
      clearTimeout(hider);
      hider = setTimeout(() => {
        if (!document.elementsFromPoint(coords.x, coords.y).includes(el))
          hideTooltip();
      }, settings.delay);
    }
    function hideTooltip() {
      el.removeEventListener('mousemove', mousePosition);
      window.removeEventListener('scroll', validatePointerenter);
      el.removeEventListener('mouseleave', hideTooltip);
      clearTimeout(renderer);
      clearTimeout(hider);
      tooltip.classList.remove('active');
    }
    function removeTooltip() {
      observer.disconnect();
      el.removeEventListener('mousemove', mousePosition);
      el.removeEventListener('mouseleave', hideTooltip);
      clearTimeout(renderer);
      if (tooltip) tooltip.remove();
    }
    function getCoords(e: MouseEvent | TouchEvent) {
      return {
        x: 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX,
        y: 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY,
      };
    }
    function mousePosition(e: MouseEvent) {
      let prevCoord = coords;
      coords = getCoords(e);
      if (!settings.unblocking) return;

      if (
        Math.abs(coords.x - prevCoord.x) > (settings.offset / 3) * 2 ||
        Math.abs(coords.y - prevCoord.y) > (settings.offset / 3) * 2
      ) {
        tooltip.classList.remove('active');
        clearTimeout(renderer);
        renderer = setTimeout(() => {
          calcPosition();
        }, settings.delay);
      }
    }
    function calcPosition() {
      document.body.append(tooltip);
      tooltip.style.removeProperty('width');
      tooltip.classList.remove('rhs', 'lhs', 'upward', 'downward');

      let rects = {
        el: el.getBoundingClientRect(),
        tp: {
          width: tooltip.offsetWidth,
          height: tooltip.offsetHeight,
        },
        win: {
          width: window.innerWidth - utils.winScrollbarSize().x,
          height: window.innerHeight - utils.winScrollbarSize().y,
        },
        pad: {
          x: 8,
          y: 12,
        },
      };

      if (settings.unblocking) {
        tooltip.style.left = `${Math.min(
          Math.max(
            rects.pad.x,
            rects.el.left + rects.el.width / 2 - rects.tp.width / 2
          ),
          rects.win.width - rects.tp.width - rects.pad.x
        )}px`;

        let spacing = {
          top: rects.el.top - rects.pad.y,
          bottom:
            rects.win.height - rects.el.top - rects.el.height - rects.pad.y,
        };

        if (spacing.bottom >= spacing.top) {
          tooltip.style.top = `${
            rects.el.top + rects.el.height + settings.offset
          }px`;
          tooltip.classList.add('downward');
        } else {
          tooltip.style.top = `${
            rects.el.top - rects.tp.height - settings.offset
          }px`;
          tooltip.classList.add('upward');
        }
      } else {
        let spacing = {
          top: coords.y - settings.offset - rects.pad.y,
          bottom: window.innerHeight - coords.y - settings.offset - rects.pad.y,
          left: coords.x - settings.offset - rects.pad.x,
          right: window.innerWidth - coords.x - settings.offset - rects.pad.x,
        };

        if (spacing.right >= Math.max(rects.tp.width, spacing.left)) {
          tooltip.style.left = `${Math.min(
            coords.x + settings.offset,
            rects.win.width - rects.tp.width - rects.pad.x
          )}px`;
          tooltip.classList.add('rhs');
        } else {
          tooltip.style.left = `${Math.max(
            rects.pad.x,
            coords.x - rects.tp.width - settings.offset
          )}px`;
          tooltip.classList.add('lhs');
        }

        if (spacing.bottom >= spacing.top) {
          tooltip.style.top = `${Math.min(
            coords.y + settings.offset,
            rects.win.height - rects.tp.height - rects.pad.y
          )}px`;
          tooltip.classList.add('downward');
        } else {
          tooltip.style.top = `${Math.max(
            coords.y - rects.tp.height - settings.offset,
            rects.pad.y
          )}px`;
          tooltip.classList.add('upward');
        }
      }

      tooltip.classList.add('active');
    }
  },
  beforeUnmount(el: Element) {
    utils.triggerEvent(el, 'removeTooltip');
  },
};

/* tooltip should be non-blocking. it can appear in any of the four sides of the element. it open on mousehover and focus enter */
