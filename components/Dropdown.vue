<script setup>
import { useEventListener } from '@vueuse/core';

// get dropdown element and necessary dropdown properties
const dropElem = useTemplateRef('dropdown');
const props = defineProps(['modelValue', 'name', 'placeholder', 'options']);
const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();
const classes = attrs.class ? attrs.class.split(' ') : [];
const compValue = ref();
const showDropdown = ref(false);


// function to check if an attribute exist on the base component.
function checkAttr(attr) {
  return Object.prototype.hasOwnProperty.call(attrs, attr);
}

// setup dropdown settings
const settings = {
  ...{
    namespace: 'dropdown',
    constrainWidth: false,
    fluidMinWidth: false,
    delay: 0,
    duration: 300,
    closeOnItemClick: true,
    independentMenu: 'auto', // can be true, 'auto' or false
  },
  ...(props.options || {})
}
settings.view = ((classes.includes('sub') && settings.view !== 'vertical') || settings.view === 'horizontal') ? 'horizontal' : 'vertical';
settings.openOnMouseover = (checkAttr('data-hover') && attrs['data-hover'] !== false) || classes.includes('sub');
settings.findToggler = checkAttr('data-find-toggler');
settings.page = (settings.page && !classes.includes('sub')) && !settings.openOnMouseover;
settings.browseDm = attrs?.['data-browse-dm'] || false; // replacement for settings.browser and settings.menuid
settings.directionPriority = settings.directionPriority || {};
settings.directionPriority.x = settings.directionPriority.x || 'right';
settings.directionPriority.y = settings.directionPriority.y || 'bottom';
settings.selectable = classes.includes('select') || classes.includes('selection');
settings.multipleSelect = settings.selectable && classes.includes('multiple');
settings.searchable = settings.selectable && classes.includes('search');
settings.delay = settings.delay || (settings.openOnMouseover) ? 300 : 0;


// create a workshop space variable
const tmp = reactive({
  dropdownReady: false,
  selectionContent: undefined,
  selectionValue: {},
  positionStream: undefined,
  // an array to contain browseable sub dropdown menu
  asdm: [],
  activateKeyboard: false,
  allItemSelected: false,
  allItemFiltered: false,
  showDropdownTimeout: undefined,
  hideDropdownTimeout: undefined,
  hidingDropdown: false,
  // event data to be used for a settings.page dropdown coordinates.
  evt: undefined,
  independentMenu: false,
});

const selectors = {
  // select all element in dropMenu regardless of it statuses
  items: ':scope > .item:not(.xhover):not(.disabled), :scope > .items > .item:not(.xhover):not(.disabled)',
  // select all element in dropMenu regarding it statuses
  items_of_indicating_dropdown: `:scope > .item:not(.xhover):not(.disabled)${!(settings.multipleSelect && classes.includes('indicating')) ? ':not(.selected)' : ''}, :scope > .items > .item:not(.xhover):not(.disabled)${!(settings.multipleSelect && classes.includes('indicating')) ? ':not(.selected)' : ''}`,
  // select all element in dropMenu regarding it statuses
  items_filtered: `:scope > .item:not(.xhover):not(.disabled):not(.filtered)${!(settings.multipleSelect && classes.includes('indicating')) ? ':not(.selected)' : ''}, :scope > .items > .item:not(.xhover):not(.disabled):not(.filtered)${!(settings.multipleSelect && classes.includes('indicating')) ? ':not(.selected)' : ''}`,
  // exiter
  dropdown_exiter: `.exit-dd`,
};
const unwatch = {
  allItemFiltered: undefined,
  allItemSelected: undefined,
  modelValue: undefined,
  compValue: undefined,
}

// get dropdown menu element,set-it-up and generate uniqueId
let dropMenu, uniqueId;
onMounted(() => {
  dropMenu = (settings.browseDm) ? document.getElementById(settings.browseDm) : dropElem.value.querySelector(':scope > .drop.menu');
  // check if dropdown Menu exist
  if (!dropMenu) {
    console.error('A dropMenu menu is missing for the following dropdown', dropElem.value);
    return;
  }

  tmp.dropdownReady = true;
  uniqueId = utils.getUniqueId(settings.namespace);
  dropMenu.setAttribute('data-view', settings.view);
  dropMenu.setAttribute('data-ddid', uniqueId);
  if (settings.page) dropMenu.classList.add('fixed');
});


// configure dropdown to be selectable and searchable if that what it is.
let
  selectableContentBox,
  selectablePlaceholder,
  searchBox,
  searchBoxSizer,
  allFilteredMsgBox,
  allSelectedMsgBox;

