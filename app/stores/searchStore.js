import businessess from "@/assets/jsons/businesses.json";
import products from "@/assets/jsons/products.json";

export const useSearchStore = defineStore("search", {
  state: () => ({
    searchBox: "",
    searchIn: "businesses",
    resultIn: "",
    location: "nigeria",
    categories: ["businesses", "products"],
    searchResult: [],
  }),
  actions: {
    async triggerSearch() {
      if (!this.searchBox) return;

      await navigateTo({
        name: "search",
        params: { searchIn: this.searchIn },
        query: { q: this.searchBox },
      });
      this.resultIn = this.searchIn;

      if (this.searchIn === "businesses") this.searchResult = businessess;
      else if (this.searchIn === "products") this.searchResult = products;
    },
  },
});
