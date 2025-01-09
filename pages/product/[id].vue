<script setup>
definePageMeta({ layout: "details" });
const route = useRoute();
const details = ref({
  type: "product",
  title:
    "Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery",
  price: "N100,000",
  currency: "Naira",
  negotiable: true,
  media: [
    ["pic", "/images/product.jpeg"],
    ["pic", "/images/product.jpeg"],
    ["pic", "/images/product.jpeg"],
  ],
  specifications: {
    Type: "Laptop",
    Condition: "Used",
    Brand: "Dell",
    Model: "Inspiron 5050",
    Processor: "Intel Corel i5 5th Generation",
    RAM: "8gb DDR3",
    Storage: "256gb SSD M.2",
    "Display Size": '15.6"',
    Graphics: "Intel Graphics 3000 (64mb)",
  },
  reviews: [
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 3,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 3,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
    {
      userid: "e8e34",
      username: "daverine",
      userpic: "/images/profile_pic.jpg",
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: "I enjoy my experience doing business with you guys. keep it up.",
    },
  ],
  bizData: {
    logo: "/images/logo-sq.png",
    bizName: "Emmadave Computer Technology Services",
    bizUrl: "https://www.edtech.com",
    mainCategory: "Computer repair services",
    contacts: {
      tel: "08157483233",
      email: "contact_us@edtech.com",
    },
    verified: true,
    location: {
      address: "3 Nepal road, beside Igbagboyemi Pharmacy, Isabo 111102",
      city: "Abeokuta",
      state: "Ogun State",
      url: "https://goo.gl/maps/y9ExQLSq37FL6EHm6",
    },
    hours: [
      [-1],
      ["8:30", "18:30"],
      ["8:30", "18:30"],
      ["15:30", "18:30"],
      ["8:30", "18:30"],
      [-1],
      ["8:30", "18:30"],
    ],
  },
});
const divider = useTemplateRef("divider");
const dgContent = useTemplateRef("dgContent");
const activeFixedMenu = ref(false);
const feedStore = useFeedStore();
let isLargeScreen = ref(false);
onMounted(() =>
  watchEffect(() => {
    isLargeScreen.value = useMediaQuery("(min-width: 768px)").value;
  })
);
onMounted(() => feedStore.getUpdate());

function mediaResponsiveness(rule) {
  let mediaWidth;
  let mediaHeight;

  window.addEventListener("resize", () => {
    mediaWidth = window.innerWidth;
    mediaHeight = window.innerHeight;
  });
}

function nextOpenDay(hours) {
  let ex = new Date().getDay() === 6 ? 0 : new Date().getDay() + 1,
    i = 1,
    result;

  for (; i < 6; i++) {
    if (hours[ex > 5 ? -1 + i : ex + i][0] !== -1) {
      result = ex > 5 ? -1 + i : ex + i;
      break;
    }
  }

  return result;
}

function getMinutes(time) {
  time = time.split(":");
  return Number(time[0]) * 60 + Number(time[1]);
}

function to12hrsTime(time) {
  time = time.split(":");
  return `${Number(time[0]) % 12 || 12}:${time[1]}${
    Number(time[0]) >= 12 ? "PM" : "AM"
  }`;
}

function whatDay(index) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][index];
}