onMounted(() => {
  if (!tmp.dropdownReady) return;

  if (settings.selectable) {
    // cache all concurrent elements for selectable dropdown
    selectableContentBox = useTemplateRef('sContent');
    selectablePlaceholder = useTemplateRef('sPlaceholder');

    // // Warn if select dropdown does not have a name prop
    // if (!props.name) console.warn("It might be difficult to get the data of a selection-dropdown on this page because its name prop is invalid.");

    // configure search box and cache concurrent element for searchable dropdown
    if (settings.searchable) {
      searchBox = useTemplateRef('searchBox');
      searchBoxSizer = useTemplateRef('sbsizer');

      // add the message to show when no search result is found.
      allFilteredMsgBox = dropMenu.querySelector(`:scrope > .ed-msg.all-filtered-msg`);
      if (!allFilteredMsgBox) {
        allFilteredMsgBox = document.createElement('div');
        allFilteredMsgBox.classList.add('ed-msg', 'all-filtered-msg');
        allFilteredMsgBox.innerHTML = `No result found.`;
        dropMenu.append(allFilteredMsgBox);
      }

      unwatch.allItemFiltered = watch(() => tmp.allItemFiltered, (filtered) => {
        if (filtered) allFilteredMsgBox.classList.add('active');
        else allFilteredMsgBox.classList.remove('active');
      });


      if (dropElem.value.hasAttribute('tabindex')) {
        searchBox.setAttribute('tabindex', dropElem.value.getAttribute('tabindex'));
        dropElem.value.removeAttribute('tabindex');
      }

      // open dropdown if user typed in the searchbox. And resize searchBox according to it content.
      searchBox.addEventListener('input', () => {
        if (searchBox.value) {
          selectablePlaceholder.classList.add('filtered');
          if (!settings.multipleSelect) selectableContentBox.classList.add('filtered');
        }
        else {
          selectablePlaceholder.classList.remove('filtered');
          if (!settings.multipleSelect) selectableContentBox.classList.remove('filtered');
        }

        searchBoxSizer.textContent = searchBox.value;
        searchBox.style.width = searchBoxSizer.clientWidth + 'px';
        if (!showDropdown.value) dd_toggleDropdown('activate keyboard controls');
      });
    }

    if (settings.multipleSelect) {
      tmp.selectionContent = [];
      // click controls for multiple selectable dropdown
      useEventListener(document, 'click', (e) => {
        let sItems = [...dropElem.value.querySelectorAll(':scope > .content > .chip')];
        let sItem = sItems.filter(el => el.contains(e.target))[0];
        let sItemClose = [...dropElem.value.querySelectorAll(':scope > .content > .chip > .close')].filter(el => el.contains(e.target))[0];

        // deselecting multiple dropdown item when not opened when user clicks on the close button of a chip
        if (sItemClose && !showDropdown.value) dd_setDeselect(sItem);
        else if (sItem) {
          let sItemSiblings = sItems.filter(el => el != sItem);

          // select a chip that is not selected if user clicks on them.
          if (!sItem.matches('.active')) sItem.classList.add('active');
          // deselect a chip that is selected if user click on them and there is no other chip selected
          else if (!sItemSiblings.filter(el => el.matches('.active'))[0]) sItem.classList.remove('active');

          // if the control key is not pressed when user clicks on a chip, deselect the siblings of the chip 
          if (!e.ctrlKey) sItemSiblings.forEach(el => el.classList.remove('active'));
        }
        // if one or more chip(s) is selected and user clicks out, deselect the selected chips
        else sItems.forEach(el => el.classList.remove('active'));
      });
      // keyboard controls for multiple selectable dropdown
      useEventListener(document, 'keydown', (e) => {
        let activeSItems = [...dropElem.value.querySelectorAll(':scope > .content > .chip.active')];

        if (activeSItems[0]) {
          let prevSibling = activeSItems[0].previousElementSibling;
          let nextSibling = activeSItems.slice(-1)[0].nextElementSibling;

          // deselect items with keyboard when they are selected
          if (e.key === 'Backspace' || e.key === 'Delete') {
            if (e.key == 'Backspace') {
              if (prevSibling) prevSibling.classList.add('active');
              else if (nextSibling) nextSibling.classList.add('active');
            }
            else if (e.key == 'Delete') {
              if (nextSibling) nextSibling.classList.add('active');
              else if (prevSibling) prevSibling.classList.add('active');
            }

            activeSItems.forEach(el => dd_setDeselect(el));
          }
          // navigation within multiple selectable dropdown.
          else if (e.key === 'ArrowRight' && nextSibling) {
            if (nextSibling === searchBox) {
              activeSItems.forEach(el => el.classList.remove('active'));
              searchBox.focus();
              return;
            }
            else if (nextSibling.matches('.chip')) {
              if (!e.shiftKey) activeSItems.forEach(el => el.classList.remove('active'));
              nextSibling.classList.add('active');
            }
          }
          else if (e.key === 'ArrowLeft' && prevSibling && prevSibling.matches('.chip')) {
            if (!e.shiftKey) activeSItems.forEach(el => el.classList.remove('active'));
            prevSibling.classList.add('active');
          }
          else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            activeSItems.forEach(el => el.classList.remove('active'));
            if (e.key === 'ArrowDown') dd_toggleDropdown('activate keyboard controls');
          }
          else if (e.key === ' ' || e.key === 'Enter' /* || e.key === 'Tab' */) activeSItems.forEach(el => el.classList.remove('active'));
        }
        // delete the last chip in multiple dropdown if searchbox is focused-on and seachbox is empty and the backspace key is pressed
        else if (settings.searchable && searchBox.matches(':focus') && !searchBox.value && e.key == 'Backspace' && [...dropElem.value.querySelectorAll(':scope > .content > .chip')][0]) dd_setDeselect([...dropElem.value.querySelectorAll(':scope > .content > .chip')].slice(-1)[0]);
        // navigation in multiple selectable dropdown continues at the following.
        else if ((dropElem.value.matches(':focus') || dropElem.value.querySelectorAll(':scope :focus')[0])) {
          let sItems = [...dropElem.value.querySelectorAll(':scope > .content > .chip')];

          if (sItems[0]) {
            if (e.key == 'ArrowRight') sItems[0].classList.add('active');
            else if (e.key == 'ArrowLeft') sItems.pop().classList.add('active');
          }
        }
      });
      // add the message to show when all item is selected.
      allSelectedMsgBox = dropMenu.querySelector(`:scrope > .ed-msg.all-selected-msg`);
      if (!allSelectedMsgBox) {
        allSelectedMsgBox = document.createElement('div');
        allSelectedMsgBox.classList.add('ed-msg', 'all-selected-msg');
        allSelectedMsgBox.innerHTML = `All available items are selected.`;
        dropMenu.append(allSelectedMsgBox);
      }

      unwatch.allItemSelected = watch(() => tmp.allItemSelected, (selected) => {
        if (selected) allSelectedMsgBox.classList.add('active');
        else allSelectedMsgBox.classList.remove('active');
      });
    }

    /* set select dropdown value for preselected value */
    let items = [...dropMenu.querySelectorAll(selectors.items)];
    if (settings.multipleSelect && items.filter(el => el.matches('.selected'))[0]) items.filter(el => el.matches('.selected')).forEach(el => dd_setSelect(el));
    else if (!settings.multipleSelect && items.filter(el => el.matches('.active'))[0]) dd_setSelect(items.filter(el => el.matches('.active'))[0]);

    // sychronize selectable dropdown value with it modelValue if it is two-way-binded from it parent
    unwatch.modelValue = watch(() => props.modelValue, (newValue) => {
      if (JSON.stringify(newValue) === JSON.stringify(compValue.value)) return;
      let items = [...dropMenu.querySelectorAll(selectors.items)];

      if (settings.multipleSelect) {
        if (!Array.isArray(newValue)) emit('update:modelValue', compValue.value);
        else {
          let modelItems = [];

          newValue.forEach((val) => {
            // avoid selecting an item more than once.
            let pendingItems = items.filter(el => !modelItems.includes(el));
            for (let i = 0; i < pendingItems.length; i++) {
              if (val === (pendingItems[i].getAttribute('data-value') || pendingItems[i].textContent)) {
                modelItems.push(pendingItems[i]);
                break;
              }
            }
          });

          // deselect all items in the multiple selectable drop menu
          items.forEach(item => {
            item.classList.remove('selected');
            item.setAttribute('data-ddid', '');
          });
          tmp.selectionValue = {};
          tmp.selectionContent = [];
          selectableContentBox.classList.add('no-content');

          // select all items that exist in the modelItems
          if (modelItems[0]) {
            modelItems.forEach((item) => {
              let ddid = utils.getUniqueId('ddid');
              let itemValue = item.getAttribute('data-value') || item.textContent;

              item.classList.add('selected');
              tmp.selectionValue[ddid] = itemValue;
              item.setAttribute('data-ddid', ddid);
              tmp.selectionContent.push({
                html: `${item.innerHTML} <i class="svgv1 action close trailing icon"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M480.435-421.652 277.522-219.304q-12.131 12.13-29.392 12.413-17.26.282-28.826-12.848-12.695-12.131-12.478-28.674.217-16.544 12.913-29.674L422.217-480 219.304-683.348q-12.695-12.13-12.695-28.674 0-16.543 12.695-29.674 11.566-12.13 28.826-11.848 17.261.283 29.392 12.414l202.913 202.347L682.478-741.13q12.131-12.131 29.392-12.414 17.26-.282 28.826 11.848 12.695 13.131 12.478 29.674-.217 16.544-11.913 28.674L538.783-480l202.478 201.913q11.696 12.696 11.913 29.457.217 16.76-12.478 28.891-11.566 13.13-28.826 12.848-17.261-.283-29.392-12.413L480.435-421.652Z"/></svg></i>`,
                index: ddid
              });
            });
            selectableContentBox.classList.remove('no-content');
            // check if all items in the dropdown is selected.
            if (!items.filter(el => !el.matches('.selected'))[0]) tmp.allItemSelected = true;
          }

          compValue.value = Object.values(tmp.selectionValue);
        }
      }
      else {
        items.forEach(item => item.classList.remove('active'));
        tmp.selectionContent = undefined;
        compValue.value = undefined;

        let item = items.filter((item) => newValue === (item.getAttribute('data-value') || item.textContent))[0];

        if (item) {
          item.classList.add('active');
          tmp.selectionContent = item.innerHTML;
          compValue.value = newValue;
        }
      }
    }, { immediate: props.modelValue !== undefined });
    unwatch.compValue = watch(compValue, (newValue) => {
      if (JSON.stringify(newValue) === JSON.stringify(props.modelValue)) return;
      emit('update:modelValue', newValue);
    }, { immediate: props.modelValue === undefined });
  }
});

