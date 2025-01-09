export default {
    mounted(el) {
        function toggleCollapsible(e) {
            const collapsible = el.nextElementSibling.matches('.collapsible') ? el.nextElementSibling : null;
            const accordion = el.getAttribute('data-collapsible');

            if (e) el.classList.toggle('active');

            if (collapsible) {
                if (el.classList.contains('active')) {
                    collapsible.style.height = collapsible.scrollHeight + 'px';

                    if (accordion) {
                        let activeElems = [...el.parentNode.querySelectorAll(`:scope > [data-collapsible='${accordion}']`)].filter(elem => elem.classList.contains('active') && elem !== el);
                        if (activeElems[0]) {
                            activeElems.forEach(el => el.dispatchEvent(new Event('click')));
                        }
                    }
                    setTimeout(() => {
                        collapsible.style.height = 'auto';
                        utils.triggerEvent(window, 'resize');           
                    }, utils.durationInMilliseconds(utils.getCssVal(collapsible, 'transition-duration')));
                    
                }
                else {
                    collapsible.style.height = collapsible.scrollHeight + 'px';
                    utils.afterNextRepaint(() => collapsible.style.height = null);
                    setTimeout(() => utils.triggerEvent(window, 'resize'), utils.durationInMilliseconds(utils.getCssVal(collapsible, 'transition-duration')));

                }
            }
        }

        toggleCollapsible();
        el.addEventListener('click', toggleCollapsible);
    },
}