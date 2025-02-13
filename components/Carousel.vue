<script setup>
const carousel = useTemplateRef('carousel');
const props = defineProps(['options']);
const settings = {
    ...{
        namespace: 'carousel',
        autoSetup: true,
        continuous: true, // can also be set to string 'rewind'
        slidesPerView: 1,
        sliderMove: 'slide', // can also be page to move all the slide in a view out on next or prev
        spaceBetween: '0.5rem',
        breakpoints: [
            // {	
            // 	minWidth: 500,
            //	maxWidth: 1700,
            // 	slidesPerView: 3,
            // 	spaceBetween: 20,
            // },
            // {	
            // 	minWidth: 400,
            // 	maxWidth: 800,
            // 	slidesPerView: 2,
            // 	spaceBetween: 50,
            // }
        ],
        animation: 'slide',
        direction: 'horizontal',
        transitionDuration: 500,
        autoslide: false,
        autoslideInterval: 5000,
        pauseOnHover: true,
        imageZoom: true,
        videoAutoPlay: false,
        videoMute: true,
        controllable: true
    },
    ...props.options || {}
};
const tmp = reactive({
    newCoord: 0,
    startCoord: 0,
    endCoord: 0,
    initCoord: 0,
    movePastSlides: 0,
    coordChange: false,
    moveDir: 0,
    autoslider: undefined,
    autosliding: false,
    slidesNo: null,
    currSlideNo: null,
    slidesPerView: undefined,
    slideSize: undefined,
    minExt: undefined,
    maxExt: undefined,
    gT: undefined,
    updateSet: undefined,
    spaceBetween: undefined,
    sizeResponse: undefined,
    gestureMove: undefined,
    gestureEnd: undefined,
    stopAutoslider: undefined,
    gestureTarget: undefined,
    resizeTimeout: undefined,
    uniqueId: undefined,
    continuous: settings.continuous && settings.continuous !== 'rewind',
});
let changeInSlides, viewbox, slider, slides, currSlide, prevSlide, trackerCont, prevBtn, nextBtn, initialized;

onMounted(() => {
    tmp.uniqueId = utils.getUniqueId(settings.namespace);
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
    changeInSlides = new MutationObserver(sizeResponse);
    window.addEventListener('resize', sizeResponse);
    sizeResponse();
});

onBeforeUnmount(() => {
    clearInterval(tmp.autoslider);
    clearTimeout(tmp.updateSet);
    stopAutoslider();
    window.removeEventListener('resize', sizeResponse);
});

