export function Collapsible() {
    const dnm = {
        toggleCollapsible(e, el) {
            el = el || e.currentTarget;

            const
                collapsible = el.nextElementSibling.matches('.collapsible') ? el.nextElementSibling : null,
                accordion = el.getAttribute('data-collapsible')
            ;

            if (e !== 'initialize') el.classList.toggle('active');
            
            if (collapsible) {
                if (el.classList.contains('active')) {
                    collapsible.style.maxHeight = collapsible.scrollHeight + 'px';
                    
                    if (accordion) {
                        let activeElems = [...el.parentNode.querySelectorAll(`:scope > [data-collapsible='${accordion}']`)].filter(elem => elem.classList.contains('active') && elem !== el);
                        if (activeElems[0]) {
                            activeElems.forEach(el => el.dispatchEvent(new Event('click')));
                        }
                    }
                }
                else collapsible.style.maxHeight = null;
            }
        }
    };

    return {
        mounted(el) {
            dnm.toggleCollapsible('initialize', el);
            el.addEventListener('click', dnm.toggleCollapsible);
        },
        updated(el) { dnm.toggleCollapsible('initialize', el); },
        unmounted(el) { el.removeEventListener('click', dnm.toggleCollapsible); }
    }
}