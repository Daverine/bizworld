export default {
	props: ['id', 'options'],
	data() {
		return {
			showPanel: false,
			uniqueId: undefined,
			EscTrack: undefined,
			factory: {
				namespace: 'panel',
				toBeConsidered: ':scope .panel, :scope .pl-controls',
				toggler: '.open-panel',
				toExcuseToggler: '.ex-open-panel',
				setHighlightRange: true,
				setTabRange: true,
				closeOnEsc: true,
				closeOnWrapperClick: true,
				dismissible: true,
				dismisser: ':scope .exit-panel',
				autoFocusEl: ':scope [pl-autofocus]',
				commands: {
					open: 'open panel',
					close: 'close panel'
				},
				lockScreen: true,
				inDuration: 500,
				outDuration: 500,
				controller: undefined,
				ready: undefined,
				complete: undefined
			},
			settings: {},
			e: {}
		}
	},
	methods: {
		panelClickFunc(e) {
			if ((this.settings.closeOnWrapperClick && ![...this.e.pl.querySelectorAll(this.settings.toBeConsidered)].filter((el) => el.contains(e.target))[0]) || (this.settings.dismissible && e.target.closest(this.settings.dismisser))) this.showPanel = false;
		},
		panelKbdFunc(e) {
			// tab function in panel
			if (this.settings.setTabRange && e.key === 'Tab') utils.focusRangeOnTab(this.e.pl, e);
			// Control + A function in panel
			else if (this.settings.setHighlightRange && e.ctrlKey && e.code === 'KeyA') {
				if (document.querySelectorAll('input:focus, textarea:focus')[0]) return;
				e.preventDefault();
				utils.setHighlightRange(this.e.pl);
			}
		},
		panelEscFunc(e) {
			if (e.key === 'Escape' && utils.checkEscStatus(this.uniqueId)) this.showPanel = false;
		},
		togglePanel(e) {
			let toggler = [...document.querySelectorAll(this.settings.toggler)].filter((el) => el.contains(e.target) && (el.getAttribute('data-target') === this.id || el.getAttribute('href') === `#${this.id}`))[0];
			if (!toggler || e.target.closest(this.settings.toExcuseToggler)) return;
			this.settings.caller = toggler;
			this.showPanel = !this.showPanel;
		},
		pl_console(e) {
			if (e.detail === this.settings.commands.open) this.showPanel = true;
			else if (e.detail === this.settings.commands.close) this.showPanel = false;
		}
	},
	mounted() {
		this.settings = {
			...this.factory,
			...this.default || {},
			...this.options || {}
		};
		this.e.pl = this.$refs.panel;
		this.uniqueId = utils.getUniqueId(this.settings.namespace);
		document.addEventListener('click', this.togglePanel);
		this.e.pl.addEventListener('plconsole', this.pl_console);
	},
	watch: {
		showPanel(value) {
			if (value) {
				utils.lockWindowScroll(this.uniqueId);
				if (typeof(this.settings.controller) === 'function') this.settings.controller(this.e.pl, this.settings);
				document.addEventListener('keydown', this.panelKbdFunc);
				this.e.pl.addEventListener('click', this.panelClickFunc);
				if (this.settings.closeOnEsc) utils.trackEscOn(this.uniqueId), document.addEventListener('keyup', this.panelEscFunc);
				this.e.pl.classList.add('active');
				setTimeout(() => {
					if (typeof(this.settings.ready) === 'function') this.settings.ready(this.e.pl, this.settings);
					this.e.pl.scrollTop = 0;

					let autoFocusEl = [...this.e.pl.querySelectorAll(this.settings.autoFocusEl)][0];
					if (autoFocusEl) autoFocusEl.focus();
					else this.e.pl.focus();
				}, this.settings.inDuration);
			}
			else {
				document.removeEventListener('keydown', this.panelKbdFunc);
				this.e.pl.removeEventListener('click', this.panelClickFunc);
				if (this.settings.closeOnEsc) document.removeEventListener('keyup', this.panelEscFunc);					
				// safely get out of escape track
				utils.checkEscStatus(this.uniqueId, true);
				
				this.e.pl.classList.remove('active');
				setTimeout(() => {
					if (typeof(this.settings.complete) === 'function') this.settings.complete(this.e.pl, this.settings);
					if (this.settings.caller) this.settings.caller.focus();
					this.settings.caller = undefined;
					utils.unlockWindowScroll(this.uniqueId);
				}, this.settings.outDuration);
			}
		}
	},
	beforeUnmount() {
		this.showPanel = false;
		utils.unlockWindowScroll(this.uniqueId);
		document.removeEventListener('keydown', this.panelKbdFunc);
		this.e.pl.removeEventListener('click', this.panelClickFunc);
		document.removeEventListener('click', this.togglePanel);
	}
}