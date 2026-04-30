import type { DirectiveBinding } from "vue";

type TooltiperElement = HTMLElement & {
  _Tooltiper?: {
    tooltip?: HTMLElement;
    useAriaLabel?: boolean;
  };
};

export default {
  mounted(el: TooltiperElement, binding: DirectiveBinding<string>) {
    const offset = 10;
    const delay = 150;
    const unblocking = binding.modifiers.hasOwnProperty("unblocking");
    const useAriaLabel = binding.arg === "aria";
    const uniqueId = utils.getUniqueId("tooltip");

    let tooltip: HTMLElement;
    let renderer: ReturnType<typeof setTimeout>;
    let hider: ReturnType<typeof setTimeout>;
    let coords = { x: 0, y: 0 };

    el._Tooltiper = { useAriaLabel };
    createTooltip();
    el.addEventListener("pointerenter", showTooltip);
    el.addEventListener("removeTooltip", removeTooltip);

    function createTooltip() {
      tooltip = document.createElement("div");
      tooltip.classList.add("plain", "tooltip");
      tooltip.setAttribute("data-tooltip-id", uniqueId);
      if (useAriaLabel) tooltip.textContent = el.ariaLabel;
      else tooltip.textContent = el.dataset.tooltip || "";
      document.body.append(tooltip);
      el._Tooltiper!.tooltip = tooltip;
    }
    function showTooltip(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      coords = getCoords(e);
      calcPosition();
      el.addEventListener("mouseleave", hideTooltip);
      window.addEventListener("scroll", validatePointerenter);
      el.addEventListener("mousemove", mousePosition);
    }
    function validatePointerenter() {
      clearTimeout(hider);
      hider = setTimeout(() => {
        if (!document.elementsFromPoint(coords.x, coords.y).includes(el)) hideTooltip();
      }, delay);
    }
    function hideTooltip() {
      el.removeEventListener("mousemove", mousePosition);
      window.removeEventListener("scroll", validatePointerenter);
      el.removeEventListener("mouseleave", hideTooltip);
      clearTimeout(renderer);
      clearTimeout(hider);
      tooltip.classList.remove("active");
    }
    function removeTooltip() {
      el.removeEventListener("mousemove", mousePosition);
      el.removeEventListener("mouseleave", hideTooltip);
      clearTimeout(renderer);
      if (tooltip) tooltip.remove();
    }
    function getCoords(e: MouseEvent | TouchEvent) {
      return {
        x: "touches" in e ? e.touches[0]!.clientX : (e as MouseEvent).clientX,
        y: "touches" in e ? e.touches[0]!.clientY : (e as MouseEvent).clientY,
      };
    }
    function mousePosition(e: MouseEvent) {
      let prevCoord = coords;
      coords = getCoords(e);
      if (!unblocking) return;

      if (
        Math.abs(coords.x - prevCoord.x) > (offset / 3) * 2 ||
        Math.abs(coords.y - prevCoord.y) > (offset / 3) * 2
      ) {
        tooltip.classList.remove("active");
        clearTimeout(renderer);
        renderer = setTimeout(() => {
          calcPosition();
        }, delay);
      }
    }
    function calcPosition() {
      document.body.append(tooltip);
      tooltip.style.removeProperty("width");
      tooltip.classList.remove("rhs", "lhs", "upward", "downward");

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

      if (unblocking) {
        tooltip.style.left = `${Math.min(
          Math.max(rects.pad.x, rects.el.left + rects.el.width / 2 - rects.tp.width / 2),
          rects.win.width - rects.tp.width - rects.pad.x,
        )}px`;

        let spacing = {
          top: rects.el.top - rects.pad.y,
          bottom: rects.win.height - rects.el.top - rects.el.height - rects.pad.y,
        };

        if (spacing.bottom >= spacing.top) {
          tooltip.style.top = `${rects.el.top + rects.el.height + offset}px`;
          tooltip.classList.add("downward");
        } else {
          tooltip.style.top = `${rects.el.top - rects.tp.height - offset}px`;
          tooltip.classList.add("upward");
        }
      } else {
        let spacing = {
          top: coords.y - offset - rects.pad.y,
          bottom: window.innerHeight - coords.y - offset - rects.pad.y,
          left: coords.x - offset - rects.pad.x,
          right: window.innerWidth - coords.x - offset - rects.pad.x,
        };

        if (spacing.right >= Math.max(rects.tp.width, spacing.left)) {
          tooltip.style.left = `${Math.min(
            coords.x + offset,
            rects.win.width - rects.tp.width - rects.pad.x,
          )}px`;
          tooltip.classList.add("rhs");
        } else {
          tooltip.style.left = `${Math.max(rects.pad.x, coords.x - rects.tp.width - offset)}px`;
          tooltip.classList.add("lhs");
        }

        if (spacing.bottom >= spacing.top) {
          tooltip.style.top = `${Math.min(
            coords.y + offset,
            rects.win.height - rects.tp.height - rects.pad.y,
          )}px`;
          tooltip.classList.add("downward");
        } else {
          tooltip.style.top = `${Math.max(coords.y - rects.tp.height - offset, rects.pad.y)}px`;
          tooltip.classList.add("upward");
        }
      }

      tooltip.classList.add("active");
    }
  },
  updated(el: TooltiperElement) {
    if (el._Tooltiper?.tooltip) {
      if (el._Tooltiper?.useAriaLabel) el._Tooltiper.tooltip.textContent = el.ariaLabel;
      else el._Tooltiper.tooltip.textContent = el.dataset.tooltip || "";
    }
  },
  beforeUnmount(el: TooltiperElement) {
    delete el._Tooltiper;
    utils.triggerEvent(el, "removeTooltip");
  },
};

/* tooltip should be non-blocking. it can appear in any of the four sides of the element. it open on mousehover and focus enter */