// decide wether to teleport dropdown menu or not
onMounted(() => {
  if (!tmp.dropdownReady) return;
  if (settings.independentMenu) tmp.independentMenu = settings.independentMenu === true || ((!dropElem.value.classList.contains('sub') && !dropElem.value.classList.contains('select')) || settings.browseDm);
  if (tmp.independentMenu) document.body.append(dropMenu);
});

// cache all dropdowns and dropdown menus that can possibly close the dropdown in allExiter variable
let allExiter = [];
// checkerFill is a function that find all sub dropMenu that is linked to it dropdown by id and add it to allExiter array.
function checkerFill(dm) {
  if (dm.querySelectorAll(':scope .sub.dropdown[data-browse-dm]')[0]) {
    [...dm.querySelectorAll(':scope .sub.dropdown[data-browse-dm]')].forEach(el => {
      let newDm = document.querySelector(`.drop.menu[data-ddid="${el.getAttribute('data-ddid')}"]`);
      if (newDm) {
        allExiter.push(newDm);
        checkerFill(newDm);
      }
    });
  }
}
onMounted(() => {
  if (!tmp.dropdownReady) return;
  if (settings.browseDm) allExiter.push(dropElem.value, dropMenu);
  else allExiter.push(dropElem.value);
  checkerFill(dropMenu);
});

// configure how dropdown opens
onMounted(() => {
  if (!tmp.dropdownReady) return;
  // open dropdown if the enter key or arrow down key is pressed while dropdown is focused-on
  useEventListener(document, 'keydown', (e) => {
    if ((e.key == "Enter" || e.key == "ArrowDown") && (dropElem.value.matches(':focus') || dropElem.value.querySelectorAll(':scope :focus')[0]) && !showDropdown.value) {
      e.preventDefault();
      dd_toggleDropdown('activate keyboard controls');
    }
  });

  // get elements that opens dropdown
  let target = settings.findToggler && dropElem.value.querySelectorAll(':scope > .dd-toggler:not(".drop.menu")')[0] ? dropElem.value.querySelectorAll(':scope > .dd-toggler:not(".drop.menu")')[0] : dropElem.value;

  // configure hoverable dropdown to open on mouse-over and touchstart
  if (settings.openOnMouseover) {
    target.addEventListener('mouseenter', dd_toggleDropdown);
    target.addEventListener('touchstart', dd_toggleDropdown);
  }
  // configure clickable dropdown to open on mouse click
  else target.addEventListener('click', dd_toggleDropdown);

  // configure dropdown to be controlled using ddconsole-custom-event. controls include opening and closing dropdown and sub dropdowns
  dropElem.value.addEventListener('ddconsole', (e) => {
    if (e.detail === 'close') showDropdown.value = false;
    else if (e.detail === 'close all ancestor dropdown') dd_toggleDropdown('close-all');
    else if (e.detail === 'open') showDropdown.value = true;
    else if (e.detail === 'open with keyboard') dd_toggleDropdown('activate keyboard controls');
    else if (e.detail.command === 'set hovered item' && e.detail.el) {
      [...dropMenu.querySelectorAll(selectors.items)].forEach(el => el.classList.remove('hovered'));
      setTimeout(() => e.detail.el.classList.add('hovered'), 10);
    }
  });
});

