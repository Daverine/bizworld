<script setup>
definePageMeta({ layout: 'details' });
const route = useRoute();
const details = ref({
  type: 'service',
  title:
    'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
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
        'Responsive Design': true,
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
        'Responsive Design': true,
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
const isLargeScreen = ref(false);
const configureMessage = ref(true);
onMounted(() => {
  watchEffect(() => {
    isLargeScreen.value = useMediaQuery('(min-width: 768px)').value;
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
function to12hrsTime(time) {
  time = time.split(':');
  return `${Number(time[0]) % 12 || 12}:${time[1]}${
    Number(time[0]) >= 12 ? 'PM' : 'AM'
  }`;
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
  <main class="grid-layout" style="padding-top: 1rem">
    <div class="page-cont">
      <section
        class="sp-wrapper page-summary"
        v-scrollPin="{
          top: 68,
          bottom: 64,
          breakpoints: [{ maxWidth: 767, pinnable: false }],
        }"
      >
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
          <template v-if="isLargeScreen" #trackers>
            <div v-for="slide in details.media" class="thumbnail cs-tracker">
              <img :src="slide.thumbnail" />
            </div>
          </template>
        </Carousel>
        <!-- Overview Section -->
        <section class="page-overview">
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
            <Icon
              name="material-symbols:overview-outline-rounded"
              class="lead"
            />
            Service Overview
            <i class="ac-viewbox trailing icon">
              <Icon name="material-symbols:chevron-left-rounded" />
              <Icon name="material-symbols:expand-more-rounded" />
            </i>
          </div>
          <div class="collapsible">
            <p>
              We are deeply committed to crafting professional logo designs that
              align with your specific requirements.
            </p>

            <p>Our Pledge:</p>
            <ul>
              <li>
                You will retain complete ownership rights of the final designs.
              </li>
              <li>
                We ensure swift delivery, by your timeline. 1st round in 24-48
                Hours. Followed by daily updates.
              </li>
              <li>
                You can take advantage of unlimited revisions until your desired
                design is achieved.
              </li>
            </ul>

            <p>Our Experience:</p>
            <ul>
              <li>
                As a top-rated freelancer, we maintain a flawless 100% job
                success rate.
              </li>
              <li>
                Our Upwork track record includes over 20,000 working hours
                across 10,000+ projects.
              </li>
              <li>
                With over 17 years of expertise in graphic design, we bring a
                wealth of experience to every project.
              </li>
            </ul>

            <p>
              Your satisfaction is our priority, and we look forward to the
              opportunity to collaborate on your design needs.
            </p>
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
      </section>
      <div
        class="page-details"
        v-scrollPin="{
          top: 68,
          bottom: 64,
          breakpoints: [{ maxWidth: 767, pinnable: false }],
        }"
      >
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
            <div class="fillable-eq menu" v-tab>
              <label
                v-for="(option, index) in details.serviceOptions"
                class="flex-column item"
                :class="{ active: !index }"
                :data-tab="`${option.type}-tier`"
              >
                <input
                  class="big form-item"
                  type="radio"
                  name="tier"
                  :checked="!index ? '' : null"
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
              :id="`${option.type}-tier`"
            >
              <div v-if="option.descHead" class="heading">
                {{ option.descHead }}
              </div>
              <p v-if="option.descCont">{{ option.descCont }}</p>
              <table v-if="option.specifications" class="table">
                <tbody>
                  <tr v-for="(value, key) in option.specifications">
                    <td>{{ key }}</td>
                    <td>{{ value }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="flexbox flex-column guttered">
                <button class="fluid primary button">
                  Continue ({{ option.price }})
                </button>
                <button class="fluid outlined button">
                  <Icon
                    name="material-symbols:chat-outline-rounded"
                    class="lead"
                  />
                  Chat Contractor
                </button>
              </div>
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
      </div>
    </div>
    <!-- Call to Action Section -->
    <div class="sp-wrapper fluid z-level-2 p-f">
      <div
        v-scrollPin="{ pinPriority: 'bottom', independent: true }"
        class="page-footer surface-bg"
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

<style lang="scss" scoped>
.page-cont {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 1fr;
  align-items: start;

  .carousel {
    --thumbnail-size: 4.5rem;
  }
  .page-summary {
    padding-bottom: 0.5rem;

    & > div {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
  .page-details {
    padding-bottom: 18vh;

    & > section {
      margin: 0em 0em 1rem;
    }
  }

  .block.heading.pinned {
    color: var(--primary);
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
