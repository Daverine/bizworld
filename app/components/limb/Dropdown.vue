<script setup lang="ts">
import type { WatchStopHandle } from "vue";

type MultipleSelectContent = {
  html: string;
  val: string;
  ddid: string;
};
type Options = {
  delay?: number;
  closeOnItemClick: boolean;
  teleportDropdown?: boolean;
  constrainWidth?: boolean;
  stretchWidth?: boolean;
  findTrigger?: boolean;
  page?: boolean;
  view: "unset" | "vertical" | "horizontal";
  directionPriority: {
    x?: "left" | "right" | "center";
    y?: "top" | "bottom" | "center";
  };
  arrowKeyNavigation?: boolean;
  dismisser?: string;
};
type Brainbox = Options & {
  namespace: string;
  transitionDuration?: number;
  openOnHover: boolean;
  isSelect?: boolean;
  selectable?: boolean;
  multipleSelect?: boolean;
  searchable?: boolean;
  activateKeyboard: boolean;
  hidingDropdown: boolean;
  showDropdownTimeout?: ReturnType<typeof setTimeout>;
  hideDropdownTimeout?: ReturnType<typeof setTimeout>;
  // event data to be used for a bb.page dropdown coordinates.
  pageEvent?: MouseEvent;
};

// get dd-Toggler element and necessary dropdown properties
const ddRef = useTemplateRef("dd-toggler");
const model = defineModel<string[] | string>({
  get(value) {
    return value ?? (bb.multipleSelect ? [] : "");
  },
});
const props = defineProps<{
  name?: string;
  placeholder?: string;
  dataTarget?: string;
  options?: Partial<Options>;
  sub?: boolean;
  boundless?: boolean;
  openOnHover?: boolean;
  type?:
    | "select"
    | "selection"
    | "multiple select"
    | "multiple selection"
    | "search select"
    | "search selection"
    | "search multiple select"
    | "search multiple selection";
  searchData?: string[] | any[];
  filterFunction?: (query: string, item: any[]) => any[];
}>();
const emit = defineEmits<{
  change: [value?: string[] | string];
}>();
const showDropdown = ref(false);

// setup dropdown brainbox
const bb: Brainbox = {
  namespace: "dropdown",
  closeOnItemClick: true,
  openOnHover: false,
  view: "unset",
  directionPriority: {
    x: "right",
    y: "bottom",
  },
  activateKeyboard: false,
  hidingDropdown: false,
  arrowKeyNavigation: true,
  dismisser: ".exit-dd, .item:not(.xhover, .disabled, [disabled], .dd-xclose)",
  ...props.options,
};
const dropdownType = props.type?.split(" ");
bb.isSelect = dropdownType?.includes("select");
bb.selectable = bb.isSelect || dropdownType?.includes("selection");
bb.multipleSelect = bb.selectable && dropdownType?.includes("multiple");
bb.searchable = bb.selectable && (dropdownType?.includes("search") || props.boundless);
bb.openOnHover = props.openOnHover || (props.sub && props.openOnHover !== false);
bb.page = bb.page && !props.sub && !bb.openOnHover;
// dropdown direction priority
bb.directionPriority.x = bb.directionPriority.x ?? "right";
bb.directionPriority.y = bb.directionPriority.y ?? "bottom";
// contrain dropdown width to the width of dropdown if bb.constrainWidth is true or dropdown has class select
bb.stretchWidth = props.options?.stretchWidth ?? bb.isSelect;
// teleport dropdown if it was specified to do so, or if dropElem is not a sub-dropdown and not a select-dropdown and the dropDown is not browsed-for.
bb.teleportDropdown = bb.teleportDropdown ?? (!props.sub && !bb.isSelect && !props.dataTarget);

if (bb.delay === undefined) bb.delay = bb.openOnHover ? 300 : 0;

if (bb.view === "unset") bb.view = props.sub ? "horizontal" : "vertical";

// create reactive brain-box
const rbb = reactive<{
  selectContent: string;
  mSelectContent: MultipleSelectContent[];
  allItemSelected: boolean;
  allItemFiltered: boolean;
  dropdownId: string;
}>({
  selectContent: "",
  mSelectContent: [],
  allItemSelected: false,
  allItemFiltered: false,
  dropdownId: "",
});

const searchQuery = ref("");
const filteredData = ref<any[]>([]);
let sizeStream: ResizeObserver;

// set up selectors for dropdown items
const optionSelectors = {
  items: `:scope [role="option"]:not(.xhover, .disabled, [disabled])`,
  items_of_indicating_dropdown: `\
    :scope.indicating [role="option"]:not(.xhover, .disabled, [disabled]), \
    :scope:not(.indicating) [role="option"]:not(.xhover, .disabled, [disabled], .selected) \
    `,
  items_filtered: `\
    :scope.indicating [role="option"]:not(.xhover, .disabled, [disabled], .hidden), \
    :scope:not(.indicating) [role="option"]:not(.xhover, .disabled, [disabled], .hidden, .selected) \
    `,
};
const unwatch: Record<string, WatchStopHandle> = {};
let uniqueId = "";
let dropDown: HTMLElement,
  selectableContentBox: HTMLElement,
  selectablePlaceholder: HTMLElement,
  searchBox: HTMLInputElement,
  searchBoxSizer: HTMLElement,
  allFilteredMsgBox: HTMLElement,
  allSelectedMsgBox: HTMLElement,
  userDefinedOption: HTMLElement,
  teleportationPlaceholder: Comment;
let ddFamily: Element[] = [];

