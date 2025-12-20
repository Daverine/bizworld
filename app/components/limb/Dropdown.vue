<script setup lang="ts">
import type { WatchStopHandle } from 'vue';
type MultipleSelectContent = {
  html: string;
  index: string;
};
type Settings = {
  namespace: string;
  delay?: number;
  duration: number;
  closeOnItemClick: boolean;
  teleportMenu: boolean;
  openOnMouseover: boolean;
  constrainWidth: boolean;
  stretchWidth: boolean;
  findToggler?: boolean;
  page?: boolean;
  view: 'unset' | 'vertical' | 'horizontal';
  directionPriority: {
    x?: 'left' | 'right' | 'center';
    y?: 'top' | 'bottom' | 'center';
  };
};

type reactiveBrainBox = {
  selectionContent: (MultipleSelectContent | string)[];
  selectionValue: {
    [key: string]: string;
  };
  activateKeyboard: boolean;
  allItemSelected: boolean;
  allItemFiltered: boolean;
  showDropdownTimeout?: ReturnType<typeof setTimeout>;
  hideDropdownTimeout?: ReturnType<typeof setTimeout>;
  hidingDropdown: boolean;
  // event data to be used for a bb.page dropdown coordinates.
  evt?: MouseEvent;
  isSelect: boolean;
  view?: 'vertical' | 'horizontal';
  openOnMouseover: boolean;
  findToggler: boolean;
  page: boolean;
  browseDm: string | false;
  menuId: string;
  selectable?: boolean;
  multipleSelect?: boolean;
  searchable?: boolean;
  delay: number;
};

// get dropdown element and necessary dropdown properties
const dropElem = useTemplateRef('dropdown');
const model = defineModel<string[] | string>();
const props = defineProps<{
  name?: string;
  placeholder?: string;
  options?: Partial<Settings>;
  searchData?: string[] | any[];
  filterFunction?: (query: string, item: any[]) => any[];
}>();
const emit = defineEmits<{
  change: [value?: string[] | string];
}>();
const showDropdown = ref(false);

// setup dropdown settings
const settings: Settings = {
  ...{
    namespace: 'dropdown',
    duration: 300,
    closeOnItemClick: true,
    teleportMenu: false,
    openOnMouseover: false,
    constrainWidth: false,
    stretchWidth: false,
    view: 'unset',
    directionPriority: {
      x: 'right',
      y: 'bottom',
    },
  },
  ...(props.options || {}),
};
// create a workshop space variable
const bb = reactive<reactiveBrainBox>({
  selectionContent: [],
  selectionValue: {},
  activateKeyboard: false,
  allItemSelected: false,
  allItemFiltered: false,
  hidingDropdown: false,
  isSelect: false,
  openOnMouseover: false,
  findToggler: false,
  page: false,
  browseDm: false,
  menuId: '',
  delay: 0,
});
const searchQuery = ref('');
const filteredData = ref<any[]>([]);
let sizeStream: ResizeObserver;
let selectors: {
  items: string;
  items_of_indicating_dropdown: string;
  items_filtered: string;
  dropdown_exiter: string;
};
const unwatch: {
  [key: string]: WatchStopHandle;
} = {};
let dropMenu: HTMLElement, uniqueId: string;
let selectableContentBox: HTMLElement,
  selectablePlaceholder: HTMLElement,
  searchBox: HTMLInputElement,
  searchBoxSizer: HTMLElement,
  allFilteredMsgBox: HTMLElement,
  allSelectedMsgBox: HTMLElement;
let ddFamily: Element[] = [];

