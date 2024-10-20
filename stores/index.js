
export const useMainStore = defineStore('main', {
    state: () => ({
        showFixedMenu: false,
        colorScheme: 'auto-mode'
    }),
    actions: {
        mutateSFM(value) {
            if (typeof(value) !== 'boolean') return;
            this.showFixedMenu = value;
        }
    }
});