export function Tooltip() {
    const dnm = function() {
        return {
            default: {
                namespace: 'tooltip',
                delay: 150,
                unblocking: false,
            },
            initialize(el, binding) {
                this.el = el;
                this.settings = utils.isObject(binding.value) ? { ...this.default, ...binding.value } : this.default;
                this.uniqueId = utils.getUniqueId(this.namespace);
                this.settings.unblocking = (binding.modifiers.hasOwnProperty('unblocking')) ? true : this.settings.unblocking;
                this.binding = binding;

                // bind all event methods to the correct 'this'
                Object.keys(this).forEach(el => {
                    if (typeof(this[el]) === 'function') {
                        this[el] = this[el].bind(this);
                    }
                });

                if (binding.value) el.setAttribute('data-tooltip', String(binding.value));
                this.createTooltip();
                this.el.addEventListener('pointerenter', this.showTooltip);
                this.el.addEventListener('removeTooltip', this.removeTooltip);
            },
            updateTooltip() {
                this.tooltip.textContent = this.el.getAttribute('data-tooltip');
            },
            createTooltip() {
                this.tooltip = document.createElement('div');
                this.tooltip.classList.add('plain', 'tooltip');
                this.tooltip.setAttribute('data-tooltipid', this.uniqueId);
                this.tooltip.textContent = this.el.getAttribute('data-tooltip');
                document.body.append(this.tooltip);

                this.observer = new MutationObserver(this.updateTooltip);
                this.observer.observe(this.el, { attributes: true });
            },
            showTooltip(e) {
                if (e.pointerType === 'touch') return;
                this.evt = e;
                this.calcPosition();
                this.el.addEventListener('mouseleave', this.hideTooltip);
                if (!this.settings.unblocking) this.el.addEventListener('mousemove', this.mousePosition);
            },
            hideTooltip() {
                this.el.removeEventListener('mousemove', this.mousePosition);
                this.el.removeEventListener('mouseleave', this.hideTooltip);
                clearTimeout(this.renderer);
                this.tooltip.classList.remove('active');
            },
            removeTooltip() {
                this.observer.disconnect();
                this.hideTooltip();
                if (this.tooltip) this.tooltip.remove();
            },
            getCoords(e) {
                return {
                    x: e.type.indexOf("touch") > -1 ? e.touches[0].clientX : e.clientX,
                    y: e.type.indexOf('touch') > -1 ? e.touches[0].clientY : e.clientY
                }
            },
            mousePosition(e) {
                let
                    coord = this.getCoords(e),
                    prevCoord = this.getCoords(this.evt)
                ;

                if (Math.abs(coord.x - prevCoord.x) > 20 || Math.abs(coord.y - prevCoord.y) > 20) {
                    this.evt = e;
                    this.tooltip.classList.remove('active');
                    clearTimeout(this.renderer);
                    this.renderer = setTimeout(() => { this.calcPosition(); }, this.settings.delay);
                }
            },
            calcPosition() {
                document.body.append(this.tooltip);
                this.tooltip.style.width = null;
                this.tooltip.classList.remove('rhs', 'lhs', 'upward', 'downward');

                let 
                    prop = this.getCoords(this.evt),
                    tProp = this.el.getBoundingClientRect(),
                    vHeight = window.innerHeight,
                    vWidth = window.innerWidth - utils.getScrollbarWidth(),
                    offset = 5,
                    spacing = {}, tpPos = {}
                ;

                prop.width = this.tooltip.getBoundingClientRect().width;

                if (this.settings.unblocking) {
                    this.tooltip.style.left = `${Math.max(Math.min(Math.max(0, tProp.left + (tProp.width/2) - (prop.width/2)), (vWidth - prop.width)), 0)}px`;
                    if (prop.width > vWidth) this.tooltip.style.width = `${vWidth}px`; // may need to adjust this later (width should be ajusted before styling left)
                }
                else {
                    spacing.top = prop.y - offset;
                    spacing.bottom = window.innerHeight - prop.y - offset;
                    spacing.left = prop.x - offset;
                    spacing.right = window.innerWidth - prop.x - offset;

                    tpPos.left = prop.x - this.tooltip.getBoundingClientRect().width - offset;
                    tpPos.right = prop.x + offset;

                    if (spacing.right >= prop.width || spacing.right >= spacing.left) {
                        if (prop.width > spacing.right) this.tooltip.style.width = `${spacing.right}px`;
                        this.tooltip.style.left = `${tpPos.right}px`;
                        this.tooltip.classList.add('rhs');
                    }
                    else {
                        if (prop.width > spacing.left) this.tooltip.style.width = `${spacing.left}px`;
                        this.tooltip.style.left = `${tpPos.left}px`;
                        this.tooltip.classList.add('lhs');
                    }
                }

                prop.height = this.tooltip.offsetHeight;

                if (this.settings.unblocking) {
                    spacing.top = tProp.top;
                    spacing.bottom = vHeight - tProp.top - tProp.height;
                    tpPos.top = tProp.top - prop.height - offset;
                    tpPos.bottom = tProp.top + tProp.height + offset;
                }
                else {
                    tpPos.top = prop.y - prop.height - offset;
                    tpPos.bottom = prop.y + offset;
                }

                if (spacing.bottom >= prop.height || spacing.bottom >= spacing.top) {
                    this.tooltip.style.top = `${tpPos.bottom}px`;
                    this.tooltip.classList.add('upward');
                }
                else {
                    this.tooltip.style.top = `${tpPos.top}px`;
                    this.tooltip.classList.add('downward');
                }

                this.tooltip.classList.add('active');
            }
        }
    };

    return {
        mounted(el, binding) {
            if (!el.lui) el.lui = {};
            el.lui.tooltip = dnm();
            el.lui.tooltip.initialize(el, binding);
        },
        unmounted(el) {
            utils.triggerEvent(el, 'removeTooltip');
        }
    }
}

/* tooltip should be non-blocking. it can appear in any of the four sides of the element. it open on mousehover and focus enter */