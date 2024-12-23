const dnm = function () {
    return {
        default: {
            namespace: 'scrollPin',
            className: 'pinned',
            wrapper: '.sp-wrapper',
            guardian: undefined,
            autoContainMargins: true,
            sticky: false,
            ancestorGuarded: false,
            topSpacing: 0,
            bottomSpacing: 0,
            pinPriority: 'top', // can either be a sting of top or bottom
            streamHeightToWrapper: true,
            pinned: undefined,
            unpinned: undefined,
        },
        init(el, binding) {
            // adjust settings
            this.el = el;
            this.settings = utils.isObject(binding.value)
                ? { ...this.default, ...binding.value }
                : this.default;
            this.settings.ancestorGuarded = this.settings.sticky ? true : this.settings.ancestorGuarded;
            this.settings.pinPriority = this.settings.pinPriority !== 'bottom'
                ? 'top'
                : 'bottom';
            this.uniqueId = utils.getUniqueId(this.settings.namespace);
            // cache current style attribute of the scrollPin element to be used for resetting during window resize.
            this.initStyle = this.el.getAttribute('style');
            this.prop = {}; this.tmp = {};

            // bind all event methods to the correct 'this'
            Object.keys(this).forEach(el => {
                if (typeof (this[el]) === 'function') {
                    this[el] = this[el].bind(this);
                }
            });
            window.addEventListener('resize', this.getGeometry);
            window.addEventListener('scroll', this.onScrollMtd);
            this.el.addEventListener('stopScrollPin', this.stopScrollPin);

            if (this.settings.autoContainMargins) this.el.classList.add('clearfix');

            if (this.settings.streamHeightToWrapper && this.el.parentNode.matches(this.settings.wrapper)) {
                this.wrapper = this.el.parentNode;
                this.wrapper.classList.add('clearfix');
                // ensure that the wrapper is a positioned Element
                if (utils.getCssVal(this.wrapper, 'position') === 'static') this.wrapper.style.position = 'relative';
            }
            else this.settings.streamHeightToWrapper = false;

            // trigger a resize Method of windows used in scrollPin to get the initial coords of scrollPin element.
            this.scrollPos = window.scrollY;
            this.getGeometry();

            // start wrapperSize streaming
            if (this.settings.streamHeightToWrapper) {
                const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                this.sizeStreamId = requestAnimationFrame(this.streamCallback);
            }
        },
        streamCallback() {
            let elHeight = this.el.getBoundingClientRect().height;
            let streamer;

            // let parent take scrollPin element height + the parent padding top and bottom as min-height
            this.wrapper.style.minHeight = `${elHeight + this.getTB(this.wrapper, true) + this.getTB(this.wrapper)}px`;
            if (elHeight && elHeight !== this.prop.eBox.height) {
                clearTimeout(streamer);
                if (this.prop.eBox.height !== elHeight) this.prop.eBox.height = elHeight;
                streamer = setTimeout(() => this.onScrollMtd('partial-reset'), 20);
            }
            if (this.settings.ancestorGuarded && this.guardian.getBoundingClientRect().height !== this.prop.pBox.height) {
                clearTimeout(streamer);
                streamer = setTimeout(() => this.getGeometry(), 20);
            }

            const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            this.sizeStreamId = requestAnimationFrame(this.streamCallback);
        },
        getGeometry() {
            // reset scrollPin
            this.el.classList.remove(this.settings.className);
            if (this.initStyle) this.el.setAttribute('style', this.initStyle);
            else this.el.removeAttribute('style');
            this.currState = 'reset-state';
            this.tmp.pinnable = true;

            // get data
            this.prop.eBox = JSON.parse(JSON.stringify(this.el.getBoundingClientRect()));
            this.prop.eOffset = utils.offsetPos(this.el);
            // determine if a scrollpin should be independent by element's height
            this.settings.independent = this.prop.eBox.height + this.settings.topSpacing >= window.innerHeight || this.prop.eBox.height + this.settings.bottomSpacing > window.innerHeight;

            // needed if pinned element needs to be contained inside one of it ancestor element's boundaries
            if (this.settings.ancestorGuarded) {
                this.guardian = this.settings.guardian && utils.getParents(this.el, this.settings.guardian)[0]
                    ? utils.getParents(this.el, this.settings.guardian)[0]
                    : this.settings.streamHeightToWrapper
                        ? this.wrapper.parentNode
                        : this.el.parentNode;

                this.prop.pBox = JSON.parse(JSON.stringify(this.guardian.getBoundingClientRect()));
                this.prop.pOffset = utils.offsetPos(this.guardian);

                if (Math.max(this.prop.eBox.height + this.settings.topSpacing, this.prop.eBox.height + this.settings.bottomSpacing) > utils.contentSize(this.guardian).height) {
                    this.tmp.pinnable = false;
                    console.warn('a scrollPin element on this page is not currently pinnable.');
                    return;
                }
            }

            // trigger a scroll Method of windows used in scrollPin.
            this.onScrollMtd();
        },
        onScrollMtd(init) {
            if (!this.tmp.pinnable) return;
            // store previous scroll position to be used in independent scrollPin
            let prevScrollPos = this.tmp.scrollPos;
            this.tmp.scrollDir = this.tmp.scrollPos < window.scrollY ? 1 : this.tmp.scrollPos > window.scrollY ? -1 : 0;
            this.tmp.scrollPos = window.scrollY;

            let positionedParent = utils.getParents(this.el).filter(el => utils.getCssVal(el, 'position') !== 'static')[0] || document.body;
            let ppOffset = utils.offsetPos(positionedParent);
            let isIndependentBefore = this.settings.independent;
            let prevState = this.currState;
            // partial reset
            if (init === 'partial-reset') {
                // determine if a scrollpin should be independent by element's height
                this.settings.independent = this.prop.eBox.height + this.settings.topSpacing >= window.innerHeight || this.prop.eBox.height + this.settings.bottomSpacing > window.innerHeight;
                this.currState = 'reset-state';
                this.el.classList.remove(this.settings.className);

                if (isIndependentBefore && !this.settings.independent) {
                    this.el.classList.add(this.settings.className);
                    this.el.style.position = 'fixed';
                    this.el.style.top = `${this.settings.topSpacing}px`;
                    this.el.style.left = `${this.prop.eOffset.left}px`;
                    // fix for the use of relative width on the element.
                    this.el.style.setProperty('width', `${this.prop.eBox.width}px`, 'important');
                    this.currState = 'top-pinned';
                }
            }

            if (this.settings.independent) {
                // dont change anyting if element is within free-zone area of moving in scroll-direction and it criteria of being in this zone is still meant.
                if (this.currState === 'reset-state' && (prevState === 'dir-bottom-unpinned' || prevState === 'dir-top-unpinned') &&
                    (
                        (!this.settings.ancestorGuarded && document.body.getBoundingClientRect().height - this.tmp.scrollPos > this.prop.eBox.height + this.settings.topSpacing) ||
                        (this.settings.ancestorGuarded && this.prop.pOffset.top + this.prop.pBox.height - this.tmp.scrollPos > this.prop.eBox.height + this.settings.topSpacing + this.getTB(this.guardian))
                    ) && this.tmp.scrollPos >= this.prop.eOffset.top - this.settings.topSpacing
                ) { return; }

                // if (this.currState === 'reset-state' && prevState === 'dir-bottom-unpinned' &&
                //     !(utils.offsetPos(this.el).top + this.prop.eBox.height + this.settings.bottomSpacing <= this.tmp.scrollPos + window.innerHeight)) {
                //     this.currState = 'dir-bottom-unpinned';
                // }
                // else if (this.currState === 'reset-state' && prevState === 'dir-top-unpinned' &&
                //     !(utils.offsetPos(this.el).top > this.tmp.scrollPos + this.settings.topSpacing)) {
                //     this.currState = 'dir-top-unpinned';
                // }

                // pin the element at the bottom
                // if element bottom and bottomSpacing is visible on the screen
                // and the user is scrolling down
                // and element is not parent-guilded
                // or the parent bottom (excluding it bottom-padding and bottomSpacing) have not reach the screen bottom. 
                else if (
                    !this.el.classList.contains(this.settings.className) &&
                    (
                        (this.tmp.scrollDir === 1 && utils.offsetPos(this.el).top + this.prop.eBox.height + this.settings.bottomSpacing <= this.tmp.scrollPos + window.innerHeight) ||
                        (this.currState === 'reset-state' && ((!this.settings.ancestorGuarded && document.body.getBoundingClientRect().height - this.tmp.scrollPos <= this.prop.eBox.height + this.settings.topSpacing) || (this.settings.ancestorGuarded && this.prop.pOffset.top + this.prop.pBox.height - this.tmp.scrollPos <= this.prop.eBox.height + this.settings.topSpacing + this.getTB(this.guardian))))
                    ) &&
                    (!this.settings.ancestorGuarded || Math.ceil(this.prop.pOffset.top + this.prop.pBox.height - this.getTB(this.guardian)) >= this.tmp.scrollPos + window.innerHeight)
                ) {
                    this.el.classList.add(this.settings.className);
                    this.el.style.position = 'fixed';
                    this.el.style.top = `${window.innerHeight - this.prop.eBox.height - this.settings.bottomSpacing}px`;
                    this.el.style.left = `${this.prop.eOffset.left}px`;
                    // fix for the use of relative width on the element.
                    this.el.style.setProperty('width', this.prop.eBox.width + "px", "important");
                    this.currState = 'bottom-pinned';
                }
                // pin the element at the top
                // if element top and topSpacing is visible
                // and the user is scrolling up
                // while element have not reach its initial position
                else if (
                    !this.el.classList.contains(this.settings.className) &&
                    (
                        (this.tmp.scrollDir === -1 && utils.offsetPos(this.el).top > this.tmp.scrollPos + this.settings.topSpacing) ||
                        (this.currState === 'reset-state' && ((!this.settings.ancestorGuarded && document.body.getBoundingClientRect().height - this.tmp.scrollPos > this.prop.eBox.height + this.settings.topSpacing) || (this.settings.ancestorGuarded && this.prop.pOffset.top + this.prop.pBox.height - this.tmp.scrollPos > this.prop.eBox.height + this.settings.topSpacing + this.getTB(this.guardian))))
                    ) && this.tmp.scrollPos >= this.prop.eOffset.top - this.settings.topSpacing
                ) {
                    this.el.classList.add(this.settings.className);
                    this.el.style.position = 'fixed';
                    this.el.style.top = `${this.settings.topSpacing}px`;
                    this.el.style.left = `${this.prop.eOffset.left}px`;
                    // fix for the use of relative width on the element.
                    this.el.style.setProperty('width', this.prop.eBox.width + "px", "important");
                    this.currState = 'top-pinned';
                }
                // unpin the element at bottom (from been pinned by pin1)
                // if it is Guarded by it parent and it as reach it parent limit at the bottom.
                else if (
                    this.settings.ancestorGuarded &&
                    this.prop.pOffset.top + this.prop.pBox.height - this.getTB(this.guardian) <= this.tmp.scrollPos + window.innerHeight - this.settings.bottomSpacing
                ) {
                    this.el.classList.remove(this.settings.className);
                    this.el.style.position = 'absolute';
                    this.el.style.top = `${this.prop.pOffset.top + this.prop.pBox.height - this.prop.eBox.height - this.getTB(this.guardian) - ppOffset.top}px`;
                    this.el.style.left = `${this.prop.eOffset.left - ppOffset.left}px`;
                    // fix for the use of relative width on the element.
                    this.el.style.setProperty('width', this.prop.eBox.width + "px", "important");
                    this.currState = 'bottom-unpinned';
                }
                // unpin the element if the page scrolls to where the initial offset of the element is visible
                else if (this.tmp.scrollPos + this.settings.topSpacing <= this.prop.eOffset.top) {
                    this.el.classList.remove(this.settings.className);
                    this.el.style.position = 'absolute';
                    this.el.style.top = `${this.prop.eOffset.top - ppOffset.top}px`;
                    this.el.style.left = `${this.prop.eOffset.left - ppOffset.left}px`;
                    // fix for the use of relative width on the element.
                    this.el.style.setProperty('width', this.prop.eBox.width + "px", "important");
                    this.currState = 'top-unpinned';
                }
                // unpin element
                // if element was pinned by pin1
                // and the scroll direction for been pinned has changed
                else if (this.currState === 'bottom-pinned' && this.tmp.scrollDir === -1) {
                    this.el.classList.remove(this.settings.className);
                    this.el.style.position = 'absolute';
                    this.el.style.top = `${prevScrollPos + window.innerHeight - this.prop.eBox.height - this.settings.bottomSpacing - ppOffset.top}px`;
                    this.el.style.left = `${this.prop.eOffset.left - ppOffset.left}px`;
                    // fix for the use of relative width on the element.
                    this.el.style.setProperty('width', this.prop.eBox.width + "px", "important");
                    this.currState = 'dir-bottom-unpinned';
                }
                // unpin element
                // if element was pinned by pin2
                // and the scroll direction for been pinned has changed
                else if (this.currState === 'top-pinned' && this.tmp.scrollDir === 1) {
                    this.el.classList.remove(this.settings.className);
                    this.el.style.position = 'absolute';
                    this.el.style.top = `${prevScrollPos + this.settings.topSpacing - ppOffset.top}px`;
                    this.el.style.left = `${this.prop.eOffset.left - ppOffset.left}px`;
                    // fix for the use of relative width on the element.
                    this.el.style.setProperty('width', this.prop.eBox.width + "px", "important");
                    this.currState = 'dir-top-unpinned';
                }
            }
            else {
                if (this.settings.pinPriority === 'bottom') {
                    // pin element at the bottom if pinPriority is set to bottom
                    // and element is not guarded by an ancestor
                    // or if guarded, the guardian content-visible area on the screen can contain the pin element and it bottom space
                    if (this.currState !== 'bottom-pinned' && (!this.settings.ancestorGuarded || (
                        (this.prop.pOffset.top < this.tmp.scrollPos || this.tmp.scrollPos + window.innerHeight - this.prop.pOffset.top >= this.prop.eBox.height + this.settings.bottomSpacing + this.getTB(this.guardian, true)) &&
                        (this.prop.pOffset.top + this.prop.pBox.height - this.getTB(this.guardian) > this.tmp.scrollPos + window.innerHeight || this.tmp.scrollPos + window.innerHeight - this.prop.pOffset.top - this.prop.pBox.height + this.getTB(this.guardian) <= this.settings.bottomSpacing)
                    ))) {
                        this.el.classList.add(this.settings.className);
                        this.el.style.position = 'fixed';
                        this.el.style.top = `${window.innerHeight - this.prop.eBox.height - this.settings.bottomSpacing}px`;
                        this.el.style.left = `${this.prop.eOffset.left}px`;
                        // fix for the use of relative width on the element.
                        this.el.style.setProperty('width', `${this.prop.eBox.width}px`, 'important');

                        this.currState = 'bottom-pinned';
                    }
                    else if (this.settings.ancestorGuarded) {
                        // unpin element if user is scrolling down and have scrolled past the bottom of guardian element
                        if (this.currState !== 'bottom-unpinned' && (
                            this.prop.pOffset.top + this.prop.pBox.height < this.tmp.scrollPos + window.innerHeight &&
                            this.tmp.scrollPos + window.innerHeight - this.prop.pOffset.top - this.prop.pBox.height + this.getTB(this.guardian) > this.settings.bottomSpacing
                        )) {
                            // this.tmp.scrollPos + window.innerHeight - this.prop.pOffset.top - this.prop.pBox.height + this.getTB(this.guardian) < this.settings.bottomSpacing
                            this.el.classList.remove(this.settings.className);
                            this.el.style.position = 'absolute';
                            this.el.style.top = `${this.prop.pOffset.top + this.prop.pBox.height - this.prop.eBox.height - this.getTB(this.guardian) - ppOffset.top}px`;
                            // this.el.style.top = this.prop.pBox.height - this.getTB(this.guardian) - this.prop.eBox.height;
                            this.el.style.left = `${this.prop.eOffset.left - ppOffset.left}px`;
                            // fix for the use of relative width on the element.
                            this.el.style.setProperty('width', `${this.prop.eBox.width}px`, 'important');

                            this.currState = 'bottom-unpinned';
                        }
                        // unpin element if user is scrolling up and have scrolled past the top of guardian element
                        else if (this.currState !== 'top-unpinned' && (
                            this.prop.pOffset.top > this.tmp.scrollPos &&
                            this.tmp.scrollPos + window.innerHeight - this.prop.pOffset.top < this.prop.eBox.height + this.settings.bottomSpacing + this.getTB(this.guardian, true)
                        )) {
                            this.el.classList.remove(this.settings.className);
                            this.el.style.position = 'absolute';
                            this.el.style.top = `${this.prop.pOffset.top + this.getTB(this.guardian, true) - ppOffset.top}px`;
                            this.el.style.left = `${this.prop.eOffset.left - ppOffset.left}px`;
                            // fix for the use of relative width on the element.
                            this.el.style.setProperty('width', `${this.prop.eBox.width}px`, 'important');

                            this.currState = 'top-unpinned';
                        }
                    }
                }
                else {
                    // pin element at the top if element has been scrolled out of page (from top)
                    // also if element is Guarded by parent, the parent must have enough visible area to contain the element and its top spacing
                    // and if element is sticky, then the user must be scrolling down \/ and the element must not be recently unpined by unpin2
                    if (
                        (!this.settings.sticky || (this.tmp.scrollDir === 1 && this.currState !== 'bottom-unpinned')) &&
                        this.tmp.scrollPos > this.prop.eOffset.top - this.settings.topSpacing &&
                        (!this.settings.ancestorGuarded || this.prop.pOffset.top + this.prop.pBox.height - this.tmp.scrollPos > this.prop.eBox.height + this.settings.topSpacing + this.getTB(this.guardian)) &&
                        !this.el.classList.contains(this.settings.className)
                    ) {
                        this.el.classList.add(this.settings.className);
                        this.el.style.position = 'fixed';
                        this.el.style.top = `${this.settings.topSpacing}px`;
                        this.el.style.left = `${this.prop.eOffset.left}px`;
                        // fix for the use of relative width on the element.
                        this.el.style.setProperty('width', `${this.prop.eBox.width}px`, 'important');

                        this.currState = 'top-pinned';
                    }
                    // pin element at the bottom if element is sticky
                    // and was recently unpined by unpin2
                    // and the user is scrolling the page up /\
                    // also the parent of sticky has enough space in the viewport to contain the element
                    else if (
                        this.settings.sticky && this.currState === 'bottom-unpinned' && this.tmp.scrollDir === -1 &&
                        this.prop.pOffset.top + this.prop.pBox.height > this.tmp.scrollPos + window.innerHeight &&
                        utils.offsetPos(this.el).top + this.prop.eBox.height + this.settings.bottomSpacing >= window.innerHeight + this.tmp.scrollPos &&
                        !this.el.classList.contains(this.settings.className)
                    ) {
                        this.el.classList.add(this.settings.className);
                        this.el.style.position = 'fixed';
                        this.el.style.top = `${window.innerHeight - this.prop.eBox.height - this.settings.bottomSpacing}px`;
                        this.el.style.left = `${this.prop.eOffset.left}px`;
                        // fix for the use of relative width on the element.
                        this.el.style.setProperty('width', `${this.prop.eBox.width}px`, 'important');

                        this.currState = 'bottom-pinned';
                    }
                    // unpin the element if the page scrolls to where the initial offset of the element is visible
                    // but element must not be sticky
                    // else element must not be recently pined by pin2
                    // else user must be scrolling up /\ and must have scroll to the initial position of the element
                    else if (
                        this.tmp.scrollPos + this.settings.topSpacing <= this.prop.eOffset.top &&
                        (!this.settings.sticky || (this.currState !== 'bottom-pinned' || this.tmp.scrollDir === -1)) &&
                        this.el.classList.contains(this.settings.className)
                    ) {
                        this.el.classList.remove(this.settings.className);
                        this.el.style.position = 'absolute';
                        this.el.style.top = `${this.prop.eOffset.top - ppOffset.top}px`;
                        this.el.style.left = `${this.prop.eOffset.left - ppOffset.left}px`;
                        // fix for the use of relative width on the element.
                        this.el.style.setProperty('width', `${this.prop.eBox.width}px`, 'important');

                        this.currState = 'top-unpinned';
                    }
                    // unpin element and make it stay at the bottom of parent if it is parent-Guarded
                    // and the page has scrolled reaching or past the parent
                    // and if element was recently pinned by pin2, the user must be scrolling down \/ the page
                    // must have reach or scrolled the parent out of viewport
                    else if (
                        this.settings.ancestorGuarded &&
                        (this.tmp.scrollPos > this.prop.pOffset.top + this.prop.pBox.height - this.prop.eBox.height - this.settings.topSpacing - this.getTB(this.guardian) ||
                            (this.currState === 'bottom-pinned' && this.tmp.scrollDir === 1 && this.prop.pOffset.top + this.prop.pBox.height < this.scrollPos + window.innerHeight)
                        ) && (this.el.classList.contains(this.settings.className) || this.currState === 'reset-state')
                    ) {
                        this.el.classList.remove(this.settings.className);
                        this.el.style.position = 'absolute';
                        this.el.style.top = `${this.prop.pOffset.top + this.prop.pBox.height - this.prop.eBox.height - this.getTB(this.guardian) - ppOffset.top}px`;
                        // this.el.style.top = this.prop.pBox.height - this.getTB(this.guardian) - this.prop.eBox.height;
                        this.el.style.left = `${this.prop.eOffset.left - ppOffset.left}px`;
                        // fix for the use of relative width on the element.
                        this.el.style.setProperty('width', `${this.prop.eBox.width}px`, 'important');

                        this.currState = 'bottom-unpinned';
                    }
                }
            }
        },
        stopScrollPin() {
            // stop height streaming
            const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
            cancelAnimationFrame(this.sizeStreamId);

            // stop scrollPin events
            window.removeEventListener('resize', this.getGeometry);
            window.removeEventListener('scroll', this.onScrollMtd);
            this.el.removeEventListener('stopScrollPin', this.stopScrollPin);

            // reset scrollPin element
            this.el.classList.remove(this.settings.className);
            if (this.initStyle) this.el.setAttribute('style', this.initStyle);
            else this.el.removeAttribute('style');
        },
        // utility to get padding and border of either the top side or the bottom side of an element
        getTB(el, top) {
            if (top) return parseFloat(utils.getCssVal(el, 'padding-top')) + parseFloat(utils.getCssVal(el, 'border-top-width'));
            return parseFloat(utils.getCssVal(el, 'padding-bottom')) + parseFloat(utils.getCssVal(el, 'border-bottom-width'));
        }
    }
};