watch(showDropdown, (show) => {
  if (show) {
    if (dropElem.value.matches('.disabled, [disabled]')) return;
    let items = [...dropMenu.querySelectorAll(selectors.items_of_indicating_dropdown)];
    let activeItem = items.filter(el => el.matches('.active'))[0];

    utils.trackEscOn(uniqueId);

    if (settings.searchable) {
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
    dropMenu.classList.add('visible');

    // highlight (add .hover class to) the active item or the first item in the menu list if dropdown is opened with with keyboard keys or it is a searchable dropdown. (default action)
    if (tmp.activateKeyboard) {
      let itemToHover = activeItem || items[0];

      if (itemToHover) {
        itemToHover.classList.add('hovered')
        items.filter(el => el != itemToHover).forEach(el => el.classList.remove('hovered'));
      }
    }

    // auto scroll dropdown-menu to active item position.
    setTimeout(() => {
      if (activeItem) {
        let overflowParent = utils.getParents(activeItem, '', dropMenu).filter(el => (utils.getCssVal(el, 'overflow-y') === 'auto' || utils.getCssVal(el, 'overflow-y') === 'scroll'))[0] || dropMenu;
        let scrollPosition = overflowParent.scrollTop;
        let scrollAmount = activeItem.getBoundingClientRect().top - overflowParent.getBoundingClientRect().top + scrollPosition;

        overflowParent.scrollTop = scrollAmount;
      }
    }, settings.duration + 50);
  }
  else {
    // close all sub-dropdown first
    [...dropMenu.querySelectorAll(':scope .dropdown.active')].forEach(el => utils.triggerEvent(el, 'ddconsole', 'close'));

    document.removeEventListener('click', dd_clickOnDomEvt);
    document.removeEventListener('keyup', dd_escAndTabEvt);
    document.removeEventListener('keydown', dd_KBControlEvt);
    document.removeEventListener('mousemove', dd_mouseMover);
    window.removeEventListener('resize', dd_CalcPosition);
    window.removeEventListener('scroll', dd_CalcPosition, true);
    [...dropMenu.querySelectorAll(selectors.items)].forEach(el => el.classList.remove('hovered'));

    if (settings.searchable) {
      searchBox.removeEventListener('input', dd_searchEvt);
      searchBox.value = '';
      selectableContentBox.classList.remove('filtered');
      selectablePlaceholder.classList.remove('filtered');
    }

    if (settings.openOnMouseover) document.removeEventListener('mousemove', dd_toggleDropdown);

    // safely get out of escape track
    utils.checkEscStatus(uniqueId, true);

    dropMenu.classList.remove('visible');
  }
});

onBeforeUnmount(() => {
  // stop all asynchronous watcher
  Object.keys(unwatch).forEach(el => {
    if (typeof unwatch[el] === 'function') unwatch[el]();
  });
  document.removeEventListener('click', dd_clickOnDomEvt);
  document.removeEventListener('keyup', dd_escAndTabEvt);
  document.removeEventListener('keydown', dd_KBControlEvt);
  document.removeEventListener('mousemove', dd_mouseMover);
  window.removeEventListener('resize', dd_CalcPosition);
  window.removeEventListener('scroll', dd_CalcPosition, true);

  if (settings.openOnMouseover) document.removeEventListener('mousemove', dd_toggleDropdown);
  // return dropMenu to it appropriate location.
  if (dropMenu && !settings.browseDm && !settings.selectable) dropElem.value.append(dropMenu); // return drop menu to the drop down to get it removed also.

  // safely get out of escape track
  utils.checkEscStatus(uniqueId, true);

});

function dd_toggleDropdown(e) {
  if (typeof (e) === 'object') {
    // escape all ex-dropdown classed element from toggling dropdwon
    if ([...dropElem.value.querySelectorAll(':scope > .content > .chip')].filter(el => el.contains(e.target))[0] || (e.target && e.target.closest('.ex-dropdown'))) return;

    if (settings.openOnMouseover) {
      if (e.type === 'mouseenter') {
        document.addEventListener('mousemove', dd_toggleDropdown);
        clearTimeout(tmp.hideDropdownTimeout);
        tmp.showDropdownTimeout = setTimeout(() => {
          if (settings.searchable) dd_toggleDropdown('activate keyboard controls');
          else showDropdown.value = true;
        }, settings.delay / 2);
      }
      else if (e.type === 'mousemove') {
        if (tmp.asdm.filter(el => el.contains(e.target))[0]) {
          tmp.hidingDropdown = false;
          clearTimeout(tmp.hideDropdownTimeout);
          return;
        }
        // prevent tmp.hidingDropdown from triggering more than once.
        if (tmp.hidingDropdown) return;

        tmp.hidingDropdown = true;
        clearTimeout(tmp.showDropdownTimeout);
        tmp.hideDropdownTimeout = setTimeout(() => {
          tmp.hidingDropdown = false;
          showDropdown.value = false;
        }, settings.delay);
      }
      else if (e.type === 'touchstart') {
        // prevent event from interfering with dropMenu items actions.
        if (dropMenu.contains(e.target)) return;

        if (showDropdown.value) {
          clearTimeout(tmp.showDropdownTimeout);
          showDropdown.value = false;
        }
        else {
          document.addEventListener('mousemove', dd_toggleDropdown);
          clearTimeout(tmp.hideDropdownTimeout);
          if (settings.searchable) dd_toggleDropdown('activate keyboard controls');
          else showDropdown.value = true;
        }
      }
    }
    else {
      // prevent event from interfering with dropMenu items actions.
      if (dropMenu.contains(e.target)) return;

      // I don't know why i called e.preventDefault here.
      e.preventDefault();
      // save event data to be used for a setting.page type dropdown dropMenu coordinate when showing it.
      if (settings.page) tmp.evt = e;

      if (showDropdown.value) {
        if (settings.searchable && !dropElem.value.querySelector(':scope .ddico')?.contains(e.target)) {
          searchBox.focus();
          return;
        }

        setTimeout(() => showDropdown.value = false, settings.delay);
      }
      else {
        setTimeout(() => {
          if (settings.searchable) dd_toggleDropdown('activate keyboard controls');
          else showDropdown.value = true;
        }, settings.delay)
      }
    }

    return;
  }
  else if (e === 'activate keyboard controls') {
    tmp.activateKeyboard = true;
    if (showDropdown.value) return;
  }

  if (showDropdown.value) showDropdown.value = false;
  else if (e !== 'close-all') showDropdown.value = true;

  if (e === 'close-all') {
    let pDd = dd_getParentDropdown();
    if (pDd) utils.triggerEvent(pDd, 'ddconsole', 'close all ancestor dropdown');
  };
}

function dd_searchEvt() {
  let items = [...dropMenu.querySelectorAll(selectors.items_of_indicating_dropdown)];
  let filter = searchBox.value.toUpperCase();

  items.forEach(el => {
    if (el.textContent.toUpperCase().trim().indexOf(filter.trim()) !== 0) el.classList.add('filtered');
    else el.classList.remove('filtered');
  });

  items = [...dropMenu.querySelectorAll(selectors.items_filtered)];

  if (!items[0]) {
    [...dropMenu.querySelectorAll(selectors.items)].forEach(el => el.classList.remove('hovered'));

    if (filter && !tmp.allItemFiltered) tmp.allItemFiltered = true;
    else if (!filter && tmp.allItemFiltered) tmp.allItemFiltered = false;
  }
  else if (filter && !dropElem.value.matches('.indicating')) {
    [...dropMenu.querySelectorAll(selectors.items)].forEach(el => el.classList.remove('hovered'));
    items[0].classList.add('hovered');
    tmp.allItemFiltered = false;
  }

  if (settings.multipleSelect) {
    if (filter) {
      selectableContentBox.classList.remove('no-content');
      let sItems = [...dropElem.value.querySelectorAll(':scope > .content > .chip')];
      if (sItems[0]) sItems.forEach(el => el.classList.remove('active'));
    }
    else if (!tmp.selectionContent[0]) selectableContentBox.classList.add('no-content');
  }

  dd_CalcPosition();
}

function dd_clickOnDomEvt(e) {
  let items = [...dropMenu.querySelectorAll(selectors.items)];
  let item = items.filter(el => el.contains(e.target))[0];
  let sItem = [...dropElem.value.querySelectorAll(':scope > .content > .chip')].filter(el => el.contains(e.target))[0];
  let sItemClose = [...dropElem.value.querySelectorAll(':scope > .content > .chip > .close')].filter(el => el.contains(e.target))[0];
  let exiter = dropMenu.contains(e.target) && e.target.closest(selectors.dropdown_exiter);

  // Close when an exiter is clicked or on "Click Out"
  if (exiter || (!dropElem.value.contains(e.target) && !dropMenu.contains(e.target))) showDropdown.value = false;
  // respond when an item is clicked
  else if (item) {
    if (item.matches('.dropdown')) return;

    if (settings.selectable) {
      // deselecting items for multiple select dropdown that has the indicating class
      if (item.matches('.selected')) dd_setDeselect([...dropElem.value.querySelectorAll(':scope > .content > .chip')].filter(el => el.getAttribute('data-ddid') === item.getAttribute('data-ddid'))[0]);
      // select item if dropdown is selectable
      else dd_setSelect(item, (settings.multipleSelect ? true : false));
    }
    // close all dropdown including all sub dropdowns and parent dropdowns if dropdown is [1. set to close on item click and click target is not on .dd-xclose item.], [2. not set to close on item click but target is .dd-close item]
    else if ((settings.closeOnItemClick && !item.matches('.dd-xclose')) || item.matches('.dd-close')) dd_toggleDropdown('close-all');
  }
  else if (sItemClose) dd_setDeselect(sItem);
}

function dd_KBControlEvt(e) {
  let items = [...dropMenu.querySelectorAll(selectors.items_filtered)];
  /*
    The Enter key triggers the click action on an item
    Enter and right arrow key open a sub dropdown that is hovered.
  */
  if (e.key == 'Enter' || e.key == 'ArrowRight') {
    let item = items.filter(el => el.matches('.hovered'))[0];
    if (!item) return;
    if (item.matches('.dropdown:not(.active)')) {
      e.preventDefault();
      utils.triggerEvent(item, 'ddconsole', 'open with keyboard');
    }
    else if (e.key == 'Enter') {
      e.preventDefault();
      item.click();
    }
  }
  // Arrow left key (Use to close a sub dropdown) support
  else if (e.key == 'ArrowLeft' && dropElem.value.matches('.sub') && ![...dropMenu.querySelectorAll(':scope .dropdown.active')][0]) {
    e.preventDefault();
    showDropdown.value = false;
    // I don't know why I used setTimeout here
    if (dropElem.value.matches('.sub') && dd_getParentDropdown()) setTimeout(() => dropElem.value.classList.add('hovered'), 10);
  }
  // Up and down arrrow key navigation on dropdown menu item.
  else if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
    let hvItem = items.filter(el => el.matches('.hovered'))[0];
    let acItem = items.filter(el => el.matches('.active'))[0];

    if (![...dropMenu.querySelectorAll(':scope .dropdown.active')][0]) {
      e.preventDefault();
      // cii is current-item-index
      let cii = (hvItem)
        ? items.indexOf(hvItem)
        : (acItem)
          ? items.indexOf(acItem)
          : -1;
      // nii is new-item-index
      let nii = (e.key == 'ArrowUp')
        ? (cii <= 0)
          ? items.length - 1
          : cii - 1
        : (cii === items.length - 1 || cii < 0)
          ? 0
          : cii + 1;
      // ci is new-current-item
      let ci = items[nii];

      /* Enable scroll of overflow parent to hovered-item to make the hovered item visible */
      if (ci) {
        // auto scroll dropdown-menu to active item position.
        let overflowParent = utils.getParents(ci, '', dropMenu).filter(el => (utils.getCssVal(el, 'overflow-y') === 'auto' || utils.getCssVal(el, 'overflow-y') === 'scroll'))[0] || dropMenu;
        let scrollPosition = overflowParent.scrollTop;
        let overflowParentHeight = overflowParent.clientHeight;
        let ciHeight = ci.offsetHeight;
        let ciTop = ci.getBoundingClientRect().top - overflowParent.getBoundingClientRect().top + scrollPosition;
        let availSpace = scrollPosition + overflowParentHeight - ciTop;
        let scrollAmount = (e.key == 'ArrowUp')
          ? ((nii === items.length - 1 && ciHeight > availSpace) || scrollPosition > ciTop)
            ? ciTop
            : ciTop > (scrollPosition + overflowParentHeight - ciHeight)
              ? ciTop - overflowParentHeight + (ciHeight * 2)
              : undefined
          : (e.key == 'ArrowDown')
            ? ((nii === 0 && scrollPosition > ciTop) || ciHeight > availSpace)
              ? scrollPosition + ciHeight - availSpace
              : scrollPosition > ciTop
                ? ciTop - ciHeight
                : undefined
            : undefined;

        overflowParent.scrollTop = scrollAmount;

        items.forEach(el => el.classList.remove('hovered'));
        ci.classList.add('hovered');
        if (settings.selectable && !settings.multipleSelect) dd_setSelect(ci, true);
      }
    }

    document.addEventListener('mousemove', dd_mouseMover);
  }
}

