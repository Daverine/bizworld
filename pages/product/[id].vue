<script setup>
definePageMeta({ layout: 'details' });
const details = ref({
  type: 'product',
  title:
    'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
  price: 'N100,000',
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
  overview:
    'This product is suitable for office use and it also presentable. It has a long lasting battery and its capable of handling comming computer daily tasks.',
  specification: {
    Type: 'Laptop',
    Condition: 'Used',
    Brand: 'Dell',
    Model: 'Inspiron 5050',
    Processor: 'Intel Corel i5 5th Generation',
    RAM: '8gb DDR3',
    Storage: '256gb SSD M.2',
    'Display Size': '15.6"',
    Graphics: 'Intel Graphics 3000 (64mb)',
  },
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
  },
});

const isSmallScreen = ref(true);
const configureMessage = ref(true);
onMounted(() =>
  watchEffect(() => {
    isSmallScreen.value = useMediaQuery('(max-width: 959px)').value;
  })
);
</script>
<template>
  <Title>{{ `${details.title} | Bizworld` }}</Title>
  <main class="grid-layout" style="padding-top: 1rem">
    <div class="page-cont">
      <section
        class="page-summary"
        v-scrollPin="{
          top: 68,
          bottom: 64,
          breakpoints: [{ maxWidth: 959, pinnable: false }],
        }"
      >
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
          <template v-if="!isSmallScreen" #trackers>
            <div v-for="slide in details.media" class="thumbnail cs-tracker">
              <img :src="slide.thumbnail" />
            </div>
          </template>
        </Carousel>
        <h5 class="semibold 0-margined page-title">{{ details.title }}</h5>
        <div class="flexbox flex-separate guttered small semibold">
          <span
            v-tooltip.unblocking
            data-tooltip="Average Rate (Number of raters)"
          >
            <Icon name="material-symbols:star-rounded" class="yellow-text" />
            {{
              (
                details.reviews.reduce((n, i) => n + i.rating, 0) /
                details.reviews.length
              ).toFixed(1)
            }}
            ({{ details.reviews.length }} reviews)
          </span>
          <span
            v-tooltip.unblocking
            :data-tooltip="details.bizData.location.address"
          >
            <Icon name="material-symbols:location-on-outline-rounded" />
            {{ details.bizData.location.city }},
            {{ details.bizData.location.state }}
          </span>
        </div>
        <div class="h3 0-margined primary-text bold">
          {{ details.price }}
        </div>
        <p>{{ details.overview }}</p>
        <!-- Purchase Configuration Note -->
        <div
          v-if="configureMessage"
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
      </section>
      <div class="page-details sp-wrapper">
        <!-- Specification Section -->
        <section class="spec">
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
            <Icon
              name="material-symbols:list-alt-outline-rounded"
              class="lead"
            />
            Specification
            <i class="ac-viewbox trailing icon">
              <Icon name="material-symbols:chevron-left-rounded" />
              <Icon name="material-symbols:expand-more-rounded" />
            </i>
          </div>
          <div class="collapsible">
            <table class="basic definition table">
              <tbody>
                <tr v-for="(value, key) in details.specification">
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
                {{ details.bizData.location.address }},
                {{ details.bizData.location.city }},
                {{ details.bizData.location.state }}
              </p>
            </div>
            <div>
              <div class="sub heading">Available delivery options</div>
              <!-- Bizworld delivery option -->
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
              <!-- Self pickup option -->
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
        <!-- Seller's Details Section -->
        <section>
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
            <Icon name="material-symbols:store-outline-rounded" class="lead" />
            Seller's Information
            <i class="ac-viewbox trailing icon">
              <Icon name="material-symbols:chevron-left-rounded" />
              <Icon name="material-symbols:expand-more-rounded" />
            </i>
          </div>
          <div class="collapsible">
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
                <div
                  class="bold h6 truncate uppercased"
                  style="--line-clamp: 2"
                >
                  {{ details.bizData.bizName }}
                </div>
                <div
                  class="flexbox flex-separate flex-wrap semibold"
                  style="gap: 0.25em 0.75em"
                >
                  <span>
                    {{ details.bizData.mainCategory }}
                  </span>
                  <span
                    v-if="details.bizData.rating"
                    class="semibold"
                    v-tooltip.unblocking
                    data-tooltip="Average Rate (Number of raters)"
                  >
                    <Icon
                      name="material-symbols:star-rounded"
                      class="yellow-text"
                    />
                    {{ details.bizData.rating.rate }} ({{
                      details.bizData.rating.raters
                    }})
                  </span>
                </div>
              </div>
            </div>
            <div
              class="flexbox flex-items-to-basis guttered"
              style="margin-top: 0.5em"
            >
              <button class="secondary compact button">
                <Icon
                  name="material-symbols:add-to-queue-outline-rounded"
                  class="lead"
                />
                Follow
              </button>
              <button class="compact button">Visit Store</button>
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
                <div>{{ details.reviews.length }} review(s)</div>
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
    <div
      v-scrollPin="{ pinPriority: 'bottom' }"
      class="page-footer surface-bg fluid z-level-2 p-f"
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .page-details {
    padding-bottom: 18vh;

    & > section {
      margin: 0em 0em 1rem;
    }
  }

  @media only screen and (max-width: 959px) {
    grid-template-columns: 1fr;
    gap: 1rem;

    .carousel {
      padding-bottom: 0px;
    }
  }
}
</style>
