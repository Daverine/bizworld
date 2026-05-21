import followed from "@/assets/jsons/followed.json";
import reviews from "@/assets/jsons/reviews.json";

export const useUserStore = defineStore("user", {
  state: () => ({
    auth: false,
    routeProceed: "",
    userData: {
      firstName: "Ayoola",
      lastName: "Folorunso",
      email: "folorunsodavid1@gmail.com",
      country: "Nigeria",
      profileImg: "/images/profile.jpg",
      following: [],
      bookmarks: [],
      searchLocation: "Itori, Ewekoro, Ogun state, Nigeria",
      manageBisiness: true,
    },
    savedCards: [],
    followedCards: [],
    yourReviews: [],
  }),
  actions: {
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
      });
    },
    async getReviews() {
      return new Promise(() => {
        setTimeout(() => {
          this.yourReviews = reviews;
        }, 200);
      });
    },
  },
});