onMounted(async () => {
  bb.view =
    settings.view === 'unset'
      ? dropElem.value!.classList.contains('sub')
        ? 'horizontal'
        : 'vertical'
      : settings.view;
  bb.openOnMouseover =
    (dropElem.value!.hasAttribute('data-hover') &&
      dropElem.value!.getAttribute('data-hover') !== 'false') ||
    (dropElem.value!.classList.contains('sub') && !settings.openOnMouseover);
  bb.findToggler =
    settings.findToggler || dropElem.value!.hasAttribute('data-find-toggler');
  bb.page =
    Boolean(settings.page) &&
    !dropElem.value!.classList.contains('sub') &&
    !bb.openOnMouseover;
  bb.browseDm = dropElem.value!.getAttribute('data-browse-dm') ?? false; // replacement for settings.browser and settings.menuid
  bb.selectable =
    dropElem.value!.classList.contains('select') ||
    dropElem.value!.classList.contains('selection');
  bb.multipleSelect =
    bb.selectable && dropElem.value!.classList.contains('multiple');
  bb.searchable = bb.selectable && dropElem.value!.classList.contains('search');
  bb.delay =
    settings.delay === undefined
      ? bb.openOnMouseover
        ? 300
        : 0
      : settings.delay;
  bb.isSelect = dropElem.value!.classList.contains('select');
  // dropdown direction priority
  settings.directionPriority.x = settings.directionPriority.x ?? 'right';
  settings.directionPriority.y = settings.directionPriority.y ?? 'bottom';
  // contrain drop menu width to the width of dropdown if settings.constrainWidth is true or dropdown has class select
  settings.stretchWidth =
    props.options?.stretchWidth ?? dropElem.value!.classList.contains('select');
  settings.teleportMenu =
    props.options?.teleportMenu ??
    (!dropElem.value!.classList.contains('sub') &&
      !dropElem.value!.classList.contains('select'));

  // set up selectors for dropdown items
  selectors = {
    // select all element in dropMenu regardless of it statuses
    items:
      ':scope > .item:not(.xhover, .disabled, [disabled]), :scope > .items > .item:not(.xhover, .disabled, [disabled])',
    // select all element in dropMenu regarding it statuses
    items_of_indicating_dropdown: `:scope > .item:not(.xhover, .disabled, [disabled]${
      !(bb.multipleSelect && dropElem.value!.classList.contains('indicating'))
        ? ', .selected'
        : ''
    }), :scope > .items > .item:not(.xhover, .disabled, [disabled]${
      !(bb.multipleSelect && dropElem.value!.classList.contains('indicating'))
        ? ', .selected'
        : ''
    })`,
    // select all element in dropMenu regarding it statuses
    items_filtered: `:scope > .item:not(.xhover, .disabled, [disabled], .filtered${
      !(bb.multipleSelect && dropElem.value!.classList.contains('indicating'))
        ? ', .selected'
        : ''
    }), :scope > .items > .item:not(.xhover, .disabled, [disabled], .filtered${
      !(bb.multipleSelect && dropElem.value!.classList.contains('indicating'))
        ? ', .selected'
        : ''
    })`,
    // exiter
    dropdown_exiter: `.exit-dd`,
  };

  await nextTick();

  // get dropdown menu element,set-it-up and generate uniqueId
  let ddm = bb.browseDm
    ? document.getElementById(bb.browseDm)
    : dropElem.value!.querySelector(':scope > .drop.menu');
  // check if dropdown Menu exist
  if (!ddm) {
    console.error(
      'A dropMenu menu is missing for the following dropdown',
      dropElem.value
    );
    return;
  }

  dropMenu = ddm as HTMLElement;
  uniqueId = utils.getUniqueId(settings.namespace);
  bb.menuId = dropMenu.id || uniqueId;
  dropMenu.id = bb.menuId;
  if (!dropMenu.role) dropMenu.role = bb.selectable ? 'listbox' : 'menu';
  if (!dropMenu.tabIndex) dropMenu.tabIndex = -1;
  dropMenu.dataset.view = bb.view;
  dropMenu.dataset.ddid = uniqueId;
  if (bb.page) dropMenu.classList.add('fixed');
  if (dropElem.value?.classList.contains('indicating'))
    dropMenu.classList.add('indicating');

  // configure dropdown to be selectable and searchable if that what it is.

  if (bb.selectable) {
    // cache all concurrent elements for selectable dropdown
    selectableContentBox = dropElem.value!.querySelector(
      ':scope > .content'
    ) as HTMLElement;
    selectablePlaceholder = dropElem.value!.querySelector(
      ':scope .placeholder'
    ) as HTMLElement;

    // configure search box and cache concurrent element for searchable dropdown
    if (bb.searchable) {
      searchBox = dropElem.value!.querySelector(
        ':scope input.ssbox'
      ) as HTMLInputElement;
      searchBoxSizer = dropElem.value!.querySelector(
        ':scope .ddss'
      ) as HTMLElement;

      // add the message to show when no search result is found.
      if (dropMenu.querySelector(`:scope > .ed-msg.all-filtered-msg`)) {
        allFilteredMsgBox = dropMenu.querySelector(
          `:scope > .ed-msg.all-filtered-msg`
        ) as HTMLElement;
      } else {
        allFilteredMsgBox = document.createElement('div');
        allFilteredMsgBox.classList.add('ed-msg', 'all-filtered-msg');
        allFilteredMsgBox.textContent = `No result found.`;
        dropMenu.append(allFilteredMsgBox);
      }

      unwatch.allItemFiltered = watch(
        () => bb.allItemFiltered,
        (filtered) => {
          if (filtered) allFilteredMsgBox.classList.add('active');
          else allFilteredMsgBox.classList.remove('active');
        }
      );

      // open dropdown if user typed in the searchBox. And resize searchBox according to it content.
      searchBox.addEventListener('input', () => {
        if (searchBox.value) {
          selectablePlaceholder.classList.add('filtered');
          if (!bb.multipleSelect)
            selectableContentBox.classList.add('filtered');
        } else {
          selectablePlaceholder.classList.remove('filtered');
          if (!bb.multipleSelect)
            selectableContentBox.classList.remove('filtered');
        }

        searchBoxSizer.textContent = searchBox.value;
        utils.afterNextRepaint(
          () => (searchBox.style.width = searchBoxSizer.clientWidth + 'px')
        );
        if (!showDropdown.value) {
          bb.activateKeyboard = true;
          showDropdown.value = true;
        }
      });
    }

    if (bb.multipleSelect) {
      bb.selectionContent = [];
      // click controls for multiple selectable dropdown
      document.addEventListener('click', ms_clickEvt);
      // keyboard controls for multiple selectable dropdown
      document.addEventListener('keydown', ms_keyEvt);
      // add the message to show when all item is selected.
      if (dropElem.value!.querySelector(`:scope > .ed-msg.all-selected-msg`)) {
        allSelectedMsgBox = dropElem.value!.querySelector(
          `:scope > .ed-msg.all-selected-msg`
        ) as HTMLElement;
      } else {
        allSelectedMsgBox = document.createElement('div');
        allSelectedMsgBox.classList.add('ed-msg', 'all-selected-msg');
        allSelectedMsgBox.textContent = `All available items are selected.`;
        dropMenu.append(allSelectedMsgBox);
      }

      unwatch.allItemSelected = watch(
        () => bb.allItemSelected,
        (allSelected) => {
          if (allSelected) allSelectedMsgBox.classList.add('active');
          else allSelectedMsgBox.classList.remove('active');
        }
      );
    }

    /* set select dropdown value for preselected value */
    let items = [...dropMenu.querySelectorAll(selectors.items)];
    if (bb.multipleSelect && items.some((el) => el.matches('.selected')))
      items
        .filter((el) => el.matches('.selected'))
        .forEach((el) => dd_setSelect(el));
    else if (!bb.multipleSelect && items.some((el) => el.matches('.active')))
      dd_setSelect(items.find((el) => el.matches('.active')) as Element);

    watch(
      model,
      (newValue) => {
        let items = [
          ...dropMenu.querySelectorAll(selectors.items),
        ] as HTMLElement[];

        if (bb.multipleSelect) {
          if (!Array.isArray(newValue)) newValue = [];

          let modelItems: HTMLElement[] = [];

          newValue.forEach((val) => {
            // avoid selecting an item more than once.
            let pendingItems = items.filter((el) => !modelItems.includes(el));
            for (let i = 0; i < pendingItems.length; i++) {
              let pendingItem = pendingItems[i] as HTMLElement;
              if (
                val ===
                (pendingItem.getAttribute('data-value') ??
                  pendingItem.textContent)
              ) {
                modelItems.push(pendingItem);
                break;
              }
            }
          });

          // deselect all items in the multiple selectable drop menu
          items.forEach((item) => {
            item.classList.remove('selected');
            item.setAttribute('data-ddid', '');
          });
          bb.selectionValue = {};
          bb.selectionContent = [];
          selectableContentBox.classList.add('no-content');

          // select all items that exist in the modelItems
          if (modelItems[0]) {
            modelItems.forEach((item) => {
              let ddid = utils.getUniqueId('ddid');
              let itemValue =
                item.getAttribute('data-value') ?? (item.textContent as string);

              item.classList.add('selected');
              bb.selectionValue[ddid] = itemValue;
              item.setAttribute('data-ddid', ddid);
              bb.selectionContent.push({
                html: item.innerHTML,
                index: ddid,
              });
            });
            selectableContentBox.classList.remove('no-content');
            // check if all items in the dropdown is selected.
            if (!items.some((el) => !el.matches('.selected')))
              bb.allItemSelected = true;
          }

          newValue = Object.values(bb.selectionValue);
        } else {
          items.forEach((item) => item.classList.remove('active'));
          bb.selectionContent = [];

          let item = items.find(
            (item) =>
              newValue === (item.getAttribute('data-value') ?? item.textContent)
          );

          if (item) {
            item.classList.add('active');
            bb.selectionContent = [item.innerHTML];
          } else newValue = '';
        }
        emit('change', model.value);
      },
      { immediate: true }
    );
  }

  // decide wether to teleport dropdown menu or not
  if (settings.teleportMenu) document.body.append(dropMenu);

  // get all dropdowns and dropdown menus that is dropdown family indirectly (ie. linked by id) in ddFamily variable
  // the ddFamily variable is used to close all dropdowns that is linked to the current dropdown when the current dropdown is closed.
  if (settings.teleportMenu || bb.browseDm)
    ddFamily.push(dropElem.value as HTMLElement, dropMenu);
  else ddFamily.push(dropElem.value as HTMLElement);
  checkerFill(dropMenu);

  // configure how dropdown opens
  // open dropdown if the enter key, spacebar key or arrow down key is pressed while dropdown is focused-on
  document.addEventListener('keydown', dd_keyEvt);

  // configure hoverable dropdown to open on mouse-over and touchstart
  if (bb.openOnMouseover) {
    dropElem.value!.addEventListener('mouseenter', dd_toggleHandler);
    dropElem.value!.addEventListener('touchstart', dd_toggleHandler);
  }
  // configure clickable dropdown to open on mouse click
  else dropElem.value!.addEventListener('click', dd_toggleHandler);

  // configure dropdown to be controlled using ddconsole-custom-event. controls include opening and closing dropdown and sub dropdowns
  dropElem.value!.addEventListener('ddconsole', (event) => {
    let e = event as CustomEvent;
    if (e.detail === 'close') showDropdown.value = false;
    else if (e.detail === 'close all ancestor dropdown') dd_closeWithAncestor();
    else if (e.detail === 'open') showDropdown.value = true;
    else if (e.detail === 'open with keyboard') {
      bb.activateKeyboard = true;
      showDropdown.value = true;
    } else if (e.detail.command === 'set hovered item' && e.detail.el) {
      [...dropMenu.querySelectorAll(selectors.items)].forEach((el) =>
        el.classList.remove('hovered')
      );
      utils.afterNextRepaint(() => e.detail.el.classList.add('hovered'));
    }
  });

  if (settings.constrainWidth || settings.stretchWidth) {
    sizeStream = new ResizeObserver(() => {
      let dd_width = dropElem.value!.getBoundingClientRect().width;
      if (settings.constrainWidth) dropMenu.style.maxWidth = `${dd_width}px`;
      if (settings.stretchWidth) dropMenu.style.minWidth = `${dd_width}px`;
    });

    sizeStream.observe(dropElem.value!);
  }
});

