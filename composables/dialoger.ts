// Usage: import { useDialoger } from 'components/composables/useDialoger.ts';
// Usage: const { showDialog, teleporter } = useDialoger(dialoger, 'dialoger-id', options);
import type { ShallowRef } from 'vue';

interface Settings {
  namespace?: string;
  toBeConsidered?: string;
  toggler?: string;
  toExcuseToggler?: string;
  closeOnEsc?: boolean;
  closeOnWrapperClick?: boolean;
  dismissible?: boolean;
  dismisser?: string;
  autoFocusEl?: string;
  commands?: {
    open: string;
    close: string;
  };
  inDuration?: number;
  outDuration?: number;
  hashDialog?: boolean;
  controller?: (dialoger: HTMLElement, settings: Settings) => void;
  ready?: (dialoger: HTMLElement, settings: Settings) => void;
  complete?: (dialoger: HTMLElement, settings: Settings) => void;
  caller?: HTMLElement;
}

export function useDialoger(
  dialoger: ShallowRef<HTMLDivElement | null>,
  id: string,
  options?: Partial<Settings>
) {
  const router = useRouter();
  const route = useRoute();
  const showDialog = ref(false);
  const teleporter = ref(false);
  const settings: Settings = {
    namespace: 'dialog',
    toBeConsidered: '.dialog, .dg-controls',
    toggler: '.open-dialog',
    toExcuseToggler: '.ex-open-dialog',
    closeOnEsc: true,
    closeOnWrapperClick: true,
    dismissible: true,
    dismisser: '.exit-dialog',
    autoFocusEl: '[dg-autofocus]',
    commands: {
      open: 'open dialog',
      close: 'close dialog',
    },
    inDuration: 500,
    outDuration: 500,
    hashDialog: false,
    ...options,
  };
  const bb = {
    uniqueId: undefined as string | undefined,
    openWithHash: false,
    scrollPosBeforeLock: { top: 0, left: 0 },
  };
  const unwatch: { [key: string]: (() => void) | undefined } = {
    openDialogFromRoute: undefined,
    closeOnRouteChange: undefined,
  };

  function exitByClick(e: MouseEvent) {
    if (
      (settings.closeOnWrapperClick && e.target === dialoger.value) ||
      (settings.dismissible &&
        (e.target as HTMLElement).closest(settings.dismisser!))
    )
      showDialog.value = false;
  }

  function KBDControls(e: KeyboardEvent) {
    // tab function in dialog
    if (e.key === 'Tab') utils.focusRangeOnTab(dialoger.value!, e);
    // Control + A function in dialog
    else if (e.ctrlKey && e.code === 'KeyA') {
      if (document.querySelectorAll('input:focus, textarea:focus')[0]) return;
      e.preventDefault();
      utils.setHighlightRange(dialoger.value!);
    }
  }

  function exitByEscKeyPress(e: KeyboardEvent) {
    if (e.key === 'Escape' && utils.checkEscStatus(bb.uniqueId!))
      showDialog.value = false;
  }

  function backToExit() {
    history.pushState(null, '', window.location.href);
    showDialog.value = false;
  }

  function toOpenDialog(e: MouseEvent) {
    let target = e.target as HTMLElement;
    let toggler = target.closest(`${settings.toggler}[data-target="${id}"]`);
    if (!toggler || target.closest(settings.toExcuseToggler!)) return;
    settings.caller = toggler as HTMLElement;
    showDialog.value = !showDialog.value;
  }

  onMounted(() => {
    bb.uniqueId = utils.getUniqueId(settings.namespace!);
    teleporter.value = true;

    // click on dialoger toggler to open dialog
    document.addEventListener('click', toOpenDialog);

    dialoger.value!.addEventListener('dgconsole', ((e: CustomEvent<string>) => {
      if (e.detail === settings.commands!.open) showDialog.value = true;
      else if (e.detail === settings.commands!.close) showDialog.value = false;
    }) as EventListener);

    if (settings.hashDialog) {
      // open dialog from hash
      unwatch.openDialogFromRoute = watch(
        () => route.hash,
        async (newHash) => {
          if (newHash === `#${id}` && !showDialog.value) {
            bb.openWithHash = true;
            showDialog.value = true;
          }
        },
        { immediate: true }
      );
    }
  });

  watch(showDialog, (value) => {
    if (value) {
      // teleporter.value = true;
      utils.afterNextRepaint(() => {
        if (settings.hashDialog) {
          bb.scrollPosBeforeLock = {
            top: window.scrollY,
            left: window.scrollX,
          };
          if (!bb.openWithHash) router.replace({ hash: `#${id}` });
          window.addEventListener('popstate', backToExit);
          // exit when route hash changes
          unwatch.closeOnRouteChange = watch(
            () => route.hash,
            (newHash) => {
              if (newHash !== `#${id}`) {
                showDialog.value = false;
              }
            }
          );
        }

        utils.lockWindowScroll(bb.uniqueId!);

        // If a controller function is provided in the settings, call it with the lightbox element and settings.
        // The controller function can be used to perform additional setup or customization of the lightbox.
        if (typeof settings.controller === 'function')
          settings.controller(dialoger.value!, settings);

        document.addEventListener('keydown', KBDControls);
        dialoger.value!.addEventListener('click', exitByClick);
        if (settings.closeOnEsc) {
          utils.trackEscOn(bb.uniqueId!);
          document.addEventListener('keyup', exitByEscKeyPress);
        }
        dialoger.value!.classList.add('active');
        setTimeout(() => {
          if (typeof settings.ready === 'function')
            settings.ready(dialoger.value!, settings);
          dialoger.value!.scrollTop = 0;

          let autoFocusEl = [
            ...dialoger.value!.querySelectorAll(
              `:scope ${settings.autoFocusEl}`
            ),
          ][0] as HTMLElement;
          if (autoFocusEl) autoFocusEl.focus();
          else dialoger.value!.focus();
        }, settings.inDuration);
      });
    } else {
      document.removeEventListener('keydown', KBDControls);
      dialoger.value!.removeEventListener('click', exitByClick);
      if (settings.closeOnEsc) {
        // safely get out of escape track
        utils.checkEscStatus(bb.uniqueId!, true);
        document.removeEventListener('keyup', exitByEscKeyPress);
      }

      dialoger.value!.classList.remove('active');
      if (settings.hashDialog) {
        unwatch.closeOnRouteChange!();
        window.removeEventListener('popstate', backToExit);
        router.replace({ hash: '' });
        bb.openWithHash = false;
        utils.afterNextRepaint(() => window.scrollTo(bb.scrollPosBeforeLock));
      }
      setTimeout(() => {
        if (typeof settings.complete === 'function')
          settings.complete(dialoger.value!, settings);
        if (settings.caller) settings.caller.focus();
        settings.caller = undefined;
        utils.unlockWindowScroll(bb.uniqueId!);
        // utils.afterNextRepaint(() => (teleporter.value = false));
      }, settings.outDuration);
    }
  });

  onBeforeUnmount(() => {
    // stop all asynchronous watcher
    Object.keys(unwatch).forEach((el) => {
      if (typeof unwatch[el] === 'function') unwatch[el]!();
    });
    showDialog.value = false;
    document.removeEventListener('keydown', KBDControls);
    document.removeEventListener('click', toOpenDialog);
    utils.unlockWindowScroll(bb.uniqueId!);
  });

  return { showDialog, teleporter };
}
