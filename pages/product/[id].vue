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
  productOptions: {
    optionType: 'RAM/ROM',
    options: [
      {
        label: '4GB / 64GB',
        media: undefined,
        price: 'N100,000',
        subOptions: {
          optionType: 'Color',
          options: [
            {
              label: 'Yellow',
              price: 'N100,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Reflective Blue',
              price: 'N100,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Silver',
              price: 'N100,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
          ],
        },
      },
      {
        label: '4GB / 128GB',
        media: undefined,
        price: 'N120,000',
        subOptions: {
          optionType: 'Color',
          options: [
            {
              label: 'Black',
              price: 'N120,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Reflective Blue',
              price: 'N120,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Moon Gray',
              price: 'N120,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
          ],
        },
      },
      {
        label: '6GB / 128GB',
        media: undefined,
        price: 'N150,000',
        subOptions: {
          optionType: 'Color',
          options: [
            {
              label: 'Black',
              price: 'N150,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Reflective Blue',
              price: 'N150,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Moon Gray',
              price: 'N150,000',
              media: {
                pic: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
          ],
        },
      },
    ],
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
const tmp = ref({
  id: details.value.id,
  spec: [],
  price: computed(() => {
    if (tmp.value.spec[0]) {
      if (tmp.value.spec[1]) {
        return details.value.productOptions.options
          .find((option) => option.label === tmp.value.spec[0])
          .subOptions.options.find(
            (subOption) => subOption.label === tmp.value.spec[1]
          ).price;
      }
      return details.value.productOptions.options.find(
        (option) => option.label === tmp.value.spec[0]
      ).price;
    }
    return details.value.price;
  }),
  quantity: 1,
  delivery: 'bizworld',
});
const isSmallScreen = ref(true);
onMounted(() => {
  // Configure product default option
  if (details.value.productOptions) {
    tmp.value.spec.push(details.value.productOptions.options[0].label);
    if (details.value.productOptions.options[0].subOptions) {
      tmp.value.spec.push(
        details.value.productOptions.options[0].subOptions.options[0].label
      );
      // Configure sub-option based on option
      watchEffect(() => {
        let option = details.value.productOptions.options.find(
          (option) => option.label === tmp.value.spec[0]
        );
        tmp.value.spec[1] =
          option.subOptions.options.find(
            (subOption) => subOption.label === tmp.value.spec[1]
          )?.label || option.subOptions.options[0].label;
      });
    }
  }
  // watch for screen size change
  watchEffect(() => {
    isSmallScreen.value = useMediaQuery('(max-width: 959px)').value;
  });
});
</script>
<template>
  <Title>{{ `${details.title} | Bizworld` }}</Title>
  <main class="grid-layout" style="padding-top: 1rem">
    <div class="page-cont">
      <section
        class="page-sec1"
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
        <!-- Product Options -->
        <section class="mobile-screen-only config">
          <div class="h3 0-margined primary-text bold">
            {{ tmp.price }}
          </div>
          <div class="alt-ribbon red label">Configure purchase</div>
          <template v-if="details.productOptions">
            <div>
              <div class="sub lined heading a-block">
                {{ details.productOptions.optionType }}:
                <div class="trailing">{{ tmp.spec[0] }}</div>
              </div>
              <div class="wrappable menu">
                <label
                  v-for="(option, a) in details.productOptions.options"
                  class="item as-icon"
                  :class="{ active: option.label === tmp.spec[0] }"
                >
                  <input
                    type="radio"
                    class="form-item"
                    :value="option.label"
                    v-model="tmp.spec[0]"
                  />
                  <img
                    v-if="option.media"
                    :src="option.media.thumbnail"
                    class="thumbnail"
                  />
                  {{ option.label }}
                </label>
              </div>
            </div>
            <template v-for="(option, a) in details.productOptions.options">
              <div
                v-if="option.subOptions"
                class="tab-page"
                :class="{ active: option.label === tmp.spec[0] }"
              >
                <div class="sub lined heading a-block">
                  {{ option.subOptions.optionType }}:
                  <div class="trailing">{{ tmp.spec[1] }}</div>
                </div>
                <div class="wrappable menu">
                  <label
                    v-for="(subOption, b) in option.subOptions.options"
                    class="item as-icon"
                    :class="{ active: subOption.label === tmp.spec[1] }"
                  >
                    <input
                      type="radio"
                      class="form-item"
                      :value="subOption.label"
                      v-model="tmp.spec[1]"
                    />
                    <img
                      v-if="subOption.media"
                      :src="subOption.media.thumbnail"
                      class="thumbnail"
                    />
                    {{ subOption.label }}
                  </label>
                </div>
              </div>
            </template>
          </template>
          <div>
            <div class="sub lined heading a-block">
              Quantity:
              <div class="trailing">{{ tmp.quantity }}</div>
            </div>
            <input
              type="number"
              placeholder="Enter product Quantity"
              class="form-item compact"
              min="1"
              v-model="tmp.quantity"
            />
          </div>
          <div>
            <div class="sub lined heading a-block">
              Delivery service:
              <div class="trailing">
                {{
                  `${tmp.delivery.charAt(0).toUpperCase()}${tmp.delivery.slice(
                    1
                  )}`
                }}
              </div>
            </div>
            <div class="vertical menu">
              <!-- Bizworld delivery option -->
              <label
                class="item as-icon"
                :class="{ active: tmp.delivery === 'bizworld' }"
              >
                <div class="flexbox flex-column sm-guttered align-center">
                  <input
                    type="radio"
                    value="bizworld"
                    v-model="tmp.delivery"
                    class="form-item"
                  />
                  <Icon
                    name="material-symbols:delivery-truck-speed-outline-rounded"
                    style="font-size: 1.5em"
                  />
                </div>
                <div class="content" style="font-weight: normal">
                  <div class="flexbox guttered flex-separate">
                    <div class="small bold">BizWorld Delivery Management</div>
                    <a href="#">Details</a>
                  </div>
                  <div class="flexbox guttered flex-separate">
                    <div>Delivery fee:</div>
                    <div>N900</div>
                  </div>
                  <div class="flexbox guttered flex-separate">
                    <div>Delivery time:</div>
                    <div>2-3 days</div>
                  </div>
                </div>
              </label>
              <!-- Self pickup option -->
              <label
                class="item as-icon"
                :class="{ active: tmp.delivery === 'self-pickup' }"
              >
                <div class="flexbox flex-column sm-guttered align-center">
                  <input
                    type="radio"
                    value="self-pickup"
                    v-model="tmp.delivery"
                    class="form-item"
                  />
                  <Icon
                    name="material-symbols:package-outline-rounded"
                    style="font-size: 1.5em"
                  />
                </div>
                <div class="content" style="font-weight: normal">
                  <div class="flexbox guttered flex-separate">
                    <div class="small bold">Self Pickup</div>
                    <a href="#">Details</a>
                  </div>
                  <div class="faint-text-v1">
                    Manage how your item gets to you. Pick up your item within 2
                    weeks of purchase.
                  </div>
                </div>
              </label>
            </div>
          </div>
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
        <!-- Overview Section -->
        <section>
          <div class="heading">Seller's review</div>
          <p>{{ details.overview }}</p>
        </section>
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
                    <a href="#">Details</a>
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
                    <a href="#">Details</a>
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
            <div class="flexbox flex-items-to-basis align-center">
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

      <!-- Product Options -->
      <section
        class="desktop-screen-only config sp-wrapper"
        v-scrollPin="{
          top: 80,
          bottom: 64,
          breakpoints: [{ maxWidth: 863, pinnable: false }],
        }"
      >
        <div class="h3 0-margined primary-text bold">
          {{ tmp.price }}
        </div>
        <div class="alt-ribbon red label">Configure purchase</div>
        <template v-if="details.productOptions">
          <div>
            <div class="sub lined heading a-block">
              {{ details.productOptions.optionType }}:
              <div class="trailing">{{ tmp.spec[0] }}</div>
            </div>
            <div class="wrappable menu">
              <label
                v-for="(option, a) in details.productOptions.options"
                class="item as-icon"
                :class="{ active: option.label === tmp.spec[0] }"
              >
                <input
                  type="radio"
                  class="form-item"
                  :value="option.label"
                  v-model="tmp.spec[0]"
                />
                <img
                  v-if="option.media"
                  :src="option.media.thumbnail"
                  class="thumbnail"
                />
                {{ option.label }}
              </label>
            </div>
          </div>
          <template v-for="(option, a) in details.productOptions.options">
            <div
              v-if="option.subOptions"
              class="tab-page"
              :class="{ active: option.label === tmp.spec[0] }"
            >
              <div class="sub lined heading a-block">
                {{ option.subOptions.optionType }}:
                <div class="trailing">{{ tmp.spec[1] }}</div>
              </div>
              <div class="wrappable menu">
                <label
                  v-for="(subOption, b) in option.subOptions.options"
                  class="item as-icon"
                  :class="{ active: subOption.label === tmp.spec[1] }"
                >
                  <input
                    type="radio"
                    class="form-item"
                    :value="subOption.label"
                    v-model="tmp.spec[1]"
                  />
                  <img
                    v-if="subOption.media"
                    :src="subOption.media.thumbnail"
                    class="thumbnail"
                  />
                  {{ subOption.label }}
                </label>
              </div>
            </div>
          </template>
        </template>
        <div>
          <div class="sub lined heading a-block">
            Quantity:
            <div class="trailing">{{ tmp.quantity }}</div>
          </div>
          <input
            type="number"
            placeholder="Enter product Quantity"
            class="form-item compact"
            min="1"
            v-model="tmp.quantity"
          />
        </div>
        <div>
          <div class="sub lined heading a-block">
            Delivery service:
            <div class="trailing">
              {{
                `${tmp.delivery.charAt(0).toUpperCase()}${tmp.delivery.slice(
                  1
                )}`
              }}
            </div>
          </div>
          <div class="vertical menu">
            <!-- Bizworld delivery option -->
            <label
              class="item as-icon"
              :class="{ active: tmp.delivery === 'bizworld' }"
            >
              <div class="flexbox flex-column sm-guttered align-center">
                <input
                  type="radio"
                  value="bizworld"
                  v-model="tmp.delivery"
                  class="form-item"
                />
                <Icon
                  name="material-symbols:delivery-truck-speed-outline-rounded"
                  style="font-size: 1.5em"
                />
              </div>
              <div class="content" style="font-weight: normal">
                <div class="flexbox guttered flex-separate">
                  <div class="small bold">BizWorld Delivery Management</div>
                  <a href="#">Details</a>
                </div>
                <div class="flexbox guttered flex-separate">
                  <div>Delivery fee:</div>
                  <div>N900</div>
                </div>
                <div class="flexbox guttered flex-separate">
                  <div>Delivery time:</div>
                  <div>2-3 days</div>
                </div>
              </div>
            </label>
            <!-- Self pickup option -->
            <label
              class="item as-icon"
              :class="{ active: tmp.delivery === 'self-pickup' }"
            >
              <div class="flexbox flex-column sm-guttered align-center">
                <input
                  type="radio"
                  value="self-pickup"
                  v-model="tmp.delivery"
                  class="form-item"
                />
                <Icon
                  name="material-symbols:package-outline-rounded"
                  style="font-size: 1.5em"
                />
              </div>
              <div class="content" style="font-weight: normal">
                <div class="flexbox guttered flex-separate">
                  <div class="small bold">Self Pickup</div>
                  <a href="#">Details</a>
                </div>
                <div class="faint-text-v1">
                  Manage how your item gets to you. Pick up your item within 2
                  weeks of purchase.
                </div>
              </div>
            </label>
          </div>
        </div>
        <div class="flexbox guttered" style="margin-top: 1rem">
          <Dropdown class="primary fluid button">
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
                Chat seller
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
        <Dropdown class="flexible primary button">
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
              Chat seller
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
  grid-template-columns: 1fr 1fr;
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

.config {
  border: 1px solid var(--outline);
  border-radius: var(--comp-radius);
  padding: 1rem;

  & > .label {
    margin-left: auto;
    margin-right: -2em;
  }
}

@media only screen and (min-width: 960px) {
  .mobile-screen-only {
    display: none !important;
  }
}
@media only screen and (max-width: 959px) {
  .page-cont {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .desktop-screen-only {
    display: none !important;
  }
}
</style>
