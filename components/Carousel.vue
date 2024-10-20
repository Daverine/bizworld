<script setup>
const carousel = useTemplateRef('carousel');
const props = defineProps(['options']);
const settings = {
  ...{
    namespace: 'carousel',
    autoSetup: true,
    continuous: 'rewind', // can also be set to string 'rewind'
    slidesPerView: 1,
    sliderMove: 'slide', // can also be page to move all the slide in a view out on next or prev
    spaceBetween: '0.5rem',
    breakpoints: [
      // {	
      // 	minWidth: 500,
      // 	// maxWidth: 1700,
      // 	slidesPerView: 3,
      // 	spaceBetween: 20,
      // },
      // {	
      // 	// minWidth: 400,
      // 	minWidth: 800,
      // 	slidesPerView: 2,
      // 	spaceBetween: 50,
      // }
    ],
    animation: 'slide',
    direction: 'horizontal',
    autoCreatetracker: true,
    track: 'default', // can also be the following: 'thumbnails', 'scroll'.
    trackView: 'slide',
    transitionDuration: 500,
    autoslide: true,
    autoslideInterval: 5000,
    pauseOnHover: true,
    imageZoom: true,
    videoAutoPlay: false,
    videoMute: true,
    controllable: true
  },
  ...props.options || {}
};
const uniqueId = utils.getUniqueId(settings.namespace);
const tmp = {
  newCoord: 0,
  startCoord: 0,
  endCoord: 0,
  initCoord: 0,
  gsmScale: 0,
  coordChange: false,
  gsDir: 0,
  autoslider: undefined,
  autosliding: false,
  slidesNo: null,
  slideNo: null,
  slidesPerView: undefined,
  slideExt: undefined,
  minExt: undefined,
  maxExt: undefined,
  gT: undefined,
  updateSet: undefined,
  spaceBetween: undefined,
  sizeResponse: undefined,
  gestureMove: undefined,
  gestureEnd: undefined,
  stopAutoslider: undefined,
  continuous: settings.continuous && settings.continuous !== 'rewind',
};
let viewbox, slider, slides, currSlide, prevSlide, trackerCont, prevBtn, nextBtn, initialized;

onMounted(() => {
  viewbox = carousel.value.querySelector(':scope > .cs-viewbox');

  if (!viewbox) {
    console.error('A carousel in this page does not have it viewbox');
    return;
  }

  slider = viewbox.querySelector(':scope > .cs-slider');

  if (!slider) {
    console.error("A carousel on this page does not have it slider");
    return;
  }

  prevBtn = carousel.value.querySelector(':scope .cs-prev');
  nextBtn = carousel.value.querySelector(':scope .cs-next');
  trackerCont = carousel.value.querySelector(':scope .cs-trackers');
  slider.style.transitionDuration = `${settings.transitionDuration}ms`;
  slider.setAttribute('data-anim', settings.animation);
  slider.ondragstart = () => false; // prevent browser from hijacking swiping process
  slider.addEventListener('mousedown', gestureStart);
  slider.addEventListener('touchstart', gestureStart);

  if (settings.autoslide && settings.pauseOnHover) {
    slider.addEventListener('mouseenter', stopAutoslider);
    slider.addEventListener('mouseleave', startAutoslider);
  }

  // navigator control on carousel
  prevBtn?.addEventListener('click', prevSlides);
  nextBtn?.addEventListener('click', nextSlides);

  // slide track control on carousel
  trackerCont?.addEventListener('click', trackControl);

  // responsiveness
  window.addEventListener('resize', sizeResponse);
  sizeResponse();
});

const changeInSlides = new MutationObserver(sizeResponse);

onUnmounted(() => {
  clearInterval(tmp.autoslider);
  clearTimeout(tmp.updateSet);
  stopAutoslider();
  window.removeEventListener('resize', sizeResponse);
});

