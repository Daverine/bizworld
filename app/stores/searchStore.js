import sresults from '@/assets/jsons/sresults.json';

export const useSearchStore = defineStore('search', {
    state: () => ({
        searchBox: '',
        searchResults: []
    }),
    actions: {
        triggerSearch() {
            const router = useRouter();
            
            if (!this.searchBox) return;
            router.push('/search?q='+this.searchBox);
            this.searchResults = sresults;
        }
    }
});