// checkerFill is a function that find all sub dropMenu that is linked to it dropdown by id and add it to ddFamily array.
function checkerFill(dm: Element) {
  if (dm.querySelectorAll(':scope .sub.dropdown[data-browse-dm]')[0]) {
    [...dm.querySelectorAll(':scope .sub.dropdown[data-browse-dm]')].forEach(
      (el) => {
        let newDm = document.querySelector(
          `.drop.menu[data-ddid="${el.getAttribute('data-ddid')}"]`
        );
        if (newDm) {
          ddFamily.push(newDm);
          checkerFill(newDm);
        }
      }
    );
  }
}

watch(showDropdown, (show) => {
  if (show) {
    if (dropElem.value!.matches('.disabled, [disabled]')) {
      showDropdown.value = false;
      return;
    }
    let items = [
      ...dropMenu.querySelectorAll(selectors.items_of_indicating_dropdown),
    ] as HTMLElement[];
    let activeItem = items.find((el) => el.matches('.active'));

    // register dropdown as to when it will respond Escape key press
    utils.trackEscOn(uniqueId);

    if (bb.searchable) {
      searchBox.focus();
      // what to do when searching in a dropdown box
      searchBox.addEventListener('input', dd_searchEvt);
      utils.triggerEvent(searchBox, 'input');
    }

    document.addEventListener('click', dd_clickOnDomEvt);
    document.addEventListener('keyup', dd_escAndTabEvt);
    document.addEventListener('keydown', dd_KBControlEvt);
    window.addEventListener('resize', dd_CalcPosition);
    window.addEventListener('scroll', dd_CalcPosition, true);
    document.addEventListener('mousemove', dd_mouseMover);

    dd_CalcPosition();
    dropMenu.style.visibility = 'visible';
    dropMenu.classList.add('visible');

    // highlight (add .hover class to) the active item or the first item in the menu list if dropdown is opened with with keyboard keys or it is a searchable dropdown. (default action)
    let itemToHover = activeItem ?? items[0];

    if (itemToHover) {
      itemToHover.focus();
      if (bb.activateKeyboard) {
        itemToHover.classList.add('hovered');
        items
          .filter((el) => el != itemToHover)
          .forEach((el) => el.classList.remove('hovered'));
        bb.activateKeyboard = false;
      }
    } else dropMenu.focus();

    // auto scroll dropdown-menu to active item position.
    setTimeout(() => {
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }, settings.duration + 50);
  } else {
    // close all sub-dropdown first
    [...dropMenu.querySelectorAll(':scope .dropdown.active')].forEach((el) =>
      utils.triggerEvent(el, 'ddconsole', 'close')
    );

    document.removeEventListener('click', dd_clickOnDomEvt);
    document.removeEventListener('keyup', dd_escAndTabEvt);
    document.removeEventListener('keydown', dd_KBControlEvt);
    document.removeEventListener('mousemove', dd_mouseMover);
    window.removeEventListener('resize', dd_CalcPosition);
    window.removeEventListener('scroll', dd_CalcPosition, true);
    [...dropMenu.querySelectorAll(selectors.items)].forEach((el) =>
      el.classList.remove('hovered')
    );

    if (bb.searchable) {
      searchBox.removeEventListener('input', dd_searchEvt);
      searchBox.value = '';
      selectableContentBox.classList.remove('filtered');
      selectablePlaceholder.classList.remove('filtered');
    }

    if (bb.openOnMouseover)
      document.removeEventListener('mousemove', dd_toggleHandler);

    // safely get out of escape track
    utils.checkEscStatus(uniqueId, true);

    dropMenu.classList.remove('visible');
    dropElem.value!.focus();
    setTimeout(
      () => (dropMenu.style.visibility = 'hidden'),
      utils.durationInMilliseconds(
        utils.getCssVal(dropMenu, 'transition-duration')
      )
    );
  }
});

