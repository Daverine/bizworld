import { Tooltip } from './directives/Tooltip';
import { Tab } from './directives/Tab';
import collapsible from './directives/Collapsible';
import scrollPin from './directives/ScrollPin';

export default defineNuxtPlugin((app) => {
    app.vueApp.directive('collapsible', collapsible);
    app.vueApp.directive('tooltip', new Tooltip());
    app.vueApp.directive('tab', new Tab());
    app.vueApp.directive('scrollPin', scrollPin);
});

