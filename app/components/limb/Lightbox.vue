<script lang="ts" setup>
import type { WatchStopHandle } from 'vue';

// Declare the global YT type for TypeScript
declare global {
  interface Window {
    YT: any;
  }
}
declare var YT: any;

type LightboxSettings = {
  namespace: string;
  toBeConsidered: string;
  toggler: string;
  toExcuseToggler: string;
  closeOnEsc: boolean;
  closeOnWrapperClick: boolean;
  dismissible: boolean;
  dismisser: string;
  maxZoom: number;
  inDuration: number;
  outDuration: number;
  slideshow: boolean;
  slideshowDuration: number;
  transitionDuration: number;
  thumbnailsView: boolean;
  hashControl: boolean;
  controller?: (event: {
    target: HTMLElement;
    settings: DialogerSettings;
    caller?: HTMLElement;
  }) => void;
  ready?: (event: {
    target: HTMLElement;
    settings: DialogerSettings;
    caller?: HTMLElement;
  }) => void;
  complete?: (event: {
    target: HTMLElement;
    settings: DialogerSettings;
    caller?: HTMLElement;
  }) => void;
  slidePlayer?: ReturnType<typeof setInterval>;
  caller?: HTMLElement;
  gallery?: boolean;
  [key: string]: any;
};

type BrainBox = {
  uniqueId?: string;
  startCoords: { x: number; y: number; z: number };
  endCoords: { x: number; y: number; z: number };
  initCoords: {
    x: number;
    y: number;
    zoom: number;
    pointOnContent?: {
      x: number;
      y: number;
    };
  };
  newCoords: {
    x: number;
    y: number;
    zoom: number;
    change: boolean;
  };
  sliderRect?: DOMRect;
  doubleTap: number;
  doubleTapTimeout?: ReturnType<typeof setTimeout> | undefined;
  moveDir: number;
  maybeCaption: boolean;
  captionTogglePrevented: boolean;
  readjustTimeout?: ReturnType<typeof setTimeout> | undefined;
  gestureTime: number;
  touchGT?: number;
  mouseGT?: number;
  youtubeSlides: boolean;
  viewportMeta: string;
  prevHash: string;
  openWithHash: boolean;
  inOutTimeout?: ReturnType<typeof setTimeout>;
  scrollPosBeforeLock?: { top: number; left: number };
};

type reactiveBrainBox = {
  showLightbox: boolean;
  thumbnailsView: boolean;
  caller: HTMLElement | undefined;
  slidesNo: number;
  currSlideNo: number;
  slidesData: slideContent[] | undefined;
  playing: boolean;
};

type slideContent = {
  url?: string;
  type?: string;
  contentId?: string;
  videoId?: string;
  youtubeRef?: any; // Use 'any' to avoid TS error if YT.Player type is not available
  caption?: string;
  markup?: string;
  thumbnail?: string;
};

const router = useRouter();
const route = useRoute();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});
const lightbox = useTemplateRef('lightbox');
const slides = useTemplateRef('slide');
const settings: LightboxSettings = {
  ...{
    namespace: 'lightbox',
    toBeConsidered: '.slide, .lb-control',
    toggler: '.open-lightbox',
    toExcuseToggler: '.ex-open-lightbox',
    closeOnEsc: true,
    closeOnWrapperClick: true,
    dismissible: true,
    dismisser: '.exit-lightbox',
    maxZoom: 5,
    inDuration: 500,
    outDuration: 500,
    slideshow: true,
    slideshowDuration: 6000,
    transitionDuration: 350,
    thumbnailsView: true,
    hashControl: true,
  },
  ...(props.options || {}),
};
const bb: BrainBox = {
  // brainbox
  startCoords: { x: 0, y: 0, z: 0 },
  endCoords: { x: 0, y: 0, z: 0 },
  initCoords: { x: 0, y: 0, zoom: 1 },
  newCoords: { x: 0, y: 0, zoom: 1, change: false },
  doubleTap: 0,
  moveDir: 0,
  gestureTime: 0,
  maybeCaption: false,
  captionTogglePrevented: false,
  youtubeSlides: false,
  viewportMeta: '',
  prevHash: '',
  openWithHash: false,
};
const vbb = reactive<reactiveBrainBox>({
  //view brainbox
  showLightbox: false,
  thumbnailsView: true,
  caller: undefined,
  slidesNo: 0,
  currSlideNo: 0,
  slidesData: undefined,
  playing: false,
});
const unwatch: {
  [key: string]: WatchStopHandle;
} = {};

let toolbar: HTMLElement;
let progressBar: HTMLElement;
let slider: HTMLElement;
let prevBtn: HTMLElement;
let nextBtn: HTMLElement;

let slidesTogglers: HTMLElement[] = [];
let gallery: HTMLElement;
let currSlide: HTMLElement;
let prevSlide: HTMLElement | null;
let nextSlide: HTMLElement | null;
let currContent: HTMLElement;
let currPic: HTMLElement | HTMLIFrameElement | HTMLVideoElement;
let sizeStream: ResizeObserver;

