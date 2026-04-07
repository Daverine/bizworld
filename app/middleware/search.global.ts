export default defineNuxtRouteMiddleware((to, from) => {
  if (from.path !== "/search") return;
  const searchStore = useSearchStore();
  searchStore.searchBox = "";
});