function dd_escAndTabEvt(e) {
  // you should use an Escape tracker here to stop other plugins like modal from triggering close on escape press if the dropdown is opened down.
  if (e.key === 'Escape' && utils.checkEscStatus(uniqueId)) {
    // I don't know why preventDefault is called here.
    e.preventDefault();
    showDropdown.value = false;
    // set sub dropdown to current hovered item in it parent dropdown.
    // I don't know why I used setTimeout here
    if (dropElem.value.matches('.sub') && dd_getParentDropdown()) setTimeout(() => dropElem.value.classList.add('hovered'), 10);
  }
  else if (e.key === 'Tab' && ![...dropElem.value.querySelectorAll(':scope :focus')][0] && ![...dropMenu.querySelectorAll(':scope :focus')][0] && ![...dropMenu.querySelectorAll(':scope .dropdown.active')][0]) {
    // i don't know why preventDefault is called here.
    e.preventDefault();
    dd_toggleDropdown('close-all');
  }
}

function dd_CalcPosition() {
  // position dropdown relative to window
  if (settings.page) {
    let coords = {
      left: tmp.evt.clientX || 0,
      top: tmp.evt.clientY || 0,
      right: undefined, bottom: undefined,
    };

    coords.right = document.documentElement.clientWidth - coords.left;
    coords.bottom = document.documentElement.clientHeight - coords.top;
    dropMenu.style.right = 'auto';
    dropMenu.style.bottom = 'auto';

    if (coords.right >= dropMenu.offsetWidth) {
      dropMenu.style.left = coords.left;
      dropMenu.classList.add('rhs');
    }
    else if (coords.left >= dropMenu.offsetWidth) {
      dropMenu.style.left = coords.left - dropMenu.offsetWidth;
      dropMenu.classList.add('lhs');
    }
    else if (coords.right >= coords.left) {
      dropMenu.classList.add('rhs');
      if (coords.right + coords.left >= dropMenu.offsetWidth) dropMenu.style.left = document.documentElement.clientWidth - dropMenu.offsetWidth;
      else {
        dropMenu.style.left = 0;
        dropMenu.style.maxWidth = document.documentElement.clientWidth;
      }
    }
    else {
      dropMenu.classList.add('lhs');
      dropMenu.style.left = 0;
      if (coords.right + coords.left < dropMenu.offsetWidth) dropMenu.style.maxWidth = document.documentElement.clientWidth;
    }

    if (coords.bottom >= dropMenu.offsetHeight) {
      dropMenu.style.top = coords.top;
      dropMenu.classList.add('downward');
    }
    else if (coords.top >= dropMenu.offsetHeight) {
      dropMenu.style.top = coords.top - dropMenu.offsetHeight;
      dropMenu.classList.add('upward');
    }
    else if (coords.bottom >= coords.top) {
      dropMenu.classList.add('downward');
      if (coords.bottom + coords.top >= dropMenu.offsetHeight) dropMenu.style.top = document.documentElement.clientHeight - dropMenu.offsetHeight;
      else {
        dropMenu.style.top = 0;
        dropMenu.style.maxHeight = document.documentElement.clientHeight;
      }
    }
    else {
      dropMenu.classList('upward');
      dropMenu.style.top = 0;
      if (coords.bottom + coords.top < dropMenu.offsetHeight) dropMenu.style.maxWidth = document.documentElement.clientHeight;
    }
  }
  else {
    let rects = {
      dd: dropElem.value.getBoundingClientRect(),
      dm: {
        width: dropMenu.offsetWidth,
        height: dropMenu.offsetHeight,
      },
      window: {
        width: window.innerWidth - utils.getScrollbarWidth(),
        height: window.innerHeight,
      }
    };
    let spacing;

    if (settings.view === "vertical") {
      spacing = {
        top: rects.dd.top,
        bottom: rects.window.height - rects.dd.top - rects.dd.height,
        left: rects.dd.left + rects.dd.width,
        right: rects.window.width - rects.dd.left,
      };
      rects.dm = {
        ...rects.dm,
        ...{
          left: rects.dd.left + rects.dd.width - rects.dm.width,
          right: rects.dd.left,
          top: rects.dd.top - rects.dm.height,
          bottom: rects.dd.top + rects.dd.height,
        },
      };
    }
    else {
      spacing = {
        top: rects.dd.top + rects.dd.height,
        bottom: rects.window.height - rects.dd.top,
        left: rects.dd.left,
        right: rects.window.width - rects.dd.left - rects.dd.width,
      };
      rects.dm = {
        ...rects.dm,
        ...{
          left: rects.dd.left - rects.dm.width,
          right: rects.dd.left + rects.dd.width,
          top: rects.dd.top + rects.dd.width - rects.dm.height,
          bottom: rects.dd.top,
        }
      };
    }

    if (settings.directionPriority.x === 'right') {
      if (spacing.right >= rects.dm.width || spacing.right >= spacing.left || rects.dm.width > spacing.left) {
        if (tmp.independentMenu) dropMenu.style.left = `${rects.dm.right}px`;
        if (!dropMenu.classList.contains('rhs')) {
          dropMenu.classList.add('rhs');
          dropMenu.classList.remove('lhs');
        }
      }
      else {
        if (tmp.independentMenu) dropMenu.style.left = `${rects.dm.left}px`;
        if (!dropMenu.classList.contains('lhs')) {
          dropMenu.classList.add('lhs');
          dropMenu.classList.remove('rhs');
        }
      }
    }
    else if (settings.directionPriority.x === 'center' && settings.view === "vertical") {
      dropMenu.style.left = `${Math.max(Math.min(Math.max(0, rects.dd.left + (rects.dd.width / 2) - (rects.dm.width / 2)), (rects.window.width - rects.dm.width)), 0)}px`;
    }
    else {
      if (spacing.left >= rects.dm.width) {
        if (tmp.independentMenu) dropMenu.style.left = `${rects.dm.left}px`;
        if (!dropMenu.classList.contains('lhs')) {
          dropMenu.classList.add('lhs');
          dropMenu.classList.remove('rhs');
        }
      }
      else {
        if (tmp.independentMenu) dropMenu.style.left = `${rects.dm.right}px`;
        if (!dropMenu.classList.contains('rhs')) {
          dropMenu.classList.add('rhs');
          dropMenu.classList.remove('lhs');
        }
      }
    }

    if (settings.directionPriority.y === 'bottom') {
      if (spacing.bottom >= rects.dm.height || spacing.bottom >= spacing.top || rects.dm.height > spacing.top) {
        if (tmp.independentMenu) dropMenu.style.top = `${rects.dm.bottom}px`;
        if (!dropMenu.classList.contains('downward')) {
          dropMenu.classList.add('downward');
          dropMenu.classList.remove('upward');
        }
      }
      else {
        if (tmp.independentMenu) dropMenu.style.top = `${rects.dm.top}px`;
        if (!dropMenu.classList.contains('upward')) {
          dropMenu.classList.add('upward');
          dropMenu.classList.remove('downward');
        }
      }
    }
    else if (settings.directionPriority.y === 'center' && settings.view === "horizontal") {
      dropMenu.style.top = `${Math.max(Math.min(Math.max(0, rects.dd.top + (rects.dd.height / 2) - (rects.dm.height / 2)), (rects.window.height - rects.dm.height)), 0)}px`;
    }
    else {
      if (spacing.top >= rects.dm.height) {
        if (tmp.independentMenu) dropMenu.style.top = `${rects.dm.top}px`;
        if (!dropMenu.classList.contains('upward')) {
          dropMenu.classList.add('upward');
          dropMenu.classList.remove('downward');
        }
      }
      else {
        if (tmp.independentMenu) dropMenu.style.top = `${rects.dm.bottom}px`;
        if (!dropMenu.classList.contains('downward')) {
          dropMenu.classList.add('downward');
          dropMenu.classList.remove('upward');
        }
      }
    }

    // set arrow position variable
    if (settings.view === "vertical") {
      if (dropMenu.classList.contains('lhs')) dropMenu.style.setProperty('--arrow-center', `${rects.dm.width - rects.dd.width/2}px`);
      else if (dropMenu.classList.contains('rhs')) dropMenu.style.setProperty('--arrow-center', `${rects.dd.width/2}px`);
      else dropMenu.style.setProperty('--arrow-center', `${rects.dd.left - rects.dm.left + (rects.dd.width/2)}px`);
    }
    else {
      if (dropMenu.classList.contains('upward')) dropMenu.style.setProperty('--arrow-center', `${rects.dm.height - rects.dd.height/2}px`);
      else if (dropMenu.classList.contains('downward')) dropMenu.style.setProperty('--arrow-center', `${rects.dd.height/2}px`);
      else dropMenu.style.setProperty('--arrow-center', `${rects.dd.top + (rects.dd.height/2) - rects.dm.top}px`);
    }
  }
}

