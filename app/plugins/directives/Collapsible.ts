export default {
  mounted(el: HTMLElement) {
    function collapser() {
      if (!el) {
        observer.disconnect();
        return;
      }

      const collapsible = el.nextElementSibling instanceof HTMLElement && el.nextElementSibling.matches('.collapsible')
        ? el.nextElementSibling as HTMLElement
        : null;
      const accordion = el.getAttribute('data-collapsible');

      if (collapsible) {
        if (el.classList.contains('active')) {
          collapsible.style.height = collapsible.scrollHeight + 'px';

          if (accordion) {
            let activeElems = [
              ...(el.parentNode?.querySelectorAll(
                `:scope > [data-collapsible='${accordion}']`
              ) || []),
            ].filter(
              (elem) => elem instanceof HTMLElement && elem.classList.contains('active') && elem !== el
            ) as HTMLElement[];
            if (activeElems[0]) {
              activeElems.forEach((el) => el.dispatchEvent(new Event('click')));
            }
          }
          setTimeout(() => {
            collapsible.style.height = 'auto';
            utils.triggerEvent(window, 'resize');
          }, utils.durationInMilliseconds(utils.getCssVal(collapsible, 'transition-duration')));
        } else {
          collapsible.style.height = collapsible.scrollHeight + 'px';
          utils.afterNextRepaint(() => collapsible.style.removeProperty('height'));
          setTimeout(
            () => utils.triggerEvent(window, 'resize'),
            utils.durationInMilliseconds(
              utils.getCssVal(collapsible, 'transition-duration')
            )
          );
        }
      }
    }
    const observer = new MutationObserver(collapser);

    observer.observe(el, {
      attributes: true,
      attributeFilter: ['class'],
    });
    utils.afterNextRepaint(() => collapser());
    el.addEventListener('click', () => el.classList.toggle('active'));
  },
};
