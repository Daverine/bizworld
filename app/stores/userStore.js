import followed from '@/assets/jsons/followed.json';
import reviews from '@/assets/jsons/reviews.json';

export const useUserStore = defineStore('user', {
    state: () => ({
        auth: false,
        routeProceed: '',
        userData: {
            firstName: 'Ayoola',
            lastName: 'Folorunso',
            email: 'folorunsodavid1@gmail.com',
            country: 'Nigeria',
            profileImg: '/images/profile.jpg',
            following: [],
            bookmarks: [],
            searchLocation: 'Itori, Ewekoro, Ogun state, Nigeria',
            manageBisiness: true,
        },
        savedCards: [],
        followedCards: [],
        yourReviews: []
    }),
    actions: {
        login(email, password) {
            this.auth = true;
            const router = useRouter();
            const route = useRoute();
            console.log(route.routeProceed);
            if (route.path === '/login' && this.routeProceed) router.push(this.routeProceed);
            else if (route.path === '/login' || route.path === '/') router.push('/home');
        },
        signup(firstname, lastname, email, password, country) {
            this.auth = true;
            const router = useRouter();
            const route = useRoute();

            if (route.path === '/register' && this.routeProceed) router.push(this.routeProceed);
            else if (route.path === '/register' || route.path === '/') router.push('/home');
        },
        logout() {
            this.auth = false;
            const router = useRouter();
            const route = useRoute();

            if (route.meta.auth) router.push('/');
        },
        async getSavedCards() {
            return new Promise(() => {
                setTimeout(() => {
                    this.savedCards = [];
                }, 200);
            });
        },
        async getFollowedCards() {
            return new Promise(() => {
                setTimeout(() => {
                    this.followedCards = followed;
                }, 200);
            })
        },
        async getReviews() {
            return new Promise(() => {
                setTimeout(() => {
                    this.yourReviews = reviews;
                }, 200);
            })
        }
    }
})