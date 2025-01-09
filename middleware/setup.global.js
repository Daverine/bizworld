export default defineNuxtRouteMiddleware((to, from) => {
    const
        userStore = useUserStore(),
        searchStore = useSearchStore()
    ;
    if (to.meta.auth && !userStore.auth) {
        userStore.routeProceed = to;
        return navigateTo('/login');
    }

    if (from.path === '/search') {
        searchStore.searchBox = '';
    }
});