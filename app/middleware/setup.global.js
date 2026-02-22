export default defineNuxtRouteMiddleware(async (to, from) => {
  const searchStore = useSearchStore();
  const { data } = await useAuth().useSession(useFetch);

  if (to.meta.auth && !data.value) {
    return navigateTo('/login?redirect=' + to.path);
  }

  if (from.path === '/search') {
    searchStore.searchBox = '';
  }
});
