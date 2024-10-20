export function Tab() {
    const dnm = {
        tabClick(e, el) {
            el = el || e.currentTarget;

            const
                tabs = [...el.querySelectorAll(':scope [data-tab]')],
                pages = [...document.querySelectorAll('.tab-page')].filter(el => tabs.filter(elem => elem.matches(`[data-tab ='${el.getAttribute('id')}']`))[0])
            ;

            let currTab = e === 'initialize' ? (tabs.filter(el => el.classList.contains('active'))[0] || tabs[0]) : tabs.filter(el => el.contains(e.target))[0];

            if (currTab) {
                currTab.classList.add('active');
                tabs.filter(el => el != currTab).forEach(el => el.classList.remove('active'));

                let currPage = currTab.getAttribute('data-tab') ? pages.filter(el => el.matches(`#${currTab.getAttribute('data-tab')}`))[0] : null;
                
                if (currPage) currPage.classList.add('active');
                pages.filter(el => el != currPage).forEach(el => el.classList.remove('active'));
            }
        }
    };
    
    return {
        mounted(el) {
            dnm.tabClick('initialize', el);
            el.addEventListener('click', dnm.tabClick);
        },
        updated(el) { dnm.tabClick('initialize', el); },
        unmounted(el) { el.removeEventListener('click', dnm.tabClick); }
    }
}