function clickToOpenLightbox(e: MouseEvent) {
  let target = e.target as HTMLElement;
  let toggler = target.closest(
    `${settings.toggler}[data-target="${props.id}"]`
  ) as HTMLElement;
  if (!toggler || target.closest(settings.toExcuseToggler)) return;
  triggerViewOf(toggler);
}
async function init() {
  let newTogglers = (
    [
      ...document.querySelectorAll(`[data-target="${props.id}"]`),
    ] as HTMLElement[]
  ).filter(
    (el) =>
      el.matches('[data-lightbox]') ||
      el.matches('[data-find-lightbox-content]')
  );
  if (!utils.compareArrays(slidesTogglers, newTogglers)) {
    let slidesData: slideContent[] = [];
    slidesTogglers = newTogglers;
    slidesTogglers.forEach((el) => slidesData.push(getContent(el)));
    vbb.slidesData = slidesData;
    vbb.slidesNo = vbb.slidesData.length;
  }
  if (bb.youtubeSlides) {
    // Wait for the YouTube API to be ready
    let youtubeAPIState = await loadYouTubeAPI();
    if (youtubeAPIState instanceof Error) return;
    // wait a bit to ensure the API is loaded
    await nextTick();
    if (window.YT && window.YT.Player) {
      // If YT.Player is already available, we can proceed immediately
      vbb.slidesData
        ?.filter((el) => el.type === 'youtube' && el.youtubeRef === undefined)
        .forEach((slide) => {
          let slideElement = slides.value!.find(
            (elem) => elem.getAttribute('data-cont-id') === slide.contentId
          );
          if (slideElement) {
            slide.youtubeRef = new YT.Player(
              slideElement.querySelector(`:scope > .content > iframe`)
            );
          }
        });
    }
  }
}
function setInteractionRange(e: KeyboardEvent) {
  // tab function in panel
  if (e.key === 'Tab') utils.focusRangeOnTab(lightbox.value!, e);
  // Control + A function in panel
  else if (e.ctrlKey && e.code === 'KeyA') {
    if (document.querySelectorAll('input:focus, textarea:focus')[0]) return;
    e.preventDefault();
    utils.setHighlightRange(lightbox.value!);
  }
}
function backToExit() {
  history.pushState(null, '', window.location.href);
  vbb.showLightbox = false;
}
function exitWithEscKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && utils.checkEscStatus(bb.uniqueId!))
    vbb.showLightbox = false;
}
function resizeIframe() {
  if (!currPic || currPic.nodeName !== 'IFRAME') return;
  let srcWidth = currPic.clientWidth;
  let srcHeight = currPic.clientHeight;
  let ratio = Math.min(
    currContent.clientWidth / srcWidth,
    currContent.clientHeight / srcHeight
  );

  currPic.style.width = `${srcWidth * ratio}px`;
  currPic.style.height = `${srcHeight * ratio}px`;
}
function toolbarControls(e: MouseEvent) {
  let target = e.target as HTMLElement;
  // Zoom-in and zoom-out funtionality on toolbar
  if (target.closest('.item.zoom-in, .item.zoom-out')) {
    stopSlideshow();
    bb.newCoords.zoom = Math.min(
      settings.maxZoom,
      target.closest('.item.zoom-in')
        ? bb.newCoords.zoom + 0.5
        : bb.newCoords.zoom - 0.5
    );
    reAdjustSlide();
  }
  // Gallery-view toggler
  else if (target.closest('.item.gallery-switch')) {
    if (lightbox.value!.classList.contains('pic-only')) {
      lightbox.value!.classList.remove('pic-only');
      lightbox.value!.classList.add('show-gallery');
      [...toolbar.querySelectorAll(':scope .item.pic-only')].forEach((el) =>
        el.classList.remove('active')
      );
      [...toolbar.querySelectorAll(':scope .item.gallery-switch')].forEach(
        (el) => el.classList.add('active')
      );
    } else {
      [...toolbar.querySelectorAll(':scope .item.gallery-switch')].forEach(
        (el) => el.classList.toggle('active')
      );
      lightbox.value!.classList.toggle('show-gallery');
    }
    utils.afterNextRepaint(() => {
      reAdjustSlide();
      if (lightbox.value!.classList.contains('show-gallery')) {
        // delay set activeView of gallery to get accurate values
        setTimeout(
          () =>
            utils.triggerEvent(
              gallery,
              'activeView',
              gallery.querySelector(
                `:scope .thumbnail[data-gallery-ref="${vbb.currSlideNo}"]`
              )
            ),
          settings.transitionDuration
        );
        resizeIframe();
      }
    });
  }
  // Slideshow start and pause control
  else if (target.closest('.item.slideshow') && settings.slideshow) {
    if (vbb.playing) stopSlideshow();
    else startSlideshow();
  }
  // Fullscreen functionality
  else if (target.closest('.item.fullscreen-switch')) {
    if (document.fullscreenElement === lightbox.value!) {
      document.exitFullscreen();
    } else {
      lightbox.value!.requestFullscreen();
      [...toolbar.querySelectorAll(':scope .item.fullscreen-switch')].forEach(
        (el) => el.classList.add('active')
      );
    }
  }
  // Pic-only Funtionality
  else if (target.closest('.item.pic-only')) {
    [...toolbar.querySelectorAll(':scope .item.pic-only')].forEach((el) =>
      el.classList.toggle('active')
    );
    lightbox.value!.classList.toggle('pic-only');

    utils.afterNextRepaint(() => {
      reAdjustSlide();
      if (lightbox.value!.classList.contains('show-gallery')) {
        // delay set activeView of gallery to get accurate values
        setTimeout(
          () =>
            utils.triggerEvent(
              gallery,
              'activeView',
              gallery.querySelector(
                `:scope .thumbnail[data-gallery-ref="${vbb.currSlideNo}"]`
              )
            ),
          settings.transitionDuration
        );
        resizeIframe();
      }
    });
  }
}
function fullscreenOutFunc() {
  if (document.fullscreenElement !== lightbox.value!)
    [...toolbar.querySelectorAll(':scope .item.fullscreen-switch')].forEach(
      (el) => el.classList.remove('active')
    );
  resizeIframe();
  if (bb.newCoords.zoom > 1) reAdjustSlide();
}
function resizeFunc() {
  reAdjustSlide();

  if (lightbox.value!.classList.contains('show-gallery')) {
    // delay set activeView of gallery to get accurate values
    setTimeout(
      () =>
        utils.triggerEvent(
          gallery,
          'activeView',
          gallery.querySelector(
            `:scope .thumbnail[data-gallery-ref="${vbb.currSlideNo}"]`
          )
        ),
      settings.transitionDuration
    );
    resizeIframe();
  }
}
function zoomToFit(coords: { x: number; y: number; zoom?: number }) {
  // re-calculate coords.x and coords.y to
  // (1) consider slider's top and left as it starting point (boundry) instead of window top and left
  // (2) re-factor to having a transform-origin of center center
  //     (ie. coords.x minus half width of currContent and coords.y minus half height of currContent)
  //     (boundry width and height is used because currContent has a width and height of 100%).
  let cursorX = coords.x - bb.sliderRect!.left - bb.sliderRect!.width / 2;
  let cursorY = coords.y - bb.sliderRect!.top - bb.sliderRect!.height / 2;
  let pointOnContentX = (cursorX - bb.newCoords.x) / bb.newCoords.zoom;
  let pointOnContentY = (cursorY - bb.newCoords.y) / bb.newCoords.zoom;

  if (coords.zoom === undefined)
    return { x: pointOnContentX, y: pointOnContentY };

  coords.zoom = Math.min(settings.maxZoom, Math.max(coords.zoom, 0.5));
  bb.newCoords.x = cursorX - pointOnContentX * coords.zoom;
  bb.newCoords.y = cursorY - pointOnContentY * coords.zoom;
  bb.newCoords.zoom = coords.zoom;
  currContent.style.transform = `translate(${bb.newCoords.x}px, ${bb.newCoords.y}px) scale(${bb.newCoords.zoom})`;
}
function wheelToZoom(e: WheelEvent) {
  let target = e.target as HTMLElement;
  if (!target.closest('.content')) return;
  if (vbb.playing) stopSlideshow();
  e.preventDefault();

  zoomToFit({
    x: e.clientX,
    y: e.clientY,
    zoom: e.deltaY < 0 ? bb.newCoords.zoom * 1.2 : bb.newCoords.zoom / 1.2,
  });
  clearTimeout(bb.readjustTimeout);
  bb.readjustTimeout = setTimeout(reAdjustSlide, 350);
}
function gallerySwitch(e: MouseEvent) {
  let target = e.target as HTMLElement;
  let thumbnail = target.closest('.thumbnail');
  if (!thumbnail) return;
  update(Number(thumbnail.getAttribute('data-gallery-ref')));
  stopSlideshow();
}
function exitOnWrapperClick(e: MouseEvent) {
  let target = e.target as HTMLElement;
  if (
    (settings.closeOnWrapperClick &&
      !target.closest(settings.toBeConsidered)) ||
    (settings.dismissible && target.closest(settings.dismisser))
  )
    vbb.showLightbox = false;
}
function reAdjustSlide() {
  if (bb.newCoords.zoom > 1) {
    if (bb.newCoords.zoom >= settings.maxZoom) {
      bb.newCoords.zoom = settings.maxZoom;
      [...toolbar.querySelectorAll(':scope .item.zoom-in')].forEach((el) =>
        el.classList.add('disabled')
      );
    } else {
      [...toolbar.querySelectorAll(':scope .item.zoom-in')].forEach((el) =>
        el.classList.remove('disabled')
      );
    }

    let xMax = Math.abs(
      (currPic.clientWidth * bb.newCoords.zoom - currContent.clientWidth) / 2
    );
    let yMax = Math.abs(
      (currPic.clientHeight * bb.newCoords.zoom - currContent.clientHeight) / 2
    );

    bb.newCoords.x =
      Math.abs(bb.newCoords.x) > xMax
        ? Math.sign(bb.newCoords.x) * xMax
        : bb.newCoords.x;
    bb.newCoords.y =
      Math.abs(bb.newCoords.y) > yMax
        ? Math.sign(bb.newCoords.y) * yMax
        : bb.newCoords.y;
    [...toolbar.querySelectorAll(':scope .item.zoom-out')].forEach((el) =>
      el.classList.remove('disabled')
    );
  } else {
    bb.newCoords.x = 0;
    bb.newCoords.y = 0;
    bb.newCoords.zoom = 1;
    [...toolbar.querySelectorAll(':scope .item.zoom-out')].forEach((el) =>
      el.classList.add('disabled')
    );
    [...toolbar.querySelectorAll(':scope .item.zoom-in')].forEach((el) =>
      el.classList.remove('disabled')
    );
  }
  currContent.style.transform = `translate(${bb.newCoords.x}px, ${bb.newCoords.y}px) scale(${bb.newCoords.zoom})`;
  resizeIframe();
}