// this function cancels active keyboard control on dropdown and enable mouse control.
function dd_mouseMover(e) {
  let items = [...dropMenu.querySelectorAll(selectors.items_of_indicating_dropdown)];

  if (dropElem.value.contains(e.target) || dropMenu.contains(e.target)) {
    let item = items.filter(el => el.contains(e.target))[0];
    if (!item) {
      items.forEach(el => el.classList.remove('hovered'));
      return;
    }
    item.classList.add('hovered');
    items.filter(el => el !== item).forEach(el => el.classList.remove('hovered'));
  }
  else if (settings.openOnMouseover) showDropdown.value = false;
  else items.forEach(el => el.classList.remove('hovered'));
}

// this function returns the ancestor dropdown of a sub-dropdown
function dd_getParentDropdown() {
  let pDd = utils.getParents(dropElem.value, '.drop.menu')[0];
  pDd = utils.getParents(dropElem.value, '.dropdown')[0] || (pDd && pDd.getAttribute('id'))
    ? [...document.querySelectorAll(`[data-browse-dm="${pDd.getAttribute('id')}"]`)].filter(el => el.matches('.dropdown'))[0]
    : undefined;
  return pDd;
}

// this function set an item as selected in a selectable dropdown
// xClose means don't close dropdown after selection.
function dd_setSelect(item, xClose) {
  if (!item || !settings.selectable) return;

  let items = [...dropMenu.querySelectorAll(selectors.items)];

  if (settings.multipleSelect) {
    let itemIndex = items.indexOf(item);
    let ddid = utils.getUniqueId('ddid');
    let itemValue = item.getAttribute('data-value') || item.textContent;

    item.classList.add('selected');
    tmp.selectionValue[ddid] = itemValue;
    compValue.value = Object.values(tmp.selectionValue);
    item.setAttribute('data-ddid', ddid);
    tmp.selectionContent.push({
      html: `${item.innerHTML} <i class="svgv1 action close trailing icon"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M480.435-421.652 277.522-219.304q-12.131 12.13-29.392 12.413-17.26.282-28.826-12.848-12.695-12.131-12.478-28.674.217-16.544 12.913-29.674L422.217-480 219.304-683.348q-12.695-12.13-12.695-28.674 0-16.543 12.695-29.674 11.566-12.13 28.826-11.848 17.261.283 29.392 12.414l202.913 202.347L682.478-741.13q12.131-12.131 29.392-12.414 17.26-.282 28.826 11.848 12.695 13.131 12.478 29.674-.217 16.544-11.913 28.674L538.783-480l202.478 201.913q11.696 12.696 11.913 29.457.217 16.76-12.478 28.891-11.566 13.13-28.826 12.848-17.261-.283-29.392-12.413L480.435-421.652Z"/></svg></i>`,
      index: ddid
    });
    selectableContentBox.classList.remove('no-content');

    if (settings.searchable && showDropdown.value) {
      searchBox.value = '';
      utils.triggerEvent(searchBox, 'input');
      searchBox.focus();
    }

    if (!items.filter(el => !el.matches('.selected'))[0]) tmp.allItemSelected = true;

    if (!showDropdown.value || dropElem.value.matches('.indicating')) return;

    item.classList.remove('hovered');

    if (!settings.searchable) {
      let next = items.filter((el, i) => i > itemIndex && !el.matches('.selected'))[0];
      let prev = items.filter((el, i) => i < itemIndex && !el.matches('.selected')).slice(-1)[0];
      if (next) next.classList.add('hovered');
      else if (prev) prev.classList.add('hovered');
    }

    dd_CalcPosition();
  }
  else {
    item.classList.add('active');
    if (!showDropdown.value && items.filter(el => el !== item && el.matches('.active'))[0]) console.warn("A selection-dropdown on this page has multiple preselected value which is not suppose to be except it is a multiple-selection-dropdown. Only the first preselected value will be preselected.");

    items.filter(el => el !== item).forEach(el => el.classList.remove('active'));
    compValue.value = item.getAttribute('data-value') || item.textContent;
    tmp.selectionContent = item.innerHTML;
  }

  if (xClose) return;

  if (settings.searchable) {
    searchBox.value = '';
    utils.triggerEvent(searchBox, 'input');
  }

  showDropdown.value = false;
}