function sizeResponse() {
  changeInSlides.disconnect();
  stopAutoslider();
  let mediaWidth = window.innerWidth;
  // sort breakpoints by maxWidth and minWidth and then select the first breakpoint that matches the current media width
  let matchedBreakpoints = settings.breakpoints.filter(el => (el.minWidth || el.maxWidth) && (!el.minWidth || el.minWidth <= mediaWidth) && (!el.maxWidth || el.maxWidth >= mediaWidth));
  let breakpoint = matchedBreakpoints.filter(el => el.maxWidth).sort((a, b) => Number(a.maxWidth) - Number(b.maxWidth))[0] || matchedBreakpoints.filter(el => el.minWidth).sort((a, b) => Number(b.minWidth) - Number(a.minWidth))[0];

  tmp.breakpoint = {
    ...{
      slidesPerView: settings.slidesPerView,
      spaceBetween: settings.spaceBetween,
    },
    ...(breakpoint || {})
  };
  init();
  changeInSlides.observe(carousel.value, { subtree: true, childList: true, });
}
function init() {
  slides = [...slider.querySelectorAll(`:scope > .cs-slide`)].filter(el => !el.matches(`[data-creator='${uniqueId}']`));
  if (!slides[0]) return;
  slider.classList.add('ghost-walk');

  // Initialize carousel
  if (!initialized || tmp.slidesNo !== slides.length) {
    [...carousel.value.querySelectorAll(`:scope [data-creator='${uniqueId}']`)].forEach(el => el.remove());
    slides.forEach((el, index) => {
      el.setAttribute('data-csId', index + 1);

      if (trackerCont && settings.autoCreatetracker) {
        let tracker = document.createElement('button');
        tracker.classList.add('cs-tracker');
        tracker.setAttribute('data-csId', index + 1);
        tracker.setAttribute('data-creator', uniqueId);
        trackerCont.append(tracker);
      }

      if (tmp.continuous) {
        let eC = el.cloneNode(true);
        eC.setAttribute('data-creator', uniqueId);
        eC.classList.remove('active');
        slider.append(eC);
        if (!index) slider.prepend(eC.cloneNode(true));
        else slider.insertBefore(eC.cloneNode(true), slider.children[index]);
      }
    });
    initialized = true;
  }

  tmp.slidesNo = slides.length; // number of slides in the carousel
  // the 1-based index of the current slide
  tmp.slideNo = slides.filter(el => el.classList.contains('active'))[0]
    ? Number(slides.filter(el => el.classList.contains('active'))[0].getAttribute('data-csId'))
    : 1;
  currSlide = slides[tmp.slideNo - 1];
  tmp.spaceBetween = typeof (tmp.breakpoint.spaceBetween) === 'number' ? `${tmp.breakpoint.spaceBetween}px` : tmp.breakpoint.spaceBetween;
  // ensure the slidePerPage is not more than the number of slides in the carousel in a continuous carousel
  tmp.slidesPerView = tmp.continuous && tmp.breakpoint.slidesPerView > tmp.slidesNo ? tmp.slidesNo : tmp.breakpoint.slidesPerView;

  [...slider.querySelectorAll(`:scope > .cs-slide`)].forEach((el) => {
    el.style.width = `calc(((100% + ${tmp.spaceBetween}) / ${tmp.slidesPerView}) - ${tmp.spaceBetween})`;
    el.style.marginRight = tmp.spaceBetween;
  });

  // cache slide extent, mininmum slider move and maximum slider move
  tmp.slideExt = currSlide.offsetWidth + parseFloat(utils.getCssVal(currSlide, 'margin-right'));
  tmp.minExt = tmp.continuous ? -(tmp.slideExt * tmp.slidesNo) : 0;
  tmp.maxExt = (!tmp.continuous && tmp.slidesPerView > 1)
    ? tmp.minExt - (tmp.slideExt * (tmp.slidesNo - tmp.slidesPerView))
    : tmp.minExt - (tmp.slideExt * (tmp.slidesNo - 1));

  update();
  setTimeout(() => { slider.classList.remove('ghost-walk'); }, 10);
  if (settings.autoslide) startAutoslider();
}
function dist(e) {
  return e.type.indexOf("touch") > -1 ? e.touches[0].pageX : e.clientX;
}
function update(newI = tmp.slideNo) {
  clearTimeout(tmp.updateSet);

  newI = (!tmp.continuous)
    ? (newI < 1)
      ? 1
      : (newI > tmp.slidesNo)
        ? tmp.slidesNo
        : newI
    : (newI < 1)
      ? tmp.slidesNo + newI
      : (newI > tmp.slidesNo)
        ? newI - tmp.slidesNo
        : newI;

  // pause html5 video when current slide change
  // stop youtube video when current slide change

  prevSlide = currSlide;
  tmp.slideNo = newI;
  currSlide = slides[tmp.slideNo - 1];
  // newCoord should be in-between mininum Extent and maximum Extent
  tmp.newCoord = Math.min(tmp.minExt, Math.max(tmp.minExt - ((newI - 1) * tmp.slideExt), tmp.maxExt));
  slider.style.transform = `translateX(${tmp.newCoord}px)`;
  tmp.updateSet = setTimeout(() => {
    [...slider.querySelectorAll(`:scope > .cs-slide`)].forEach((el) => el.classList.remove('active'));
    [...slider.querySelectorAll(`:scope > .cs-slide[data-csid='${newI}']`)].forEach((el) => el.classList.add('active'));
  }, settings.transitionDuration);

  // determine controls
  if (!settings.continuous && tmp.slidesNo > 1) {
    if (tmp.slideNo === 1) {
      prevBtn?.classList.add('disabled');
      nextBtn?.classList.remove('disabled');
    }
    else if (tmp.slideNo === tmp.slidesNo) {
      nextBtn?.classList.add('disabled');
      prevBtn?.classList.remove('disabled');
    }
    else {
      prevBtn?.classList.remove('disabled');
      nextBtn?.classList.remove('disabled');
    }
  }

  if (tmp.slidesNo === 1) {
    prevBtn?.classList.add('disabled');
    nextBtn?.classList.add('disabled');
  }

  if (trackerCont) {
    let trackers = [...trackerCont.querySelectorAll(`:scope > .cs-tracker`)];
    trackers.forEach((el) => el.classList.remove('active'));
    trackers[newI - 1]?.classList.add('active');
  }
  tmp.coordChange = false;
}
function gestureStart(e) {
  if (tmp.slidesNo <= 1) return; // stop gesture if total number of slides is one or less;

  if (settings.autoslide) stopAutoslider();

  // save gesture time start to know gesture duration
  tmp.gT = new Date().getTime();

  // save the initial value of bb.newCoord to have it accessable when the move-gesture event is triggered. (That's because the newCoord value might change during the event)
  tmp.initCoord = tmp.newCoord;
  tmp.startCoord = dist(e);
  tmp.coordChange = false;
  tmp.endCoord = tmp.startCoord; // set the initial endCoord to the startpoint coord;

  // Swiping
  slider.classList.add('swiping');

  if (e.type === 'touchstart') {
    document.addEventListener('touchmove', gestureMove);
    document.addEventListener('touchend', gestureEnd);
  }
  else if (e.type === 'mousedown') {
    document.addEventListener('mousemove', gestureMove);
    document.addEventListener('mouseup', gestureEnd);
  }
}
function gestureMove(e) {
  tmp.gsDir = tmp.endCoord > dist(e) ? 1 : tmp.endCoord < dist(e) ? -1 : tmp.gsDir;
  tmp.endCoord = dist(e);
  if (Math.abs(tmp.endCoord - tmp.startCoord) > 5 && !tmp.coordChange) tmp.coordChange = true;

  // Swipping in action
  if (tmp.coordChange) {
    tmp.newCoord = tmp.initCoord + tmp.endCoord - tmp.startCoord + (tmp.gsmScale * Math.abs(tmp.minExt));

    if (tmp.continuous) {
      if (tmp.gsDir === 1 && tmp.newCoord < tmp.maxExt) tmp.gsmScale += 1;
      else if (tmp.gsDir === -1 && tmp.newCoord > tmp.minExt) tmp.gsmScale -= 1;
      tmp.newCoord = tmp.initCoord + tmp.endCoord - tmp.startCoord + (tmp.gsmScale * Math.abs(tmp.minExt));
    }

    slider.style.transform = `translateX(${tmp.newCoord}px)`;
  }
}
function gestureEnd(e) {
  if (e.type === 'touchend') {
    document.removeEventListener('touchmove', gestureMove);
    document.removeEventListener('touchend', gestureEnd);
  }
  else {
    document.removeEventListener('mousemove', gestureMove);
    document.removeEventListener('mouseup', gestureEnd);
  }

  tmp.gsDir = 0; // reset gesture move direction
  tmp.gsmScale = 0; // reset gesture move scale offset calculation

  if (slider.classList.contains('swiping') && tmp.coordChange) {
    let
      xChange = tmp.endCoord - tmp.startCoord,
      sChange = Math.abs(xChange / tmp.slideExt);

    if (Math.abs(xChange) > tmp.slideExt / 3 || (Math.abs(xChange) > tmp.slideExt / 20 && new Date().getTime() - tmp.gT < 300)) {
      slider.classList.remove('swiping');
      sChange = (settings.continuous)
        ? Math.ceil(sChange) > tmp.slidesNo
          ? Math.ceil(sChange) % tmp.slidesNo
          : Math.ceil(sChange)
        : Math.ceil(sChange);
      update(tmp.slideNo + ((xChange > 0) ? -sChange : sChange));
    }
    else {
      tmp.newCoord = tmp.initCoord + tmp.endCoord - tmp.startCoord;
      slider.style.transform = `translateX(${tmp.newCoord}px)`;
      setTimeout(() => {
        slider.classList.remove('swiping');
        update(tmp.slideNo);
      }, 20);
    }
  }
  else {
    slider.classList.remove('swiping'); // Do this to ensure the swiping class is removed if added by event emulation
    update(tmp.slideNo);
  }

  if (settings.pauseOnHover && slider.contains(e.target) && e.type !== 'touchend') return;
  if (settings.autoslide) startAutoslider();
}
function prevSlides() {
  let newI = tmp.slideNo - (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

  if (tmp.continuous && newI < 1) {
    slider.classList.add('ghost-walk');
    slider.style.transform = `translateX(${tmp.newCoord + tmp.minExt}px)`;
    setTimeout(() => { slider.classList.remove('ghost-walk'); }, 10);
    setTimeout(() => update(newI), 20);
  }
  else {
    if (settings.continuous && newI < 1) newI = tmp.slidesNo;
    update(newI);
  }
  if (tmp.autosliding) startAutoslider();
}
function nextSlides() {
  let newI = tmp.slideNo + (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

  if (tmp.continuous && newI > tmp.slidesNo) {
    slider.classList.add('ghost-walk');
    slider.style.transform = `translateX(${tmp.newCoord - tmp.minExt}px)`;
    setTimeout(() => { slider.classList.remove('ghost-walk'); }, 10);
    setTimeout(() => update(newI), 20);
  }
  else {
    if (settings.continuous && newI > tmp.slidesNo) newI = 1;
    update(newI);
  }
  if (tmp.autosliding) startAutoslider();
}
function trackControl(e) {
  let tracker = e.target.closest('.cs-trackers > .cs-tracker');

  if (tracker) {
    update([...trackerCont.querySelectorAll(`:scope > .cs-tracker`)].indexOf(tracker) + 1)
    if (tmp.autosliding) startAutoslider();
  }
}
function startAutoslider() {
  if (slider.classList.contains('swiping')) return;
  stopAutoslider();
  tmp.autoslider = setInterval(() => {
    let newI = tmp.slideNo + (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

    if (tmp.continuous && newI > tmp.slidesNo) {
      slider.classList.add('ghost-walk');
      slider.style.transform = `translateX(${tmp.newCoord - tmp.minExt}px)`;
      setTimeout(() => { slider.classList.remove('ghost-walk'); }, 10);
    }
    else if (!tmp.continuous && newI > tmp.slidesNo) newI = 1;
    setTimeout(() => update(newI), 20);
  }, settings.autoslideInterval);
  tmp.autosliding = true;
}
function stopAutoslider() {
  clearInterval(tmp.autoslider);
  tmp.autosliding = false;
}
</script>
<template>
  <div ref="carousel" class="lui carousel">
    <div ref="viewbox" class="cs-viewbox">
      <div ref="slider" class="cs-slider">
        <slot></slot>
      </div>
    </div>
    <div class="cs-trackers">
    </div>
    <div class="cs-controls">
      <button ref="prevBtn" type="button" class="cs-nav cs-prev">
        <i class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m422.348-481.435 169.478 169.478q11.696 12.131 11.196 28.879-.5 16.749-12.196 29.469-12.13 12.131-29.879 12.131-17.748 0-29.469-12.131L334.174-451.478q-6.514-5.404-9.888-13.317-3.373-7.913-3.373-16.64 0-7.888 3.373-15.942 3.374-8.055 9.888-13.58l198.304-198.869q11.721-12.131 29.469-12.131 17.749 0 29.879 12.131 11.696 12.721 11.696 29.969t-11.696 29.379L422.348-481.435Z"/></svg>
        </i>
      </button>
      <button ref="nextBtn" type="button" class="cs-nav cs-next">
        <i class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M514.087-481.435 345.609-650.478q-12.696-12.131-12.196-28.892.5-16.76 13.196-29.456 11.13-12.131 28.891-12.131 17.761 0 29.891 12.131l197.87 197.869q5.565 5.566 9.413 13.479 3.848 7.913 3.848 16.043 0 8.565-3.848 16.479-3.848 7.913-9.413 13.478l-198.87 198.869q-12.13 12.131-29.391 11.631-17.261-.5-28.391-12.631-12.696-12.695-12.696-29.956t12.696-29.392l167.478-168.478Z"/></svg>
        </i>
      </button>
    </div>
  </div>
</template>