onMounted(async () => {
  bb.uniqueId = utils.getUniqueId(settings.namespace);
  progressBar = lightbox.value!.querySelector(
    ':scope > .progress-bar > .determinate'
  ) as HTMLElement;
  toolbar = lightbox.value!.querySelector(
    ':scope > .icon-bar.lb-control'
  ) as HTMLElement;
  gallery = lightbox.value!.querySelector(
    ':scope > .gallery-view'
  ) as HTMLElement;
  slider = lightbox.value!.querySelector(':scope > .slides') as HTMLElement;
  prevBtn = slider.querySelector(':scope > .lb-control.c-prev') as HTMLElement;
  nextBtn = slider.querySelector(':scope > .lb-control.c-next') as HTMLElement;

  // click on lightbox toggler to open lightbox event
  document.addEventListener('click', clickToOpenLightbox);

  lightbox.value!.addEventListener('lbconsole', ((
    e: CustomEvent<string | { command: string; el: HTMLElement }>
  ) => {
    if (
      typeof e.detail === 'object' &&
      e.detail.command === 'view in lightbox' &&
      e.detail.el &&
      e.detail.el.matches(`[data-target="${props.id}"]`)
    )
      triggerViewOf(e.detail.el);
    else if (e.detail === 'close lightbox') vbb.showLightbox = false;
  }) as EventListener);

  prevBtn.addEventListener('click', () => {
    update(vbb.currSlideNo - 1);
    stopSlideshow();
  });
  nextBtn.addEventListener('click', () => {
    update(vbb.currSlideNo + 1);
    if (vbb.playing) {
      stopSlideshow();
      startSlideshow();
    }
  });
  sizeStream = new ResizeObserver(() => {
    bb.sliderRect = slider.getBoundingClientRect();
  });
  sizeStream.observe(slider);

  init();
  vbb.currSlideNo = vbb.slidesNo ? 1 : 0;

  if (settings.hashControl) {
    unwatch.openLightboxFromRoute = watch(
      () => route.hash,
      async (newHash) => {
        if (newHash === `#${props.id}` && !vbb.showLightbox) {
          init();
          vbb.currSlideNo = vbb.slidesNo ? 1 : 0;
          bb.openWithHash = true;
          await nextTick();
          vbb.showLightbox = true;
        }
        // else if (vbb.showLightbox) vbb.showLightbox = false;
      },
      { immediate: true }
    );
  }
});
onBeforeUnmount(() => {
  // stop all asynchronous watcher
  Object.keys(unwatch).forEach((el) => {
    if (typeof unwatch[el] === 'function') unwatch[el]();
  });
  document.removeEventListener('click', clickToOpenLightbox);
  if (document.fullscreenElement === lightbox.value!) document.exitFullscreen();
  if (settings.hashControl) window.removeEventListener('popstate', backToExit);
  document.removeEventListener('keydown', setInteractionRange);
  utils.checkEscStatus(bb.uniqueId!, true);
  document.removeEventListener('keyup', exitWithEscKey);
  document.removeEventListener('fullscreenchange', fullscreenOutFunc);
  window.removeEventListener('resize', resizeFunc);
  document.removeEventListener('touchmove', gestureMove);
  document.removeEventListener('touchend', gestureEnd);
  document.removeEventListener('mousemove', gestureMove);
  document.removeEventListener('mouseup', gestureEnd);
  sizeStream?.disconnect();
  utils.unlockWindowScroll(bb.uniqueId!);
});