// this function de-select an item in a selection dropdown.
function dd_setDeselect(sItem) {
  if (!settings.multipleSelect) return;

  let ddid = sItem.getAttribute('data-ddid');
  let item = [...dropMenu.querySelectorAll(`:scope [data-ddid="${ddid}"]`)][0];

  delete tmp.selectionValue[ddid];
  compValue.value = Object.values(tmp.selectionValue);
  item.classList.remove('selected');
  item.setAttribute('data-ddid', '');
  tmp.selectionContent = tmp.selectionContent.filter(el => el.index !== ddid);

  if (tmp.allItemSelected) tmp.allItemSelected = false;
  if (!tmp.selectionContent[0]) selectableContentBox.classList.add('no-content');

  if (showDropdown.value) {
    if (settings.searchable) {
      searchBox.value = '';
      utils.triggerEvent(searchBox, 'input');
    }

    dd_CalcPosition();
  }

  if (settings.searchable) searchBox.focus();
}
</script>

<template>
  <div ref="dropdown" class="dropdown" :data-ddid="uniqueId" :class="{ active: showDropdown }"
    :tabindex="settings.selectable ? 0 : null">
    <slot></slot>
    <template v-if="settings.selectable">
      <div v-if="settings.multipleSelect" ref="sContent" class="content no-content">
        <div v-for="item in tmp.selectionContent" :key="item.index" :data-ddid="item.index" v-html="item.html"
          class="chip"></div>
        <template v-if="settings.searchable">
          <input ref="searchBox" class='ssbox' autocomplete='off' tabindex='0'>
          <span ref="sbsizer" class='ddmss'></span>
        </template>
        <div ref="sPlaceholder" class="placeholder">{{ placeholder }}</div>
      </div>
      <template v-else>
        <template v-if="settings.searchable">
          <input ref="searchBox" class='ssbox' autocomplete='off' tabindex='0'>
          <span ref="sbsizer" class='ddmss'></span>
        </template>
        <div ref="sContent" v-html="tmp.selectionContent" class="content"></div>
        <div ref="sPlaceholder" class="placeholder">{{ placeholder }}</div>
      </template>
      <button v-if="$attrs.class.split(' ').includes('select')" ref="ddIcon" class="ddico icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
          <path
            d="m480-222.609 108.913-108.913q13.202-12.696 30.21-12.696 17.007 0 29.138 13.299 12.13 11.734 12.13 29.552 0 17.817-11.13 29.758L509.957-132.87q-6.023 6.131-14.118 9.414-8.095 3.282-16.035 3.282-7.941 0-15.858-3.282-7.918-3.283-12.903-9.414L311.739-271.609q-12.13-12.071-12.13-29.927 0-17.855 12.233-29.769 12.234-12.913 29.834-12.63 17.6.283 29.976 12.413L480-222.609Zm0-512.651L371.087-626.348q-13.202 12.696-30.21 12.696-17.007 0-29.138-13.299-12.13-12.299-12.13-30.116 0-17.818 12.13-30.194l139.304-139.304q5.019-5.182 13.11-9.222 8.09-4.039 16.026-4.039 7.935 0 15.892 4.039 7.957 4.04 13.886 9.222l139.304 139.304q11.13 12.507 11.13 30.362 0 17.856-12.233 30.334-12.234 12.913-29.957 12.348-17.723-.565-29.853-12.696L480-735.26Z" />
        </svg>
      </button>
      <input ref="sInput" :value="compValue" type="hidden" :name="name">
    </template>
    <slot name="trailing"></slot>
  </div>
</template>