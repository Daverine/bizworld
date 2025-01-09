export default {
    mounted(el, binding) {
        const settings = {
            ...{
                namespace: 'scrollPin',
                className: 'pinned',
                wrapper: '.sp-wrapper',
                guardian: undefined,
                autoContainMargins: true,
                sticky: false,
                ancestorGuarded: false,
                pinnable: true,
                clipTop: 0,
                clipBottom: 0,
                topSpacing: 0,
                bottomSpacing: 0,
                breakpoints: [
                    // {	
                    // 	minWidth: 500,
                    //	maxWidth: 1700,
                    // 	pinnable: true,
                    // 	topSpacing: 3,
                    // 	bottomSpacing: 20,
                    // },
                    // {	
                    // 	minWidth: 400,
                    // 	maxWidth: 800,
                    // 	pinnable: true,
                    // 	topSpacing: 3,
                    // 	bottomSpacing: 20,
                    // }
                ],
                pinPriority: 'top', // can either be top or bottom
                streamHeightToWrapper: true,
                pinned: undefined,
                unpinned: undefined,
            },
            ...(utils.isObject(binding.value) ? binding.value : {})
        };
        let tmp = {
            initialized: false,
            pinnable: undefined,
            topSpacing: undefined,
            bottomSpacing: undefined,
            eBox: undefined,
            pBox: undefined,
            eOffset: undefined,
            pOffset: undefined,
            // cache current style attribute of the scrollPin element to be used for resetting during window resize.
            initStyle: el.getAttribute('style'),
            // get scrollPosition here
            scrollPos: window.scrollY,
            scrollDir: undefined,
            currState: undefined,
            resizeTimeout: undefined,
        };
        let wrapper;
        let guardian;
        let sizeStreamId;

        settings.ancestorGuarded = settings.sticky ? true : settings.ancestorGuarded;
        settings.pinPriority = settings.pinPriority !== 'bottom' ? 'top' : 'bottom';

        window.addEventListener('resize', getGeometry);
        window.addEventListener('scroll', onScrollMtd);
        el.addEventListener('stopScrollPin', stopScrollPin);

        if (settings.autoContainMargins) el.classList.add('clearfix');

        if (settings.streamHeightToWrapper && el.parentNode.matches(settings.wrapper)) {
            wrapper = el.parentNode;
            wrapper.classList.add('clearfix');
            // ensure that the wrapper is a positioned Element
            if (utils.getCssVal(wrapper, 'position') === 'static') wrapper.style.position = 'relative';
        }
        else settings.streamHeightToWrapper = false;

        // trigger a resize Method of windows used in scrollPin to get the initial coords of scrollPin element.
        getGeometry();

        // start wrapperSize streaming
        if (settings.streamHeightToWrapper) {
            sizeStreamId = requestAnimationFrame(streamCallback);
        }

        function streamCallback() {
            if (tmp.initialized) {
                let elHeight = el.getBoundingClientRect().height;

                // let parent take scrollPin element height + the parent padding top and bottom as min-height
                wrapper.style.minHeight = `${elHeight + getTB(wrapper, true) + getTB(wrapper)}px`;
                if (settings.ancestorGuarded && guardian.getBoundingClientRect().height !== tmp.pBox.height) {
                    getGeometry();
                    sizeStreamId = requestAnimationFrame(streamCallback);
                }
                else if (elHeight && elHeight !== tmp.eBox.height) {
                    tmp.eBox.height = elHeight;
                    onScrollMtd('partial-reset');
                    sizeStreamId = requestAnimationFrame(streamCallback);
                }
                else {
                    setTimeout(() => {
                        sizeStreamId = requestAnimationFrame(streamCallback);
                    }, 30);
                }
            }
            else {
                sizeStreamId = requestAnimationFrame(streamCallback);
            }
        }

        function getGeometry() {
            // reset scrollPin
            el.classList.remove(settings.className);
            if (tmp.initStyle) el.setAttribute('style', tmp.initStyle);
            else el.removeAttribute('style');
            tmp.currState = 'reset-state';
            let mediaWidth = window.innerWidth;
            // sort breakpoints by maxWidth and minWidth and then select the first breakpoint that matches the current media width
            let matchedBreakpoints = settings.breakpoints.filter(el => (el.minWidth || el.maxWidth) && (!el.minWidth || el.minWidth <= mediaWidth) && (!el.maxWidth || el.maxWidth >= mediaWidth));
            let breakpoint = matchedBreakpoints.filter(el => el.maxWidth).sort((a, b) => a.maxWidth - b.maxWidth)[0] || matchedBreakpoints.filter(el => el.minWidth).sort((a, b) => b.minWidth - a.minWidth)[0];
            tmp = {
                ...tmp,
                ...{
                    pinnable: settings.pinnable,
                    topSpacing: settings.topSpacing,
                    bottomSpacing: settings.bottomSpacing,
                    clipTop: settings.clipTop,
                    clipBottom: settings.clipBottom,
                },
                ...(breakpoint || {})
            }

            if (!tmp.pinnable) return;

            // get data
            tmp.clipBoxHeight = window.innerHeight - (settings.pinPriority === 'bottom' ? tmp.clipBottom : tmp.clipTop);
            tmp.calcTop = tmp.clipTop + tmp.topSpacing;
            tmp.calcBottom = tmp.clipBottom + tmp.bottomSpacing;
            tmp.eBox = JSON.parse(JSON.stringify(el.getBoundingClientRect()));
            tmp.eOffset = utils.offsetPos(el);
            // determine if a scrollpin should be independent by element's height
            settings.independent = tmp.eBox.height + tmp.calcTop >= tmp.clipBoxHeight || tmp.eBox.height + tmp.calcBottom > tmp.clipBoxHeight;

            // needed if pinned element needs to be contained inside one of it ancestor's boundaries
            if (settings.ancestorGuarded) {
                guardian = settings.guardian && utils.getParents(el, settings.guardian)[0]
                    ? utils.getParents(el, settings.guardian)[0]
                    : settings.streamHeightToWrapper
                        ? wrapper.parentNode
                        : el.parentNode;

                tmp.pBox = JSON.parse(JSON.stringify(guardian.getBoundingClientRect()));
                tmp.pOffset = utils.offsetPos(guardian);

                if (Math.max(tmp.eBox.height + tmp.calcTop, tmp.eBox.height + tmp.calcBottom) > utils.contentSize(guardian).height) {
                    tmp.pinnable = false;
                    return;
                }
            }

            // trigger a scroll Method of windows used in scrollPin.
            onScrollMtd();
            if (!tmp.initialized) tmp.initialized = true;
        }

        function onScrollMtd(init) {
            if (!tmp.pinnable) return;
            // store previous scroll position to be used in independent scrollPin
            let prevScrollPos = tmp.scrollPos;
            tmp.scrollDir = tmp.scrollPos < window.scrollY ? 1 : tmp.scrollPos > window.scrollY ? -1 : 0;
            tmp.scrollPos = window.scrollY;

            let positionedParent = utils.getParents(el).filter(el => utils.getCssVal(el, 'position') !== 'static')[0] || document.body;
            let ppOffset = utils.offsetPos(positionedParent);
            let isIndependentBefore = settings.independent;
            let prevState = tmp.currState;
            // partial reset
            if (init === 'partial-reset') {
                // determine if a scrollpin should be independent by element's height
                settings.independent = tmp.eBox.height + tmp.calcTop >= tmp.clipBoxHeight || tmp.eBox.height + tmp.calcBottom > tmp.clipBoxHeight;
                tmp.currState = 'reset-state';
                el.classList.remove(settings.className);

                if (isIndependentBefore && !settings.independent) {
                    el.classList.add(settings.className);
                    el.style.position = 'fixed';
                    el.style.top = `${tmp.calcTop}px`;
                    el.style.left = `${tmp.eOffset.left}px`;
                    // fix for the use of relative width on the element.
                    el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');
                    tmp.currState = 'top-pinned';
                }
            }

            if (settings.independent) {
                // dont change anyting if element is within free-zone area of moving in scroll-direction and it criteria of being in this zone is still meant.
                if (tmp.currState === 'reset-state' && (prevState === 'dir-bottom-unpinned' || prevState === 'dir-top-unpinned') &&
                    (
                        (!settings.ancestorGuarded && document.body.getBoundingClientRect().height - tmp.scrollPos > tmp.eBox.height + tmp.calcTop) ||
                        (settings.ancestorGuarded && tmp.pOffset.top + tmp.pBox.height - tmp.scrollPos > tmp.eBox.height + tmp.calcTop + getTB(guardian))
                    ) && tmp.scrollPos >= tmp.eOffset.top - tmp.calcTop
                ) { return; }

                // if (tmp.currState === 'reset-state' && prevState === 'dir-bottom-unpinned' &&
                //     !(utils.offsetPos(el).top + tmp.eBox.height + tmp.calcBottom <= tmp.scrollPos + tmp.clipBoxHeight)) {
                //     tmp.currState = 'dir-bottom-unpinned';
                // }
                // else if (tmp.currState === 'reset-state' && prevState === 'dir-top-unpinned' &&
                //     !(utils.offsetPos(el).top > tmp.scrollPos + tmp.calcTop)) {
                //     tmp.currState = 'dir-top-unpinned';
                // }

                // pin the element at the bottom
                // if element bottom and bottomSpacing is visible on the screen
                // and the user is scrolling down
                // and element is not parent-guilded
                // or the parent bottom (excluding it bottom-padding and bottomSpacing) have not reach the screen bottom. 
                else if (
                    !el.classList.contains(settings.className) &&
                    (
                        (tmp.scrollDir === 1 && utils.offsetPos(el).top + tmp.eBox.height + tmp.calcBottom <= tmp.scrollPos + tmp.clipBoxHeight) ||
                        (tmp.currState === 'reset-state' && ((!settings.ancestorGuarded && document.body.getBoundingClientRect().height - tmp.scrollPos <= tmp.eBox.height + tmp.calcTop) || (settings.ancestorGuarded && tmp.pOffset.top + tmp.pBox.height - tmp.scrollPos <= tmp.eBox.height + tmp.calcTop + getTB(guardian))))
                    ) &&
                    (!settings.ancestorGuarded || Math.ceil(tmp.pOffset.top + tmp.pBox.height - getTB(guardian)) >= tmp.scrollPos + tmp.clipBoxHeight)
                ) {
                    el.classList.add(settings.className);
                    el.style.position = 'fixed';
                    el.style.top = `${tmp.clipBoxHeight - tmp.eBox.height - tmp.calcBottom}px`;
                    el.style.left = `${tmp.eOffset.left}px`;
                    // fix for the use of relative width on the element.
                    el.style.setProperty('width', tmp.eBox.width + "px", "important");
                    tmp.currState = 'bottom-pinned';
                }
                // pin the element at the top
                // if element top and topSpacing is visible
                // and the user is scrolling up
                // while element have not reach its initial position
                else if (
                    !el.classList.contains(settings.className) &&
                    (
                        (tmp.scrollDir === -1 && utils.offsetPos(el).top > tmp.scrollPos + tmp.calcTop) ||
                        (tmp.currState === 'reset-state' && ((!settings.ancestorGuarded && document.body.getBoundingClientRect().height - tmp.scrollPos > tmp.eBox.height + tmp.calcTop) || (settings.ancestorGuarded && tmp.pOffset.top + tmp.pBox.height - tmp.scrollPos > tmp.eBox.height + tmp.calcTop + getTB(guardian))))
                    ) && tmp.scrollPos >= tmp.eOffset.top - tmp.calcTop
                ) {
                    el.classList.add(settings.className);
                    el.style.position = 'fixed';
                    el.style.top = `${tmp.calcTop}px`;
                    el.style.left = `${tmp.eOffset.left}px`;
                    // fix for the use of relative width on the element.
                    el.style.setProperty('width', tmp.eBox.width + "px", "important");
                    tmp.currState = 'top-pinned';
                }
                // unpin the element at bottom (from been pinned by pin1)
                // if it is Guarded by it parent and it as reach it parent limit at the bottom.
                else if (
                    settings.ancestorGuarded &&
                    tmp.pOffset.top + tmp.pBox.height - getTB(guardian) <= tmp.scrollPos + tmp.clipBoxHeight - tmp.calcBottom
                ) {
                    el.classList.remove(settings.className);
                    el.style.position = 'absolute';
                    el.style.top = `${tmp.pOffset.top + tmp.pBox.height - tmp.eBox.height - getTB(guardian) - ppOffset.top}px`;
                    el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
                    // fix for the use of relative width on the element.
                    el.style.setProperty('width', tmp.eBox.width + "px", "important");
                    tmp.currState = 'bottom-unpinned';
                }
                // unpin the element if the page scrolls to where the initial offset of the element is visible
                else if (tmp.scrollPos + tmp.calcTop <= tmp.eOffset.top) {
                    el.classList.remove(settings.className);
                    el.style.position = 'absolute';
                    el.style.top = `${tmp.eOffset.top - ppOffset.top}px`;
                    el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
                    // fix for the use of relative width on the element.
                    el.style.setProperty('width', tmp.eBox.width + "px", "important");
                    tmp.currState = 'top-unpinned';
                }
                // unpin element
                // if element was pinned by pin1
                // and the scroll direction for been pinned has changed
                else if (tmp.currState === 'bottom-pinned' && tmp.scrollDir === -1) {
                    el.classList.remove(settings.className);
                    el.style.position = 'absolute';
                    el.style.top = `${prevScrollPos + tmp.clipBoxHeight - tmp.eBox.height - tmp.calcBottom - ppOffset.top}px`;
                    el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
                    // fix for the use of relative width on the element.
                    el.style.setProperty('width', tmp.eBox.width + "px", "important");
                    tmp.currState = 'dir-bottom-unpinned';
                }
                // unpin element
                // if element was pinned by pin2
                // and the scroll direction for been pinned has changed
                else if (tmp.currState === 'top-pinned' && tmp.scrollDir === 1) {
                    el.classList.remove(settings.className);
                    el.style.position = 'absolute';
                    el.style.top = `${prevScrollPos + tmp.calcTop - ppOffset.top}px`;
                    el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
                    // fix for the use of relative width on the element.
                    el.style.setProperty('width', tmp.eBox.width + "px", "important");
                    tmp.currState = 'dir-top-unpinned';
                }
            }
            else {
                if (settings.pinPriority === 'bottom') {
                    // pin element at the bottom if pinPriority is set to bottom
                    // and element is not guarded by an ancestor
                    // or if guarded, the guardian content-visible area on the screen can contain the pin element and it bottom space
                    if (tmp.currState !== 'bottom-pinned' && (!settings.ancestorGuarded || (
                        (tmp.pOffset.top < tmp.scrollPos || tmp.scrollPos + tmp.clipBoxHeight - tmp.pOffset.top >= tmp.eBox.height + tmp.calcBottom + getTB(guardian, true)) &&
                        (tmp.pOffset.top + tmp.pBox.height - getTB(guardian) > tmp.scrollPos + tmp.clipBoxHeight || tmp.scrollPos + tmp.clipBoxHeight - tmp.pOffset.top - tmp.pBox.height + getTB(guardian) <= tmp.calcBottom)
                    ))) {
                        el.classList.add(settings.className);
                        el.style.position = 'fixed';
                        el.style.top = `${tmp.clipBoxHeight - tmp.eBox.height - tmp.calcBottom}px`;
                        el.style.left = `${tmp.eOffset.left}px`;
                        // fix for the use of relative width on the element.
                        el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');

                        tmp.currState = 'bottom-pinned';
                    }
                    else if (settings.ancestorGuarded) {
                        // unpin element if user is scrolling down and have scrolled past the bottom of guardian element
                        if (tmp.currState !== 'bottom-unpinned' && (
                            tmp.pOffset.top + tmp.pBox.height < tmp.scrollPos + tmp.clipBoxHeight &&
                            tmp.scrollPos + tmp.clipBoxHeight - tmp.pOffset.top - tmp.pBox.height + getTB(guardian) > tmp.calcBottom
                        )) {
                            // tmp.scrollPos + tmp.clipBoxHeight - tmp.pOffset.top - tmp.pBox.height + getTB(guardian) < tmp.calcBottom
                            el.classList.remove(settings.className);
                            el.style.position = 'absolute';
                            el.style.top = `${tmp.pOffset.top + tmp.pBox.height - tmp.eBox.height - getTB(guardian) - ppOffset.top}px`;
                            // el.style.top = tmp.pBox.height - getTB(guardian) - tmp.eBox.height;
                            el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
                            // fix for the use of relative width on the element.
                            el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');

                            tmp.currState = 'bottom-unpinned';
                        }
                        // unpin element if user is scrolling up and have scrolled past the top of guardian element
                        else if (tmp.currState !== 'top-unpinned' && (
                            tmp.pOffset.top > tmp.scrollPos &&
                            tmp.scrollPos + tmp.clipBoxHeight - tmp.pOffset.top < tmp.eBox.height + tmp.calcBottom + getTB(guardian, true)
                        )) {
                            el.classList.remove(settings.className);
                            el.style.position = 'absolute';
                            el.style.top = `${tmp.pOffset.top + getTB(guardian, true) - ppOffset.top}px`;
                            el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
                            // fix for the use of relative width on the element.
                            el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');

                            tmp.currState = 'top-unpinned';
                        }
                    }
                }
                else {
                    // pin element at the top if element has been scrolled out of page (from top)
                    // also if element is Guarded by parent, the parent must have enough visible area to contain the element and its top spacing
                    // and if element is sticky, then the user must be scrolling down \/ and the element must not be recently unpined by unpin2
                    if (
                        (!settings.sticky || (tmp.scrollDir === 1 && tmp.currState !== 'bottom-unpinned')) &&
                        tmp.scrollPos > tmp.eOffset.top - tmp.calcTop &&
                        (!settings.ancestorGuarded || tmp.pOffset.top + tmp.pBox.height - tmp.scrollPos > tmp.eBox.height + tmp.calcTop + getTB(guardian)) &&
                        !el.classList.contains(settings.className)
                    ) {
                        el.classList.add(settings.className);
                        el.style.position = 'fixed';
                        el.style.top = `${tmp.calcTop}px`;
                        el.style.left = `${tmp.eOffset.left}px`;
                        // fix for the use of relative width on the element.
                        el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');

                        tmp.currState = 'top-pinned';
                    }
                    // pin element at the bottom if element is sticky
                    // and was recently unpined by unpin2
                    // and the user is scrolling the page up /\
                    // also the parent of sticky has enough space in the viewport to contain the element
                    else if (
                        settings.sticky && tmp.currState === 'bottom-unpinned' && tmp.scrollDir === -1 &&
                        tmp.pOffset.top + tmp.pBox.height > tmp.scrollPos + tmp.clipBoxHeight &&
                        utils.offsetPos(el).top + tmp.eBox.height + tmp.calcBottom >= tmp.clipBoxHeight + tmp.scrollPos &&
                        !el.classList.contains(settings.className)
                    ) {
                        el.classList.add(settings.className);
                        el.style.position = 'fixed';
                        el.style.top = `${tmp.clipBoxHeight - tmp.eBox.height - tmp.calcBottom}px`;
                        el.style.left = `${tmp.eOffset.left}px`;
                        // fix for the use of relative width on the element.
                        el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');

                        tmp.currState = 'bottom-pinned';
                    }
                    // unpin the element if the page scrolls to where the initial offset of the element is visible
                    // but element must not be sticky
                    // else element must not be recently pined by pin2
                    // else user must be scrolling up /\ and must have scroll to the initial position of the element
                    else if (
                        tmp.scrollPos + tmp.calcTop <= tmp.eOffset.top &&
                        (!settings.sticky || (tmp.currState !== 'bottom-pinned' || tmp.scrollDir === -1)) &&
                        el.classList.contains(settings.className)
                    ) {
                        el.classList.remove(settings.className);
                        el.style.position = 'absolute';
                        el.style.top = `${tmp.eOffset.top - ppOffset.top}px`;
                        el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
                        // fix for the use of relative width on the element.
                        el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');

                        tmp.currState = 'top-unpinned';
                    }
                    // unpin element and make it stay at the bottom of parent if it is parent-Guarded
                    // and the page has scrolled reaching or past the parent
                    // and if element was recently pinned by pin2, the user must be scrolling down \/ the page
                    // must have reach or scrolled the parent out of viewport
                    else if (
                        settings.ancestorGuarded &&
                        (tmp.scrollPos > tmp.pOffset.top + tmp.pBox.height - tmp.eBox.height - tmp.calcTop - getTB(guardian) ||
                            (tmp.currState === 'bottom-pinned' && tmp.scrollDir === 1 && tmp.pOffset.top + tmp.pBox.height < tmp.scrollPos + tmp.clipBoxHeight)
                        ) && (el.classList.contains(settings.className) || tmp.currState === 'reset-state')
                    ) {
                        el.classList.remove(settings.className);
                        el.style.position = 'absolute';
                        el.style.top = `${tmp.pOffset.top + tmp.pBox.height - tmp.eBox.height - getTB(guardian) - ppOffset.top}px`;
                        // el.style.top = tmp.pBox.height - getTB(guardian) - tmp.eBox.height;
                        el.style.left = `${tmp.eOffset.left - ppOffset.left}px`;
                        // fix for the use of relative width on the element.
                        el.style.setProperty('width', `${tmp.eBox.width}px`, 'important');

                        tmp.currState = 'bottom-unpinned';
                    }
                }
            }
        }

        function stopScrollPin() {
            // stop height streaming
            const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
            cancelAnimationFrame(sizeStreamId);

            // stop scrollPin events
            window.removeEventListener('resize', getGeometry);
            window.removeEventListener('scroll', onScrollMtd);
            el.removeEventListener('stopScrollPin', stopScrollPin);

            // reset scrollPin element
            el.classList.remove(settings.className);
            if (tmp.initStyle) el.setAttribute('style', tmp.initStyle);
            else el.removeAttribute('style');
        }

        // utility to get padding and border of either the top side or the bottom side of an element
        function getTB(el, top) {
            if (top) return parseFloat(utils.getCssVal(el, 'padding-top')) + parseFloat(utils.getCssVal(el, 'border-top-width'));
            return parseFloat(utils.getCssVal(el, 'padding-bottom')) + parseFloat(utils.getCssVal(el, 'border-bottom-width'));
        }
    },
    beforeUnmount(el) {
        utils.triggerEvent(el, 'stopScrollPin');
    }
};