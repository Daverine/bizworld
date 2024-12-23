<script setup>
const { $anime } = useNuxtApp();
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

let scrollElem, items;

onMounted(async () => {
    scrollElem = el.value.querySelector(`:scope > ${settings.scrollBody}`);

    if (!scrollElem) {
        console.warn('An IScrollable element does not exist');
        return;
    }

    items = [...scrollElem.querySelectorAll(`:scope ${settings.scrollChildren}`)];
    window.addEventListener('resize', onResizeMtd);
    scrollElem.addEventListener('scroll', onScrollMtd);
    el.value.ondragstart = () => false;
    el.value.addEventListener('click', (e) => {
        if (e.target.closest(settings.prevCtrlBtn)) {
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
        else if (e.target.closest(settings.nextCtrlBtn)) {
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
    });
    el.value.addEventListener('activeView', (e) => {
        let activeItem = e.detail || items.filter(el => el.classList.contains('active'));

        if (!activeItem || !scrollElem.contains(activeItem)) return;
        getRect();

        let aeProp = {
            left: utils.offsetPos(activeItem).left,
            width: activeItem.offsetWidth,
        }

        animateScroll(rect.scrollPos - ((rect.width / 2) - aeProp.left + rect.left - (aeProp.width / 2)));
    })
    await nextTick();
    onResizeMtd();
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', onResizeMtd);
    scrollElem.removeEventListener('scroll', onScrollMtd);
});

function getRect() {
    rect.width = scrollElem.clientWidth;
    rect.left = utils.offsetPos(scrollElem).left;
    rect.scrollPos = scrollElem.scrollLeft;
    rect.sWidth = scrollElem.scrollWidth;
    rect.maxScroll = scrollElem.scrollWidth - rect.width;
}
function dist(e) {
    return e.type.indexOf('touch') > -1 ? e.touches[0].clientX : e.clientX;
}
function onResizeMtd() {
    getRect();
    onScrollMtd();
}
function onScrollMtd() {
    if (scrollElem.scrollLeft === 0) [...el.value.querySelectorAll(`:scope ${settings.prevCtrlBtn}`)].forEach((el) => el.classList.add('disabled'));
    else[...el.value.querySelectorAll(`:scope ${settings.prevCtrlBtn}`)].forEach((el) => el.classList.remove('disabled'));

    if (scrollElem.scrollLeft >= rect.maxScroll - settings.tolerance) [...el.value.querySelectorAll(`:scope ${settings.nextCtrlBtn}`)].forEach((el) => el.classList.add('disabled'));
    else[...el.value.querySelectorAll(`:scope ${settings.nextCtrlBtn}`)].forEach((el) => el.classList.remove('disabled'));
}
function gestureStart(e) {
    if (scrollElem.contains(e.target) || e.target === scrollElem) {
        getRect();
        coords.start = dist(e);
        coords.change = false;
        scrollElem.classList.add('swiping');
        document.addEventListener('touchmove', gestureMove);
        document.addEventListener('touchend', gestureEnd);
    }
}
function gestureMove(e) {
    coords.end = dist(e);
    if (Math.abs(coords.end - coords.start) > 5 && !coords.change) coords.change = true;
    if (coords.change) scrollElem.scrollLeft = rect.scrollPos - (coords.end - coords.start);
}
function gestureEnd(e) {
    document.removeEventListener('touchmove', gestureMove);
    document.removeEventListener('touchend', gestureEnd);
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
function animateScroll(scrollExt) {
    $anime({
        targets: scrollElem,
        scrollLeft: scrollExt,
        duration: settings.duration,
        easing: 'linear',
    });
}
</script>

<template>
    <div ref="el" class="i-scroller" @touchstart="gestureStart" @wheel="wheelControl">
        <slot />
    </div>
</template>