watch(
  () => vbb.showLightbox,
  async (value) => {
    if (value) {
      document.body.append(lightbox.value!);
      await utils.afterNextRepaint();
      lightbox.value!.style.visibility = 'visible';
      if (vbb.slidesNo) update();
      if (settings.hashControl) {
        bb.scrollPosBeforeLock = { top: window.scrollY, left: window.scrollX };
        if (!bb.openWithHash) {
          bb.prevHash = route.hash;
          router.replace({ hash: `#${props.id}` });
        }
        window.addEventListener('popstate', backToExit);
        // exit when route hash changes
        unwatch.closeOnRouteChange = watch(
          () => route.hash,
          (newHash) => {
            if (newHash !== `#${props.id}`) vbb.showLightbox = false;
          }
        );
      }

      utils.lockWindowScroll(bb.uniqueId!);

      // configure viewport meta to let lightbox function well
      let viewportMeta = document.head.querySelector('meta[name=viewport]');
      if (viewportMeta) {
        bb.viewportMeta = viewportMeta.getAttribute('content') ?? '';
        viewportMeta.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      } else {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        viewportMeta.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
        document.head.appendChild(viewportMeta);
      }

      // If a controller function is provided in the settings, call it with the lightbox element and settings.
      // The controller function can be used to perform additional setup or customization of the lightbox.
      if (typeof settings.controller === 'function')
        settings.controller({
          target: lightbox.value!,
          settings,
          caller: settings.caller,
        });
      // set focus and text-highlight range to only lightbox;
      document.addEventListener('keydown', setInteractionRange);

      if (settings.closeOnEsc) {
        utils.trackEscOn(bb.uniqueId!);
        document.addEventListener('keyup', exitWithEscKey);
      }

      lightbox.value!.classList.add('active');
      clearTimeout(bb.inOutTimeout);
      bb.inOutTimeout = setTimeout(() => {
        if (typeof settings.ready === 'function')
          settings.ready({
            target: lightbox.value!,
            settings,
            caller: settings.caller,
          });
        lightbox.value!.focus();
        if (vbb.slidesNo) resizeIframe();

        // // Caption is truncated to contain a line. Click on it to show full text and click out for otherwise.
        // slider.addEventListener('click', captionControl);

        toolbar.addEventListener('click', toolbarControls);
        // Remove the active class from fullscreen-switch when fullscreen is off
        document.addEventListener('fullscreenchange', fullscreenOutFunc);
        // Trigger responsiveness
        window.addEventListener('resize', resizeFunc);
        // Use mouse wheel to zoom image
        slider.addEventListener('wheel', wheelToZoom);
        // Gallery-view controls
        gallery.addEventListener('click', gallerySwitch);

        // Gesture on Lightbox
        lightbox.value!.addEventListener('mousedown', gestureStart);
        lightbox.value!.addEventListener('touchstart', gestureStart);
        // click to exit event
        lightbox.value!.addEventListener('click', exitOnWrapperClick);
        if (vbb.slidesNo) update();
      }, settings.inDuration);
    } else {
      // pause youtube and html5 video when exiting lightbox
      if (currSlide?.getAttribute('data-cont-type') === 'video')
        (currPic as HTMLVideoElement).pause();
      else if (currSlide?.getAttribute('data-cont-type') === 'youtube')
        vbb.slidesData
          ?.find(
            (el) => el.contentId === currSlide.getAttribute('data-cont-id')
          )
          ?.youtubeRef?.pauseVideo();

      document.removeEventListener('keydown', setInteractionRange);
      stopSlideshow();
      lightbox.value!.removeEventListener('click', exitOnWrapperClick);
      if (settings.closeOnEsc) {
        // safely get out of escape track
        utils.checkEscStatus(bb.uniqueId!, true);
        document.removeEventListener('keyup', exitWithEscKey);
      }

      toolbar.removeEventListener('click', toolbarControls);
      if (document.fullscreenElement === lightbox.value!)
        document.exitFullscreen();
      [...toolbar.querySelectorAll(':scope .item.fullscreen-switch')].forEach(
        (el) => el.classList.remove('active')
      );
      document.removeEventListener('fullscreenchange', fullscreenOutFunc);
      window.removeEventListener('resize', resizeFunc);
      slider.removeEventListener('wheel', wheelToZoom);
      gallery.removeEventListener('click', gallerySwitch);
      lightbox.value!.removeEventListener('mousedown', gestureStart);
      lightbox.value!.removeEventListener('touchstart', gestureStart);
      document.removeEventListener('touchmove', gestureMove);
      document.removeEventListener('touchend', gestureEnd);
      document.removeEventListener('mousemove', gestureMove);
      document.removeEventListener('mouseup', gestureEnd);

      lightbox.value!.classList.remove('active');

      if (settings.hashControl) {
        if (typeof unwatch.closeOnRouteChange === 'function')
          unwatch.closeOnRouteChange();
        window.removeEventListener('popstate', backToExit);
        router.replace({ hash: bb.prevHash });
        bb.openWithHash = false;
        utils.afterNextRepaint(() => window.scrollTo(bb.scrollPosBeforeLock));
      }
      clearTimeout(bb.inOutTimeout);
      bb.inOutTimeout = setTimeout(() => {
        lightbox.value!.style.visibility = 'hidden';
        if (typeof settings.complete === 'function')
          settings.complete({
            target: lightbox.value!,
            settings,
            caller: settings.caller,
          });
        slides.value!.forEach((el) =>
          el.classList.remove('active', 'prev-slide', 'next-slide')
        );
        // reset viewport meta to what it was before
        document.head
          .querySelector('meta[name=viewport]')
          ?.setAttribute('content', bb.viewportMeta);
        if (settings.caller) settings.caller.focus();
        settings.caller = undefined;
        utils.unlockWindowScroll(bb.uniqueId!);
      }, settings.outDuration);
    }
  }
);