onBeforeUnmount(() => {
  // return dropMenu to it appropriate location.
  if (settings.teleportMenu) dropElem.value!.append(dropMenu); // return drop menu to the drop down to get it removed also.

  // stop all asynchronous watcher
  Object.keys(unwatch).forEach((el) => {
    if (typeof unwatch[el] === 'function') unwatch[el]();
  });
  document.removeEventListener('click', ms_clickEvt);
  document.removeEventListener('keydown', ms_keyEvt);
  document.removeEventListener('keydown', dd_keyEvt);
  document.removeEventListener('click', dd_clickOnDomEvt);
  document.removeEventListener('keyup', dd_escAndTabEvt);
  document.removeEventListener('keydown', dd_KBControlEvt);
  document.removeEventListener('mousemove', dd_mouseMover);
  document.removeEventListener('mousemove', dd_toggleHandler);
  window.removeEventListener('resize', dd_CalcPosition);
  window.removeEventListener('scroll', dd_CalcPosition, true);
  sizeStream?.disconnect();
  if (bb.openOnMouseover)
    document.removeEventListener('mousemove', dd_toggleHandler);

  // safely get out of escape track
  utils.checkEscStatus(uniqueId, true);
});

function ms_clickEvt(e: MouseEvent) {
  let target = e.target as HTMLElement;
  let sItems = [
    ...dropElem.value!.querySelectorAll(':scope > .content > .chip'),
  ];
  let sItem = sItems.find((el) => el.contains(target));
  let sItemClose = [
    ...dropElem.value!.querySelectorAll(':scope > .content > .chip > .close'),
  ].find((el) => el.contains(target));

  // deselecting multiple dropdown item when user clicks on the close button of a chip
  if (sItemClose)
    utils.afterNextRepaint(() => dd_setDeselect(sItem as Element));
  else if (sItem) {
    let sItemSiblings = sItems.filter((el) => el != sItem);

    // select a chip that is not selected if user clicks on them.
    if (!sItem.matches('.active')) sItem.classList.add('active');
    // deselect a chip that is selected if user click on them and there is no other chip selected
    else if (!sItemSiblings.some((el) => el.matches('.active')))
      sItem.classList.remove('active');

    // if the control key is not pressed when user clicks on a chip, deselect the siblings of the chip
    if (!e.ctrlKey)
      sItemSiblings.forEach((el) => el.classList.remove('active'));
  }
  // if one or more chip(s) is selected and user clicks out, deselect the selected chips
  else sItems.forEach((el) => el.classList.remove('active'));
}
function ms_keyEvt(e: KeyboardEvent) {
  let sItems = [
    ...dropElem.value!.querySelectorAll(':scope > .content > .chip'),
  ];
  let activeSItems = sItems.filter((el) => el.matches('.active'));

  if (activeSItems[0]) {
    let prevSibling = activeSItems[0].previousElementSibling?.matches('.chip')
      ? activeSItems[0].previousElementSibling
      : null;
    let nextSibling = activeSItems.slice(-1)[0]!.nextElementSibling;

    // deselect items with keyboard when they are selected
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (e.key == 'Backspace') {
        if (prevSibling) prevSibling.classList.add('active');
        else if (nextSibling?.matches('.chip'))
          nextSibling.classList.add('active');
      } else if (e.key == 'Delete') {
        if (nextSibling?.matches('.chip')) nextSibling.classList.add('active');
        else if (prevSibling) prevSibling.classList.add('active');
      }

      activeSItems.forEach((el) => dd_setDeselect(el));
    }
    // navigation within multiple selectable dropdown.
    else if (e.key === 'ArrowRight' && nextSibling) {
      if (nextSibling === searchBox) {
        activeSItems.forEach((el) => el.classList.remove('active'));
        searchBox.focus();
        return;
      } else if (nextSibling.matches('.chip')) {
        if (!e.shiftKey)
          activeSItems.forEach((el) => el.classList.remove('active'));
        nextSibling.classList.add('active');
      }
    } else if (e.key === 'ArrowLeft' && prevSibling) {
      if (!e.shiftKey)
        activeSItems.forEach((el) => el.classList.remove('active'));
      prevSibling.classList.add('active');
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      activeSItems.forEach((el) => el.classList.remove('active'));
      if (e.key === 'ArrowDown') {
        bb.activateKeyboard = true;
        showDropdown.value = true;
      }
    } else if (e.key === ' ' || e.key === 'Enter' /* || e.key === 'Tab' */)
      activeSItems.forEach((el) => el.classList.remove('active'));
  }
  // delete the last chip in multiple dropdown if searchBox is focused-on and seachbox is empty and the backspace key is pressed
  else if (
    bb.searchable &&
    searchBox.matches(':focus') &&
    !searchBox.value &&
    e.key == 'Backspace' &&
    sItems[0]
  )
    dd_setDeselect(sItems.slice(-1)[0]!);
  // navigation in multiple selectable dropdown continues at the following.
  else if (dropElem.value!.matches(':focus-within')) {
    if (e.key == 'ArrowRight') sItems[0]?.classList.add('active');
    else if (e.key == 'ArrowLeft') sItems.pop()?.classList.add('active');
  }
}
function dd_keyEvt(e: KeyboardEvent) {
  if (
    (e.key == 'Enter' || e.key == 'ArrowDown' || e.key == ' ') &&
    dropElem.value!.matches(':focus-within') &&
    !showDropdown.value
  ) {
    e.preventDefault();
    bb.activateKeyboard = true;
    showDropdown.value = true;
  }
}