onMounted(async () => {
  let ddElem = ddRef.value! as HTMLElement;
  // get dropdown element,set-it-up and generate uniqueId
  let ddm = props.dataTarget
    ? document.getElementById(props.dataTarget)
    : ddElem.querySelector(":scope > .dropdown")
      ? ddElem.querySelector(":scope > .dropdown")
      : ddElem.nextElementSibling?.matches(".dropdown")
        ? ddElem.nextElementSibling
        : null;
  // check if dropdown exist
  if (!ddm) {
    console.error(ddElem, "A selection dropdown is missing for this toggler");
    return;
  }

  dropDown = ddm as HTMLElement;
  uniqueId = utils.getUniqueId(bb.namespace);
  rbb.dropdownId = dropDown.id || uniqueId;
  dropDown.id = rbb.dropdownId;
  dropDown.role = bb.selectable ? "listbox" : "menu";
  if (!dropDown.hasAttribute("tabindex")) dropDown.tabIndex = -1;
  if (bb.multipleSelect) dropDown.ariaMultiSelectable = "true";
  dropDown.dataset.view = bb.view;
  dropDown.dataset.ddid = uniqueId;
  if (bb.page) dropDown.classList.add("fixed");
  if (ddElem?.classList.contains("indicating")) dropDown.classList.add("indicating");
  bb.transitionDuration = utils.durationInMilliseconds(
    utils.getCssVal(dropDown, "transition-duration"),
  );

  // configure dropdown to be selectable and searchable if that what it is.
  if (bb.selectable) {
    // cache all concurrent elements for selectable dropdown
    selectableContentBox = ddElem.querySelector(":scope .content") as HTMLElement;
    selectablePlaceholder = ddElem.querySelector(":scope .placeholder") as HTMLElement;

    // create a user-defined item for boundless selectable dropdown
    if (props.boundless) {
      userDefinedOption = dropDown.querySelector(":scope > .item.user-defined") as HTMLElement;

      if (!userDefinedOption) {
        userDefinedOption = document.createElement("div");
        userDefinedOption.classList.add("item", "user-defined");
        userDefinedOption.role = "option";
        dropDown.prepend(userDefinedOption);
      }
    }

    // configure search box and cache concurrent element for searchable dropdown
    if (bb.searchable) {
      searchBox = ddElem.querySelector(":scope .ssbox") as HTMLInputElement;
      searchBoxSizer = ddElem.querySelector(":scope .ddss") as HTMLElement;

      // add the message to show when no search result is found.
      allFilteredMsgBox = dropDown.querySelector(
        ":scope > .ed-msg.all-filtered-msg",
      ) as HTMLElement;

      if (!allFilteredMsgBox) {
        allFilteredMsgBox = document.createElement("div");
        allFilteredMsgBox.classList.add("ed-msg", "all-filtered-msg");
        allFilteredMsgBox.textContent = `No result found.`;
        dropDown.append(allFilteredMsgBox);
      }

      unwatch.allItemFiltered = watchEffect(() => {
        if (rbb.allItemFiltered) allFilteredMsgBox.classList.add("active");
        else allFilteredMsgBox.classList.remove("active");
      });

      // open dropdown if user typed in the searchBox. And resize searchBox according to it content.
      searchBox.addEventListener("input", () => {
        if (props.boundless) userDefinedOption.textContent = searchBox.value;

        if (searchBox.value) {
          selectablePlaceholder.classList.add("hidden");
          if (!bb.multipleSelect) selectableContentBox.classList.add("hidden");
        } else {
          selectablePlaceholder.classList.remove("hidden");
          if (!bb.multipleSelect) selectableContentBox.classList.remove("hidden");
        }

        searchBoxSizer.textContent = searchBox.value;
        utils.afterNextRepaint(() => (searchBox.style.width = searchBoxSizer.clientWidth + "px"));
        if (!showDropdown.value) {
          bb.activateKeyboard = true;
          showDropdown.value = true;
        }
      });
    }

    if (bb.multipleSelect) {
      // click controls for multiple selectable dropdown
      document.addEventListener("click", ms_clickEvt);
      // keyboard controls for multiple selectable dropdown
      document.addEventListener("keydown", ms_keyEvt);

      // add the message to show when all item is selected.
      allSelectedMsgBox = ddElem.querySelector(":scope > .ed-msg.all-selected-msg") as HTMLElement;

      if (!allSelectedMsgBox) {
        allSelectedMsgBox = document.createElement("div");
        allSelectedMsgBox.classList.add("ed-msg", "all-selected-msg");
        allSelectedMsgBox.textContent = `All available items are selected.`;
        dropDown.append(allSelectedMsgBox);
      }

      unwatch.allItemSelected = watchEffect(() => {
        if (rbb.allItemSelected) allSelectedMsgBox.classList.add("active");
        else allSelectedMsgBox.classList.remove("active");
      });
    }

    /* set select dropdown value for preselected value */
    let items = [...dropDown.querySelectorAll(optionSelectors.items)];
    if (bb.multipleSelect && items.some((el) => el.matches(".selected")))
      items.filter((el) => el.matches(".selected")).forEach((el) => dd_setSelect(el));
    else if (!bb.multipleSelect && items.some((el) => el.matches(".active")))
      dd_setSelect(items.find((el) => el.matches(".active"))!);

    unwatch.model = watch(model, (newModel) => modelEffect(newModel), { immediate: true });
  }

  // decide wether to teleport dropdown or not
  if (bb.teleportDropdown) {
    teleportationPlaceholder = document.createComment(`teleportation placeholder for ${uniqueId}`);
    dropDown.parentElement?.insertBefore(teleportationPlaceholder, dropDown);
    document.body.append(dropDown);
  }

  // get all dd-togglers and dropdowns that are related directly or indirectly
  // the ddFamily variable is used to close all dropdowns that is linked to the current dropdown when the current dropdown is closed.
  ddFamily.push(ddElem as HTMLElement, dropDown);
  checkerFill(dropDown);

  // configure how dropdown opens
  // open dropdown if the enter key, spacebar key or arrow down key is pressed while dropdown is focused-on
  document.addEventListener("keydown", dd_keyEvt);

  // configure hoverable dropdown to open on mouse-over and touchstart
  if (bb.openOnHover) {
    ddElem.addEventListener("mouseenter", dd_toggleHandler);
    ddElem.addEventListener("touchstart", dd_toggleHandler);
  }
  // configure clickable dropdown to open on mouse click
  else ddElem.addEventListener("click", dd_toggleHandler);

  // configure dropdown to be controlled using ddconsole-custom-event. controls include opening and closing dropdown and sub dropdowns
  ddElem.addEventListener("ddconsole", ((e: CustomEvent) => {
    if (e.detail === "close") showDropdown.value = false;
    else if (e.detail === "close all ancestor dropdown") dd_closeWithAncestor();
    else if (e.detail === "open") showDropdown.value = true;
    else if (e.detail === "open with keyboard") {
      bb.activateKeyboard = true;
      showDropdown.value = true;
    }
  }) as EventListener);

  if (bb.constrainWidth || bb.stretchWidth)
    sizeStream = new ResizeObserver(() => {
      let dd_width = ddElem.getBoundingClientRect().width;
      if (bb.constrainWidth) dropDown.style.maxWidth = `${dd_width}px`;
      if (bb.stretchWidth) dropDown.style.minWidth = `${dd_width}px`;
    });
});

// checkerFill is a function that find all sub dropDown that is linked to it dropdown by id and add it to ddFamily array.
function checkerFill(dm: Element) {
  if (dm.querySelectorAll(":scope .sub.dd-toggler[data-target]")[0]) {
    [...dm.querySelectorAll(":scope .sub.dd-toggler[data-target]")].forEach((el) => {
      let newDm = document.querySelector(`.dropdown[data-ddid="${el.getAttribute("data-ddid")}"]`);
      if (newDm) {
        ddFamily.push(newDm);
        checkerFill(newDm);
      }
    });
  }
}