function triggerViewOf(toggler: HTMLElement) {
  init();
  vbb.currSlideNo = slidesTogglers.indexOf(toggler) + 1;
  vbb.showLightbox = true;
}
function loadYouTubeAPI() {
  return new Promise((resolve, reject) => {
    // This code loads the IFrame Youtube Player API code.
    const youtubeAPI = document.createElement('script');
    youtubeAPI.src = 'https://www.youtube.com/iframe_api';
    youtubeAPI.async = true;
    youtubeAPI.onload = () => resolve(youtubeAPI);
    youtubeAPI.onerror = () =>
      reject(new Error('Failed to load the YouTube IFrame API'));
    document.head.appendChild(youtubeAPI);
  });
}
function getContent(el: HTMLElement) {
  let content: slideContent = {};
  if (el.hasAttribute('data-lightbox')) {
    let ref = el.getAttribute('data-lightbox');

    if (ref !== null) {
      try {
        const parsedUrl = new URL(ref, window.location.href);
        const hostname = parsedUrl.hostname.toLowerCase();
        const pathname = parsedUrl.pathname;

        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
          content.url = ref;
          content.type = 'youtube';
          content.videoId =
            parsedUrl.searchParams.get('v') || pathname.split('/').pop();
          bb.youtubeSlides = true;
        } else {
          const extension = pathname
            .split('.')
            .pop()
            ?.split('?')[0]
            ?.split('#')[0];
          const imageExtensions = [
            'jpg',
            'jpeg',
            'png',
            'webp',
            'avif',
            'gif',
            'svg',
            'bmp',
            'tiff',
          ];
          const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];

          if (imageExtensions.includes(extension!)) {
            content.url = ref;
            content.type = 'image';
          } else if (videoExtensions.includes(extension!)) {
            content.url = ref;
            content.type = 'video';
          } else {
            content.url = ref;
            content.type = 'unknown';
          }
        }
      } catch (error) {
        console.error('Invalid URL in data-lightbox:', ref, error);
      }
    }
  } else if (el.hasAttribute('data-find-lightbox-content')) {
    let ref = el.querySelector(':scope .lightbox-content');

    if (ref) {
      ref = ref.cloneNode(true) as HTMLElement;
      ref.classList.remove('lightbox-content');
      content.markup = ref.outerHTML;
      content.type = ref.nodeName === 'IFRAME' ? 'IFRAME' : 'html';
    }
  }

  if (el.hasAttribute('data-caption'))
    content.caption = el.getAttribute('data-caption') ?? '';
  else if (el.hasAttribute('data-find-lightbox-caption')) {
    let caption = el.querySelector(':scope .lightbox-caption');

    if (caption) {
      caption = caption.cloneNode(true) as HTMLElement;
      caption.classList.remove('lightbox-caption');
      content.caption = caption.outerHTML;
    }
  }

  content.contentId = utils.getUniqueId(content.type || 'content');
  content.thumbnail = el.hasAttribute('data-thumbnail')
    ? el.getAttribute('data-thumbnail') ?? ''
    : content.type === 'image'
    ? content.url
    : content.type === 'youtube'
    ? `https://img.youtube.com/vi/${content.videoId}/default.jpg`
    : `data:image/png;base64,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`;

  return content;
}
function update(newSlideNo: number = vbb.currSlideNo) {
  newSlideNo =
    newSlideNo < 1 ? 1 : newSlideNo > vbb.slidesNo ? vbb.slidesNo : newSlideNo;

  let refresh = newSlideNo === vbb.currSlideNo;
  if (!refresh) {
    slides.value!.forEach((el) =>
      el.classList.remove('active', 'prev-slide', 'next-slide')
    );

    if (newSlideNo < vbb.currSlideNo) currSlide?.classList.add('next-slide');
    else if (newSlideNo > vbb.currSlideNo)
      currSlide?.classList.add('prev-slide');

    // pause youtube and html5 video when current slide change
    if (currSlide?.getAttribute('data-cont-type') === 'video')
      (currPic as HTMLVideoElement).pause();
    else if (currSlide?.getAttribute('data-cont-type') === 'youtube')
      vbb.slidesData
        ?.find((el) => el.contentId === currSlide.getAttribute('data-cont-id'))
        ?.youtubeRef?.pauseVideo();
  }

  vbb.currSlideNo = newSlideNo;
  currSlide = slides.value!.find(
    (el) => el.getAttribute('data-gallery-ref') === `${newSlideNo}`
  ) as HTMLElement;
  prevSlide = currSlide?.previousElementSibling?.matches('.slide')
    ? (currSlide.previousElementSibling as HTMLElement)
    : null;
  nextSlide = currSlide?.nextElementSibling?.matches('.slide')
    ? (currSlide.nextElementSibling as HTMLElement)
    : null;
  currSlide?.classList.add('active');
  prevSlide?.classList.add('prev-slide');
  nextSlide?.classList.add('next-slide');
  currContent = currSlide.querySelector(':scope > .content') as HTMLElement;
  currPic = [...currContent.children][0] as HTMLElement;
  slides.value!.forEach((el) => {
    el.removeAttribute('style');
    el.querySelector(':scope > .content')?.removeAttribute('style');
  });
  bb.newCoords = {
    x: 0,
    y: 0,
    zoom: 1,
    change: false,
  };
  [...toolbar.querySelectorAll(':scope .zoom-out')].forEach((el) =>
    el.classList.add('disabled')
  );

  if (!refresh) {
    // ** delay 50ms to avoid all disruption that might occur during swipe.
    setTimeout(() => {
      // play youtube and html5 video if current slide contains them
      if (!vbb.playing) {
        if (currSlide.getAttribute('data-cont-type') === 'video')
          (currPic as HTMLVideoElement).play();
        else if (currSlide.getAttribute('data-cont-type') === 'youtube')
          vbb.slidesData
            ?.find(
              (el) => el.contentId === currSlide.getAttribute('data-cont-id')
            )
            ?.youtubeRef?.playVideo();
      }
      // Remove full-text class from all slides caption
      slides.value!.forEach((el) =>
        el.querySelector(':scope .caption')?.classList.remove('full-text')
      );
      resizeIframe();
    }, 50);
  }

  if (!vbb.thumbnailsView) return;
  [...gallery.querySelectorAll(':scope .thumbnail')].forEach((el) => {
    if (el.getAttribute('data-gallery-ref') === `${vbb.currSlideNo}`) {
      el.classList.add('active');
      utils.triggerEvent(gallery, 'activeView', el);
      return;
    }
    el.classList.remove('active');
  });
}
function dist(e: TouchEvent | MouseEvent) {
  if ('touches' in e && e.touches.length > 1) {
    let [t1, t2] = e.touches;
    if (t1 && t2) {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
        z: Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY),
      };
    } else {
      // fallback if touches are not available
      return { x: 0, y: 0, z: 0 };
    }
  } else {
    return {
      x:
        'touches' in e ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX,
      y:
        'touches' in e ? e.touches[0]?.clientY ?? 0 : (e as MouseEvent).clientY,
      z: 0, // z is not used for mouse events
    };
  }
}
function gestureStart(e: TouchEvent | MouseEvent) {
  let target = e.target as HTMLElement;
  if (
    (e.type === 'mousedown' && (e as MouseEvent).button != 0) ||
    !vbb.slidesNo ||
    (!currContent.contains(target) && !target.closest('.caption'))
  )
    return;

  e.preventDefault();
  // save gesture time start to know gesture duration
  bb.gestureTime = new Date().getTime();
  bb.maybeCaption = Boolean(target.closest('.caption'));

  if (!target.closest('.caption.full-text')) {
    if (vbb.playing) {
      stopSlideshow();
      vbb.playing = true;
    }

    // allow doubleTap to zoom only on image content.
    if (currSlide.getAttribute('data-cont-type') === 'image') {
      // DoubleTab Function Luncher
      if (e.type === 'touchstart') {
        bb.touchGT = bb.gestureTime;
        var tapLength = bb.touchGT - bb.doubleTap;
      } else {
        bb.mouseGT = bb.gestureTime;
        var tapLength = bb.mouseGT - bb.doubleTap;
      }

      if (
        tapLength < 300 &&
        tapLength > 100 &&
        !('touches' in e && e.touches.length > 1)
      ) {
        if (bb.newCoords.zoom === 1) {
          const coords = dist(e);
          zoomToFit({
            x: coords.x,
            y: coords.y,
            zoom: Math.min(2, settings.maxZoom),
          });
          clearTimeout(bb.readjustTimeout);
          bb.readjustTimeout = setTimeout(reAdjustSlide, 350);
          toolbar
            .querySelectorAll(':scope .item.zoom-out')
            .forEach((el) => el.classList.remove('disabled'));
        } else {
          bb.newCoords.x = 0;
          bb.newCoords.y = 0;
          bb.newCoords.zoom = 1;
          currContent.removeAttribute('style');
          [...toolbar.querySelectorAll(':scope .item.zoom-out')].forEach((el) =>
            el.classList.add('disabled')
          );
        }

        bb.doubleTap = 0;
        bb.maybeCaption = false;
        bb.captionTogglePrevented = false;
        return;
      }

      bb.doubleTap = bb.gestureTime;
    }

    // save the initial value of bb.newCoords to have it accessable when the move-gesture event is triggered. (That's because the bb.newCoords value might change during the event)
    bb.initCoords = {
      ...{
        x: bb.newCoords.x,
        y: bb.newCoords.y,
        zoom: bb.newCoords.zoom,
      },
    };
    bb.startCoords = dist(e);

    //Zooming with pinch
    if ('touches' in e && e.touches.length === 2) {
      if (slider.classList.contains('swiping') && bb.newCoords.change) return;
      // get the percentage of the pointer position relative to the content area
      bb.initCoords.pointOnContent = zoomToFit({
        x: bb.startCoords.x,
        y: bb.startCoords.y,
      });
      currContent.classList.add('zooming');
      bb.doubleTap = 0; // stop double tap function to avoid it triggering after zoom pinch and a tap
    } else {
      // Swiping
      if (bb.newCoords.zoom === 1) {
        slider.classList.add('swiping');
      }
      //Zoom dragging
      else currContent.classList.add('zoom-dragging');
    }
  } else if (bb.maybeCaption) e.stopPropagation();

  if (e.type === 'touchstart') {
    document.addEventListener('touchmove', gestureMove);
    document.addEventListener('touchend', gestureEnd);
  } else if (e.type === 'mousedown') {
    document.addEventListener('mousemove', gestureMove);
    document.addEventListener('mouseup', gestureEnd);
  }
}
function gestureMove(e: TouchEvent | MouseEvent) {
  bb.moveDir = Math.sign(bb.endCoords.x - dist(e).x);
  bb.endCoords = dist(e);
  let coordDiffX = bb.endCoords.x - bb.startCoords.x;
  let coordDiffY = bb.endCoords.y - bb.startCoords.y;

  if (Math.abs(coordDiffX) > 5 || Math.abs(coordDiffY) > 5)
    bb.newCoords.change = true;

  if (bb.newCoords.change) {
    // Pinch Zooming in action
    if (
      'touches' in e &&
      e.touches.length === 2 &&
      currContent.classList.contains('zooming')
    ) {
      bb.newCoords.zoom =
        bb.initCoords.zoom * (bb.endCoords.z / bb.startCoords.z);
      let zoomDiff = bb.initCoords.zoom - bb.newCoords.zoom;

      // This is the translation due to pinch-zooming
      let zoomingX = bb.initCoords.pointOnContent!.x * zoomDiff;
      let zoomingY = bb.initCoords.pointOnContent!.y * zoomDiff;

      // Total translation is from two components:
      // (1) translation due to zooming and
      // (2) from the two fingers translating in unity
      bb.newCoords.x = bb.initCoords.x + zoomingX + coordDiffX;
      bb.newCoords.y = bb.initCoords.y + zoomingY + coordDiffY;
      currContent.style.transform = `translate(${bb.newCoords.x}px, ${bb.newCoords.y}px) scale(${bb.newCoords.zoom})`;
    } else if (
      currContent.classList.contains('zoom-dragging') ||
      slider.classList.contains('swiping')
    ) {
      bb.doubleTap = 0; // stop double-tap initialization
      bb.newCoords.x = bb.initCoords.x + coordDiffX;
      bb.newCoords.y = bb.initCoords.y + coordDiffY;

      // Swipping in action
      if (bb.newCoords.zoom === 1) {
        currSlide.style.transform = `translate(${bb.newCoords.x}px, 0px)`;
        if (bb.newCoords.x > 0) {
          if (prevSlide)
            prevSlide.style.transform = `translate(${
              bb.newCoords.x - bb.sliderRect!.width
            }px, 0px)`;
        } else if (nextSlide)
          nextSlide.style.transform = `translate(${
            bb.newCoords.x + bb.sliderRect!.width
          }px, 0px)`;
      }
      // Zoom-dragging in action
      else
        currContent.style.transform = `translate(${bb.newCoords.x}px, ${bb.newCoords.y}px) scale(${bb.newCoords.zoom})`;
    } else if (bb.maybeCaption && e.type === 'touchmove')
      bb.captionTogglePrevented = true;
  }
}
function gestureEnd(e: TouchEvent | MouseEvent) {
  if (e.type === 'touchend') {
    document.removeEventListener('touchmove', gestureMove);
    document.removeEventListener('touchend', gestureEnd);
  } else {
    document.removeEventListener('mousemove', gestureMove);
    document.removeEventListener('mouseup', gestureEnd);
  }

  if (currContent.matches('.zooming, .zoom-dragging')) {
    // trigger zoomToFit function to adjust the content position and zoom level to the maximum zoom level
    if (currContent.classList.contains('zooming'))
      zoomToFit({
        x: bb.endCoords.x,
        y: bb.endCoords.y,
        zoom: bb.newCoords.zoom,
      });

    currContent.classList.remove('zooming', 'zoom-dragging');
    stopSlideshow();
    reAdjustSlide();
  } else if (slider.classList.contains('swiping')) {
    slider.classList.remove('swiping');
    if (bb.maybeCaption)
      currSlide.querySelector(':scope .caption')?.classList.toggle('full-text');
    else
      currSlide.querySelector(':scope .caption')?.classList.remove('full-text');

    let changeExt = bb.endCoords.x - bb.startCoords.x;

    if (
      ((bb.newCoords.change &&
        Math.abs(changeExt) > currSlide.clientWidth / 20) ||
        (Math.abs(changeExt) > currSlide.clientWidth / 40 &&
          new Date().getTime() - bb.gestureTime < 300)) &&
      ((bb.newCoords.x < 0 && bb.moveDir === 1) ||
        (bb.newCoords.x > 0 && bb.moveDir === -1))
    ) {
      if (bb.newCoords.x < 0) {
        update(vbb.currSlideNo + 1);
        stopSlideshow();
        if (vbb.playing && vbb.slidesNo > vbb.currSlideNo + 1) startSlideshow();
      } else if (bb.newCoords.x > 0) {
        update(vbb.currSlideNo - 1);
        stopSlideshow();
      }
    } else {
      update();
      stopSlideshow();
    }
  } else if (bb.maybeCaption && !bb.captionTogglePrevented)
    currSlide.querySelector(':scope .caption')?.classList.toggle('full-text');

  bb.maybeCaption = false;
  bb.captionTogglePrevented = false;
  slider.classList.remove('swiping'); // Do this to ensure the swiping class is removed if added by event emulation
  clearTimeout(bb.doubleTapTimeout);
  bb.doubleTapTimeout = setTimeout(() => (bb.doubleTap = 0), 300);
  bb.newCoords.change = false;
}
function startSlideshow() {
  function startProgressBar() {
    setTimeout(
      () =>
        progressBar.setAttribute(
          'style',
          `width: 100%; transition: width ${
            settings.slideshowDuration - 200
          }ms ease 0s;`
        ),
      200
    );
  }
  settings.slidePlayer = setInterval(() => {
    update(vbb.currSlideNo + 1 > vbb.slidesNo ? 1 : vbb.currSlideNo + 1);
    progressBar.removeAttribute('style');
    startProgressBar();
  }, settings.slideshowDuration);

  if (!vbb.playing) startProgressBar();
  vbb.playing = true;
  // pause youtube and html5 video when slideshow starts
  if (currSlide.getAttribute('data-cont-type') === 'video')
    (currPic as HTMLVideoElement).pause();
  else if (currSlide.getAttribute('data-cont-type') === 'youtube')
    vbb.slidesData
      ?.find((el) => el.contentId === currSlide.getAttribute('data-cont-id'))
      ?.youtubeRef?.pauseVideo();

  [...toolbar.querySelectorAll(':scope .item.slideshow')].forEach((el) =>
    el.classList.add('active')
  );
  lightbox.value!.classList.add('playing');
}
function stopSlideshow() {
  vbb.playing = false;
  clearInterval(settings.slidePlayer);
  lightbox.value!.classList.remove('playing');
  progressBar.removeAttribute('style');
  [...toolbar.querySelectorAll(':scope .item.slideshow')].forEach((el) =>
    el.classList.remove('active')
  );
}