function sizeResponse() {
    clearTimeout(tmp.resizeTimeout);
    tmp.resizeTimeout = setTimeout(() => {
        changeInSlides.disconnect();
        stopAutoslider();
        let mediaWidth = window.innerWidth;
        // sort breakpoints by maxWidth and minWidth and then select the first breakpoint that matches the current media width
        let matchedBreakpoints = settings.breakpoints.filter(el => (el.minWidth || el.maxWidth) && (!el.minWidth || el.minWidth <= mediaWidth) && (!el.maxWidth || el.maxWidth >= mediaWidth));
        let breakpoint = matchedBreakpoints.filter(el => el.maxWidth).sort((a, b) => a.maxWidth - b.maxWidth)[0] || matchedBreakpoints.filter(el => el.minWidth).sort((a, b) => b.minWidth - a.minWidth)[0];

        tmp.breakpoint = {
            ...{
                slidesPerView: settings.slidesPerView,
                spaceBetween: settings.spaceBetween,
            },
            ...(breakpoint || {})
        };
        init();
        if (!carousel.value) return;
        changeInSlides.observe(carousel.value, { subtree: true, childList: true, });
    }, 350);
}
function init() {
    slides = [...slider.querySelectorAll(`:scope > .cs-slide`)].filter(el => !el.matches(`[data-creator='${tmp.uniqueId}']`));
    if (!slides[0]) return;
    slider.classList.add('ghost-walk');

    // Initialize carousel
    if (!initialized || tmp.slidesNo !== slides.length) {
        [...slider.querySelectorAll(`:scope [data-creator='${tmp.uniqueId}']`)].forEach(el => el.remove());
        slides.forEach((slide, index) => {
            slide.setAttribute('data-csid', index + 1);

            if (tmp.continuous) {
                let slideClone = slide.cloneNode(true);
                slideClone.setAttribute('data-creator', tmp.uniqueId);
                [...slideClone.querySelectorAll(':scope *')].forEach(el => {
                    el.removeAttribute('data-lightbox');
                    el.removeAttribute('data-find-lightbox-content');
                });
                slideClone.classList.remove('active');
                slider.append(slideClone);
                if (!index) slider.prepend(slideClone.cloneNode(true));
                else slider.insertBefore(slideClone.cloneNode(true), slider.children[index]);
            }
        });
        initialized = true;
    }

    tmp.slidesNo = slides.length; // number of slides in the carousel
    // the 1-based index of the current slide
    tmp.currSlideNo = slides.filter(el => el.classList.contains('active'))[0]
        ? Number(slides.filter(el => el.classList.contains('active'))[0].getAttribute('data-csid'))
        : 1;
    currSlide = slides[tmp.currSlideNo - 1];
    tmp.spaceBetween = typeof (tmp.breakpoint.spaceBetween) === 'number' ? `${tmp.breakpoint.spaceBetween}px` : tmp.breakpoint.spaceBetween;
    // ensure the slidePerPage is not more than the number of slides in the carousel in a continuous carousel
    tmp.slidesPerView = tmp.continuous && tmp.breakpoint.slidesPerView > tmp.slidesNo ? tmp.slidesNo : tmp.breakpoint.slidesPerView;

    [...slider.querySelectorAll(`:scope > .cs-slide`)].forEach((el) => {
        el.style.width = `calc(((100% + ${tmp.spaceBetween}) / ${tmp.slidesPerView}) - ${tmp.spaceBetween})`;
        el.style.marginRight = tmp.spaceBetween;
    });

    // cache slide extent, mininmum slider move and maximum slider move
    tmp.slideSize = currSlide.offsetWidth + parseFloat(utils.getCssVal(currSlide, 'margin-right'));
    tmp.minExt = tmp.continuous ? -(tmp.slideSize * tmp.slidesNo) : 0;
    tmp.maxExt = tmp.minExt - (tmp.slideSize * (tmp.slidesNo - tmp.slidesPerView));

    update();
    utils.afterNextRepaint(() => slider.classList.remove('ghost-walk'));
    // setTimeout(() => { slider.classList.remove('ghost-walk'); }, 10);
    if (settings.autoslide) startAutoslider();
}
function update(newSlideNo = tmp.currSlideNo) {
    clearTimeout(tmp.updateSet);

    newSlideNo = (!tmp.continuous)
        ? (newSlideNo < 1)
            ? 1
            : (newSlideNo > tmp.slidesNo)
                ? tmp.slidesNo
                : newSlideNo
        : (newSlideNo < 1)
            ? tmp.slidesNo + newSlideNo
            : (newSlideNo > tmp.slidesNo)
                ? newSlideNo - tmp.slidesNo
                : newSlideNo;

    // pause html5 video when current slide change
    // stop youtube video when current slide change

    prevSlide = currSlide;
    tmp.currSlideNo = newSlideNo;
    currSlide = slides[tmp.currSlideNo - 1];

    // newCoord should be in-between mininum Extent and maximum Extent
    tmp.newCoord = Math.min(tmp.minExt, Math.max(tmp.minExt - ((newSlideNo - 1) * tmp.slideSize), tmp.maxExt));
    slider.style.transform = `translateX(${tmp.newCoord}px)`;
    tmp.updateSet = setTimeout(() => {
        [...slider.querySelectorAll(`:scope > .cs-slide`)].forEach((el) => el.classList.remove('active'));
        [...slider.querySelectorAll(`:scope > .cs-slide[data-csid='${newSlideNo}']`)].forEach((el) => el.classList.add('active'));
    }, settings.transitionDuration);

    // determine controls
    if (!settings.continuous && tmp.slidesNo > 1) {
        if (tmp.currSlideNo === 1) {
            prevBtn?.classList.add('disabled');
            nextBtn?.classList.remove('disabled');
        }
        else if (tmp.currSlideNo === tmp.slidesNo) {
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
        trackers[newSlideNo - 1]?.classList.add('active');
    }
    tmp.coordChange = false;
}
function dist(e) {
    if (settings.direction === 'vertical') return e.type.indexOf('touch') > -1 ? e.touches[0].clientY : e.clientY;
    return e.type.indexOf('touch') > -1 ? e.touches[0].clientX : e.clientX;
}
function gestureStart(e) {
    if (e.type === 'mousedown' && e.button != 0) return; // stop gesture if total number of slides is one or less;

    if (settings.autoslide) stopAutoslider();
    tmp.gestureTarget = e.target;
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
    if (tmp.slidesNo <= 1) return;
    tmp.moveDir = tmp.endCoord > dist(e) ? 1 : tmp.endCoord < dist(e) ? -1 : tmp.moveDir;
    tmp.endCoord = dist(e);
    if (Math.abs(tmp.endCoord - tmp.startCoord) > 5) tmp.coordChange = true;

    // Swipping in action
    if (tmp.coordChange) {
        tmp.newCoord = tmp.initCoord + tmp.endCoord - tmp.startCoord + (tmp.movePastSlides * Math.abs(tmp.minExt));

        if (tmp.continuous) {
            if (tmp.moveDir === 1 && tmp.newCoord < tmp.maxExt) tmp.movePastSlides += 1;
            else if (tmp.moveDir === -1 && tmp.newCoord > tmp.minExt) tmp.movePastSlides -= 1;
            tmp.newCoord = tmp.initCoord + tmp.endCoord - tmp.startCoord + (tmp.movePastSlides * Math.abs(tmp.minExt));
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

    tmp.moveDir = 0; // reset gesture move direction
    tmp.movePastSlides = 0; // reset gesture move scale offset calculation

    if (slider.classList.contains('swiping') && tmp.coordChange) {
        let
            changeExt = tmp.endCoord - tmp.startCoord,
            movedSlidesCount = Math.ceil(Math.abs(changeExt / tmp.slideSize));

        if (Math.abs(changeExt) > tmp.slideSize / 3 || (Math.abs(changeExt) > tmp.slideSize / 20 && new Date().getTime() - tmp.gT < 300)) {
            slider.classList.remove('swiping');
            movedSlidesCount = (settings.continuous)
                ? movedSlidesCount > tmp.slidesNo
                    ? movedSlidesCount % tmp.slidesNo
                    : movedSlidesCount
                : movedSlidesCount;
            update(tmp.currSlideNo + ((changeExt > 0) ? -movedSlidesCount : movedSlidesCount));
        }
        else {
            tmp.newCoord = tmp.initCoord + changeExt;
            slider.style.transform = `translateX(${tmp.newCoord}px)`;
            utils.afterNextRepaint(() => {
                slider.classList.remove('swiping');
                update(tmp.currSlideNo);
            });
            // setTimeout(() => {
            //     slider.classList.remove('swiping');
            //     update(tmp.currSlideNo);
            // }, 20);
        }
    }
    else {
        if (tmp.gestureTarget.closest('[data-lightbox], [data-find-lightbox-content]')) {
            let toggler = e.target.closest('[data-lightbox], [data-find-lightbox-content]');
            let lightboxElem = document.querySelector(`#${toggler.getAttribute('data-target')}`);
            if (lightboxElem) utils.triggerEvent(lightboxElem, 'lbconsole', { command: 'view in lightbox', el: toggler });
        }
        slider.classList.remove('swiping'); // Do this to ensure the swiping class is removed if added by event emulation
        update(tmp.currSlideNo);
    }

    // prevent gesture end from starting autoSlide on a mouse gesture event because it will be started when mouse is out if settings.pauseOnOver is set true.
    if (settings.pauseOnHover && slider.contains(e.target) && e.type !== 'touchend') return;
    if (settings.autoslide) startAutoslider();
}
function prevSlides() {
    let newSlideNo = tmp.currSlideNo - (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

    if (tmp.continuous && newSlideNo < 1) {
        slider.classList.add('ghost-walk');
        slider.style.transform = `translateX(${tmp.newCoord + tmp.minExt}px)`;
        utils.afterNextRepaint(() => {
            slider.classList.remove('ghost-walk');
            utils.afterNextRepaint(() => update(newSlideNo));
        });
        // setTimeout(() => { slider.classList.remove('ghost-walk'); }, 10);
        // setTimeout(() => update(newSlideNo), 20);
    }
    else {
        if (settings.continuous && newSlideNo < 1) newSlideNo = tmp.slidesNo;
        update(newSlideNo);
    }
    if (tmp.autosliding) startAutoslider();
}
function nextSlides() {
    let newSlideNo = tmp.currSlideNo + (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

    if (tmp.continuous && newSlideNo > tmp.slidesNo) {
        slider.classList.add('ghost-walk');
        slider.style.transform = `translateX(${tmp.newCoord - tmp.minExt}px)`;
        utils.afterNextRepaint(() => {
            slider.classList.remove('ghost-walk');
            utils.afterNextRepaint(() => update(newSlideNo));
        });
        // setTimeout(() => { slider.classList.remove('ghost-walk'); }, 10);
        // setTimeout(() => update(newSlideNo), 20);
    }
    else {
        if (settings.continuous && newSlideNo > tmp.slidesNo) newSlideNo = 1;
        update(newSlideNo);
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
        let newSlideNo = tmp.currSlideNo + (settings.sliderMove === 'page' ? tmp.slidesPerView : 1);

        if (tmp.continuous && newSlideNo > tmp.slidesNo) {
            slider.classList.add('ghost-walk');
            slider.style.transform = `translateX(${tmp.newCoord - tmp.minExt}px)`;
            utils.afterNextRepaint(() => slider.classList.remove('ghost-walk'));
            // setTimeout(() => slider.classList.remove('ghost-walk'), 10);
        }
        else if (!tmp.continuous && newSlideNo > tmp.slidesNo) newSlideNo = 1;
        utils.afterNextRepaint(() => update(newSlideNo));
        // setTimeout(() => update(newSlideNo), 20);
    }, settings.autoslideInterval);
    tmp.autosliding = true;
}
function stopAutoslider() {
    clearInterval(tmp.autoslider);
    tmp.autosliding = false;
}
</script>
<template>
    <div ref="carousel" class="carousel" :class="{ 'lui': settings.autoSetup }">
        <template v-if="settings.autoSetup">
            <div class="cs-viewbox">
                <div class="cs-slider">
                    <slot></slot>
                </div>
                <div class="cs-controls">
                    <button type="button" class="cs-nav cs-prev">
                        <Icon mode="svg" name="material-symbols:chevron-left" class="icon" />
                    </button>
                    <button type="button" class="cs-nav cs-next">
                        <Icon mode="svg" name="material-symbols:chevron-right" />
                    </button>
                </div>
            </div>
            <div class="cs-trackers">
                <slot name="trackers">
                    <button class="cs-tracker" v-for="n in tmp.slidesNo" :data-csid="n" :data-creator="tmp.uniqueId"></button>
                </slot>
            </div>
        </template>
        <slot v-else></slot>
    </div>
</template>