async function modelEffect(newModel: typeof model.value) {
  await nextTick();

  let items = [...dropDown.querySelectorAll(optionSelectors.items)] as HTMLElement[];

  if (bb.multipleSelect) {
    rbb.mSelectContent = [];
    selectableContentBox.classList.add("no-content");

    if (!Array.isArray(newModel)) {
      console.error(
        ddRef.value,
        "Model value for multiple selectable dropdown must be an array. Please provide an array as model value.",
      );
    } else {
      let boundValue = items.map((item) => item.dataset.value || item.textContent);

      newModel.forEach((item) => {
        selectableContentBox.classList.remove("no-content");
        if (boundValue.includes(item))
          rbb.mSelectContent.push({
            html: "",
            val: "",
            ddid: "",
          });
        else {
          let ddid = utils.getUniqueId("ddid");

          rbb.mSelectContent.push({
            html: item,
            val: item,
            ddid: ddid,
          });
          if (!props.boundless)
            console.warn(
              ddRef.value,
              item,
              "There's no item that match this value in it dropdown.",
            );
        }
      });

      // go through all items in the multiple selectable dropdown to justify there selection.
      items.forEach((item) => {
        let itemValue = item.dataset.value || item.textContent;
        let ddid = item.dataset.ddid ?? utils.getUniqueId("ddid");

        if (newModel!.includes(itemValue)) {
          item.classList.add("selected");

          let index = newModel!.indexOf(itemValue);

          if (rbb.mSelectContent.every((el) => el.val !== itemValue))
            rbb.mSelectContent.splice(index, 1, {
              html: item.innerHTML,
              val: itemValue,
              ddid: ddid,
            });
          else {
            let content = rbb.mSelectContent.find((el) => el.val === itemValue);

            if (content && content?.ddid !== ddid) {
              console.warn(
                ddRef.value,
                "There are items with same value in the selection dropdown.",
              );
              ddid = content.ddid;
            }
          }
        } else item.classList.remove("selected");

        item.dataset.ddid = ddid;
      });

      // check if all items in the dropdown is selected.
      if (items.every((el) => el.classList.contains("selected"))) rbb.allItemSelected = true;
      else rbb.allItemSelected = false;
    }
  } else {
    items.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    rbb.selectContent = "";

    if (newModel) {
      if (typeof newModel !== "string")
        console.error(
          ddRef.value,
          "Model value for selectable dropdown must be a string. Please provide a string as model value.",
        );
      else {
        let item = items.find((el) => (el.dataset.value || el.textContent) === newModel);

        if (item) {
          item.classList.add("active");
          item.setAttribute("aria-selected", "true");
          rbb.selectContent = item.innerHTML;
        } else {
          rbb.selectContent = newModel;

          if (!props.boundless)
            console.warn(
              ddRef.value,
              newModel,
              items,
              "There's no item that match the selection dropdown value.",
            );
        }
      }
    }
  }

  if (showDropdown) {
    await utils.afterNextRepaint();
    dd_CalcPosition();
  }
}

async function openDropdown() {
  if (ddRef.value!.matches(".disabled, [disabled]")) {
    showDropdown.value = false;
    return;
  }

  // observe sizeStream if (bb.constrainWidth || bb.stretchWidth) is true
  sizeStream?.observe(ddRef.value!);

  // register dropdown as to when it will respond Escape key press
  utils.trackEscOn(uniqueId);

  if (bb.selectable) await modelEffect(model.value);

  document.addEventListener("click", dd_clickOnDomEvt);
  document.addEventListener("keydown", dd_KBControlEvt);
  window.addEventListener("resize", dd_CalcPosition);
  window.addEventListener("scroll", dd_CalcPosition, true);
  document.addEventListener("mousemove", dd_mouseMover);

  dd_CalcPosition();
  dropDown.style.visibility = "visible";
  dropDown.classList.add("visible");
  dropDown.focus();

  // highlight the right item when dropdown is opened with keyboard

  if (bb.selectable) {
    let options = [
      ...dropDown.querySelectorAll(optionSelectors.items_of_indicating_dropdown),
    ] as HTMLElement[];
    let activeOption = options.find((el) => el.matches(".active"));
    if (props.boundless && !bb.multipleSelect && activeOption)
      searchBox.value = activeOption.textContent;

    if (bb.activateKeyboard) {
      bb.activateKeyboard = false;

      let optionToHover = activeOption ?? options[0];
      if (optionToHover) {
        optionToHover.classList.add("hovered");
        dropDown.setAttribute("aria-activedescendant", optionToHover.textContent);
        options.filter((el) => el != optionToHover).forEach((el) => el.classList.remove("hovered"));
      }
    }

    if (bb.searchable) {
      searchBox.focus();
      // what to do when searching in a dropdown box
      searchBox.addEventListener("input", dd_searchEvt);
      utils.triggerEvent(searchBox, "input");
    }

    await utils.delay(bb.transitionDuration! + 50);
    // auto scroll dropdown to active item position in selectable dropdown.
    activeOption?.scrollIntoView({ block: "nearest" });
  } else if (bb.activateKeyboard) {
    bb.activateKeyboard = false;

    let focusable = utils.getFocusableElementsFrom(dropDown)[0];

    if (focusable) {
      focusable.focus();
      await utils.delay(bb.transitionDuration! + 50);
      // auto scroll dropdown to first focusable element.
      focusable.scrollIntoView({ block: "nearest" });
    }
  }
}
async function closeDropdown() {
  // close all sub-dropdown first
  if (dropDown) {
    [...dropDown.querySelectorAll(":scope .dd-toggler.active")].forEach((el) =>
      utils.triggerEvent(el, "ddconsole", "close"),
    );
    [...dropDown.querySelectorAll(optionSelectors.items)].forEach((el) =>
      el.classList.remove("hovered"),
    );
  }

  document.removeEventListener("click", dd_clickOnDomEvt);
  document.removeEventListener("keydown", dd_KBControlEvt);
  document.removeEventListener("mousemove", dd_mouseMover);
  window.removeEventListener("resize", dd_CalcPosition);
  window.removeEventListener("scroll", dd_CalcPosition, true);

  if (bb.searchable) {
    searchBox.removeEventListener("input", dd_searchEvt);
    if (!props.boundless) searchBox.value = "";
    searchBoxSizer.textContent = searchBox.value;
    utils.afterNextRepaint(() => (searchBox.style.width = searchBoxSizer.clientWidth + "px"));
    selectableContentBox?.classList.remove("hidden");
    selectablePlaceholder?.classList.remove("hidden");

    // return focus to rightful dropdown target
    searchBox.focus();
  } else ddRef.value?.focus();

  if (bb.openOnHover) document.removeEventListener("mousemove", dd_toggleHandler);

  // safely get out of escape track
  utils.checkEscStatus(uniqueId, true);

  dropDown?.classList.remove("visible");
  await utils.delay(bb.transitionDuration!);
  dropDown?.style.setProperty("visibility", "hidden");
  if (ddRef.value) sizeStream?.unobserve(ddRef.value);
}
watch(showDropdown, (show) => (show ? openDropdown() : closeDropdown()));

