import sresults from '@/assets/jsons/sresults.json';
import businessess from '@/assets/jsons/businesses.json';
import products from '@/assets/jsons/products.json';
import { categories } from '@vueuse/core/metadata.mjs';

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchBox: '',
    searchIn: 'businesses',
    resultIn: '',
    location: 'nigeria',
    categories: ['businesses', 'products', 'projects'],
    searchResult: [],
  }),
  actions: {
    triggerSearch() {
      const router = useRouter();

      if (!this.searchBox) return;
      router.push({
        name: 'search',
        params: { searchIn: this.searchIn },
        query: { q: this.searchBox },
      });
      this.resultIn = this.searchIn;

      if (this.searchIn === 'businesses') this.searchResult = businessess;
      else if (this.searchIn === 'products') this.searchResult = products;
      else this.searchResult = sresults;
    },
  },
});
