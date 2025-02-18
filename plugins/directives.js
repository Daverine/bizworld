import { Tooltip } from './directives/Tooltip';
import tab from './directives/Tab';
import collapsible from './directives/Collapsible';
import scrollPin from './directives/ScrollPin';

export default defineNuxtPlugin((app) => {
    app.vueApp.directive('collapser', collapsible);
    app.vueApp.directive('tooltip', new Tooltip());
    app.vueApp.directive('tab', tab);
    app.vueApp.directive('scrollPin', scrollPin);
});