onBeforeUnmount(() => {
  // stop all asynchronous watcher
  Object.keys(unwatch).forEach((el) => {
    if (typeof unwatch[el] === "function") unwatch[el]();
  });
  closeDropdown();
  document.removeEventListener("click", ms_clickEvt);
  document.removeEventListener("keydown", ms_keyEvt);
  document.removeEventListener("keydown", dd_keyEvt);
  sizeStream?.disconnect();

  if (bb.openOnHover) document.removeEventListener("mousemove", dd_toggleHandler);

  // return dropDown to it appropriate location. needs review.
  if (bb.teleportDropdown && teleportationPlaceholder) {
    teleportationPlaceholder.parentElement?.insertBefore(dropDown, teleportationPlaceholder);
    teleportationPlaceholder.remove();
  }
});

function ms_clickEvt(e: MouseEvent) {
  let target = e.target as HTMLElement;
  let sItems = [...ddRef.value!.querySelectorAll(":scope > .content > .msitem")];
  let sItem = sItems.find((el) => el.contains(target)) as HTMLElement;
  let sItemClose = [...ddRef.value!.querySelectorAll(":scope > .content > .msitem > .close")].find(
    (el) => el.contains(target),
  );

  // deselecting multiple dropdown item when user clicks on the close button of a msitem
  if (sItemClose) utils.afterNextRepaint(() => dd_setDeselect(sItem));
  else if (sItem) {
    let sItemSiblings = sItems.filter((el) => el != sItem);

    // select a msitem that is not selected if user clicks on them.
    if (!sItem.matches(".active")) sItem.classList.add("active");
    // deselect a msitem that is selected if user click on them and there is no other msitem selected
    else if (!sItemSiblings.some((el) => el.matches(".active"))) sItem.classList.remove("active");

    // if the control key is not pressed when user clicks on a msitem, deselect the siblings of the msitem
    if (!e.ctrlKey) sItemSiblings.forEach((el) => el.classList.remove("active"));
  }
  // if one or more msitem(s) is selected and user clicks out, deselect the selected msitems
  else sItems.forEach((el) => el.classList.remove("active"));
}
function ms_keyEvt(e: KeyboardEvent) {
  let sItems = [...ddRef.value!.querySelectorAll(":scope > .content > .msitem")] as HTMLElement[];
  let activeSItems = sItems.filter((el) => el.matches(".active"));

  if (activeSItems[0]) {
    let prevSibling = activeSItems[0].previousElementSibling?.matches(".msitem")
      ? activeSItems[0].previousElementSibling
      : null;
    let nextSibling = [...activeSItems].at(-1)!.nextElementSibling;

    // deselect items with keyboard when they are selected
    if (e.key === "Backspace" || e.key === "Delete") {
      if (e.key == "Backspace") {
        if (prevSibling) prevSibling.classList.add("active");
        else if (nextSibling?.matches(".msitem")) nextSibling.classList.add("active");
      } else if (e.key == "Delete") {
        if (nextSibling?.matches(".msitem")) nextSibling.classList.add("active");
        else if (prevSibling) prevSibling.classList.add("active");
      }

      activeSItems.forEach((el) => dd_setDeselect(el));
    }
    // navigation within multiple selectable dropdown.
    else if (e.key === "ArrowRight" && nextSibling) {
      if (nextSibling === searchBox) {
        activeSItems.forEach((el) => el.classList.remove("active"));
        searchBox.focus();
        return;
      } else if (nextSibling.matches(".msitem")) {
        if (!e.shiftKey) activeSItems.forEach((el) => el.classList.remove("active"));
        nextSibling.classList.add("active");
      }
    } else if (e.key === "ArrowLeft" && prevSibling) {
      if (!e.shiftKey) activeSItems.forEach((el) => el.classList.remove("active"));
      prevSibling.classList.add("active");
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      activeSItems.forEach((el) => el.classList.remove("active"));
      if (e.key === "ArrowDown") {
        bb.activateKeyboard = true;
        showDropdown.value = true;
      }
    } else if (e.key === " " || e.key === "Enter" /* || e.key === 'Tab' */)
      activeSItems.forEach((el) => el.classList.remove("active"));
  }
  // delete the last msitem in multiple dropdown if searchBox is focused-on and seachbox is empty and the backspace key is pressed
  else if (
    bb.searchable &&
    searchBox.matches(":focus") &&
    !searchBox.value &&
    e.key === "Backspace" &&
    sItems[0]
  )
    dd_setDeselect(sItems.at(-1)!);
  // navigation in multiple selectable dropdown continues at the following.
  else if (ddRef.value!.matches(":focus-within")) {
    if (e.key == "ArrowRight") sItems[0]?.classList.add("active");
    else if (e.key == "ArrowLeft") sItems.pop()?.classList.add("active");
  }
}
function dd_keyEvt(e: KeyboardEvent) {
  if (
    (e.key == "Enter" || e.key == "ArrowDown" || e.key == " ") &&
    ddRef.value!.matches(":focus-within") &&
    !showDropdown.value
  ) {
    e.preventDefault();
    bb.activateKeyboard = true;
    showDropdown.value = true;
  }
}

