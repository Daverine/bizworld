export default defineNuxtRouteMiddleware((to, from) => {
    const
        userStore = useUserStore(),
        searchStore = useSearchStore()
    ;
    console.log(userStore.routeProceed);
    if (to.meta.auth && !userStore.auth) {
        userStore.routeProceed = to;
        console.log('i got here');
        return navigateTo('/login');
    }

    if (from.path === '/search') {
        searchStore.searchBox = '';
    }
});