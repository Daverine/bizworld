<script setup>
definePageMeta({ layout: "details" });
const route = useRoute();
const details = ref({
  type: "service",
  title:
    "Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW",
  price: "N100,000",
  currency: "Naira",
  media: [["pic", "/images/product.jpeg"]],
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
const isLargeScreen = ref(false);
const configureMessage = ref(true);
onMounted(() => {
  watchEffect(() => {
    isLargeScreen.value = useMediaQuery("(min-width: 768px)").value;
  });
});

const now = useNow({ interval: 1000 });
const isClosed = computed(
  () =>
    details.value.bizData.hours[now.value.getDay()][0] < 0 ||
    details.value.bizData.hours[now.value.getDay()][0] > now.value.getHours() ||
    details.value.bizData.hours[now.value.getDay()][1] <= now.value.getHours()
);
const willOpenToday = computed(
  () => isClosed.value && details.value.bizData.hours[now.value.getDay()][0] > now.value.getHours()
);
const closesSoon = computed(
  () => !isClosed.value &&  details.value.bizData.hours[now.value.getDay()][1] - now.value.getHours() < 2
);

onMounted(() => feedStore.getUpdate());

function nextOpenDay(hours) {
  let ex = now.value.getDay() === 6 ? 0 : now.value.getDay() + 1,
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
  <main class="grid-layout" style="padding-top: 1rem">
    <div class="prod-cont">
      <header class="sp-wrapper prod-summary">
        <div
          v-scrollPin="{
            clipTop: 64,
            topSpacing: 4,
            ancestorGuarded: true,
            breakpoints: [{ maxWidth: 767, pinnable: false }],
          }"
        >
          <div class="prod-heading">
            <h4 class="semibold prod-title">{{ details.title }}</h4>
            <!-- Seller's Details Section -->
            <section>
              <div class="a-block">
                <div
                  class="lead"
                  style="position: relative; align-self: center"
                >
                  <img :src="details.bizData.logo" class="avatar image" />
                  <SvgIcon
                    name="verified_sp"
                    v-tooltip.unblocking
                    data-tooltip="Verified"
                    class="small green-text"
                    style="position: absolute; bottom: 0px; right: 0px"
                  />
                </div>
                <div class="content">
                  <div class="bold truncate">
                    {{ details.bizData.bizName }}
                  </div>
                  <div
                    class="flexbox flex-wrap semibold"
                    style="gap: 0.25em 0.75em"
                  >
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
                      <Icon
                        name="material-symbols:location-on-outline-rounded"
                      />
                      {{
                        `${details.bizData.location.city}, ${details.bizData.location.state}`
                      }}
                    </span>
                  </div>
                  <div
                    class="flexbox flex-wrap semibold"
                    style="gap: 0.25em 0.75em"
                  >
                    <span
                      v-tooltip.unblocking
                      :data-tooltip="details.bizData.location.address"
                    >
                      <Icon
                        name="material-symbols:recent-patient-outline-rounded"
                      />
                      <span
                        :title="
                          details.bizData.hours[now.getDay()][0] < 0
                            ? 'Did not open today at all.'
                            : `Open today by ${
                                details.bizData.hours[now.getDay()][0]
                              }:00 and closes by ${
                                details.bizData.hours[now.getDay()][1]
                              }:00.`
                        "
                      >
                        <template v-if="isClosed">
                          <span class="error-text">Closed.</span>
                          <span v-if="willOpenToday">
                            Opens
                            {{ details.bizData.hours[now.getDay()][0] }}
                          </span>
                          <span else>
                            Opens
                            {{
                              details.bizData.hours[
                                now.getDay() === 6
                                  ? 0
                                  : now.getDay() + 1
                              ][0] > -1
                                ? `${
                                    details.bizData.hours[
                                      now.getDay() === 6
                                        ? 0
                                        : now.getDay() + 1
                                    ][0]
                                  }:00 Tomorrow`
                                : `${
                                    details.bizData.hours[
                                      nextOpenDay(details.bizData.hours)
                                    ][0]
                                  } on ${whatDay(
                                    nextOpenDay(details.bizData.hours)
                                  )}`
                            }}
                          </span>
                        </template>
                        <template v-else>
                          <span
                            v-if="
                              details.bizData.hours[now.getDay()][1] -
                                now.getHours() <
                              2
                            "
                            class="warning-text"
                            >Closes soon.
                          </span>
                          <span v-else class="success-text">Open. </span>
                          <span>
                            Closes
                            {{
                              `${
                                details.bizData.hours[now.getDay()][1]
                              }:00`
                            }}
                          </span>
                        </template>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
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
          <div class="prod-overview">
            <div class="lined heading">
              <Icon
                name="material-symbols:overview-outline-rounded"
                class="lead"
              />
              Product Overview
            </div>
            <p>{{ details.overview }}</p>
          </div>
        </div>
      </header>
      <div class="prod-details">
        <!-- Purchase Configuration Note -->
        <div v-if="configureMessage" class="sp-wrapper">
          <div
            v-scrollPin="{
              clipTop: 64,
              topSpacing: 4,
              ancestorGuarded: true,
              autoContainMargins: false,
            }"
            class="warning compact handled note 0-margined"
          >
            <Icon name="material-symbols:brand-awareness-outline-rounded" />
            <div class="content">Add item to cart to configure purchase.</div>
            <i
              class="small trailing"
              style="align-self: start"
              @click="() => (configureMessage = false)"
            >
              <Icon name="material-symbols:cancel-rounded" />
            </i>
          </div>
        </div>
        <!-- Specifications Section -->
        <section class="spec">
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
            <Icon
              name="material-symbols:list-alt-outline-rounded"
              class="lead"
            />
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
        </section>
        <!-- Delivery Section -->
        <section class="delivery">
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
            <Icon
              name="material-symbols:local-shipping-outline-rounded"
              class="lead"
            />
            Delivery Information
            <i class="ac-viewbox trailing icon">
              <Icon name="material-symbols:chevron-left-rounded" />
              <Icon name="material-symbols:expand-more-rounded" />
            </i>
          </div>
          <div class="collapsible">
            <div>
              <div class="sub heading">Product is Located at:</div>
              <p class="indented">
                {{
                  `${details.bizData.location.address}, ${details.bizData.location.city}, ${details.bizData.location.state}`
                }}
              </p>
            </div>
            <div>
              <div class="sub heading">Available delivery options</div>
              <div class="compact note">
                <Icon
                  name="material-symbols:delivery-truck-speed-outline-rounded"
                  style="font-size: 1.875em"
                />
                <div class="content">
                  <div class="small bold">BizWorld Delivery Management</div>
                  <div class="faint-text-v1">
                    Bizworld manages how your item is delivered to you.
                    <a href="#">Learn more</a>
                  </div>
                </div>
              </div>
              <div class="compact note">
                <Icon
                  name="material-symbols:package-outline-rounded"
                  style="font-size: 1.875em"
                />
                <div class="content">
                  <div class="small bold">Self Pickup</div>
                  <div class="faint-text-v1">
                    You manage how your item gets to you. With this option, you
                    must pick up your item within 2 weeks of purchase.
                    <a href="#">Learn more</a>
                  </div>
                </div>
              </div>
              <p class="small centered">
                Bizworld offers a curated list of trusted third-party delivery
                service providers.
                <a href="#" target="_blank">
                  Click here to view our recommended providers.
                </a>
              </p>
            </div>
          </div>
        </section>
        <!-- Buyer's Protection Section -->
        <section>
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
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
                <div class="heading">Secure personal details</div>
                <div class="faint-text-v1">
                  Your personal and payment information is kept confidential and
                  secure. We do not share your details with third parties
                  without your explicit consent, ensuring your privacy is always
                  protected.
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Review and Rating Section -->
        <section>
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
            <Icon
              name="material-symbols:reviews-outline-rounded"
              class="lead"
            />
            Ratings and Reviews
            <i class="ac-viewbox trailing icon">
              <Icon name="material-symbols:chevron-left-rounded" />
              <Icon name="material-symbols:expand-more-rounded" />
            </i>
          </div>
          <div class="collapsible">
            <div class="flexbox flex-items-to-basis align-vcenter">
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
                <div>All reviews are from verified purchases.</div>
              </div>
              <div class="centered">
                <p class="small semibold">
                  Patronize {{ details.bizData.bizName }} to write a review
                  <a href="#">Learn more.</a>
                </p>
              </div>
            </div>
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
                  <Icon name="material-symbols:sort-rounded" class="lead" />
                  Sort:
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
        </section>
      </div>
    </div>
    <!-- Call to Action Section -->
    <div class="sp-wrapper fluid z-level-2 p-f">
      <div
        v-scrollPin="{ pinPriority: 'bottom', ancestorGuarded: true }"
        class="prod-footer surface-bg"
      >
        <div class="container flexbox guttered" style="padding: 0.5rem 1rem">
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
                  <button class="exit-dd secondary compact button">
                    Checkout
                  </button>
                  <button class="exit-dd secondary flat compact button">
                    Add and shop more
                  </button>
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

  @media only screen and (max-width: 767px) {
    grid-template-columns: 1fr;
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