function dd_toggleHandler(e: MouseEvent | TouchEvent) {
  let target = e.target as Element;
  // escape all ex-dropdown classed element from toggling dropdwon also trigger only on toggler in dropdown if specified to do so.
  if (
    [...dropElem.value!.querySelectorAll(':scope > .content > .chip')].some(
      (el) => el.contains(target)
    ) ||
    (target && target.closest('.ex-dropdown')) ||
    (bb.findToggler && !target.closest('.dd-toggler'))
  )
    return;

  if (bb.openOnMouseover) {
    if (e.type === 'mouseenter') {
      document.addEventListener('mousemove', dd_toggleHandler);
      clearTimeout(bb.hideDropdownTimeout);
      bb.showDropdownTimeout = setTimeout(() => {
        if (bb.searchable) bb.activateKeyboard = true;
        showDropdown.value = true;
      }, bb.delay / 2);
    } else if (e.type === 'mousemove') {
      if (ddFamily.some((el) => el.contains(target))) {
        bb.hidingDropdown = false;
        clearTimeout(bb.hideDropdownTimeout);
        return;
      }
      // prevent bb.hidingDropdown from triggering more than once.
      if (bb.hidingDropdown) return;

      bb.hidingDropdown = true;
      clearTimeout(bb.showDropdownTimeout);
      bb.hideDropdownTimeout = setTimeout(() => {
        bb.hidingDropdown = false;
        showDropdown.value = false;
      }, bb.delay);
    } else if (e.type === 'touchstart') {
      // prevent event from interfering with dropMenu items actions.
      if (dropMenu.contains(target)) return;

      if (showDropdown.value) {
        clearTimeout(bb.showDropdownTimeout);
        showDropdown.value = false;
      } else {
        document.addEventListener('mousemove', dd_toggleHandler);
        clearTimeout(bb.hideDropdownTimeout);
        if (bb.searchable) bb.activateKeyboard = true;
        showDropdown.value = true;
      }
    }
  } else {
    // prevent event from interfering with dropMenu items actions.
    if (dropMenu.contains(target)) return;

    // I don't know why i called e.preventDefault here.
    e.preventDefault();
    // save event data to be used for a setting.page type dropdown dropMenu coordinate when showing it.
    if (bb.page) bb.evt = e as MouseEvent;

    if (showDropdown.value) {
      if (
        bb.searchable &&
        !dropElem.value!.querySelector(':scope .ddico')?.contains(target)
      ) {
        searchBox.focus();
        return;
      }

      setTimeout(() => (showDropdown.value = false), bb.delay);
    } else {
      setTimeout(() => {
        if (bb.searchable) bb.activateKeyboard = true;
        showDropdown.value = true;
      }, bb.delay);
    }
  }
}

function dd_closeWithAncestor() {
  showDropdown.value = false;
  // get the ancestor dropdown of sub-dropdown and send it an event to close it self and it ancestors also
  let parentDDMenu = utils.getParents(dropElem.value!, '.drop.menu')[0];
  if (parentDDMenu && parentDDMenu.getAttribute('data-ddid')) {
    let parentDropdown = document.querySelector(
      `[data-ddid="${parentDDMenu.getAttribute('data-ddid')}"].dropdown`
    ) as Element;

    if (parentDropdown)
      utils.triggerEvent(
        parentDropdown,
        'ddconsole',
        'close all ancestor dropdown'
      );
  }
}

async function dd_searchEvt() {
  searchQuery.value = searchBox.value.toLowerCase();
  let items = [
    ...dropMenu.querySelectorAll(selectors.items_of_indicating_dropdown),
  ];

  if (props.searchData) {
    filteredData.value = props.filterFunction
      ? props.filterFunction(searchQuery.value, props.searchData)
      : props.searchData.filter((item) =>
          item.toLowerCase().includes(searchQuery.value)
        );
  } else {
    items.forEach((el) => {
      if (
        searchQuery.value &&
        !el.textContent?.toLowerCase().includes(searchQuery.value)
      )
        el.classList.add('filtered');
      else el.classList.remove('filtered');
    });
  }
  await nextTick();
  items = [...dropMenu.querySelectorAll(selectors.items_filtered)];

  if (!items[0]) {
    [...dropMenu.querySelectorAll(selectors.items)].forEach((el) =>
      el.classList.remove('hovered')
    );

    if (searchQuery.value && !bb.allItemFiltered) bb.allItemFiltered = true;
    else if (!searchQuery.value && bb.allItemFiltered)
      bb.allItemFiltered = false;
  } else {
    if (searchQuery.value && !dropElem.value!.matches('.indicating')) {
      [...dropMenu.querySelectorAll(selectors.items)].forEach((el) =>
        el.classList.remove('hovered')
      );
    } else items.forEach((el) => el.classList.remove('hovered'));

    items[0].classList.add('hovered');
    bb.allItemFiltered = false;
    items[0].scrollIntoView({ block: 'nearest' });
  }

  if (bb.multipleSelect) {
    if (searchQuery.value) {
      selectableContentBox.classList.remove('no-content');
      let sItems = [
        ...dropElem.value!.querySelectorAll(':scope > .content > .chip'),
      ];
      if (sItems[0]) sItems.forEach((el) => el.classList.remove('active'));
    } else if (!bb.selectionContent[0])
      selectableContentBox.classList.add('no-content');
  }

  utils.afterNextRepaint(() => dd_CalcPosition());
}