function handleScroll() {
  if (divider.value.getBoundingClientRect().top <= 210) {
    activeFixedMenu.value = true;
  } else {
    activeFixedMenu.value = false;
  }
}
</script>
<template>
  <Title>{{ details.title }}</Title>
  <main class="grid-layout" style="padding-top: 1rem">
    <div class="prod-cont">
      <div class="sp-wrapper z-level-2 p-h">
        <div
          v-scrollPin="{
            clipTop: 64,
            topSpacing: 8,
            ancestorGuarded: true,
            breakpoints: [{ maxWidth: 767, pinnable: false }],
          }"
          class="prod-summary"
        >
          <Carousel>
            <div v-for="slide in details.media" class="cs-slide">
              <img
                v-if="slide[0] === 'pic'"
                :src="slide[1]"
                :data-lightbox="slide[1]"
                data-target="lightbox1"
                class="image"
              />
            </div>
            <template v-if="isLargeScreen" #trackers>
              <div v-for="slide in details.media" class="thumbnail cs-tracker">
                <img v-if="slide[0] === 'pic'" :src="slide[1]" />
              </div>
            </template>
          </Carousel>
          <div class="dm-heading">
            <h6 class="semibold dm-title">{{ details.title }}</h6>
            <div class="flexbox flex-separate guttered small semibold">
              <span
                v-tooltip.unblocking
                data-tooltip="Average Rate (Number of raters)"
              >
                <Icon
                  name="material-symbols:star-rounded"
                  class="yellow-text"
                />
                {{
                  `${(
                    details.reviews.reduce((n, i) => n + i.rating, 0) /
                    details.reviews.length
                  ).toFixed(1)} (${details.reviews.length} reviews)`
                }}
              </span>
              <span
                v-tooltip.unblocking
                :data-tooltip="details.bizData.location.address"
              >
                <Icon name="material-symbols:location-on-outline-rounded" />
                {{
                  `${details.bizData.location.city}, ${details.bizData.location.state}`
                }}
              </span>
            </div>
            <div class="h3 0-margined primary-text semibold">
              {{ details.price }}
              <!-- <Icon
                v-if="details.negotiable"
                name="material-symbols:handshake-outline-rounded"
                style="color: var(--secondary); font-size: 1em"
                v-tooltip.unblocking
                data-tooltip="Negotiable"
              /> -->
            </div>
          </div>
        </div>
      </div>
      <div class="prod-details">
        <div v-collapsible class="sub heading a-block active">
          <Icon name="material-symbols:overview-outline-rounded" class="lead" />
          Product Overview
          <i class="ac-viewbox trailing icon">
            <Icon name="material-symbols:chevron-left-rounded" />
            <Icon name="material-symbols:expand-more-rounded" />
          </i>
        </div>
        <div class="collapsible">
          <p>
            This product is suitable for office use and it also presentable. It
            has a long lasting battery and its capable of handling comming
            computer daily tasks.
          </p>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <Icon name="material-symbols:list-alt-outline-rounded" class="lead" />
          Specifications
          <i class="ac-viewbox trailing icon">
            <Icon name="material-symbols:chevron-left-rounded" />
            <Icon name="material-symbols:expand-more-rounded" />
          </i>
        </div>
        <div class="collapsible">
          <table class="basic definition table">
            <tbody>
              <tr v-for="(value, key) in details.specifications">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <Icon
            name="material-symbols:local-shipping-outline-rounded"
            class="lead"
          />
          Delivery
          <i class="ac-viewbox trailing icon">
            <Icon name="material-symbols:chevron-left-rounded" />
            <Icon name="material-symbols:expand-more-rounded" />
          </i>
        </div>
        <div class="collapsible">
          <div class="italic">No delivery service offered by seller.</div>
          <a
            href="https://www.bw.net/thirdparty-delivery"
            target="_blank"
            class="warning compact action note"
          >
            <Icon
              name="material-symbols:local-shipping-outline-rounded"
              style="font-size: 1.875em"
            />
            <div class="content">
              <div class="heading">Third-party Delivery</div>
              <div class="faint-text-v1">
                Click here to check our list of third-party delivery providers.
              </div>
            </div>
            <Icon name="material-symbols:chevron-right-rounded" />
          </a>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <Icon
            name="material-symbols:shield-person-outline-rounded"
            class="lead"
          />
          Buyer's Protection
          <i class="ac-viewbox trailing icon">
            <Icon name="material-symbols:chevron-left-rounded" />
            <Icon name="material-symbols:expand-more-rounded" />
          </i>
        </div>
        <div class="collapsible">
          <div class="compact success note">
            <Icon
              name="material-symbols:verified-user-outline-rounded"
              style="font-size: 1.875em"
            />
            <div class="content">
              <div class="heading">Escrow Payment</div>
              <div class="faint-text-v1">
                The seller receives escrow payment. So you can be assured to get
                your ordered product.
              </div>
            </div>
          </div>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <Icon name="material-symbols:reviews-outline-rounded" class="lead" />
          Ratings and Reviews
          <i class="ac-viewbox trailing icon">
            <Icon name="material-symbols:chevron-left-rounded" />
            <Icon name="material-symbols:expand-more-rounded" />
          </i>
        </div>
        <div class="collapsible">
          <section>
            <div class="flexbox" style="flex-flow: row-reverse wrap">
              <div class="col 6-width md-2-width">
                <div
                  class="centered"
                  :set="
                    (rating = (
                      details.reviews.reduce((n, i) => n + i.rating, 0) /
                      details.reviews.length
                    ).toFixed(1))
                  "
                >
                  <div class="semibold" style="font-size: 3em">
                    {{
                      (
                        details.reviews.reduce((n, i) => n + i.rating, 0) /
                        details.reviews.length
                      ).toFixed(1)
                    }}
                  </div>
                  <div class="rating small yellow-text">
                    <Icon
                      v-for="i in Math.floor(rating)"
                      name="material-symbols:star-rounded"
                    />
                    <Icon
                      v-if="rating - Math.floor(rating) >= 0.5"
                      name="material-symbols:star-half-rounded"
                    />
                    <Icon
                      v-for="i in 5 - Math.round(rating)"
                      name="material-symbols:star-outline-rounded"
                    />
                  </div>
                  <div>{{ `${details.reviews.length} reviews` }}</div>
                </div>
              </div>
              <div class="col 6-width md-4-width">
                <table class="table compact borderless 0-margined">
                  <tbody>
                    <tr v-for="i in 5" :set="(n = 6 - i)">
                      <td style="width: 15px">{{ n }}</td>
                      <td>
                        <div class="progress-bar">
                          <div
                            class="determinate"
                            :style="`width: ${
                              (details.reviews.filter(
                                (elem) => elem.rating === n
                              ).length *
                                100) /
                              details.reviews.length
                            }%;`"
                          ></div>
                        </div>
                      </td>
                      <td style="width: 15px; text-align: right">
                        {{
                          `(${
                            details.reviews.filter((elem) => elem.rating === n)
                              .length
                          })`
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="centered">
              <p class="small semibold italic">
                Patronize {{ details.bizData.bizName }} to write a review.
              </p>
              <button class="compact button">
                <Icon
                  name="material-symbols:rate-review-outline-rounded"
                  class="lead"
                />
                Write a review
              </button>
            </div>
          </section>
          <hr />
          <div>
            <div
              class="flexbox flex-separate guttered align-vcenter"
              style="margin-bottom: 1rem"
            >
              <div class="semibold">Reviews</div>
              <Dropdown
                :options="{ directionPriority: { x: 'left' } }"
                class="outlined small button selection"
              >
                <Icon name="material-symbols:sort-rounded" class="lead" /> Sort:
                <div class="drop menu">
                  <div class="item active">Newest</div>
                  <div class="item">Highest</div>
                  <div class="item">Lowest</div>
                </div>
              </Dropdown>
            </div>
            <div class="dm-reviews">
              <div
                v-for="a in Math.min(5, details.reviews.length)"
                class="dm-review"
                style="padding: 0.5em"
                :set="(review = details.reviews[a - 1])"
              >
                <header class="flexbox flex-separate align-vcenter guttered">
                  <div class="circular small avatar image">
                    <img
                      src="../../assets/Images/profilepic.jpg"
                      alt="generic profile picture"
                    />
                  </div>
                  <div class="content flexible">
                    <div class="bold">{{ review.username }}</div>
                    <div class="dm-gap" style="gap: 0.5em">
                      <div
                        class="rating mini yellow-text"
                        :set="(rating = review.rating)"
                      >
                        <Icon
                          v-for="i in Math.floor(rating)"
                          name="material-symbols:star-rounded"
                        />
                        <Icon
                          v-if="rating - Math.floor(rating) >= 0.5"
                          name="material-symbols:star-half-rounded"
                        />
                        <Icon
                          v-for="i in 5 - Math.round(rating)"
                          name="material-symbols:star-outline-rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <Dropdown>
                    <Icon name="material-symbols:more-vert" />
                    <div class="drop menu small">
                      <div class="item">
                        <Icon
                          name="material-symbols:flag-outline-rounded"
                          class="lead"
                        />
                        Report
                      </div>
                    </div>
                  </Dropdown>
                </header>
                <article>{{ review.review }}</article>
                <footer>
                  <span class="faint-text-v1 small semibold">12-01-2034</span>
                </footer>
              </div>
              <div v-if="details.reviews.length > 5" class="centered">
                <a href="#" class="flat primary button"
                  >More reviews ({{ details.reviews.length - 5 }})</a
                >
              </div>
            </div>
          </div>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <Icon name="material-symbols:store-outline-rounded" class="lead" />
          Seller's Information
          <i class="ac-viewbox trailing icon">
            <Icon name="material-symbols:chevron-left-rounded" />
            <Icon name="material-symbols:expand-more-rounded" />
          </i>
        </div>
        <div class="a-block collapsible">
          <div class="lead" style="position: relative; align-self: center">
            <img :src="details.bizData.logo" class="loose avatar image" />
            <SvgIcon
              name="verified_sp"
              v-tooltip.unblocking
              data-tooltip="Verified"
              class="small green-text"
              style="position: absolute; bottom: 0px; right: 0px"
            />
          </div>
          <div class="content">
            <a href="#" class="bold">{{ details.bizData.bizName }}</a>
            <div class="sc-gap">
              <span class="small semibold">{{
                details.bizData.mainCategory
              }}</span>
              <span
                v-tooltip.unblocking
                :data-tooltip="details.bizData.location.address"
                class="truncate small semibold"
                style="color: var(--on-surface-variant)"
              >
                <Icon name="material-symbols:location-on-outline-rounded" />
                {{
                  `${details.bizData.location.city}, ${details.bizData.location.state}`
                }}
              </span>
            </div>
            <div class="semibold sc-gap">
              <span
                v-if="details.bizData.rating"
                class="semibold small"
                v-tooltip.unblocking
                data-tooltip="Average Rate (Number of raters)"
              >
                <Icon
                  name="material-symbols:star-rounded"
                  class="yellow-text"
                />
                {{
                  `${details.bizData.rating.rate} (${details.bizData.rating.raters})`
                }}
              </span>
              <span
                class="semibold small"
                v-tooltip.unblocking
                :data-tooltip="
                  details.bizData.hours[new Date().getDay()][0] < 0
                    ? 'Did not open today at all.'
                    : `Open today by ${
                        details.bizData.hours[new Date().getDay()][0]
                      }:00 and closes by ${
                        details.bizData.hours[new Date().getDay()][1]
                      }:00.`
                "
              >
                <Icon name="material-symbols:today-outline-rounded" />
                <template
                  v-if="
                    details.bizData.hours[new Date().getDay()][0] < 0 ||
                    details.bizData.hours[new Date().getDay()][0] >
                      new Date().getHours() ||
                    details.bizData.hours[new Date().getDay()][1] <=
                      new Date().getHours()
                  "
                >
                  <span class="error-text">Closed. </span>
                  <span
                    v-if="
                      details.bizData.hours[new Date().getDay()][0] >
                      new Date().getHours()
                    "
                    >Opens
                    {{ details.bizData.hours[new Date().getDay()][0] }}</span
                  >
                  <span else>
                    Opens
                    {{
                      details.bizData.hours[
                        new Date().getDay() === 6 ? 0 : new Date().getDay() + 1
                      ][0] > -1
                        ? `${
                            details.bizData.hours[
                              new Date().getDay() === 6
                                ? 0
                                : new Date().getDay() + 1
                            ][0]
                          }:00
                    Tomorrow`
                        : `${
                            details.bizData.hours[
                              nextOpenDay(details.bizData.hours)
                            ][0]
                          } on
                    ${whatDay(nextOpenDay(details.bizData.hours))}`
                    }}</span
                  >
                </template>
                <template v-else>
                  <span
                    v-if="
                      details.bizData.hours[new Date().getDay()][1] -
                        new Date().getHours() <
                      2
                    "
                    class="warning-text"
                    >Closes soon.
                  </span>
                  <span v-else class="success-text">Open. </span>
                  <span
                    >Closes
                    {{
                      `${details.bizData.hours[new Date().getDay()][1]}:00`
                    }}</span
                  >
                </template>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sp-wrapper fluid z-level-2 p-f">
      <div
        v-scrollPin="{ pinPriority: 'bottom', ancestorGuarded: true }"
        class="prod-footer surface-bg"
      >
        <div class="container flexbox guttered" style="padding: 0.5rem 1rem;">
          <Dropdown class="primary button">
            <Icon name="material-symbols:add-shopping-cart" class="lead" />
            Add to cart
            <div class="drop menu pointing">
              <div class="content" style="padding: 0.5em">
                <div class="field">
                  <label>Quantity</label>
                  <input
                    type="number"
                    class="form-item compact"
                    min="1"
                    value="1"
                  />
                </div>
                <hr class="transparent" />
                <div class="flexbox guttered">
                  <button class="exit-dd secondary compact button">Checkout</button>
                  <button class="exit-dd secondary flat compact button">Add and shop more</button>
                </div>
              </div>
            </div>
          </Dropdown>
          <button class="outlined button">
            <Icon
              name="material-symbols:bookmark-add-outline-rounded"
              class="lead"
            />
            Save
          </button>
          <button
            class="flat circular button"
            v-tooltip.unblocking
            data-tooltip="Contact seller"
          >
            <Icon name="material-symbols:chat-outline-rounded" />
          </button>
          <Dropdown
            :options="{ directionPriority: { x: 'left', y: 'top' } }"
            v-tooltip.unblocking
            data-tooltip="More options"
            class="flat circular button"
          >
            <Icon name="material-symbols:more-vert" />
            <div class="drop menu">
              <div class="item">
                <Icon
                  name="material-symbols:category-search-outline-rounded"
                  class="lead"
                />
                View related
              </div>
              <div class="item">
                <Icon
                  name="material-symbols:bookmark-add-outline-rounded"
                  class="lead"
                />
                Save card
              </div>
              <div class="item">
                <Icon name="material-symbols:share-outline" class="lead" />
                Share
              </div>
              <div class="item">
                <Icon
                  name="material-symbols:report-outline-rounded"
                  class="lead"
                />
                Report
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.prod-cont {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 1fr;

  .carousel {
    --thumbnail-size: 4.5rem;
  }
  .prod-summary {
    padding-bottom: 0.5rem;
  }

  @media only screen and (max-width: 767px) {
    grid-template-columns: 1fr;

    .carousel {
      padding-bottom: 0px;
    }
  }
}

.show-onpinned {
  opacity: 0;
  transition: all 100ms ease;
}

.pinned .show-onpinned {
  opacity: 1;
}

.posts-sec {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto;
  gap: 1rem;
  margin-top: 5rem;

  @media only screen and (max-width: 1000px) {
    grid-template-columns: 1fr;

    & > .biz-pin {
      display: none;
    }
  }
}

.posts-main {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.page-aside {
  display: flex;
  border-radius: var(--sm-radius);
  border: 1px solid var(--outline);
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
  max-width: 100%;
  padding: 1rem;
  align-items: center;
  flex-direction: column;
}

.ft-badge {
  filter: saturate(0.1);
  text-align: center;
  color: transparent;

  &:hover {
    filter: saturate(1);
    color: inherit;
  }
}

.footer-main {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(4, 1fr);

  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 550px) {
    grid-template-columns: 1fr;
  }
}
</style>
