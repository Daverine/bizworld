<script setup>
definePageMeta({ layout: 'details' });

const details = ref({
  type: 'service',
  id: 'serv134344',
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
  price: 6000,
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
      description: '',
      duration: 2, // in days
      price: 5000,
      specifications: {
        'Number of Revisions': '2',
        'Number of Pages': '1',
        'Number of Plugins/Extensions Installed': '1',
      },
    },
    {
      type: 'standard',
      description: '',
      duration: 2, // in days
      price: 8000,
      specifications: {
        'Number of Revisions': '5',
        'Number of Pages': '3',
        'Number of Plugins/Extensions Installed': '1',
        'Responsive Design': false,
      },
    },
    {
      type: 'premium',
      description: '',
      duration: 2, // in days
      price: 12000,
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
    rating: {
      rate: 3.5,
      raters: 30,
    },
    location: {
      address: '3 Nepal road, beside Igbagboyemi Pharmacy, Isabo 111102',
      city: 'Abeokuta',
      state: 'Ogun State',
      url: 'https://goo.gl/maps/y9ExQLSq37FL6EHm6',
    },
    hours: [
      false,
      ['8:30', '18:30'],
      ['8:30', '18:30'],
      ['15:30', '18:30'],
      ['8:30', '18:30'],
      false,
      ['8:30', '18:30'],
    ],
  },
});
const avail = useAvailability(details.value.bizData.hours);
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
  spec: undefined,
  quantity: 0,
  delivery: 0,
});
const isSmallScreen = ref(true);
onMounted(() => {
  // Set default service option
  if (details.value.serviceOptions) {
    choice.value.spec = details.value.serviceOptions[0].type;
  }
  watchEffect(() => {
    isSmallScreen.value = useMediaQuery('(min-width: 863px)').value;
  });
});
</script>
<template>
  <Title>{{ `${details.title} | Bizworld` }}</Title>
  <main class="grid-layout" style="padding-top: 1rem">
    <div class="page-cont">
      <section class="page-sec1">
        <div class="flexbox guttered align-start">
          <h4 class="semibold 0-margined page-title">{{ details.title }}</h4>
          <button
            class="outlined icon button"
            v-tooltip.unblocking
            data-tooltip="Add to favourite"
          >
            <Icon name="material-symbols:bookmark-outline-rounded" />
          </button>
        </div>
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
                    !avail.openTime
                      ? 'Did not open today at all.'
                      : `Open today by ${avail.openTime[0]}:${avail.openTime[1]} and closes by ${avail.closeTime[0]}:${avail.closeTime[1]}.`
                  "
                >
                  <Icon
                    name="material-symbols:recent-patient-outline-rounded"
                  />
                  <template v-if="avail.isClosed">
                    <span class="error-text">Closed.</span>
                    Opens
                    {{
                      avail.willOpenToday
                        ? `${avail.openTime[0]}:${avail.openTime[1]}`
                        : details.bizData.hours[
                            avail.now.getDay() === 6
                              ? 0
                              : avail.now.getDay() + 1
                          ][0] !== -1
                        ? `${
                            details.bizData.hours[
                              avail.now.getDay() === 6
                                ? 0
                                : avail.now.getDay() + 1
                            ][0]
                          } Tomorrow`
                        : `${
                            details.bizData.hours[avail.nextOpenDay][0]
                          } on ${avail.whatDay(avail.nextOpenDay)}`
                    }}
                  </template>
                  <template v-else>
                    <span v-if="avail.closesSoon" class="warning-text">
                      Closes soon.
                    </span>
                    <span v-else class="success-text">Open.</span>
                    Closes
                    {{ `${avail.closeTime[0]}:${avail.closeTime[1]}` }}
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
          <div class="fillable-eq menu">
            <label
              v-for="(option, index) in details.serviceOptions"
              class="flex-column item"
              :class="{ active: option.type === choice.spec }"
            >
              <input
                class="big form-item"
                type="radio"
                :value="option.type"
                v-model="choice.spec"
              />
              <div>
                <span class="capitalized">{{ option.type }}</span>
                <br />
                <span class="bold">₦{{ option.price.toLocaleString() }}</span>
              </div>
            </label>
          </div>
          <div
            v-for="option in details.serviceOptions"
            class="tab-page"
            :class="{ active: option.type === choice.spec }"
          >
            <p v-if="option.description">{{ option.description }}</p>
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
          <div class="compact success note" style="margin-top: 1rem">
            <Icon
              name="material-symbols:verified-user-outline-rounded"
              style="font-size: 1.875em"
            />
            <div class="content">
              <div class="heading">Secure personal details</div>
              <div class="faint-text">
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
          <div class="table-scroll">
            <table class="table striped">
              <thead>
                <tr>
                  <th>Packages</th>
                  <th v-for="option in details.serviceOptions" class="centered">
                    <span class="capitalized">{{ option.type }}</span>
                    <br />
                    <span class="bold"
                      >₦{{ option.price.toLocaleString() }}</span
                    >
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
                    <template v-else>{{
                      option.specifications[offer]
                    }}</template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
            <div class="flexbox flexible-items align-center">
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
                class="flexbox flex-separate guttered align-center"
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
                  <header class="flexbox flex-separate align-center guttered">
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
                    <span class="faint-text small semibold">12-01-2034</span>
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
          <div class="fillable-eq menu">
            <label
              v-for="(option, index) in details.serviceOptions"
              class="flex-column item"
              :class="{ active: option.type === choice.spec }"
            >
              <input
                class="big form-item"
                type="radio"
                :value="option.type"
                v-model="choice.spec"
              />
              <div>
                <span class="capitalized">{{ option.type }}</span>
                <br />
                <span class="bold">₦{{ option.price.toLocaleString() }}</span>
              </div>
            </label>
          </div>
        </template>
        <div v-else class="heading 0-t-margined">Service Specification</div>
        <div
          v-for="option in details.serviceOptions"
          class="tab-page"
          :class="{ active: option.type === choice.spec }"
        >
          <p v-if="option.description">{{ option.description }}</p>
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
            Continue (₦{{
              details.serviceOptions
                .filter((el) => el.type === choice.spec)[0]
                ?.price.toLocaleString()
            }})
            <Icon
              name="material-symbols:chevron-right-rounded"
              class="trailing"
            />
          </button>
          <div class="flexbox guttered">
            <button class="fluid outlined button">
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
                    name="material-symbols:chat-outline-rounded"
                    class="lead"
                  />
                  Chat contractor
                </div>
                <div class="item">
                  <Icon
                    name="material-symbols:bookmark-add-outline-rounded"
                    class="lead"
                  />
                  Add to favourite
                </div>
                <div class="item">
                  <Icon name="material-symbols:share-outline" class="lead" />
                  Share
                </div>
                <div class="item">
                  <Icon
                    name="material-symbols:category-search-outline-rounded"
                    class="lead"
                  />
                  View related
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
        <!-- Buyer's Protection Section -->
        <div class="compact success note" style="margin-top: 1rem">
          <Icon
            name="material-symbols:verified-user-outline-rounded"
            style="font-size: 1.875em"
          />
          <div class="content">
            <div class="heading">Secure personal details</div>
            <div class="faint-text">
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
      <div class="container flexbox guttered" style="padding: 0.5rem 0rem">
        <button class="flexible primary button">
          Continue (₦{{
            details.serviceOptions
              .filter((el) => el.type === choice.spec)[0]
              ?.price.toLocaleString()
          }})
          <Icon
            name="material-symbols:chevron-right-rounded"
            class="trailing"
          />
        </button>
        <button class="flexible outlined button md-and-down-hidden">
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
              <Icon name="material-symbols:chat-outline-rounded" class="lead" />
              Chat contractor
            </div>
            <div class="item">
              <Icon
                name="material-symbols:bookmark-add-outline-rounded"
                class="lead"
              />
              Add to favourite
            </div>
            <div class="item">
              <Icon name="material-symbols:share-outline" class="lead" />
              Share
            </div>
            <div class="item">
              <Icon
                name="material-symbols:category-search-outline-rounded"
                class="lead"
              />
              View related
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
  .page-sec1 {
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