function dd_clickOnDomEvt(e: MouseEvent) {
  let target = e.target as Element;
  let items = [...dropMenu.querySelectorAll(selectors.items)];
  let item = items.find((el) => el.contains(target));
  let ignore = [
    ...dropElem.value!.querySelectorAll(':scope > .content > .chip'),
  ].find((el) => el.contains(target));
  let exiter =
    dropMenu.contains(target) && target.closest(selectors.dropdown_exiter);

  // Close when an exiter is clicked or on "Click Out"
  if (exiter || (!ignore && !ddFamily.some((el) => el.contains(target)))) {
    showDropdown.value = false;
  }
  // respond when an item is clicked
  else if (item) {
    if (item.matches('.dropdown')) return;

    if (bb.selectable) {
      // deselecting items for multiple select dropdown that has the indicating class
      if (bb.multipleSelect && item.matches('.selected'))
        dd_setDeselect(
          [
            ...dropElem.value!.querySelectorAll(':scope > .content > .chip'),
          ].find(
            (el) =>
              el.getAttribute('data-ddid') === item.getAttribute('data-ddid')
          ) as Element
        );
      // select item if dropdown is selectable
      else dd_setSelect(item, bb.multipleSelect);
    } else if (
      /*
      close all dropdown including all sub dropdowns and parent dropdowns if dropdown is
        1. set to close on item click and click target is not on .dd-xclose item.
        2. not set to close on item click but target is .dd-close item
    */
      (settings.closeOnItemClick && !item.matches('.dd-xclose')) ||
      item.matches('.dd-close')
    )
      dd_closeWithAncestor();
  }
}

function dd_KBControlEvt(e: KeyboardEvent) {
  let items = [
    ...dropMenu.querySelectorAll(selectors.items_filtered),
  ] as HTMLElement[];
  /*
    The Enter key triggers the click action on an item
    Enter and right arrow key open a sub dropdown that is hovered.
  */
  if (e.key == 'Enter' || e.key == 'ArrowRight') {
    let item = items.find((el) => el.matches('.hovered')) as HTMLElement;
    if (!item) return;
    if (item.matches('.dropdown:not(.active)')) {
      e.preventDefault();
      utils.triggerEvent(item, 'ddconsole', 'open with keyboard');
    } else if (e.key == 'Enter') {
      e.preventDefault();
      item.click();
    }
  }
  // Arrow left key (Use to close a sub dropdown) support
  else if (
    e.key == 'ArrowLeft' &&
    dropElem.value!.matches('.sub') &&
    ![...dropMenu.querySelectorAll(':scope .dropdown.active')][0]
  ) {
    e.preventDefault();
    showDropdown.value = false;
    if (dropElem.value!.matches('.sub'))
      nextTick(() => dropElem.value!.classList.add('hovered'));
  }
  // Up and down arrrow key navigation on dropdown menu item.
  else if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
    let hvItem = items.find((el) => el.matches('.hovered'));
    let acItem = items.find((el) => el.matches('.active'));

    if (![...dropMenu.querySelectorAll(':scope .dropdown.active')][0]) {
      e.preventDefault();
      // cii is current-item-index
      let cii = hvItem
        ? items.indexOf(hvItem)
        : acItem
        ? items.indexOf(acItem)
        : -1;
      // nii is new-item-index
      let nii =
        e.key == 'ArrowUp'
          ? cii <= 0
            ? items.length - 1
            : cii - 1
          : cii === items.length - 1 || cii < 0
          ? 0
          : cii + 1;
      // ci is new-current-item
      let ci = items[nii] as HTMLElement;

      /* scroll overflow parent to make hovered-item visible in screen */
      if (ci) {
        ci.scrollIntoView({ behavior: 'instant', block: 'nearest' });
        items.forEach((el) => {
          el.classList.remove('hovered');
          el.blur();
        });
        ci.classList.add('hovered');
        ci.focus();
        if (bb.selectable && !bb.multipleSelect) dd_setSelect(ci, true);
      }
    }

    document.addEventListener('mousemove', dd_mouseMover);
  }
  // manage tab key navigation within dropdown menu and out of it.
  else if (e.key === 'Tab') utils.focusRangeOnTab(dropMenu, e);
}

function dd_escAndTabEvt(e: KeyboardEvent) {
  // check if it is this dropdown turn to respond to Esc press.
  if (e.key === 'Escape' && utils.checkEscStatus(uniqueId)) {
    e.preventDefault();
    showDropdown.value = false;
    // set sub dropdown to current hovered item in it parent dropdown.
    nextTick(() => {
      dropElem.value!.focus();
      if (dropElem.value!.matches('.sub'))
        dropElem.value!.classList.add('hovered');
    });
  } else if (
    e.key === 'Tab' &&
    ![...dropElem.value!.querySelectorAll(':scope :focus')][0] &&
    ![...dropMenu.querySelectorAll(':scope :focus')][0] &&
    ![...dropMenu.querySelectorAll(':scope .dropdown.active')][0]
  ) {
    e.preventDefault();
    dd_closeWithAncestor();
  }
}

