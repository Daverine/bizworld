<script setup>
definePageMeta({ layout: 'details', name: 'product-page' });
const cartStore = useCartStore();
const [newTemplate, useTemplate] = createReusableTemplate();
const details = ref({
  type: 'product',
  id: 'prod123343',
  title:
    'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
  price: 100000,
  media: [
    {
      type: 'pic',
      url: '/images/product.jpeg',
      thumbnail: '/images/product.jpeg',
    },
  ],
  overview:
    'This product is suitable for office use and it also presentable. It has a long lasting battery and its capable of handling comming computer daily tasks.',
  specifications: {
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
        price: 100000,
        subOptions: {
          optionType: 'Color',
          options: [
            {
              label: 'Yellow',
              price: 100000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Reflective Blue',
              price: 100000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Silver',
              price: 100000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
          ],
        },
      },
      {
        label: '4GB / 128GB',
        media: undefined,
        price: 120000,
        subOptions: {
          optionType: 'Color',
          options: [
            {
              label: 'Black',
              price: 120000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Reflective Blue',
              price: 120000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Moon Gray',
              price: 120000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
          ],
        },
      },
      {
        label: '6GB / 128GB',
        media: undefined,
        price: 150000,
        subOptions: {
          optionType: 'Color',
          options: [
            {
              label: 'Black',
              price: 150000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Reflective Blue',
              price: 150000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
                thumbnail: '/images/product.jpeg',
              },
            },
            {
              label: 'Moon Gray',
              price: 150000,
              media: {
                type: 'pic',
                url: '/images/product.jpeg',
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
    bizId: 'biz3884',
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
  spec: [],
  price: computed(() => {
    let price = 0;
    if (tmp.value.spec[0]) {
      if (tmp.value.spec[1]) {
        price = details.value.productOptions.options
          .find((option) => option.label === tmp.value.spec[0])
          .subOptions.options.find(
            (subOption) => subOption.label === tmp.value.spec[1]
          ).price;
      } else {
        price = details.value.productOptions.options.find(
          (option) => option.label === tmp.value.spec[0]
        ).price;
      }
    } else price = details.value.price;
    return price;
  }),
  media: computed(() => {
    let media = [];
    details.value.media.forEach((item) => media.push(item));
    if (details.value.productOptions) {
      details.value.productOptions.options.forEach((item) => {
        if (item.media) media.push(item.media);
        if (item.subOptions) {
          item.subOptions.options.forEach((item) => {
            if (item.media) media.push(item.media);
          });
        }
      });
    }
    return media;
  }),
  quantity: 1,
  delivery: 'self-pickup',
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

function getItemForCart() {
  return {
    type: details.value.type,
    id: details.value.id,
    title: details.value.title,
    price: tmp.value.price,
    media: tmp.value.media[0].url,
    productOptions: tmp.value.spec,
    quantity: tmp.value.quantity,
    delivery: tmp.value.delivery,
    bizData: details.value.bizData,
    checked: true,
  };
}
</script>
<template>
  <newTemplate>
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
            <NuxtImg
              v-if="option.media"
              preset="logo"
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
              <NuxtImg
                v-if="subOption.media"
                preset="logo"
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
      <div class="w-full small input-box">
        <button
          class="addon icon mini button"
          @click="
            () => {
              if (tmp.quantity > 1) tmp.quantity--;
            }
          "
        >
          <Icon name="material-symbols:remove-rounded" />
        </button>
        <input
          type="number"
          placeholder="Enter product Quantity"
          class="subject form-item compact text-center"
          min="1"
          v-model="tmp.quantity"
          @input="
            (evt) => {
              if (evt.target.value < 1) tmp.quantity = 1;
            }
          "
          @keypress="
            (evt) => {
              if (evt.key === '-') evt.preventDefault();
            }
          "
        />
        <button class="addon icon mini button" @click="tmp.quantity++">
          <Icon name="material-symbols:add-rounded" />
        </button>
      </div>
    </div>
    <div>
      <div class="sub lined heading a-block">
        Delivery service:
        <div class="trailing capitalize">
          {{ tmp.delivery }}
        </div>
      </div>
      <div class="vertical menu">
        <!-- Bizworld delivery option -->
        <label
          class="item as-icon disabled"
          :class="{ active: tmp.delivery === 'bizworld' }"
        >
          <div class="flex flex-col gap-2 items-center">
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
            <div class="flex gap-3 justify-between">
              <div class="small font-bold">BizWorld Delivery Management</div>
              <a href="#">Details</a>
            </div>
            <div class="flex gap-3 justify-between">
              <div>Delivery fee:</div>
              <div>NA</div>
            </div>
            <div class="flex gap-3 justify-between">
              <div>Delivery time:</div>
              <div>NA</div>
            </div>
          </div>
        </label>
        <!-- Self pickup option -->
        <label
          class="item as-icon"
          :class="{ active: tmp.delivery === 'self-pickup' }"
        >
          <div class="flex flex-col gap-2 items-center">
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
            <div class="flex gap-3 justify-between">
              <div class="small font-bold">Self Pickup</div>
              <a
                href="javascript:void(0)"
                class="open-modal"
                data-target="sp-details"
                >Details</a
              >
            </div>
            <div class="faint-text">
              Manage how your item gets to you. Pick up your item within 2 weeks
              of purchase.
            </div>
          </div>
        </label>
      </div>
    </div>
  </newTemplate>

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
        <LimbCarousel :options="{ continuous: false }">
          <div v-for="slide in tmp.media" class="cs-slide">
            <NuxtImg
              format="webp"
              sizes="960px"
              densities="1x"
              :src="slide.url"
              :data-lightbox="slide.url"
              data-target="lightbox1"
            />
          </div>
          <template v-if="!isSmallScreen" #trackers>
            <div v-for="slide in tmp.media" class="thumbnail cs-tracker">
              <NuxtImg
                sizes="150px"
                format="webp"
                densities="1x"
                :src="slide.thumbnail"
              />
            </div>
          </template>
        </LimbCarousel>
        <h5 class="font-semiboldm-0 page-title">{{ details.title }}</h5>
        <div class="flex justify-between gap-3 small font-semibold">
          <span
            v-tooltip:aria.unblocking
            aria-label="Average Rate (Number of raters)"
          >
            <Icon name="material-symbols:star-rounded" class="text-yellow-500" />
            {{
              (
                details.reviews.reduce((n, i) => n + i.rating, 0) /
                details.reviews.length
              ).toFixed(1)
            }}
            ({{ details.reviews.length }} reviews)
          </span>
          <span
            v-tooltip:aria.unblocking
            :aria-label="details.bizData.location.address"
          >
            <Icon name="material-symbols:location-on-outline-rounded" />
            {{ details.bizData.location.city }},
            {{ details.bizData.location.state }}
          </span>
        </div>
        <!-- Product Options -->
        <section class="mobile-screen-only config">
          <div class="small font-semibold">Unit price</div>
          <div class="h3 m-0 primary-text font-bold">
            ₦{{ tmp.price.toLocaleString() }}
          </div>
          <div class="alt-ribbon red label">Configure purchase</div>

          <useTemplate />
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
        <!-- Overview Section -->
        <section>
          <div class="heading">Seller's review</div>
          <p>{{ details.overview }}</p>
        </section>
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
                <NuxtImg
                  preset="logo"
                  :src="details.bizData.logo"
                  class="loose avatar"
                />
                <SvgIcon
                  name="verified_sp"
                  v-tooltip:aria.unblocking
                  aria-label="Verified"
                  class="small green-text"
                  style="position: absolute; bottom: 0px; right: 0px"
                />
              </div>
              <div class="content">
                <NuxtLink
                  :to="`/business/${details.bizData.bizId}`"
                  class="font-bold h6 line-clamp-2 uppercase"
                >
                  {{ details.bizData.bizName }}
                </NuxtLink>
                <div
                  class="flex justify-between flex-wrap font-semibold"
                  style="gap: 0.25em 0.75em"
                >
                  <span>
                    {{ details.bizData.mainCategory }}
                  </span>
                  <span
                    v-if="details.bizData.rating"
                    class="font-semibold"
                    v-tooltip:aria.unblocking
                    aria-label="Average Rate (Number of raters)"
                  >
                    <Icon
                      name="material-symbols:star-rounded"
                      class="text-yellow-500"
                    />
                    {{ details.bizData.rating.rate }} ({{
                      details.bizData.rating.raters
                    }})
                  </span>
                </div>
              </div>
            </div>
            <div class="flex *:flex-1 gap-3" style="margin-top: 0.5em">
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
            <div class="flex *:flex-1 items-center">
              <div
                class="text-center"
                :set="
                  (rating = (
                    details.reviews.reduce((n, i) => n + i.rating, 0) /
                    details.reviews.length
                  ).toFixed(1))
                "
              >
                <div class="font-semibold" style="font-size: 3em">
                  {{
                    (
                      details.reviews.reduce((n, i) => n + i.rating, 0) /
                      details.reviews.length
                    ).toFixed(1)
                  }}
                </div>
                <div class="rating small text-yellow-500">
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
              <div class="text-center">
                <p class="small font-semibold">
                  Patronize {{ details.bizData.bizName }} to write a review.
                  <a href="#">Learn more.</a>
                </p>
              </div>
            </div>
            <hr />
            <div>
              <div
                class="flex justify-between gap-3 items-center"
                style="margin-bottom: 1rem"
              >
                <div class="font-semibold">Reviews</div>
                <LimbDropdown
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
                </LimbDropdown>
              </div>
              <div class="dm-reviews">
                <div
                  v-for="a in Math.min(5, details.reviews.length)"
                  class="dm-review"
                  style="padding: 0.5em"
                  :set="(review = details.reviews[a - 1])"
                >
                  <header class="flex justify-between items-center gap-3">
                    <div class="small rounded-full avatar">
                      <NuxtImg
                        preset="logo"
                        src="/Images/profilepic.jpg"
                        alt="profile picture"
                      />
                    </div>
                    <div class="content flex-1">
                      <div class="font-bold">{{ review.username }}</div>
                      <div class="dm-gap" style="gap: 0.5em">
                        <div
                          class="rating mini text-yellow-500"
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
                    <LimbDropdown>
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
                    </LimbDropdown>
                  </header>
                  <article>{{ review.review }}</article>
                  <footer>
                    <span class="faint-text small font-semibold"
                      >12-01-2034</span
                    >
                  </footer>
                </div>
                <div v-if="details.reviews.length > 5" class="text-center">
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
        <div class="small font-semibold">Unit price</div>
        <div class="h3 m-0 primary-text font-bold">
          ₦{{ tmp.price.toLocaleString() }}
        </div>
        <div class="alt-ribbon red label">Configure purchase</div>

        <useTemplate />
        <div
          class="flex gap-3 sticky surface-bg pin-bottom-blend z-level-1"
          style="bottom: 0px; padding: 0.5rem 0rem; margin-top: 0.5rem"
        >
          <button
            class="primary w-full button open-modal"
            data-target="pre-cart"
          >
            <Icon name="material-symbols:add-shopping-cart" class="lead" />
            Add to cart
          </button>
          <LimbDropdown
            :options="{ directionPriority: { x: 'left', y: 'top' } }"
            v-tooltip:aria.unblocking
            aria-label="More options"
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
          </LimbDropdown>
        </div>
        <div class="compact success note" style="margin-top: 0.5rem">
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
      class="mobile-screen-only sticky surface-bg w-full z-level-2 pin-bottom-blend"
      style="bottom: 0px"
    >
      <div class="container flex gap-3" style="padding: 0.5rem 0rem">
        <button class="flex-1 primary button open-modal" data-target="pre-cart">
          <Icon name="material-symbols:add-shopping-cart" class="lead" />
          Add to cart
        </button>
        <LimbDropdown
          :options="{ directionPriority: { x: 'left', y: 'top' } }"
          v-tooltip:aria.unblocking
          aria-label="More options"
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
        </LimbDropdown>
      </div>
    </div>
    <LimbModal id="sp-details">
      <div class="dialog">
        <div class="header pin-top-blend flex gap-3">
          <div class="font-bold truncate">Self Pickup Details</div>
          <button
            class="circular flat button as-text exit-modal"
            style="margin-left: auto"
          >
            <Icon name="material-symbols:close" />
          </button>
        </div>
        <div class="content">
          <p class="mt-0">
            Self-pickup is a delivery option that lets you control how your item
            is collected. A token is generated to verify your pickup from the
            specified location.
          </p>
          <table class="table striped">
            <tbody>
              <tr>
                <td>Location</td>
                <td>
                  {{
                    `${details.bizData.location.address}, ${details.bizData.location.city}, ${details.bizData.location.state}.`
                  }}
                </td>
              </tr>
              <tr>
                <td>Pickup Timeframe</td>
                <td>Within 2 weeks of purchase</td>
              </tr>
              <tr>
                <td>Contact</td>
                <td>
                  Call
                  <a :href="`tel:${details.bizData.contacts.tel}`">{{
                    details.bizData.contacts.tel
                  }}</a>
                  or email
                  <a :href="`mailto:${details.bizData.contacts.email}`">{{
                    details.bizData.contacts.email
                  }}</a>
                  for more information.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </LimbModal>
    <LimbModal id="pre-cart">
      <div class="self-scroll dialog">
        <div class="header pin-top-blend flex gap-3">
          <div class="font-bold truncate">Confirm options</div>
          <button
            class="circular flat button as-text exit-modal"
            style="margin-left: auto"
          >
            <Icon name="material-symbols:close" />
          </button>
        </div>
        <div class="content" style="padding-bottom: 0em">
          <useTemplate />
          <div
            class="footer flex-col flex gap-3 surface-bg sticky pin-bottom-blend"
            style="bottom: 0px; padding: 1rem 0rem; margin-top: 0.5rem"
          >
            <div class="flex flex-col" style="gap: 0.25rem">
              <div class="flex gap-3 justify-between">
                <div>Unit price</div>
                <div>₦{{ tmp.price.toLocaleString() }}</div>
              </div>
              <hr class="m-0" />
              <div class="flex gap-3 justify-between">
                <div class="font-bold">Total:</div>
                <div class="h5 font-bold">
                  ₦{{ (tmp.price * tmp.quantity).toLocaleString() }}
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 justify-between items-start">
              <NuxtLink
                @click="cartStore.addToCart(getItemForCart())"
                to="/cart"
                class="flex-1 primary exit-modal button"
              >
                Add and Go to cart
              </NuxtLink>
              <NuxtLink
                :to="{
                  name: 'biz-products',
                  params: { id: details.bizData.bizId },
                }"
                @click="cartStore.addToCart(getItemForCart())"
                class="flex-1 primary flat button exit-modal"
              >
                Add and Continue Shopping
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </LimbModal>
  </main>
</template>

<style scoped>
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
  border-radius: var(--radius-inline);
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
