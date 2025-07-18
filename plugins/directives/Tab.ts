import type { DirectiveBinding } from 'vue';

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    function tabClick(e: Event | 'on' | undefined) {
      const tabs = [
          ...el.querySelectorAll(':scope [data-tab]'),
        ] as HTMLElement[];
      const tabsIds = tabs.map((el) => el.getAttribute('data-tab'));
      const pages = [...document.querySelectorAll('.tab-page')].filter((el) =>
          tabsIds.includes(el.getAttribute('data-tab'))
        ) as HTMLElement[];

      let currTab = tabs.find((el) =>
        typeof e === 'object'
          ? el.contains(e.target as Node)
          : el.classList.contains('active')
      );
      if (e === 'on') currTab = currTab || tabs[0];

      if (currTab) {
        currTab.classList.add('active');
        tabs
          .filter((el) => el !== currTab)
          .forEach((el) => el.classList.remove('active'));

        if (currTab.getAttribute('data-tab')) {
          let currPages = pages.filter(
            (el) =>
              currTab.getAttribute('data-tab') === el.getAttribute('data-tab')
          );

          if (currPages[0]) {
            currPages.forEach((el) => el.classList.add('active'));
            pages
              .filter((el) => !currPages.includes(el))
              .forEach((el) => el.classList.remove('active'));
          } else pages.forEach((el) => el.classList.remove('active'));
        } else pages.forEach((el) => el.classList.remove('active'));
      }
    }

    el.addEventListener('click', tabClick);
    tabClick(binding.modifiers.hasOwnProperty('on') ? 'on' : undefined);
  },
};
