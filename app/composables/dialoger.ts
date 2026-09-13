// Usage: import { useDialoger } from 'components/composables/useDialoger.ts';
// Usage: const { showDialog } = useDialoger(dialoger, 'dialoger-id', options);
import type { ShallowRef, WatchStopHandle } from "vue";

export type DialogEvent = {
  target: HTMLElement;
  settings: DialogerSettings;
};
export type Dialoger = {
  target: HTMLElement;
  settings: DialogerSettings;
  exit: () => void;
};
export type DialogerOptions = {
  namespace: string;
  toggler: string | false;
  toExcuseToggler: string | false;
  closeOnEsc: boolean;
  closeOnWrapperClick: boolean;
  dismissible: boolean;
  dismisser: string | false;
  autoFocusEl: string | false;
  commands?: {
    open: string;
    close: string;
  };
  inDuration: number;
  outDuration: number;
  hashControl: boolean;
  controller?: (event: Dialoger) => unknown;
};

export type DialogerSettings = DialogerOptions & {
  caller?: HTMLElement;
};

export function useDialoger(
  dialoger: ShallowRef<HTMLDivElement | null>,
  id: string,
  options?: Partial<DialogerOptions>,
): Dialoger {
  const route = useRoute();
  const showDialog = ref(false);
  const settings: DialogerSettings = {
    namespace: "dialog",
    toggler: ".open-dialog",
    toExcuseToggler: ".ex-open-dialog",
    closeOnEsc: true,
    closeOnWrapperClick: true,
    dismissible: true,
    dismisser: ".exit-dialog",
    autoFocusEl: "[dg-autofocus]",
    commands: {
      open: "open dialog",
      close: "close dialog",
    },
    inDuration: 500,
    outDuration: 500,
    hashControl: false,
    ...options,
  };
  const bb = {
    uniqueId: undefined as string | undefined,
    openWithHash: false,
    exitedWithBrowserBack: false,
  };
  const unwatch: Record<string, WatchStopHandle> = {};

  function exit() {
    if (settings.dismissible) showDialog.value = false;
  }
  function exitByClick(e: MouseEvent) {
    if (
      settings.dismissible &&
      ((settings.closeOnWrapperClick && e.target === dialoger.value) ||
        (settings.dismisser && (e.target as HTMLElement).closest(settings.dismisser)))
    )
      showDialog.value = false;
  }

  function KBDControls(e: KeyboardEvent) {
    // tab function in dialog
    if (e.key === "Tab") utils.focusRangeOnTab(dialoger.value!, e);
    // Control + A function in dialog
    else if (e.ctrlKey && e.code === "KeyA") {
      if (document.querySelectorAll("input:focus, textarea:focus")[0]) return;
      e.preventDefault();
      utils.setHighlightRange(dialoger.value!);
    }
    // Esc function in dialog
    else if (
      settings.closeOnEsc &&
      settings.dismissible &&
      e.key === "Escape" &&
      utils.checkEscStatus(bb.uniqueId!)
    )
      showDialog.value = false;
  }

  function backToExit() {
    if (!settings.dismissible) {
      window.history.pushState(
        { protected: true },
        "",
        `${window.location.href.split("#")[0]}#${id}`,
      );
      return;
    }
    bb.exitedWithBrowserBack = true;
    showDialog.value = false;
  }

  function toOpenDialog(e: MouseEvent) {
    let target = e.target as HTMLElement;
    let toggler =
      target.closest(`${settings.toggler}[href="#${id}"]`) ||
      target.closest(`${settings.toggler}[data-target="${id}"]`);
    if (!toggler || (settings.toExcuseToggler && target.closest(settings.toExcuseToggler))) return;
    settings.caller = toggler as HTMLElement;
    showDialog.value = !showDialog.value;
  }

  onMounted(() => {
    bb.uniqueId = utils.getUniqueId(settings.namespace);

    // click on dialoger toggler to open dialog
    if (settings.toggler) document.addEventListener("click", toOpenDialog);

    dialoger.value!.addEventListener("dgconsole", ((e: CustomEvent) => {
      if (e.detail === settings.commands!.open) showDialog.value = true;
      else if (e.detail === settings.commands!.close && settings.dismissible)
        showDialog.value = false;
    }) as EventListener);

    if (settings.hashControl) {
      // open dialog from hash
      unwatch.openDialogFromRoute = watch(
        () => route.hash,
        async (newHash) => {
          if (newHash === `#${id}` && !showDialog.value) {
            bb.openWithHash = true;
            showDialog.value = true;
          }
        },
        { immediate: true },
      );
    }
  });

  watch(showDialog, async (value) => {
    if (value) {
      document.body.append(dialoger.value!);
      dialoger.value!.style.visibility = "visible";
      await utils.afterNextRepaint();
      if (settings.hashControl) {
        if (!bb.openWithHash) {
          window.history.pushState(null, "", `${window.location.href.split("#")[0]}#${id}`);
          window.history.pushState(
            { protected: true },
            "",
            `${window.location.href.split("#")[0]}#${id}`,
          );
          window.addEventListener("popstate", backToExit);
        }
        // exit when route hash changes
        unwatch.closeOnRouteChange = watch(
          () => route.hash,
          (newHash) => {
            if (newHash !== `#${id}`) {
              if (!settings.dismissible) {
                navigateTo(
                  {
                    path: route.path,
                    query: route.query,
                    hash: `#${id}`,
                  },
                  { replace: true },
                );
                return;
              }
              showDialog.value = false;
            }
          },
        );
      }

      utils.lockWindowScroll(bb.uniqueId!);

      // If a controller function is provided in the settings, call it with the dialog element and settings.
      // The controller function can be used to perform additional setup or customization of the dialog.
      if (typeof settings.controller === "function")
        settings.controller({
          target: dialoger.value!,
          settings,
          exit,
        });

      if (settings.closeOnEsc) utils.trackEscOn(bb.uniqueId!);

      document.addEventListener("keydown", KBDControls);
      dialoger.value!.addEventListener("click", exitByClick);
      dialoger.value!.classList.add("active");
      await utils.delay(settings.inDuration);
      if (dialoger.value) {
        dialoger.value.scrollTop = 0;

        // Trigger a custom event 'isReady' on the dialog element to indicate that the dialog is ready.
        utils.triggerEvent(dialoger.value, "isReady", {
          target: dialoger.value,
          settings,
        });

        if (settings.autoFocusEl) {
          let autoFocusEl = [
            ...dialoger.value.querySelectorAll(`:scope ${settings.autoFocusEl}`),
          ][0] as HTMLElement;
          if (autoFocusEl) autoFocusEl.focus();
          else utils.focusRangeOnTab(dialoger.value!); // select the first focusable element
        }
      }
    } else {
      document.removeEventListener("keydown", KBDControls);
      dialoger.value!.removeEventListener("click", exitByClick);

      // safely get out of escape track
      if (settings.closeOnEsc) utils.checkEscStatus(bb.uniqueId!, true);

      dialoger.value?.classList.remove("active");

      if (settings.hashControl) {
        unwatch.closeOnRouteChange && unwatch.closeOnRouteChange();
        window.removeEventListener("popstate", backToExit);
        if (!bb.exitedWithBrowserBack) window.history.go(-2);
        bb.exitedWithBrowserBack = false;
        bb.openWithHash = false;
      }
      await utils.delay(settings.outDuration);
      dialoger.value?.style.setProperty("visibility", "hidden");
      // Trigger a custom event 'isComplete' on the dialog element to indicate that the dialog has completed its closing process.
      if (dialoger.value)
        utils.triggerEvent(dialoger.value, "isComplete", {
          target: dialoger.value,
          settings,
        });
      settings.caller?.focus();
      settings.caller = undefined;
      utils.unlockWindowScroll(bb.uniqueId!);
    }
  });

  onBeforeUnmount(async () => {
    // stop all asynchronous watcher
    Object.keys(unwatch).forEach((el) => {
      if (typeof unwatch[el] === "function") unwatch[el]!();
    });
    showDialog.value = false;
    await nextTick();
    document.removeEventListener("keydown", KBDControls);
    document.removeEventListener("click", toOpenDialog);
    utils.checkEscStatus(bb.uniqueId!, true);
    utils.unlockWindowScroll(bb.uniqueId!);
  });

  return {
    target: dialoger.value!,
    settings,
    exit,
  };
}
