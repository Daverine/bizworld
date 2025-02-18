<script setup>
definePageMeta({ layout: 'details' });
const route = useRoute();
const details = ref({
  type: 'service',
  title:
    'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
  desc: `
    <p>We are deeply committed to crafting professional logo designs that align with your specific requirements.</p>
    <p>Our Pledge:</p>
    <ul>
      <li>You will retain complete ownership rights of the final designs.</li>
      <li>We ensure swift delivery, by your timeline. 1st round in 24-48 Hours. Followed by daily updates.</li>
      <li>You can take advantage of unlimited revisions until your desired design is achieved.</li>
    </ul>
    <p>Our Experience:</p>
    <ul>
      <li>As a top-rated freelancer, we maintain a flawless 100% job success rate.</li>
      <li>Our Upwork track record includes over 20,000 working hours across 10,000+ projects.</li>
      <li>With over 17 years of expertise in graphic design, we bring a wealth of experience to every project.</li>
    </ul>
    <p>Your satisfaction is our priority, and we look forward to the opportunity to collaborate on your design needs.</p>
  `,
  media: [
    {
      type: 'pic',
      url: '/images/product.jpeg',
      thumbnail: '/images/product.jpeg',
    },
    {
      type: 'pic',
      url: '/images/product.jpeg',
      thumbnail: '/images/product.jpeg',
    },
    {
      type: 'pic',
      url: '/images/product.jpeg',
      thumbnail: '/images/product.jpeg',
    },
  ],
  serviceOptions: [
    {
      type: 'basic',
      descHead: '',
      descCont: '',
      duration: 2, // in days
      price: 'N5,000',
      specifications: {
        'Number of Revisions': '2',
        'Number of Pages': '1',
        'Number of Plugins/Extensions Installed': '1',
      },
    },
    {
      type: 'standard',
      descHead: '',
      descCont: '',
      duration: 2, // in days
      price: 'N8,000',
      specifications: {
        'Number of Revisions': '5',
        'Number of Pages': '3',
        'Number of Plugins/Extensions Installed': '1',
        'Responsive Design': false,
      },
    },
    {
      type: 'premium',
      descHead: '',
      descCont: '',
      duration: 2, // in days
      price: 'N12,000',
      specifications: {
        'Number of Revisions': '10',
        'Number of Pages': '5',
        'Number of Plugins/Extensions Installed': '1',
        'Responsive Design': true,
      },
    },
  ],
  reviews: [
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 3,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 3,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
  ],
  bizData: {
    logo: '/images/logo-sq.png',
    bizName: 'Emmadave Computer Technology Services',
    bizUrl: 'https://www.edtech.com',
    mainCategory: 'Computer repair services',
    contacts: {
      tel: '08157483233',
      email: 'contact_us@edtech.com',
    },
    verified: true,
    location: {
      address: '3 Nepal road, beside Igbagboyemi Pharmacy, Isabo 111102',
      city: 'Abeokuta',
      state: 'Ogun State',
      url: 'https://goo.gl/maps/y9ExQLSq37FL6EHm6',
    },
    hours: [
      [-1],
      ['8:30', '18:30'],
      ['8:30', '18:30'],
      ['15:30', '18:30'],
      ['8:30', '18:30'],
      [-1],
      ['8:30', '18:30'],
    ],
  },
});
const now = useNow({ interval: 10000 });
const openTime = computed(() =>
  details.value.bizData.hours[now.value.getDay()][0] === -1
    ? false
    : details.value.bizData.hours[now.value.getDay()][0]
        .split(':')
        .map((el) => Number(el))
);
const closeTime = computed(() =>
  openTime.value === false
    ? false
    : details.value.bizData.hours[now.value.getDay()][1]
        .split(':')
        .map((el) => Number(el))
);
const isClosed = computed(
  () =>
    !openTime.value ||
    openTime.value[0] > now.value.getHours() ||
    (openTime.value[0] === now.value.getHours() &&
      openTime.value[1] > now.value.getMinutes()) ||
    closeTime.value[0] < now.value.getHours() ||
    (closeTime.value[0] === now.value.getHours() &&
      closeTime.value[1] < now.value.getMinutes())
);
const willOpenToday = computed(
  () =>
    openTime.value !== false &&
    (openTime.value[0] > now.value.getHours() ||
      (openTime.value[0] === now.value.getHours &&
        openTime.value[1] > now.value.getMinutes()))
);
const closesSoon = computed(
  () =>
    !isClosed.value &&
    closeTime.value[0] * 60 +
      closeTime.value[1] -
      (now.value.getHours() * 60 + now.value.getMinutes()) <
      90
);
const servicesOffer = computed(() => [
  ...new Set(
    details.value.serviceOptions.reduce(
      (keys, obj) => keys.concat(Object.keys(obj.specifications)),
      []
    )
  ),
]);
const choice = ref({
  id: details.value.id,
  spec: details.value.serviceOptions[0].type,
  quant: 0,
  delivery: 0,
});
const isSmallScreen = ref(true);
onMounted(() => {
  watchEffect(() => {
    isSmallScreen.value = useMediaQuery('(min-width: 863px)').value;
  });
});

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
function whatDay(index) {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][index];
}
</script>
<template>
  <Title>{{ `${details.title} | Bizworld` }}</Title>
  <main class="grid-layout" style="padding-top: 1rem">
    <div class="page-cont">
      <section class="page-details">
        <h4 class="semibold 0-margined page-title">{{ details.title }}</h4>
        <!-- Seller's Details Section -->
        <section>
          <div class="a-block">
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
              <div class="bold truncate 0-margined">
                {{ details.bizData.bizName }}
              </div>
              <div
                class="flexbox flex-wrap small semibold"
                style="gap: 0.25em 0.75em"
              >
                <span
                  v-tooltip.unblocking
                  :data-tooltip="
                    openTime[0] < 0
                      ? 'Did not open today at all.'
                      : `Open today by ${openTime[0]}:${openTime[1]} and closes by ${closeTime[0]}:${closeTime[1]}.`
                  "
                >
                  <Icon
                    name="material-symbols:recent-patient-outline-rounded"
                  />
                  <template v-if="isClosed">
                    <span class="error-text">Closed.</span>
                    Opens
                    {{
                      willOpenToday
                        ? `${openTime[0]}:${openTime[1]}`
                        : details.bizData.hours[
                            now.getDay() === 6 ? 0 : now.getDay() + 1
                          ][0] !== -1
                        ? `${
                            details.bizData.hours[
                              now.getDay() === 6 ? 0 : now.getDay() + 1
                            ][0]
                          } Tomorrow`
                        : `${
                            details.bizData.hours[
                              nextOpenDay(details.bizData.hours)
                            ][0]
                          } on ${whatDay(nextOpenDay(details.bizData.hours))}`
                    }}
                  </template>
                  <template v-else>
                    <span v-if="closesSoon" class="warning-text">
                      Closes soon.
                    </span>
                    <span v-else class="success-text">Open.</span>
                    Closes
                    {{ `${closeTime[0]}:${closeTime[1]}` }}
                  </template>
                </span>
              </div>
              <div
                class="flexbox flex-wrap small semibold"
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
                  <Icon name="material-symbols:location-on-outline-rounded" />
                  {{
                    `${details.bizData.location.city}, ${details.bizData.location.state}`
                  }}
                </span>
              </div>
            </div>
          </div>
        </section>
        <!-- Media Section -->
        <Carousel>
          <div v-for="slide in details.media" class="cs-slide">
            <img
              v-if="slide.type === 'pic'"
              :src="slide.url"
              :data-lightbox="slide.url"
              data-target="lightbox1"
              class="image"
            />
          </div>
          <template v-if="isSmallScreen" #trackers>
            <div v-for="slide in details.media" class="thumbnail cs-tracker">
              <img :src="slide.thumbnail" />
            </div>
          </template>
        </Carousel>
        <!-- Configurations Section -->
        <section
          class="specs mobile-screen-only"
          style="
            border: 1px solid var(--outline);
            border-radius: var(--comp-radius);
            padding: 1rem;
          "
        >
          <div class="bold" style="margin-bottom: 1rem">Service option</div>
          <div class="fillable-eq menu" v-tab>
            <label
              v-for="(option, index) in details.serviceOptions"
              class="flex-column item"
              :class="{ active: option.type === choice.spec }"
              :data-tab="`${option.type}-tier`"
            >
              <input
                class="big form-item"
                type="radio"
                :value="option.type"
                v-model="choice.spec"
              />
              <div>
                {{
                  `${option.type.charAt(0).toUpperCase()}${option.type.slice(
                    1
                  )}`
                }}
                <br />
                <span class="bold">{{ option.price }}</span>
              </div>
            </label>
          </div>
          <div
            v-for="option in details.serviceOptions"
            class="tab-page"
            :data-tab="`${option.type}-tier`"
          >
            <div v-if="option.descHead" class="heading">
              {{ option.descHead }}
            </div>
            <p v-if="option.descCont">{{ option.descCont }}</p>
            <table v-if="option.specifications" class="clear table">
              <tbody>
                <tr v-for="(value, key) in option.specifications">
                  <td>{{ key }}</td>
                  <td class="r-aligned">
                    <Icon
                      v-if="value === true"
                      name="material-symbols:check-rounded"
                    />
                    <Icon
                      v-else-if="value === false"
                      name="material-symbols:close-rounded"
                    />
                    <template v-else>{{ value }}</template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Buyer's Protection Section -->
          <div class="compact success note">
            <Icon
              name="material-symbols:verified-user-outline-rounded"
              style="font-size: 1.875em"
            />
            <div class="content">
              <div class="heading">Secure personal details</div>
              <div class="faint-text-v1">
                Your personal and payment information is kept confidential and
                secure. We do not share your details with third parties without
                your explicit consent, ensuring your privacy is always
                protected.
              </div>
            </div>
          </div>
        </section>
        <!-- Service Details Section -->
        <section class="page-overview">
          <h5>Service Details</h5>
          <div v-html="details.desc"></div>
          <div class="sub heading">Our Package(s)</div>
          <table class="table striped">
            <thead>
              <tr>
                <th>Packages</th>
                <th v-for="option in details.serviceOptions" class="centered">
                  {{
                    `${option.type.charAt(0).toUpperCase()}${option.type.slice(
                      1
                    )}`
                  }}
                  <br />
                  <span class="bold">{{ option.price }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="offer in servicesOffer">
                <td>{{ offer }}</td>
                <td v-for="option in details.serviceOptions" class="centered">
                  <Icon
                    v-if="option.specifications[offer] === true"
                    name="material-symbols:check-rounded"
                  />
                  <Icon
                    v-else-if="option.specifications[offer] === false"
                    name="material-symbols:close-rounded"
                  />
                  <Icon
                    v-else-if="option.specifications[offer] === undefined"
                    name="material-symbols:check-indeterminate-small-rounded"
                  />
                  <template v-else>{{ option.specifications[offer] }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section class="mobile-screen-only"></section>
        <!-- Review and Rating Section -->
        <section>
          <div v-collapser class="ac-viewbox-ref active heading a-block">
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
      </section>
      <!-- Configurations Section -->
      <section
        class="desktop-screen-only specs"
        v-scrollPin="{
          top: 80,
          bottom: 64,
          breakpoints: [{ maxWidth: 863, pinnable: false }],
        }"
      >
        <template v-if="details.serviceOptions.length > 1">
          <div class="heading 0-t-margined">Service Options</div>
          <div class="fillable-eq menu" v-tab>
            <label
              v-for="(option, index) in details.serviceOptions"
              class="flex-column item"
              :class="{ active: option.type === choice.spec }"
              :data-tab="`${option.type}-tier`"
            >
              <input
                class="big form-item"
                type="radio"
                :value="option.type"
                v-model="choice.spec"
              />
              <div>
                {{
                  `${option.type.charAt(0).toUpperCase()}${option.type.slice(
                    1
                  )}`
                }}
                <br />
                <span class="bold">{{ option.price }}</span>
              </div>
            </label>
          </div>
        </template>
        <div v-else class="heading 0-t-margined">Service Specification</div>
        <div
          v-for="option in details.serviceOptions"
          class="tab-page"
          :data-tab="`${option.type}-tier`"
        >
          <div v-if="option.descHead" class="heading">
            {{ option.descHead }}
          </div>
          <p v-if="option.descCont">{{ option.descCont }}</p>
          <table v-if="option.specifications" class="clear table">
            <tbody>
              <tr v-for="(value, key) in option.specifications">
                <td>{{ key }}</td>
                <td class="r-aligned">
                  <Icon
                    v-if="value === true"
                    name="material-symbols:check-rounded"
                  />
                  <Icon
                    v-else-if="value === false"
                    name="material-symbols:close-rounded"
                  />
                  <template v-else>{{ value }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Call to Action Section -->
        <div class="flexbox flex-column guttered">
          <button class="fluid primary button">
            Continue ({{
              details.serviceOptions.filter((el) => el.type === choice.spec)[0]
                .price
            }})
            <Icon
              name="material-symbols:chevron-right-rounded"
              class="trailing"
            />
          </button>
          <button class="fluid outlined button">
            <Icon name="material-symbols:chat-outline-rounded" class="lead" />
            Chat Contractor
          </button>
        </div>
        <!-- Buyer's Protection Section -->
        <div class="compact success note 0-b-margined">
          <Icon
            name="material-symbols:verified-user-outline-rounded"
            style="font-size: 1.875em"
          />
          <div class="content">
            <div class="heading">Secure personal details</div>
            <div class="faint-text-v1">
              Your personal and payment information is kept confidential and
              secure. We do not share your details with third parties without
              your explicit consent, ensuring your privacy is always protected.
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Call to Action Section -->
    <div
      v-scrollPin="{ pinPriority: 'bottom' }"
      class="mobile-screen-only surface-bg fluid z-level-2 p-f"
    >
      <div class="container flexbox guttered" style="padding: 0.5rem 1rem">
        <button class="flexible primary button">
          Continue ({{
            details.serviceOptions.filter((el) => el.type === choice.spec)[0]
              .price
          }})
          <Icon
            name="material-symbols:chevron-right-rounded"
            class="trailing"
          />
        </button>
        <button class="flexible outlined button">
          <Icon name="material-symbols:chat-outline-rounded" class="lead" />
          Chat Contractor
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
  </main>
</template>

<style lang="scss" scoped>
.page-cont {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 24rem;
  align-items: start;

  .carousel {
    --thumbnail-size: 4.5rem;
  }
  .page-details {
    padding-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.specs {
  border: 1px solid var(--outline);
  border-radius: var(--comp-radius);
  padding: 1rem;
}

@media only screen and (min-width: 864px) {
  .mobile-screen-only {
    display: none !important;
  }
}
@media only screen and (max-width: 863px) {
  .page-cont {
    grid-template-columns: 1fr;
    gap: 1rem;

    .carousel {
      padding-bottom: 0px;
    }
  }
  .desktop-screen-only {
    display: none !important;
  }
}
</style>