function dd_CalcPosition() {
  let rects = {
    dd: dropElem.value!.getBoundingClientRect(),
    dm: {
      width: dropMenu.offsetWidth,
      height: dropMenu.offsetHeight,
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
  // position dropdown relative to window
  if (bb.page) {
    let spacing = {
      left: bb.evt!.clientX - rects.pad.y,
      top: bb.evt!.clientY - rects.pad.y,
      right: rects.win.width - bb.evt!.clientX - rects.pad.x,
      bottom: rects.win.height - bb.evt!.clientY - rects.pad.x,
    };

    if (spacing.right >= Math.max(rects.dm.width, spacing.left)) {
      dropMenu.style.left = `${Math.min(
        spacing.left,
        rects.win.width - rects.dm.width - rects.pad.x
      )}px`;
      dropMenu.classList.add('rhs');
    } else {
      dropMenu.style.left = `${Math.max(
        spacing.left - rects.dm.width,
        rects.pad.x
      )}px`;
      dropMenu.classList.add('lhs');
    }

    if (spacing.bottom >= Math.max(rects.dm.height, spacing.top)) {
      dropMenu.style.top = `${Math.min(
        spacing.top,
        rects.win.height - rects.dm.height - rects.pad.y
      )}px`;
      dropMenu.classList.add('downward');
    } else {
      dropMenu.style.top = `${Math.max(
        spacing.top - rects.dm.height,
        rects.pad.y
      )}px`;
      dropMenu.classList.add('upward');
    }
  } else {
    if (bb.view === 'vertical') {
      let spacing = {
        top: rects.dd.top - rects.pad.y,
        bottom: rects.win.height - rects.dd.top - rects.dd.height - rects.pad.y,
      };

      let dmY = {
        top: rects.dd.top - rects.dm.height,
        bottom: rects.dd.top + rects.dd.height,
      };

      if (settings.directionPriority.y === 'bottom') {
        if (
          spacing.bottom >= Math.max(rects.dm.height, spacing.top) ||
          rects.dm.height > spacing.top
        ) {
          dropMenu.style.top = `${dmY.bottom}px`;
          if (!dropMenu.classList.contains('downward')) {
            dropMenu.classList.add('downward');
            dropMenu.classList.remove('upward');
          }
        } else {
          dropMenu.style.top = `${dmY.top}px`;
          if (!dropMenu.classList.contains('upward')) {
            dropMenu.classList.add('upward');
            dropMenu.classList.remove('downward');
          }
        }
      } else {
        if (spacing.top >= rects.dm.height) {
          dropMenu.style.top = `${dmY.top}px`;
          if (!dropMenu.classList.contains('upward')) {
            dropMenu.classList.add('upward');
            dropMenu.classList.remove('downward');
          }
        } else {
          dropMenu.style.top = `${dmY.bottom}px`;
          if (!dropMenu.classList.contains('downward')) {
            dropMenu.classList.add('downward');
            dropMenu.classList.remove('upward');
          }
        }
      }

      let dmX = 0;

      if (settings.directionPriority.x === 'right') {
        dmX = rects.dd.left;
        if (!dropMenu.classList.contains('rhs')) {
          dropMenu.classList.add('rhs');
          dropMenu.classList.remove('lhs');
        }
      } else if (settings.directionPriority.x === 'center') {
        dmX = rects.dd.left + rects.dd.width / 2 - rects.dm.width / 2;
      } else {
        dmX = rects.dd.left + rects.dd.width - rects.dm.width;
        if (!dropMenu.classList.contains('lhs')) {
          dropMenu.classList.add('lhs');
          dropMenu.classList.remove('rhs');
        }
      }

      dropMenu.style.left = `${Math.min(
        Math.max(rects.pad.x, dmX),
        rects.win.width - rects.dm.width - rects.pad.x
      )}px`;
    } else {
      let spacing = {
        left: rects.dd.left,
        right: rects.win.width - rects.dd.left - rects.dd.width,
      };

      let dmX = {
        ...rects.dm,
        left: rects.dd.left - rects.dm.width,
        right: rects.dd.left + rects.dd.width,
      };

      if (settings.directionPriority.x === 'right') {
        if (
          spacing.right >= Math.max(rects.dm.width, spacing.left) ||
          rects.dm.width > spacing.left
        ) {
          dropMenu.style.left = `${dmX.right}px`;
          if (!dropMenu.classList.contains('rhs')) {
            dropMenu.classList.add('rhs');
            dropMenu.classList.remove('lhs');
          }
        } else {
          dropMenu.style.left = `${dmX.left}px`;
          if (!dropMenu.classList.contains('lhs')) {
            dropMenu.classList.add('lhs');
            dropMenu.classList.remove('rhs');
          }
        }
      } else {
        if (spacing.left >= rects.dm.width) {
          dropMenu.style.left = `${dmX.left}px`;
          if (!dropMenu.classList.contains('lhs')) {
            dropMenu.classList.add('lhs');
            dropMenu.classList.remove('rhs');
          }
        } else {
          dropMenu.style.left = `${dmX.right}px`;
          if (!dropMenu.classList.contains('rhs')) {
            dropMenu.classList.add('rhs');
            dropMenu.classList.remove('lhs');
          }
        }
      }

      let dmY = 0;

      if (settings.directionPriority.y === 'bottom') {
        dmY = rects.dd.top;
        if (!dropMenu.classList.contains('downward')) {
          dropMenu.classList.add('downward');
          dropMenu.classList.remove('upward');
        }
      } else if (settings.directionPriority.y === 'center')
        dmY = rects.dd.top + rects.dd.height / 2 - rects.dm.height / 2;
      else {
        dmY = rects.dd.top + rects.dd.height - rects.dm.height;
        if (!dropMenu.classList.contains('upward')) {
          dropMenu.classList.add('upward');
          dropMenu.classList.remove('downward');
        }
      }

      dropMenu.style.top = `${Math.min(
        Math.max(rects.pad.y, dmY),
        rects.win.height - rects.dm.height - rects.pad.y
      )}px`;
    }

    // set arrow position variable
    utils.afterNextRepaint(() => {
      let arrowPos = 0;
      // set arrow position based on the dropdown view and direction
      if (bb.view === 'vertical') {
        if (dropMenu.classList.contains('lhs'))
          arrowPos = rects.dm.width - rects.dd.width / 2;
        else if (dropMenu.classList.contains('rhs'))
          arrowPos = rects.dd.width / 2;
        else
          arrowPos =
            rects.dd.left +
            rects.dd.width / 2 -
            dropMenu.getBoundingClientRect().left;
      } else {
        if (dropMenu.classList.contains('upward'))
          arrowPos = rects.dm.height - rects.dd.height / 2;
        else if (dropMenu.classList.contains('downward'))
          arrowPos = rects.dd.height / 2;
        else
          arrowPos =
            rects.dd.top +
            rects.dd.height / 2 -
            dropMenu.getBoundingClientRect().top;
      }

      dropMenu.style.setProperty('--arrow-center', `${arrowPos}px`);
    });
  }
}

// this function cancels active keyboard control on dropdown and enable mouse control.
function dd_mouseMover(e: MouseEvent) {
  let target = e.target as Element;
  let items = [
    ...dropMenu.querySelectorAll(selectors.items_of_indicating_dropdown),
  ];

  if (dropElem.value!.contains(target) || dropMenu.contains(target)) {
    let item = items.find((el) => el.contains(target));
    if (!item) {
      items.forEach((el) => el.classList.remove('hovered'));
      return;
    }
    item.classList.add('hovered');
    items
      .filter((el) => el !== item)
      .forEach((el) => el.classList.remove('hovered'));
  } else if (bb.openOnMouseover) showDropdown.value = false;
  else items.forEach((el) => el.classList.remove('hovered'));
}

// this function set an item as selected in a selectable dropdown
// xClose means don't close dropdown after selection.
async function dd_setSelect(item: Element, xClose?: boolean) {
  if (!item || !bb.selectable) return;

  let items = [...dropMenu.querySelectorAll(selectors.items)];

  if (bb.multipleSelect) {
    let ddid = utils.getUniqueId('ddid');
    let itemValue = item.getAttribute('data-value') || item.textContent || '';

    if (!Object.values(bb.selectionValue).includes(itemValue)) {
      bb.selectionValue[ddid] = itemValue;
      model.value = Object.values(bb.selectionValue);
      emit('change', model.value);
      bb.selectionContent.push({
        html: item.innerHTML,
        index: ddid,
      });
      selectableContentBox.classList.remove('no-content');
    } else {
      ddid = Object.keys(bb.selectionValue).find(
        (key) => bb.selectionValue[key] === itemValue
      ) as string;
      console.warn(
        'The selected item has a value that already exist in the dropdown selection.'
      );
    }
    item.classList.add('selected');
    item.setAttribute('data-ddid', ddid);

    if (bb.searchable && showDropdown.value) {
      searchBox.value = '';
      utils.triggerEvent(searchBox, 'input');
      searchBox.focus();
    }

    await nextTick();
    items = [...dropMenu.querySelectorAll(selectors.items)];

    if (!items.some((el) => !el.matches('.selected')))
      bb.allItemSelected = true;

    if (!showDropdown.value || dropElem.value!.matches('.indicating')) return;

    item.classList.remove('hovered');

    if (!bb.searchable) {
      let nextHv =
        utils.nextAll(item).find((el) => !el.matches('.selected')) ??
        utils
          .prevAll(item)
          .filter((el) => !el.matches('.selected'))
          .pop();
      if (nextHv) {
        nextHv.classList.add('hovered');
        nextHv.scrollIntoView({ block: 'nearest' });
      }
    }

    utils.afterNextRepaint(() => dd_CalcPosition());
  } else {
    item.classList.add('active');
    if (
      !showDropdown.value &&
      items.some((el) => el !== item && el.matches('.active'))
    )
      console.warn(
        'A selection-dropdown on this page has multiple preselected value which is not suppose to be except it is a multiple-selection-dropdown. Only the first preselected value will be preselected.'
      );

    items
      .filter((el) => el !== item)
      .forEach((el) => el.classList.remove('active'));
    model.value = item.getAttribute('data-value') || item.textContent || '';
    emit('change', model.value);
    bb.selectionContent = [item.innerHTML];
  }

  if (xClose) return;

  if (bb.searchable) {
    searchBox.value = '';
    utils.triggerEvent(searchBox, 'input');
  }

  showDropdown.value = false;
}

// this function de-select an item in a selection dropdown.
function dd_setDeselect(sItem: Element) {
  if (!bb.multipleSelect) return;

  let ddid = sItem.getAttribute('data-ddid');
  if (!ddid || !bb.selectionValue[ddid]) return;
  let item = [...dropMenu.querySelectorAll(`:scope [data-ddid="${ddid}"]`)];

  delete bb.selectionValue[ddid];
  model.value = Object.values(bb.selectionValue);
  emit('change', model.value);
  if (!item) return;
  item.forEach((el) => {
    el.classList.remove('selected');
    el.setAttribute('data-ddid', '');
  });
  bb.selectionContent = bb.selectionContent.filter(
    (el) => (el as { index: string }).index !== ddid
  );

  if (bb.allItemSelected) bb.allItemSelected = false;
  if (!bb.selectionContent[0]) selectableContentBox.classList.add('no-content');

  if (showDropdown.value) {
    if (bb.searchable) {
      searchBox.value = '';
      utils.triggerEvent(searchBox, 'input');
    }

    utils.afterNextRepaint(() => dd_CalcPosition());
  }

  if (bb.searchable) searchBox.focus();
}
</script>

<template>
  <a
    ref="dropdown"
    class="dropdown"
    :data-ddid="uniqueId"
    :class="{ active: showDropdown }"
    :role="bb.selectable ? 'combobox' : 'button'"
    :aria-haspopup="bb.selectable ? 'listbox' : 'menu'"
    :aria-expanded="showDropdown"
    :aria-controls="bb.menuId"
    tabindex="0"
  >
    <slot :query="searchQuery" :filteredData></slot>
    <template v-if="bb.selectable">
      <div v-if="bb.multipleSelect" class="content no-content">
        <div
          v-for="item in bb.selectionContent  as MultipleSelectContent[]"
          :key="item.index"
          :data-ddid="item.index"
          class="chip"
        >
          <span v-html="item.html"></span>
          <Icon name="material-symbols:close-rounded" class="close trailing" />
        </div>
        <template v-if="bb.searchable">
          <input class="ssbox" autocomplete="off" tabindex="-1" />
          <span class="ddss"></span>
        </template>
        <div ref="sPlaceholder" class="placeholder">{{ placeholder }}</div>
      </div>
      <template v-else>
        <template v-if="bb.searchable">
          <input class="ssbox" autocomplete="off" tabindex="-1" />
          <span class="ddss"></span>
        </template>
        <div
          ref="sContent"
          v-html="bb.selectionContent[0]"
          class="content"
        ></div>
        <div class="placeholder">{{ placeholder }}</div>
      </template>
      <button v-if="bb.isSelect" ref="ddIcon" tabindex="-1" class="ddico icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 -960 960 960"
          width="48"
        >
          <path
            d="m480-222.609 108.913-108.913q13.202-12.696 30.21-12.696 17.007 0 29.138 13.299 12.13 11.734 12.13 29.552 0 17.817-11.13 29.758L509.957-132.87q-6.023 6.131-14.118 9.414-8.095 3.282-16.035 3.282-7.941 0-15.858-3.282-7.918-3.283-12.903-9.414L311.739-271.609q-12.13-12.071-12.13-29.927 0-17.855 12.233-29.769 12.234-12.913 29.834-12.63 17.6.283 29.976 12.413L480-222.609Zm0-512.651L371.087-626.348q-13.202 12.696-30.21 12.696-17.007 0-29.138-13.299-12.13-12.299-12.13-30.116 0-17.818 12.13-30.194l139.304-139.304q5.019-5.182 13.11-9.222 8.09-4.039 16.026-4.039 7.935 0 15.892 4.039 7.957 4.04 13.886 9.222l139.304 139.304q11.13 12.507 11.13 30.362 0 17.856-12.233 30.334-12.234 12.913-29.957 12.348-17.723-.565-29.853-12.696L480-735.26Z"
          />
        </svg>
      </button>
      <input ref="sInput" :value="model" type="hidden" :name="name" />
    </template>
    <slot name="trailing"></slot>
  </a>
</template>
