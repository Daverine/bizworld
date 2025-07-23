import tab from './directives/Tab';
import collapsible from './directives/Collapsible';
import scrollPin from './directives/ScrollPin';
import tooltip from './directives/Tooltip';

export default defineNuxtPlugin((app) => {
    app.vueApp.directive('collapser', collapsible);
    app.vueApp.directive('tooltip', tooltip);
    app.vueApp.directive('tab', tab);
    app.vueApp.directive('scrollPin', scrollPin);
});