function dd_toggleHandler(e: MouseEvent | TouchEvent) {
  let target = e.target as Element;
  // escape all dd-ignore classed element from toggling dropdwon also trigger only on dd-trigger in dropdown if specified to do so.
  if (
    [...ddRef.value!.querySelectorAll(":scope > .content > .msitem")].some((el) =>
      el.contains(target),
    ) ||
    (target && target.closest(".dd-ignore")) ||
    (bb.findTrigger && !target.closest(".dd-trigger"))
  )
    return;

  if (bb.openOnHover) {
    if (e.type === "mouseenter") {
      document.addEventListener("mousemove", dd_toggleHandler);
      clearTimeout(bb.hideDropdownTimeout);
      bb.showDropdownTimeout = setTimeout(() => {
        if (bb.searchable) bb.activateKeyboard = true;
        showDropdown.value = true;
      }, bb.delay! / 2);
    } else if (e.type === "mousemove") {
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
    } else if (e.type === "touchstart") {
      // prevent event from interfering with dropDown items actions.
      if (dropDown.contains(target)) return;

      if (showDropdown.value) {
        clearTimeout(bb.showDropdownTimeout);
        showDropdown.value = false;
      } else {
        document.addEventListener("mousemove", dd_toggleHandler);
        clearTimeout(bb.hideDropdownTimeout);
        if (bb.searchable) bb.activateKeyboard = true;
        showDropdown.value = true;
      }
    }
  } else {
    // prevent event from interfering with dropDown items actions.
    if (dropDown.contains(target)) return;

    // I don't know why i called e.preventDefault here.
    e.preventDefault();
    // save event data to be used for a setting.page type dropdown dropDown coordinate when showing it.
    if (bb.page) bb.pageEvent = e as MouseEvent;

    if (showDropdown.value) {
      if (bb.searchable && !ddRef.value!.querySelector(":scope .ddico")?.contains(target)) {
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

  if (!props.sub) return;
  // get the ancestor dropdown of sub-dropdown and send it an event to close it self and it ancestors also
  let parentDropdown = utils.getParents(ddRef.value!, ".dropdown")[0];
  if (parentDropdown && parentDropdown.getAttribute("data-ddid")) {
    let parentToggler = document.querySelector(
      `[data-ddid="${parentDropdown.getAttribute("data-ddid")}"].dd-toggler`,
    );

    if (parentToggler)
      utils.triggerEvent(parentToggler, "ddconsole", "close all ancestor dropdown");
  }
}

async function dd_searchEvt() {
  searchQuery.value = searchBox.value.toLowerCase();
  let items = [...dropDown.querySelectorAll(optionSelectors.items_of_indicating_dropdown)];

  if (props.searchData) {
    filteredData.value = props.filterFunction
      ? props.filterFunction(searchQuery.value, props.searchData)
      : props.searchData.filter((item) => item.toLowerCase().includes(searchQuery.value));
  } else {
    items.forEach((el) => {
      if (searchQuery.value && !el.textContent?.toLowerCase().includes(searchQuery.value))
        el.classList.add("hidden");
      else el.classList.remove("hidden");
    });
  }
  await nextTick();

  [...dropDown.querySelectorAll(optionSelectors.items)].forEach((el) =>
    el.classList.remove("hovered"),
  );
  let firstItem = [...dropDown.querySelectorAll(optionSelectors.items_filtered)][0];

  if (!firstItem) {
    if (searchQuery.value && !rbb.allItemFiltered) rbb.allItemFiltered = true;
    else if (!searchQuery.value && rbb.allItemFiltered) rbb.allItemFiltered = false;
  } else {
    rbb.allItemFiltered = false;
    firstItem.classList.add("hovered");
    if (props.boundless && !bb.multipleSelect && firstItem.classList.contains("user-defined")) {
      model.value = searchBox.value;
      emit("change", model.value);
    }
    dropDown.setAttribute("aria-activedescendant", firstItem.textContent);
    firstItem.scrollIntoView({ block: "nearest" });
  }

  if (bb.multipleSelect) {
    if (searchQuery.value) {
      selectableContentBox.classList.remove("no-content");
      let sItems = [...ddRef.value!.querySelectorAll(":scope > .content > .msitem")];
      if (sItems[0]) sItems.forEach((el) => el.classList.remove("active"));
    } else if (!rbb.mSelectContent[0]) selectableContentBox.classList.add("no-content");
  }

  utils.afterNextRepaint(() => dd_CalcPosition());
}

function dd_clickOnDomEvt(e: MouseEvent) {
  let target = e.target as Element;
  let option = [...dropDown.querySelectorAll(optionSelectors.items)].find((el) =>
    el.contains(target),
  );
  let ignore =
    [...ddRef.value!.querySelectorAll(":scope > .content > .msitem")].some((el) =>
      el.contains(target),
    ) || ddFamily.some((el) => el.contains(target));
  let exiter =
    dropDown.contains(target) &&
    bb.dismisser &&
    target.closest(bb.dismisser) &&
    !target.closest(".dd-toggler");

  // respond when an option is clicked in a selectable dropdown
  if (option && bb.selectable) {
    // deselecting items for multiple select dropdown that has the indicating class
    if (bb.multipleSelect && option.matches(".selected")) dd_setDeselect(option as HTMLElement);
    // select item if dropdown is selectable
    else dd_setSelect(option, bb.multipleSelect);
  }
  // Close when an exiter is clicked or on "Click Out"
  else if (exiter || !ignore) dd_closeWithAncestor();
}

function dd_KBControlEvt(e: KeyboardEvent) {
  let options = [...dropDown.querySelectorAll(optionSelectors.items_filtered)] as HTMLElement[];
  let option = options.find((el) => el.matches(".hovered"));
  /*
    The Enter key triggers the click action on an item
    Enter and right arrow key open a sub dropdown that is hovered.
  */
  if (e.key === "Enter" && option && !ddRef.value?.querySelector(":scope .ddico:focus")) {
    e.preventDefault();
    option.click();
  } else if (e.key === "ArrowRight") {
    const focusedDD_Toggler = utils
      .getFocusableElementsFrom(dropDown)
      .find((el) => el.matches(".dd-toggler:not(.active)"));

    if (focusedDD_Toggler) {
      e.preventDefault();
      utils.triggerEvent(focusedDD_Toggler, "ddconsole", "open with keyboard");
    }
  }
  // The Escape key closes the dropdown if it is the dropdown turn to respond to Esc key press.
  else if (e.key === "Escape" && utils.checkEscStatus(uniqueId)) {
    e.preventDefault();
    showDropdown.value = false;
  }
  // The Tab key closes the dropdown with all ancestor dropdowns if the dropdown or any of its relating elements loses focus.
  // Arrow left key (Use to close a sub dropdown) support
  else if (
    (e.key === "Tab" && ![...dropDown.querySelectorAll(":scope :focus")][0]) ||
    (e.key === "ArrowLeft" &&
      props.sub &&
      ![...dropDown.querySelectorAll(":scope .dd-toggler.active")][0])
  ) {
    e.preventDefault();
    showDropdown.value = false;
  }
  // Up and down arrrow key navigation on dropdown item.
  else if (e.key == "ArrowUp" || e.key == "ArrowDown") {
    if (bb.selectable) {
      e.preventDefault();

      let hoveredOption =
        options.find((el) => el.matches(".hovered")) ?? options.find((el) => el.matches(".active"));
      let currentOptionIndex = hoveredOption ? options.indexOf(hoveredOption) : -1;
      let nextOptionIndex =
        e.key == "ArrowUp"
          ? currentOptionIndex <= 0
            ? options.length - 1
            : currentOptionIndex - 1
          : currentOptionIndex === options.length - 1 || currentOptionIndex < 0
            ? 0
            : currentOptionIndex + 1;
      let nextOption = options[nextOptionIndex] as Maybe<HTMLElement>;

      /* scroll overflow parent to make hovered-item visible in screen */
      if (nextOption) {
        e.preventDefault();
        nextOption.scrollIntoView({ behavior: "instant", block: "nearest" });
        options.forEach((el) => {
          el.classList.remove("hovered");
        });
        nextOption.classList.add("hovered");
        dropDown.setAttribute("aria-activedescendant", nextOption.textContent);
        if (!bb.multipleSelect) dd_setSelect(nextOption, true);
      }

      document.addEventListener("mousemove", dd_mouseMover);
    } else if (bb.arrowKeyNavigation) {
      e.preventDefault();

      let focusableElements = utils.getFocusableElementsFrom(dropDown);

      if (!focusableElements[0]) return;

      let currentFocusable = dropDown.querySelector(":scope :focus") as Maybe<HTMLElement>;
      let currentFocusableIndex = currentFocusable
        ? focusableElements.indexOf(currentFocusable)
        : -1;
      let nextFocusableIndex =
        e.key == "ArrowUp"
          ? currentFocusableIndex <= 0
            ? focusableElements.length - 1
            : currentFocusableIndex - 1
          : currentFocusableIndex === focusableElements.length - 1 || currentFocusableIndex < 0
            ? 0
            : currentFocusableIndex + 1;
      let nextFocusable = focusableElements[nextFocusableIndex] as Maybe<HTMLElement>;

      /* scroll overflow parent to make hovered-item visible in screen */
      if (nextFocusable) {
        nextFocusable.scrollIntoView({ behavior: "instant", block: "nearest" });
        nextFocusable.focus();
      }

      document.addEventListener("mousemove", dd_mouseMover);
    }
  }
  // manage tab key navigation within dropdown and out of it.
  else if (e.key === "Tab" && utils.getFocusableElementsFrom(dropDown)[0])
    utils.focusRangeOnTab(dropDown, e);
}

function dd_CalcPosition() {
  let rects = {
    dd: ddRef.value!.getBoundingClientRect(),
    dm: {
      width: dropDown.offsetWidth,
      height: dropDown.offsetHeight,
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
      left: bb.pageEvent!.clientX - rects.pad.y,
      top: bb.pageEvent!.clientY - rects.pad.y,
      right: rects.win.width - bb.pageEvent!.clientX - rects.pad.x,
      bottom: rects.win.height - bb.pageEvent!.clientY - rects.pad.x,
    };

    if (spacing.right >= Math.max(rects.dm.width, spacing.left)) {
      dropDown.style.left = `${Math.min(
        spacing.left,
        rects.win.width - rects.dm.width - rects.pad.x,
      )}px`;
      dropDown.classList.add("rhs");
    } else {
      dropDown.style.left = `${Math.max(spacing.left - rects.dm.width, rects.pad.x)}px`;
      dropDown.classList.add("lhs");
    }

    if (spacing.bottom >= Math.max(rects.dm.height, spacing.top)) {
      dropDown.style.top = `${Math.min(
        spacing.top,
        rects.win.height - rects.dm.height - rects.pad.y,
      )}px`;
      dropDown.classList.add("downward");
    } else {
      dropDown.style.top = `${Math.max(spacing.top - rects.dm.height, rects.pad.y)}px`;
      dropDown.classList.add("upward");
    }
  } else {
    if (bb.view === "vertical") {
      let spacing = {
        top: rects.dd.top - rects.pad.y,
        bottom: rects.win.height - rects.dd.top - rects.dd.height - rects.pad.y,
      };

      let dmY = {
        top: rects.dd.top - rects.dm.height,
        bottom: rects.dd.top + rects.dd.height,
      };

      if (bb.directionPriority.y === "bottom") {
        if (
          spacing.bottom >= Math.max(rects.dm.height, spacing.top) ||
          rects.dm.height > spacing.top
        ) {
          dropDown.style.top = `${dmY.bottom}px`;
          if (!dropDown.classList.contains("downward")) {
            dropDown.classList.add("downward");
            dropDown.classList.remove("upward");
          }
        } else {
          dropDown.style.top = `${dmY.top}px`;
          if (!dropDown.classList.contains("upward")) {
            dropDown.classList.add("upward");
            dropDown.classList.remove("downward");
          }
        }
      } else {
        if (spacing.top >= rects.dm.height) {
          dropDown.style.top = `${dmY.top}px`;
          if (!dropDown.classList.contains("upward")) {
            dropDown.classList.add("upward");
            dropDown.classList.remove("downward");
          }
        } else {
          dropDown.style.top = `${dmY.bottom}px`;
          if (!dropDown.classList.contains("downward")) {
            dropDown.classList.add("downward");
            dropDown.classList.remove("upward");
          }
        }
      }

      let dmX = 0;

      if (bb.directionPriority.x === "right") {
        dmX = rects.dd.left;
        if (!dropDown.classList.contains("rhs")) {
          dropDown.classList.add("rhs");
          dropDown.classList.remove("lhs");
        }
      } else if (bb.directionPriority.x === "center") {
        dmX = rects.dd.left + rects.dd.width / 2 - rects.dm.width / 2;
      } else {
        dmX = rects.dd.left + rects.dd.width - rects.dm.width;
        if (!dropDown.classList.contains("lhs")) {
          dropDown.classList.add("lhs");
          dropDown.classList.remove("rhs");
        }
      }

      dropDown.style.left = `${Math.min(
        Math.max(rects.pad.x, dmX),
        rects.win.width - rects.dm.width - rects.pad.x,
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

      if (bb.directionPriority.x === "right") {
        if (
          spacing.right >= Math.max(rects.dm.width, spacing.left) ||
          rects.dm.width > spacing.left
        ) {
          dropDown.style.left = `${dmX.right}px`;
          if (!dropDown.classList.contains("rhs")) {
            dropDown.classList.add("rhs");
            dropDown.classList.remove("lhs");
          }
        } else {
          dropDown.style.left = `${dmX.left}px`;
          if (!dropDown.classList.contains("lhs")) {
            dropDown.classList.add("lhs");
            dropDown.classList.remove("rhs");
          }
        }
      } else {
        if (spacing.left >= rects.dm.width) {
          dropDown.style.left = `${dmX.left}px`;
          if (!dropDown.classList.contains("lhs")) {
            dropDown.classList.add("lhs");
            dropDown.classList.remove("rhs");
          }
        } else {
          dropDown.style.left = `${dmX.right}px`;
          if (!dropDown.classList.contains("rhs")) {
            dropDown.classList.add("rhs");
            dropDown.classList.remove("lhs");
          }
        }
      }

      let dmY = 0;

      if (bb.directionPriority.y === "bottom") {
        dmY = rects.dd.top;
        if (!dropDown.classList.contains("downward")) {
          dropDown.classList.add("downward");
          dropDown.classList.remove("upward");
        }
      } else if (bb.directionPriority.y === "center")
        dmY = rects.dd.top + rects.dd.height / 2 - rects.dm.height / 2;
      else {
        dmY = rects.dd.top + rects.dd.height - rects.dm.height;
        if (!dropDown.classList.contains("upward")) {
          dropDown.classList.add("upward");
          dropDown.classList.remove("downward");
        }
      }

      dropDown.style.top = `${Math.min(
        Math.max(rects.pad.y, dmY),
        rects.win.height - rects.dm.height - rects.pad.y,
      )}px`;
    }

    // set arrow position variable
    utils.afterNextRepaint(() => {
      let arrowPos = 0;
      // set arrow position based on the dropdown view and direction
      if (bb.view === "vertical") {
        if (dropDown.classList.contains("lhs")) arrowPos = rects.dm.width - rects.dd.width / 2;
        else if (dropDown.classList.contains("rhs")) arrowPos = rects.dd.width / 2;
        else arrowPos = rects.dd.left + rects.dd.width / 2 - dropDown.getBoundingClientRect().left;
      } else {
        if (dropDown.classList.contains("upward")) arrowPos = rects.dm.height - rects.dd.height / 2;
        else if (dropDown.classList.contains("downward")) arrowPos = rects.dd.height / 2;
        else arrowPos = rects.dd.top + rects.dd.height / 2 - dropDown.getBoundingClientRect().top;
      }

      dropDown.style.setProperty("--arrow-center", `${arrowPos}px`);
    });
  }
}

// this function cancels active keyboard control on dropdown and enable mouse control.
function dd_mouseMover(e: MouseEvent) {
  let target = e.target as Element;
  let options = [...dropDown.querySelectorAll(optionSelectors.items_of_indicating_dropdown)];

  if (bb.selectable && (ddRef.value!.contains(target) || dropDown.contains(target))) {
    let option = options.find((el) => el.contains(target));
    if (!option) {
      options.forEach((el) => el.classList.remove("hovered"));
      return;
    }
    option.classList.add("hovered");
    if (bb.selectable) dropDown.setAttribute("aria-activedescendant", option.textContent);

    options.filter((el) => el !== option).forEach((el) => el.classList.remove("hovered"));
  } else if (bb.openOnHover) showDropdown.value = false;
  else if (!bb.selectable) {
    dropDown.focus();
  } else options.forEach((el) => el.classList.remove("hovered"));
}

// this function set an item as selected in a selectable dropdown
// xClose means don't close dropdown after selection.
async function dd_setSelect(item: Element, xClose?: boolean) {
  if (!item || !bb.selectable || (item.matches(".user-defined") && item.textContent === "")) return;

  let items = [...dropDown.querySelectorAll(optionSelectors.items)];

  if (bb.multipleSelect) {
    let itemValue = (item as HTMLElement).dataset.value || item.textContent;

    if (Array.isArray(model.value)) {
      if (model.value.includes(itemValue))
        console.warn("The selected item has a value that already exist in the dropdown selection.");
      else model.value = [...model.value, itemValue];
    } else model.value = [itemValue];

    emit("change", model.value);

    if (bb.searchable && showDropdown.value) {
      searchBox.value = "";
      utils.triggerEvent(searchBox, "input");
      searchBox.focus();
    }

    await nextTick();
    items = [...dropDown.querySelectorAll(optionSelectors.items)];

    if (!showDropdown.value || ddRef.value!.matches(".indicating")) return;

    item.classList.remove("hovered");

    if (!bb.searchable) {
      let nextHv =
        utils.nextAll(item).find((el) => !el.matches(".selected")) ??
        utils
          .prevAll(item)
          .filter((el) => !el.matches(".selected"))
          .pop();
      if (nextHv) {
        nextHv.classList.add("hovered");
        dropDown.setAttribute("aria-activedescendant", nextHv.textContent);
        nextHv.scrollIntoView({ block: "nearest" });
      }
    }

    utils.afterNextRepaint(() => dd_CalcPosition());
  } else {
    if (!showDropdown.value && items.some((el) => el !== item && el.matches(".active")))
      console.warn(
        "A selection-dropdown on this page has multiple preselected value which is not suppose to be except it is a multiple-selection-dropdown. Only the first preselected value will be preselected.",
      );

    if (props.boundless) {
      searchBox.value = item.textContent;
      searchBoxSizer.textContent = searchBox.value;
      utils.afterNextRepaint(() => (searchBox.style.width = searchBoxSizer.clientWidth + "px"));
      if (!showDropdown.value) {
        bb.activateKeyboard = true;
        showDropdown.value = true;
      }
    }

    model.value = (item as HTMLElement).dataset.value || item.textContent;
    emit("change", model.value);
  }

  if (!xClose) showDropdown.value = false;
}

// this function de-select an item in a selection dropdown.
async function dd_setDeselect(sItem: HTMLElement) {
  if (!bb.multipleSelect) return;

  let ddid = sItem.dataset.ddid;
  let content = rbb.mSelectContent.find((cont) => cont.ddid === ddid);
  if (!content) return;

  model.value = (model.value as string[]).filter((val) => val !== content.val);
  emit("change", model.value);

  if (showDropdown.value) {
    if (bb.searchable) {
      searchBox.value = "";
      utils.triggerEvent(searchBox, "input");
    }

    await nextTick();
    utils.afterNextRepaint(() => dd_CalcPosition());
  }

  if (bb.searchable) searchBox.focus();
}
</script>

<template>
  <a
    ref="dd-toggler"
    class="dd-toggler"
    :data-ddid="uniqueId"
    :data-target
    :class="[type, { active: showDropdown, search: bb.searchable, sub: sub }]"
    :role="bb.selectable ? 'combobox' : 'button'"
    :aria-haspopup="bb.selectable ? 'listbox' : 'menu'"
    :aria-expanded="showDropdown"
    :aria-controls="rbb.dropdownId"
    :tabindex="bb.searchable ? -1 : 0"
  >
    <slot :query="searchQuery" :filteredData></slot>
    <template v-if="bb.selectable">
      <div v-if="bb.multipleSelect" class="content no-content">
        <div
          v-for="item in rbb.mSelectContent"
          :key="item.ddid"
          :data-ddid="item.ddid"
          class="msitem chip"
        >
          <div v-html="item.html"></div>
          <Icon name="material-symbols:close-rounded" class="close trailing" />
        </div>
        <template v-if="bb.searchable">
          <input class="ssbox" autocomplete="off" />
          <span class="ddss"></span>
        </template>
        <div class="placeholder">{{ placeholder }}</div>
      </div>
      <div v-else class="dd-wrapper">
        <template v-if="bb.searchable">
          <input class="ssbox" autocomplete="off" />
          <span class="ddss"></span>
        </template>
        <div ref="sContent" v-html="rbb.selectContent" class="content"></div>
        <div class="placeholder">{{ placeholder }}</div>
      </div>
      <button
        v-if="model && (!Array.isArray(model) || model.length)"
        type="button"
        @click.stop="model = bb.multipleSelect ? [] : ''"
        class="ddico icon"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
          <path
            d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z"
          />
        </svg>
      </button>
      <button v-if="bb.isSelect" ref="ddIcon" type="button" tabindex="-1" class="ddico icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
          <path
            d="m12 18.1l2.325-2.325q.3-.3.725-.3t.725.3t.3.725t-.3.725L12.7 20.3q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213l-3.075-3.075q-.3-.3-.3-.725t.3-.725t.725-.3t.725.3zM12 6L9.675 8.325q-.3.3-.725.3t-.725-.3t-.3-.725t.3-.725L11.3 3.8q.15-.15.325-.213T12 3.526t.375.063t.325.212l3.075 3.075q.3.3.3.725t-.3.725t-.725.3t-.725-.3z"
          />
        </svg>
      </button>
      <input ref="sInput" v-model="model" type="hidden" :name="name" />
    </template>
    <slot name="trailing"></slot>
  </a>
</template>
<style>
@layer components {
  .dd-toggler {
    cursor: pointer;
    position: relative;
    color: inherit;

    &,
    &:hover,
    &:focus,
    &:active {
      text-decoration: none;
    }

    &:not(:focus-visible) {
      outline-color: transparent;
    }

    .indicator {
      position: relative;
      line-height: 100%;

      &.alt {
        margin: 0 0.5em 0 -0.25em;
      }

      &:not(.alt) {
        margin: 0 -0.25em 0 0.5em;
      }
    }

    &.select,
    &.selection {
      .dd-wrapper {
        display: grid;
        flex: 1;

        & > * {
          grid-area: 1 / 1;
        }
      }

      /* new in from form */
      & .placeholder {
        position: relative;
        pointer-events: none;
        flex-basis: 100%;
      }

      & > .content {
        display: flex;
        align-items: center;
        position: relative;
        flex-basis: 100%;
        gap: 0.75em;
        max-width: 100%;
      }

      &:not(.multiple) .content:empty,
      &:not(.multiple) .content:not(:empty) ~ .placeholder,
      &.multiple .content:not(.no-content) > .placeholder {
        display: none;
      }

      &.multiple > .content {
        flex-flow: row wrap;
        align-self: center;
        gap: 0.25em;

        &.content.no-content {
          gap: 0em;
        }

        & > .msitem {
          font-size: 0.875em;
        }
      }

      &.search {
        &.active:not(.multiple) > .content {
          opacity: 0.8;
        }
      }

      .ssbox {
        display: inline-flex;
        position: relative;
        color: inherit;
        font-size: 1em;
        width: 1em;
        flex: 1 1 auto;
        max-width: 100%;
        padding: 0em;
        margin: 0em;
        background: transparent;
        border: 0px none;
        border-radius: 0px;
        outline-color: transparent;
        box-shadow: none;
      }

      /* fix to clearout search box space */
      &:not(.multiple) > .ssbox,
      &.multiple > .no-content > .ssbox {
        width: 1em;
        margin-left: -1em;
        left: 1em;
      }

      /* searchable select dropdown searchbox sizer */
      .ddss {
        letter-spacing: normal;
        padding: 0em 0.5em;
        visibility: hidden;
        position: absolute;
        white-space: pre;
        max-width: 100%;
        overflow: hidden;
        left: 0px;
        top: 0px;
        font-size: inherit;
      }

      & > .dropdown.menu,
      & + .dropdown.menu {
        max-height: min(40vh, calc(100vh - 1.5rem));
      }

      &.indicating:not(.multiple) > .content,
      &.indicating.multiple > .content > .msitem,
      &.indicating > .placeholder {
        display: none;
      }
    }
  }

  .dropdown {
    max-width: calc(100vw - 1rem);
    max-height: calc(100vh - 1.5rem);
    border: 1px solid var(--color-outline);
    border-radius: var(--radius-block);
    box-shadow: var(--shadow-d2);
    visibility: hidden;
    opacity: 0;
    transform: scaleY(0.25);
    position: fixed;
    margin: 0em;
    z-index: var(--z-level-5);
    pointer-events: none;
    scroll-behavior: smooth;
    transition:
      transform 300ms ease-in 0s,
      opacity 300ms linear 0s;

    &.board {
      width: 100%;
      padding: 0.6em 1em;
    }

    &.menu {
      --icon-pad-offset: -0.25em;

      width: max-content;
      overflow-y: auto;
      padding: 0.25em;
      gap: 0.25em;
      text-align: left;
      font-weight: normal;
      --spacing: 0.25em;

      & > .item,
      & .items > .item {
        text-align: left;
        border-color: transparent;
        padding: 0.5em 1em;
      }

      /* our dropdown only use class-based hover for options if it is selectable */
      &[role="listbox"] .item[role="option"]:not(.hovered, .dd-toggler.active):hover {
        background-color: transparent;

        &:before {
          opacity: 0;
        }
      }

      &:not(.indicating) > .item.selected,
      &:not(.indicating) .items > .item.selected {
        display: none;
      }

      &.indicating > .item,
      &.indicating .items > .item {
        &:not(.no-indicator) {
          padding-left: 2.4em;

          &:after {
            content: "";
            position: absolute;
            width: 1.14em;
            height: 1.14em;
            border: 2px solid #aaa;
            text-align: center;
            margin-left: -2em;
            opacity: 1;
            color: rgba(0, 0, 0, 0.87);
            transition: transform 0.2s;
          }

          &.selected,
          &.active {
            cursor: pointer;

            &:after {
              width: 0.7em;
              height: 1.2em;
              border: 2px solid transparent;
              border-right-color: var(--color-primary);
              border-bottom-color: var(--color-primary);
              transform: rotate(40deg);
              backface-visibility: hidden;
              transform-origin: 100% 100%;
            }
          }
        }
      }

      & > .ed-msg {
        color: inherit;
        opacity: 0.5;
        display: block;
        text-align: left;
        border: 0px none;
        margin: 0;
        padding: 0.5em 0.75em;

        &:not(.active) {
          display: none;
        }
      }

      & .divider,
      & hr {
        pointer-events: none;
        padding: 0em;
        margin: 0.25em 0;
      }
    }

    &,
    &:focus {
      outline-width: 0px;
    }

    &.pointing {
      overflow: visible;
      --spacing: 0.875em;

      &:before {
        content: "";
        position: absolute;
        height: 1.125em;
        width: 1.125em;
        transform-origin: center;
        background: inherit;
        border: inherit;
        box-shadow: inherit;
      }

      &[data-view="vertical"] {
        &:before {
          left: calc(var(--arrow-center) - 0.5625em);
        }

        &.upward {
          transform-origin: bottom center;

          &:before {
            clip-path: polygon(-50% 150%, 150% 150%, 150% -50%);
            transform: translateY(-53%) rotate(45deg);
            top: 100%;
          }
        }

        &.downward {
          transform-origin: top center;

          &:before {
            clip-path: polygon(-50% 150%, -150% -150%, 150% -50%);
            transform: translateY(53%) rotate(45deg);
            bottom: 100%;
          }
        }
      }

      &[data-view="horizontal"] {
        &:before {
          top: calc(var(--arrow-center) - 0.5625em);
        }

        &.rhs {
          transform-origin: center left;

          &:before {
            clip-path: polygon(-50% 150%, -150% -150%, 150% -50%);
            transform: translateX(53%) rotate(-45deg);
            right: 100%;
          }
        }

        &.lhs {
          transform-origin: center right;

          &:before {
            clip-path: polygon(-50% 150%, 150% 150%, 150% -50%);
            transform: translateX(-53%) rotate(-45deg);
            left: 100%;
          }
        }
      }
    }

    &.upward {
      transform-origin: bottom center;
    }

    &.downward {
      transform-origin: top center;
    }

    &.visible {
      opacity: 1;
      pointer-events: initial;
      transition:
        transform 300ms ease-in 0s,
        opacity 300ms linear 0s;
    }

    &[data-view="vertical"] {
      transform: scaleY(0.25);

      &.upward {
        margin-top: calc(0em - var(--spacing));
      }

      &.downward {
        margin-top: var(--spacing);
      }

      &.visible {
        transform: scaleY(1);
      }
    }

    &[data-view="horizontal"] {
      transform: scaleX(0.25);

      &.rhs {
        margin-left: var(--spacing);
      }

      &.lhs {
        margin-left: calc(0em - var(--spacing));
      }

      &.visible {
        transform: scaleX(1);
      }
    }
  }
}
</style>
