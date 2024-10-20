<script setup>
const el = useTemplateRef('el');
const props = defineProps(['options']);
const settings = {
  ...{
    namespace: 'iScroller',
    scrollBody: '.scroll-items',
    scrollChildren: '.item',
    prevCtrlBtn: '.l-scroll',
    nextCtrlBtn: '.r-scroll',
    autoProvideCtrls: true,
    tolerance: 10,
    duration: 300,
  },
  ...props.options || {}
};
const rect = {};
const coords = {};

let scrollElem, prevBtn, nextBtn, items;

onMounted(() => {
  scrollElem = el.value.querySelector(settings.scrollBody);
  prevBtn = [...el.value.querySelectorAll(settings.prevCtrlBtn)];
  nextBtn = [...el.value.querySelectorAll(settings.nextCtrlBtn)];
  items = [...el.value.querySelectorAll(settings.scrollChildren)];

  if (!scrollElem) {
    console.warn('An IScrollable element does not exist');
    return;
  }

  window.addEventListener('resize', onResizeMtd);
  scrollElem.addEventListener('scroll', onScrollMtd);
  el.value.ondragstart = () => false;
  if (prevBtn[0]) prevBtn.forEach((el) => el.addEventListener('click', prevControl));
  if (nextBtn[0]) nextBtn.forEach((el) => el.addEventListener('click', nextControl));
  onResizeMtd();
});
onUnmounted(() => {
  window.removeEventListener('resize', onResizeMtd);
  scrollElem.removeEventListener('scroll', onScrollMtd);
  if (prevBtn[0]) prevBtn.forEach((el) => el.removeEventListener('click', prevControl));
  if (nextBtn[0]) nextBtn.forEach((el) => el.removeEventListener('click', nextControl));
});

function getRect() {
  rect.width = scrollElem.clientWidth;
  rect.left = utils.offsetPos(scrollElem).left;
  rect.scrollPos = scrollElem.scrollLeft;
  rect.maxScroll = scrollElem.scrollWidth - rect.width;
}
function dist(e) {
  return e.type.indexOf('touch') > -1 ? e.touches[0].pageX : e.clientX;
}
function onResizeMtd() {
  getRect();
  onScrollMtd();
}
function onScrollMtd() {
  if (scrollElem.scrollLeft === 0) prevBtn.forEach((el) => el.classList.add('disabled'));
  else prevBtn.forEach((el) => el.classList.remove('disabled'));
  if (scrollElem.scrollLeft >= rect.maxScroll - settings.tolerance) nextBtn.forEach((el) => el.classList.add('disabled'));
  else nextBtn.forEach((el) => el.classList.remove('disabled'));
}
function gestureStart(e) {
  if (scrollElem.contains(e.target) || e.target === scrollElem) {
    getRect();
    coords.start = dist(e);
    coords.change = false;
    scrollElem.classList.add('swiping');

    if (e.type === 'touchstart') {
      document.addEventListener('touchmove', gestureMove);
      document.addEventListener('touchend', gestureEnd);
    } else if (e.type === 'mousedown') {
      document.addEventListener('mousemove', gestureMove);
      document.addEventListener('mouseup', gestureEnd);
    }
  }
}
function gestureMove(e) {
  coords.end = dist(e);
  if (Math.abs(coords.end - coords.start) > 5 && !coords.change) coords.change = true;
  if (coords.change) scrollElem.scrollLeft = rect.scrollPos - (coords.end - coords.start);
}
function gestureEnd(e) {
  if (e.type === 'touchend') {
    document.removeEventListener('touchmove', gestureMove);
    document.removeEventListener('touchend', gestureEnd);
  } else {
    document.removeEventListener('mousemove', gestureMove);
    document.removeEventListener('mouseup', gestureEnd);
  }

  scrollElem.classList.remove('swiping');
  rect.scrollPos = scrollElem.scrollLeft;
}
function wheelControl(e) {
  getRect();

  if (e.deltaY > 0 && Math.ceil(rect.scrollPos) < rect.maxScroll) {
    e.preventDefault();
    scrollElem.scrollLeft = rect.scrollPos + 30;
  } else if (e.deltaY < 0 && rect.scrollPos != 0) {
    e.preventDefault();
    scrollElem.scrollLeft = rect.scrollPos - 30;
  }
}
function prevControl() {
  getRect();

  let checker = [];
  if (items[0]) {
    items.forEach((el) => {
      if (utils.offsetPos(el).left + el.offsetWidth - rect.left < 0) return;
      else checker.push(rect.scrollPos - (rect.left + rect.width - utils.offsetPos(el).left - el.offsetWidth));
    });
  }

  animateScroll(
    checker.length
      ? Math.min.apply(null, checker) + settings.tolerance
      : rect.scrollPos - rect.width > 0
        ? rect.scrollPos - rect.width
        : 0
  );
}
function nextControl() {
  getRect();

  let checker = [];
  if (items[0]) {
    items.forEach((el) => {
      if (utils.offsetPos(el).left - rect.left < 0 || utils.offsetPos(el).left + el.offsetWidth < rect.left + rect.width) return;
      else checker.push(rect.scrollPos + utils.offsetPos(el).left - rect.left);
    });
  }
  animateScroll(
    checker.length
      ? Math.min.apply(null, checker) - settings.tolerance
      : rect.maxScroll > rect.scrollPos + rect.width
        ? rect.scrollPos + rect.width
        : rect.maxScroll);
}
function animateScroll(scrollExt) {
  anime({
    targets: scrollElem,
    scrollLeft: scrollExt,
    duration: settings.duration,
    easing: 'linear',
  });
}
</script>

<template>
  <div ref="el" class="i-scroller" @mousedown="gestureStart" @touchstart="gestureStart" @wheel="wheelControl">
    <slot />
  </div>
</template>