// a class of open-lightbox
// a data-target attribute to set lightbox gallery id

// a data-lightbox attribute to set lightbox details
// a data-find-lightbox-content to specify that lightbox content should be finded in the lightbox element using the .lightbox-content class

// a data-caption attribute to set a text caption for lightbox
// a data-find-lightbox-caption attribute to specify that caption should be finded in the lightbox element using the .lightbox-caption class

// a data-thumbnails to set a thumbnail picture
</script>
<template>
  <div
    ref="lightbox"
    :id="props.id"
    role="dialog"
    aria-modal="true"
    aria-label="Media lightbox dialog"
    class="lightbox"
    :class="{ 'show-gallery': vbb.thumbnailsView }"
  >
    <div class="progress-bar">
      <div class="determinate"></div>
    </div>
    <div class="icon-bar lb-control inverted menu">
      <div class="xhover status item">
        {{ vbb.currSlideNo }} / {{ vbb.slidesNo }}
      </div>
      <div class="r-aligned items">
        <div class="resp-down-hidden items">
          <button
            class="item active as-icon gallery-switch"
            v-tooltip:aria.unblocking
            aria-label="Show all slides"
          >
            <Icon mode="svg" name="material-symbols:apps" class="icon" />
          </button>
          <button
            v-if="settings.slideshow"
            class="item as-icon slideshow"
            :class="{ disabled: vbb.slidesNo < 2 }"
            v-tooltip:aria.unblocking
            aria-label="Slideshow Play or Pause"
          >
            <Icon
              mode="svg"
              name="material-symbols:play-circle-outline"
              class="nview icon"
            />
            <Icon
              mode="svg"
              name="material-symbols:pause-circle-outline"
              class="aview icon"
            />
          </button>
          <button
            class="item as-icon fullscreen-switch dd-close"
            v-tooltip:aria.unblocking
            aria-label="Toggle fullscreen"
          >
            <Icon
              mode="svg"
              name="material-symbols:fullscreen"
              class="nview icon"
            />
            <Icon
              mode="svg"
              name="material-symbols:fullscreen-exit"
              class="aview icon"
            />
          </button>
          <button
            class="item as-icon zoom-in"
            v-tooltip:aria.unblocking
            aria-label="Zoom in"
          >
            <Icon mode="svg" name="material-symbols:zoom-in" class="icon" />
          </button>
          <button
            class="disabled item zoom-out"
            v-tooltip:aria.unblocking
            aria-label="Zoom out"
          >
            <Icon mode="svg" name="material-symbols:zoom-out" class="icon" />
          </button>
        </div>
        <LimbDropdown
          class="item as-icon resp-up-hidden"
          aria-label="More options"
          :options="{ teleportMenu: false, closeOnItemClick: false }"
        >
          <Icon mode="svg" name="material-symbols:more-vert" class="icon" />
          <div class="drop menu">
            <div role="menuitem" class="item active gallery-switch dd-close">
              <Icon mode="svg" name="material-symbols:apps" class="icon" />
              Show All
            </div>
            <div
              role="menuitem"
              v-if="settings.slideshow"
              class="item slideshow dd-close"
              :class="{ disabled: vbb.slidesNo < 2 }"
            >
              <Icon
                mode="svg"
                name="material-symbols:play-circle-outline"
                class="nview icon"
              />
              <Icon
                mode="svg"
                name="material-symbols:pause-circle-outline"
                class="aview icon"
              />
              Slideshow
            </div>
            <div role="menuitem" class="item fullscreen-switch dd-close">
              <Icon
                mode="svg"
                name="material-symbols:fullscreen"
                class="nview icon"
              />
              <Icon
                mode="svg"
                name="material-symbols:fullscreen-exit"
                class="aview icon"
              />
              Toggle Fullscreen
            </div>
            <div role="menuitem" class="item zoom-in" title="Zoom in">
              <Icon mode="svg" name="material-symbols:zoom-in" class="icon" />
              Zoom-In
            </div>
            <div role="menuitem" class="disabled item zoom-out" title="Zoom out">
              <Icon mode="svg" name="material-symbols:zoom-out" class="icon" />
              Zoom-Out
            </div>
          </div>
        </LimbDropdown>
        <button
          class="item as-icon pic-only"
          v-tooltip:aria.unblocking
          aria-label="Picture only view"
        >
          <Icon mode="svg" name="material-symbols:image-outline" class="icon" />
        </button>
        <button
          class="item as-icon exit-lightbox"
          v-tooltip:aria.unblocking
          aria-label="Exit lightbox"
        >
          <Icon mode="svg" name="material-symbols:close" class="icon" />
        </button>
      </div>
    </div>
    <div class="slides" :data-slidesNo="settings.gallery ? vbb.slidesNo : null">
      <figure
        v-if="vbb.slidesNo"
        ref="slide"
        class="slide"
        v-for="(slide, index) in vbb.slidesData"
        :data-gallery-ref="index + 1"
        :data-cont-type="slide.type"
        :data-cont-id="slide.contentId"
      >
        <figcaption v-if="slide.caption" class="caption">
          <div class="truncate-helper" v-html="slide.caption"></div>
        </figcaption>
        <div class="content">
          <img v-if="slide.type === 'image'" :src="slide.url" alt="" />
          <video v-else-if="slide.type === 'video'" controls>
            <source :src="slide.url" />
          </video>
          <iframe
            v-else-if="slide.type === 'youtube'"
            :src="`https://www.youtube-nocookie.com/embed/${slide.videoId}?enablejsapi=1&playsinline=1`"
            frameborder="0"
            allowfullscreen
          ></iframe>
          <iframe
            v-else-if="slide.type === 'unknown'"
            :src="slide.url"
            frameborder="0"
            allowfullscreen
          ></iframe>
          <template v-else-if="slide.markup" v-html="slide.markup"></template>
        </div>
      </figure>
      <figure v-else class="lb-placeholder" style="text-align: center">
        <svg
          style="fill: currentColor; width: 200px; height: auto"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:v="https://vecta.io/nano"
          width="517"
          height="469"
          viewBox="0 0 296.08 268.47"
          shape-rendering="geometricPrecision"
          image-rendering="optimizeQuality"
          fill-rule="evenodd"
        >
          <path
            d="M.19 126.34l38.86 133.92c3.17 5.54 9.12 9.58 15.33 7.78l95.66-27.88 72.87 21.32c11.08 3.54 17.08-3.67 19.89-13.1l53.28-183.84c0-6.37-3.6-12.32-9.75-14.12L117.3.89c-7.77-2.23-16.27-.56-18.84 8.18l-24.9 84.71-68.12 22.66c-3.59 1.2-6.19 6.66-5.25 9.9zm46.87 71.35c0 4.44 2.49 8.94 6.76 10.65l167.54 49.15c8.62 2.51 14.7 1.67 17.67-8.31l53.44-182.65c.79-5.41-.78-9.21-5.8-12.27L115.15 3.8c-5.55-1.47-10.96 1.06-13.5 6.41L47.06 197.69zm9.17 3.01l170 50.13c3.43.95 4.3-.8 5.14-3.72l53.03-181.1c.96-3.31-.33-4.52-3.27-5.35l-166.1-48.63c-4.22-1.26-5.45-1.01-6.71 3.34L55.33 196.34c-.47 1.56-.44 3.18.9 4.36zm24.35-38.79c0 2.27 1.81 1.76 2.82 2.05l142.93 41.87c2.22.65 2.94.89 3.7-1.74l38.55-131.68c.85-2.92-1.04-2.84-3.43-3.53L124.04 27.56c-2.54-.74-3.46-1.43-4.34 1.66L80.58 161.91zm33.78-67.47c-.33 0-1.27 1.6-2.95.83-.79-.37-1.17-1.19-1.1-2.03l-5.35-1.58-18.51 63.25c.61-.33 2.96-.73 3.69-.84 20.25-3.22 43.04 3.25 65.62-1.18 2.7-.52 2.55-.98 1.38-3.33-2.85-5.69-10.41-14.73 1.98-16.48 15.61-2.19 25.62 3.59 42.29-2.59l-1.87-2.97c-.63-.94-.45-1.49-.14-2.51l4.85-17.13-3.15-23.64-6.55 2.86c-.45.18-.73.63-1.06.97-1.9 1.91-9.75 10.14-10.52 10.39-15.08 4.78-21.58 8.69-35.65 15.54-.68.34-1.39.77-2.15.77-1.05 0-1.93-.96-1.93-1.99 0-1.15.74-1.68 1.63-2.09l7.54-3.68-7.43-.95c-.69-.16-1.23-.72-1.44-1.37l-.4-9.42c0-1.43-.15-1.14.33-2.39.63-1.74 2.1-5.05 2.39-6.74l1.74-10.2c-.13.01-.46.15-.58.2l-17.57 6.53c-2.95 1.22-12.14 9.22-15.09 11.77zM185.1 165c-15.37 6.3-43.92-.09-54.44 5.76-1.26.7-1.39 1.74-1.39 3.1l97.72 28.6 14.8-50.64c-.09.02-.19.11-.28.17-.96.64-2.26.23-2.83-.74l-9.7-17.7c-4.29 1-13.22-.84-17.58 1.68-.68.4-1.33.89-1.9 1.43-7.59 7.32-35.7 2.64-34.58 6.38 1.37 4.51 11.46 11 13.27 16.39.92 2.73-.62 4.56-3.09 5.57zm-33.62-87.66c-1.46 6.27-1.91 10.62-4.23 16.98-.22.56.14 6.9.18 7.98 2.9.07 8.12 1.03 11.01 1.39.81.12.69.08 1.35-.25 8.05-4.03 12.2-6.89 21.07-8.67 1.01-.2 5.53-5.27 6.57-6.34l-1.06-3.91c-.79.53-1.55 1.62-2.49 1.9-3.88 1.17-9.75-14.08-12.48-17.18-.17 3.16-1.48 20.69-2.83 21.83-4.06 3.43-14.96-12.31-17.09-13.73zm56.9 31.11l-4.99 17.29 2.07 3.52c.4 0 1.25-.2 1.68-.28 6.04-.83 13.34-.07 19.51-.07l-8.99-16.08-4.2-15.33c-.63.3-1.84.93-2.47.93-2.28 0-3.78-5.37-4.81-6.56l2.2 16.58zm25.03 24.76l8.96 16.51 4.84-16.41-8.65-2.51c-.41 1.56-3.92 2.12-5.15 2.41zm-75.62-56.32c-1.44 1.99 5.26 7.3 7.46 8.87 1.31.92 2.2-16.29 2.2-18.06-5.54 6.14-3.94.81-9.66 9.19z"
          />
        </svg>
        <figcaption class="font-semibold huge">
          No Lightbox Element Present
        </figcaption>
      </figure>
      <button
        aria-label="Previous Slide"
        :disabled="vbb.currSlideNo <= 1"
        class="lb-control c-prev"
      >
        <Icon mode="svg" name="material-symbols:chevron-left" class="icon" />
      </button>
      <button
        aria-label="Next Slide"
        :disabled="vbb.currSlideNo === vbb.slidesNo"
        class="lb-control c-next"
      >
        <Icon mode="svg" name="material-symbols:chevron-right" />
      </button>
    </div>
    <LimbIScroller
      :options="{
        autoSetup: false,
        scrollBody: '[data-thumbnails]',
        scrollChildren: '.thumbnail',
        prevCtrlBtn: '.l-scroll',
        nextCtrlBtn: '.r-scroll',
      }"
      class="lb-control gallery-view"
    >
      <div data-thumbnails>
        <div
          v-for="(slide, index) in vbb.slidesData"
          class="thumbnail"
          :data-gallery-ref="index + 1"
        >
          <img :src="slide.thumbnail" alt="a thumbnail picture" />
        </div>
      </div>
      <div class="l-scroll">
        <Icon
          mode="svg"
          name="material-symbols:keyboard-double-arrow-left"
          class="icon"
        />
      </div>
      <div class="r-scroll">
        <Icon
          mode="svg"
          name="material-symbols:keyboard-double-arrow-right"
          class="icon"
        />
      </div>
    </LimbIScroller>
  </div>
</template>
