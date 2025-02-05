export const utils = {
	trackEscOn(trackId) {
		if (trackId === undefined) {
			console.warn(`You can't get Track Escape without a TrackId`);
			return;
		}

		if (!window.lui_EscTracker) window.lui_EscTracker = [];

		if (window.lui_EscTracker.includes(trackId)) {
			console.warn(`The passed trackId is been tracked already`, trackId);
			return;
		}

		window.lui_EscTracker.push(trackId);
		// if (typeof(window.lui_EscTracker) !== 'number') window.lui_EscTracker = 0; 
		// window.lui_EscTracker++;
		// return window.lui_EscTracker;
	},
	checkEscStatus(trackId, byForce) {
		if (trackId === undefined && !byForce) {
			console.warn(`You can't check Escape status without passing a trackId`);
			return;
		}

		if (!window.lui_EscTracker) {
			window.lui_EscTracker = [];
			return;
		}

		if (!window.lui_EscTracker.includes(trackId) && !byForce) {
			console.warn('The passed TrackId is not tracked', trackId);
			return;
		}

		if (window.lui_EscTracker.slice(-1)[0] === trackId || byForce) {
			window.lui_EscTracker = window.lui_EscTracker.filter(el => el !== trackId);
			return true;
		}
	},
	getScrollbarWidth() {
		return window.innerWidth - document.documentElement.clientWidth;
	},
	lockWindowScroll(lockerId) {
		if (!window.lui_ScrollLockers) window.lui_ScrollLockers = [];
		if (!window.lui_ScrollLockers.length) {
			// we guess it abnormal to add margin to the html unless on circumstance like this
			let scrollBarWidth = `${this.getScrollbarWidth()}px`;
			document.documentElement.classList.add('scroll-locked');
			document.documentElement.style.marginRight = scrollBarWidth;
			document.documentElement.style.overflow = 'hidden';
			[...document.querySelectorAll('.respect-lock')].forEach(el => {
				if (!el.lui) el.lui = {};
				el.lui.styleBeforeLock = el.getAttribute('style');
				el.style.maxWidth = `calc(100% - ${scrollBarWidth})`;
				el.style.marginRight = scrollBarWidth;
			});
		}
		if (!window.lui_ScrollLockers.includes(lockerId)) window.lui_ScrollLockers.push(lockerId);
	},
	unlockWindowScroll(lockerId) {
		if (window.lui_ScrollLockers && window.lui_ScrollLockers.includes(lockerId)) {
			window.lui_ScrollLockers = window.lui_ScrollLockers.filter(el => el !== lockerId);

			if (!window.lui_ScrollLockers.length) {
				document.documentElement.style.marginRight = null;
				document.documentElement.style.overflow = null;
				document.documentElement.classList.remove('scroll-locked');
				[...document.querySelectorAll('.respect-lock')].forEach(el => {
					el.setAttribute('style', ((el.lui && el.lui.styleBeforeLock) ? el.lui.styleBeforeLock : null));
					if (el.lui && el.lui.styleBeforeLock) el.lui.styleBeforeLock = null;
				});
				// this.afterNextRepaint(() => this.triggerEvent(window, 'resize'));
			}
		}
	},
	getUniqueId(nameSpace) {
		if (typeof (window.lui_uuid) !== 'number') window.lui_uuid = 0;
		window.lui_uuid++;
		nameSpace = (nameSpace != undefined && typeof (nameSpace) === 'string')
			? nameSpace
			: 'unique-id'

		return nameSpace + window.lui_uuid;
	},
	getCssVal(el, prop) {
		return window.getComputedStyle(el).getPropertyValue(prop);
	},
	contentSize(el) {
		let styleList = window.getComputedStyle(el), box = el.getBoundingClientRect();
		return {
			height: box.height - parseFloat(styleList.paddingTop) - parseFloat(styleList.paddingBottom) - parseFloat(styleList.borderTopWidth) - parseFloat(styleList.borderBottomWidth),
			width: box.width - parseFloat(styleList.paddingLeft) - parseFloat(styleList.paddingRight) - parseFloat(styleList.borderLeftWidth) - parseFloat(styleList.borderRightWidth)
		}
	},
	offsetPos(el) {
		let box = el.getBoundingClientRect(), docElem = document.documentElement;
		return {
			top: box.top + window.scrollY - docElem.clientTop,
			left: box.left + window.scrollX - docElem.clientLeft
		};
	},
	getParents(el, selector, until) {
		if (until) {
			if (typeof (until) == 'string') {
				until = [...document.querySelectorAll(until)].filter((elem) => elem.contains(el));
				if (!until.length) return;
				else until = until[0];
			}
			else if (!until.contains(el)) until = document;
		}
		else until = document;

		let parents = [];

		while ((el = el.parentNode) && el !== until) {
			if (selector) {
				if (el.matches(selector)) parents.push(el);
				continue;
			}
			parents.push(el);
		}

		return parents;
	},
	nextAll(el) {
		const nextElements = []
		let nextElement = el

		while (nextElement.nextElementSibling) {
			nextElements.push(nextElement.nextElementSibling)
			nextElement = nextElement.nextElementSibling
		}

		return nextElements
	},
	triggerEvent(el, eventType, customData) {
		if (typeof eventType === 'string') {
			if (customData !== undefined) el.dispatchEvent(new CustomEvent(eventType, { detail: customData }));
			else if (typeof el[eventType] === 'function') el[eventType]();
			else el.dispatchEvent(new Event(eventType, { bubbles: true }));
		}
		else el.dispatchEvent(eventType);
	},
	isObject(value) {
		return (
			typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value)
		);
	},
	isClose(elem, selectors) {
		function checkElem(elem) {
			return typeof (elem) != 'undefined' && elem != null
		}

		if (typeof (selectors) === 'string') {
			return checkElem(elem.closest(selectors));
		}

		let isClose = false;

		// check if node is close to at-least one of the selector
		selectors.forEach(function (node) {
			isClose = checkElem(elem.closest(node));
		});

		return isClose;
	},
	focusRangeOnTab(range, e) {
		let focusableElements = [];
		[...range.querySelectorAll('[href], button, input, textarea, select, details, object, [tabindex]:not([tabindex="-1"])')]
			.forEach(el => {
				if (!el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')) focusableElements.push(a);
			});

		if (focusableElements.length < 1) {
			e.preventDefault();
			return;
		}

		let first = focusableElements[0],
			last = focusableElements[focusableElements.length - 1];

		if (document.activeElement === last && (!e.shiftKey && e.key === 'Tab')) {
			e.preventDefault();
			first.focus();
		}
		else if (document.activeElement === first && (e.shiftKey && e.key === 'Tab')) {
			e.preventDefault();
			last.focus();
		}
	},
	setHighlightRange(el) {
		let range, selection;

		if (document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(el);
			range.select();
		}
		else if (window.getSelection) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(el);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	},
	afterNextRepaint(func) {
		// requestAnimationFrame fires before repaint. So calling it twice makes it fire after a repaint.
		requestAnimationFrame(() => requestAnimationFrame(func));
	},
	compareArrays: (a, b) => a.length === b.length && a.every((element, index) => element === b[index]),
	durationInMilliseconds: (duration) => parseFloat(duration) * (duration.includes('ms') ? 1 : 1000),
}