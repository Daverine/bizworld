<script lang="ts" setup>
definePageMeta({ layout: "details", name: "product-page" });
const cartStore = useCartStore();
const route = useRoute();
const { data: product } = await useFetch("/api/product/query", {
  query: { slug: route.params.slug },
});
const { data: bizData } = await useFetch("/api/business/query", {
  query: { id: product.value?.business_id },
});
const [newTemplate, useTemplate] = createReusableTemplate();

const reviews = ref([
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
]);
const toCart = reactive<{
  spec: (string | undefined)[];
  price: ComputedRef<number>;
  photos: ComputedRef<string[]>;
  quantity: number;
  delivery: string;
}>({
  spec: [],
  price: computed(() => {
    let option_price = product.value!.option_group?.options.find(
      (option) => option.label === toCart.spec[0],
    )?.price as string;
    let sub_option_price = product
      .value!.option_group?.options.find((option) => option.label === toCart.spec[0])
      ?.sub_options?.find((sub_option) => sub_option.label === toCart.spec[1])?.price as string;

    return parseFloat(sub_option_price || option_price || product.value!.base_price);
  }),
  photos: computed(() => {
    let photos = [...product.value!.photos];
    if (product.value!.option_group) {
      product.value!.option_group.options.forEach((item) => {
        if (item.photo) photos.push(item.photo);
      });
      if (product.value!.sub_option_group) {
        product.value!.sub_option_group.options.forEach((item) => {
          if (item.photo) photos.push(item.photo);
        });
      }
    }
    return photos;
  }),
  quantity: 1,
  delivery: "self-pickup",
});

const isSmallScreen = ref(true);
onMounted(() => {
  // Configure product default option
  if (product.value?.option_group) {
    // sort options by price
    product.value.option_group.options.sort(
      (a, b) => Number(a?.price || 0) - Number(b?.price || 0),
    );
    product.value.sub_option_group?.options.sort(
      (a, b) => Number(a?.price || 0) - Number(b?.price || 0),
    );
    product.value.option_group.options.forEach((option) => {
      option.sub_options?.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    });

    // configure default option
    toCart.spec[0] = product.value.option_group.options?.[0]?.label;
    if (
      product.value.option_group.options[0]?.sub_options?.some((sub_option) => sub_option.is_active)
    ) {
      toCart.spec[1] = product.value.option_group.options[0]?.sub_options?.find(
        (sub_option) => sub_option.is_active,
      )?.label;

      // Configure sub-option based on option
      watchEffect(() => {
        let option = product.value?.option_group?.options.find(
          (option) => option.label === toCart.spec[0],
        );
        toCart.spec[1] =
          option?.sub_options?.find(
            (sub_option) => sub_option.label === toCart.spec[1] && sub_option.is_active,
          )?.label || option?.sub_options?.find((sub_option) => sub_option.is_active)?.label;
      });
    }
  }
  // watch for screen size change
  watchEffect(() => {
    isSmallScreen.value = useMediaQuery("(max-width: 959px)").value;
  });
});

function getItemForCart() {
  return {
    type: "product",
    id: product.value!.id,
    title: product.value!.title,
    price: toCart.price,
    media: toCart.photos[0],
    productOptions: toCart.spec,
    quantity: toCart.quantity,
    delivery: toCart.delivery,
    bizData: bizData,
    checked: true,
  };
}
</script>
<template>
  <newTemplate>
    <template v-if="product?.option_group">
      <div>
        <div class="sub lined heading a-block">
          {{ product.option_group.title }}:
          <div class="trailing">{{ toCart.spec[0] }}</div>
        </div>
        <div class="wrappable menu">
          <label
            v-for="option in product.option_group.options"
            class="item as-icon"
            :class="{ active: option.label === toCart.spec[0] }"
          >
            <input type="radio" class="form-item" :value="option.label" v-model="toCart.spec[0]" />
            <NuxtImg v-if="option.photo" preset="logo" :src="option.photo" class="thumbnail" />
            {{ option.label }}
          </label>
        </div>
      </div>
      <template v-for="option in product.option_group.options">
        <div
          v-if="
            product.sub_option_group &&
            option.sub_options?.some((sub_option) => sub_option.is_active)
          "
          class="tab-page"
          :class="{ active: option.label === toCart.spec[0] }"
        >
          <div class="sub lined heading a-block">
            {{ product.sub_option_group.title }}:
            <div class="trailing">{{ toCart.spec[1] }}</div>
          </div>
          <div class="wrappable menu">
            <template v-for="sub_option in product.sub_option_group.options">
              <label
                v-if="
                  option.sub_options.filter(
                    (sub_op) => sub_op.label === sub_option.label && sub_op.is_active,
                  )[0]
                "
                class="item as-icon"
                :class="{ active: sub_option.label === toCart.spec[1] }"
              >
                <input
                  type="radio"
                  class="form-item"
                  :value="sub_option.label"
                  v-model="toCart.spec[1]"
                />
                <NuxtImg
                  v-if="sub_option.photo"
                  preset="logo"
                  :src="sub_option.photo"
                  class="thumbnail"
                />
                {{ sub_option.label }}
              </label>
            </template>
          </div>
        </div>
      </template>
    </template>
    <div>
      <div class="sub lined heading a-block">
        Quantity:
        <div class="trailing">{{ toCart.quantity }}</div>
      </div>
      <div class="w-full text-sm input-box">
        <button
          class="addon icon text-xs button"
          @click="
            () => {
              if (toCart.quantity > 1) toCart.quantity--;
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
          v-model="toCart.quantity"
          @input="
            (evt) => {
              const input = evt.currentTarget as HTMLInputElement;
              if (parseInt(input.value) < 1) toCart.quantity = 1;
            }
          "
          @keypress="
            (evt) => {
              if (evt.key === '-') evt.preventDefault();
            }
          "
        />
        <button class="addon icon text-xs button" @click="toCart.quantity++">
          <Icon name="material-symbols:add-rounded" />
        </button>
      </div>
    </div>
    <div>
      <div class="sub lined heading a-block">
        Delivery service:
        <div class="trailing capitalize">
          {{ toCart.delivery }}
        </div>
      </div>
      <div class="vertical menu">
        <!-- Bizworld delivery option -->
        <label class="item as-icon disabled" :class="{ active: toCart.delivery === 'bizworld' }">
          <div class="flex flex-col gap-2 items-center">
            <input type="radio" value="bizworld" v-model="toCart.delivery" class="form-item" />
            <Icon
              name="material-symbols:delivery-truck-speed-outline-rounded"
              style="font-size: 1.5em"
            />
          </div>
          <div class="content" style="font-weight: normal">
            <div class="flex gap-3 justify-between">
              <div class="text-sm font-bold">BizWorld Delivery Management</div>
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
        <label class="item as-icon" :class="{ active: toCart.delivery === 'self-pickup' }">
          <div class="flex flex-col gap-2 items-center">
            <input type="radio" value="self-pickup" v-model="toCart.delivery" class="form-item" />
            <Icon name="material-symbols:package-outline-rounded" style="font-size: 1.5em" />
          </div>
          <div class="content" style="font-weight: normal">
            <div class="flex gap-3 justify-between">
              <div class="text-sm font-bold">Self Pickup</div>
              <a href="javascript:void(0)" class="open-modal" data-target="sp-details">Details</a>
            </div>
            <div class="opacity-65">
              Manage how your item gets to you. Pick up your item within 2 weeks of purchase.
            </div>
          </div>
        </label>
      </div>
    </div>
  </newTemplate>

  <Title>{{ `${product?.title} | Bizworld` }}</Title>
  <main class="layout-grid">
    <div
      class="fluid layout-grid border-b p-2 mb-4 bg-surface sticky top-15.75 z-level-1 pin-top-blend"
    >
      <div class="px-4">
        Products <Icon name="material-symbols:chevron-right-rounded" /> {{ product?.category }}
        <Icon name="material-symbols:chevron-right-rounded" /> {{ product?.title }}
      </div>
    </div>
    <div class="page-cont">
      <section
        class="page-sec1"
        v-scrollPin="{
          top: 118,
          bottom: 64,
          breakpoints: [{ maxWidth: 959, pinnable: false }],
        }"
      >
        <LimbCarousel :options="{ continuous: false }">
          <div v-for="slide in toCart.photos" class="cs-slide">
            <NuxtImg
              format="webp"
              sizes="960px"
              densities="1x"
              :src="slide"
              :data-lightbox="slide"
              data-target="lightbox1"
            />
          </div>
          <template v-if="!isSmallScreen" #trackers>
            <div v-for="slide in toCart.photos" class="thumbnail cs-tracker">
              <NuxtImg sizes="150px" format="webp" densities="1x" :src="slide" />
            </div>
          </template>
        </LimbCarousel>
        <h5 class="font-semiboldm-0 page-title">{{ product?.title }}</h5>
        <div class="flex justify-between gap-3 text-sm font-semibold">
          <span v-tooltip:aria.unblocking aria-label="Average Rate (Number of raters)">
            <Icon name="material-symbols:star-rounded" class="text-yellow-500" />
            {{ (reviews.reduce((n, i) => n + i.rating, 0) / reviews.length).toFixed(1) }}
            ({{ reviews.length }} reviews)
          </span>
          <span
            v-if="bizData?.physical_location"
            v-tooltip:aria.unblocking
            :aria-label="bizData?.address!"
          >
            <Icon name="material-symbols:location-on-outline-rounded" />
            {{ bizData?.city }},
            {{ bizData?.state }}
          </span>
        </div>
        <!-- Product Options -->
        <section class="min-[960px]:hidden config">
          <div class="text-sm font-semibold">Unit price</div>
          <div class="text-h3 m-0 text-primary font-bold">₦{{ toCart.price.toLocaleString() }}</div>
          <div class="alt-ribbon label bg-red-600 text-white ml-auto mr-[-2em]">
            Configure purchase
          </div>

          <useTemplate />
          <div class="compact success note" style="margin-top: 1rem">
            <Icon
              name="material-symbols:verified-user-outline-rounded"
              style="font-size: 1.875em"
            />
            <div class="content">
              <div class="heading">Secure personal details</div>
              <div class="opacity-65">
                Your personal and payment information is kept confidential and secure. We do not
                share your details with third parties without your explicit consent, ensuring your
                privacy is always protected.
              </div>
            </div>
          </div>
        </section>
        <!-- Overview Section -->
        <section>
          <div class="heading">Overview</div>
          <p>{{ product?.overview }}</p>
        </section>
        <!-- Specifications Section -->
        <section class="spec">
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
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
                <tr v-for="spec in product?.specifications">
                  <td>{{ spec.name }}</td>
                  <td>{{ spec.value }}</td>
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
                  :src="bizData?.logo || '/images/bizpic.jpg'"
                  alt="Business logo"
                  class="loose avatar"
                />
                <SvgIcon
                  v-if="bizData?.badges?.includes('verified')"
                  name="verified_sp"
                  v-tooltip:aria.unblocking
                  aria-label="Verified"
                  class="text-sm green-text"
                  style="position: absolute; bottom: 0px; right: 0px"
                />
              </div>
              <div class="content">
                <NuxtLink
                  :to="{ name: 'biz-home', params: { slug: bizData?.slug } }"
                  class="font-bold text-h6 line-clamp-2 uppercase"
                >
                  {{ bizData?.business_name }}
                </NuxtLink>
                <div
                  class="flex justify-between flex-wrap font-semibold"
                  style="gap: 0.25em 0.75em"
                >
                  <span>
                    {{ bizData?.category }}
                  </span>
                  <span
                    v-if="bizData?.review_count !== 0"
                    class="font-semibold"
                    v-tooltip:aria.unblocking
                    aria-label="Average Rate (Number of raters)"
                  >
                    <Icon name="material-symbols:star-rounded" class="text-yellow-500" />
                    {{ bizData?.average_rating }} ({{ bizData?.review_count }})
                  </span>
                </div>
              </div>
            </div>
            <div class="flex *:flex-1 gap-3" style="margin-top: 0.5em">
              <button class="secondary compact button">
                <Icon name="material-symbols:add-to-queue-outline-rounded" class="lead" />
                Follow
              </button>
              <button class="compact button">Visit Store</button>
            </div>
          </div>
        </section>
        <!-- Review and Rating Section -->
        <section>
          <div v-collapser class="ac-viewbox-ref active lined heading a-block">
            <Icon name="material-symbols:reviews-outline-rounded" class="lead" />
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
                v-for="rating in [
                  parseFloat(
                    (reviews.reduce((n, i) => n + i.rating, 0) / reviews.length).toFixed(1),
                  ),
                ]"
              >
                <div class="font-semibold" style="font-size: 3em">
                  {{ (reviews.reduce((n, i) => n + i.rating, 0) / reviews.length).toFixed(1) }}
                </div>
                <div class="rating text-sm text-yellow-500">
                  <Icon v-for="i in Math.floor(rating)" name="material-symbols:star-rounded" />
                  <Icon
                    v-if="rating - Math.floor(rating) >= 0.5"
                    name="material-symbols:star-half-rounded"
                  />
                  <Icon
                    v-for="i in 5 - Math.round(rating)"
                    name="material-symbols:star-outline-rounded"
                  />
                </div>
                <div>{{ reviews.length }} review(s)</div>
                <div>All reviews are from verified purchases.</div>
              </div>
              <div class="text-center">
                <p class="text-sm font-semibold">
                  Patronize {{ bizData?.business_name }} to write a review.
                  <a href="#">Learn more.</a>
                </p>
              </div>
            </div>
            <hr />
            <div>
              <div class="flex justify-between gap-3 items-center" style="margin-bottom: 1rem">
                <div class="font-semibold">Reviews</div>
                <LimbDropdown
                  type="selection"
                  :options="{ directionPriority: { x: 'left' } }"
                  class="outlined text-sm button"
                >
                  <Icon name="material-symbols:sort-rounded" class="lead" />
                  Sort:
                </LimbDropdown>
                <div class="drop menu">
                  <div class="item active">Newest</div>
                  <div class="item">Highest</div>
                  <div class="item">Lowest</div>
                </div>
              </div>
              <div class="dm-reviews">
                <div
                  v-for="index in Math.min(5, reviews.length)"
                  class="dm-review"
                  style="padding: 0.5em"
                >
                  <template v-for="review in [reviews[index - 1]]">
                    <header class="flex justify-between items-center gap-3">
                      <div class="text-sm rounded-full avatar">
                        <NuxtImg preset="logo" src="/Images/profilepic.jpg" alt="profile picture" />
                      </div>
                      <div class="content flex-1">
                        <div class="font-bold">{{ review?.username }}</div>
                        <div class="dm-gap" style="gap: 0.5em">
                          <div
                            class="rating text-xs text-yellow-500"
                            v-for="rating in [review!.rating]"
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
                      </LimbDropdown>
                      <div class="drop menu text-sm">
                        <div class="item">
                          <Icon name="material-symbols:flag-outline-rounded" class="lead" />
                          Report
                        </div>
                      </div>
                    </header>
                    <article>{{ review?.review }}</article>
                    <footer>
                      <span class="opacity-65 text-smsm font-semibold">12-01-2034</span>
                    </footer>
                  </template>
                </div>
                <div v-if="reviews.length > 5" class="text-center">
                  <a href="#" class="flat primary button"
                    >More reviews ({{ reviews.length - 5 }})</a
                  >
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <!-- Product Options -->
      <section
        class="max-[959px]:hidden config"
        v-scrollPin="{
          top: 118,
          bottom: 64,
          breakpoints: [{ maxWidth: 959, pinnable: false }],
        }"
      >
        <div class="text-sm font-semibold">Unit price</div>
        <div class="text-h3 m-0 text-primary font-bold">₦{{ toCart.price.toLocaleString() }}</div>
        <div class="alt-ribbon label bg-red-600 text-white ml-auto mr-[-2em]">
          Configure purchase
        </div>

        <useTemplate />
        <div
          class="flex gap-3 sticky bg-surface pin-bottom-blend z-level-1"
          style="bottom: 0px; padding: 0.5rem 0rem; margin-top: 0.5rem"
        >
          <button class="primary w-full button open-modal" data-target="pre-cart">
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
          </LimbDropdown>
          <div class="drop menu">
            <div class="item">
              <Icon name="material-symbols:chat-outline-rounded" class="lead" />
              Chat seller
            </div>
            <div class="item">
              <Icon name="material-symbols:bookmark-add-outline-rounded" class="lead" />
              Save card
            </div>
            <div class="item">
              <Icon name="material-symbols:share-outline" class="lead" />
              Share
            </div>
            <div class="item">
              <Icon name="material-symbols:category-search-outline-rounded" class="lead" />
              View related
            </div>
            <div class="item">
              <Icon name="material-symbols:report-outline-rounded" class="lead" />
              Report
            </div>
          </div>
        </div>
        <div class="text-sm compact success note" style="margin-top: 0.5rem">
          <Icon name="material-symbols:verified-user-outline-rounded" style="font-size: 1.875em" />
          <div class="content">
            <div class="heading">Secure personal details</div>
            <div class="opacity-65">
              Your personal and payment information is kept confidential and secure. We do not share
              your details with third parties without your explicit consent, ensuring your privacy
              is always protected.
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Call to Action Section -->
    <div
      class="min-[960px]:hidden sticky bg-surface fluid z-level-2 pin-bottom-blend"
      style="bottom: 0px"
    >
      <div class="max-w-6xl auto-contain flex gap-3" style="padding: 0.5rem 0rem">
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
        </LimbDropdown>
        <div class="drop menu">
          <div class="item">
            <Icon name="material-symbols:chat-outline-rounded" class="lead" />
            Chat seller
          </div>
          <div class="item">
            <Icon name="material-symbols:bookmark-add-outline-rounded" class="lead" />
            Save card
          </div>
          <div class="item">
            <Icon name="material-symbols:share-outline" class="lead" />
            Share
          </div>
          <div class="item">
            <Icon name="material-symbols:category-search-outline-rounded" class="lead" />
            View related
          </div>
          <div class="item">
            <Icon name="material-symbols:report-outline-rounded" class="lead" />
            Report
          </div>
        </div>
      </div>
    </div>
    <LimbModal id="sp-details">
      <div class="dialog">
        <div class="header pin-top-blend flex gap-3">
          <div class="font-bold truncate">Self Pickup Details</div>
          <button class="circular flat button as-text exit-modal" style="margin-left: auto">
            <Icon name="material-symbols:close" />
          </button>
        </div>
        <div class="content">
          <p class="mt-0">
            Self-pickup is a delivery option that lets you control how your item is collected. A
            token is generated to verify your pickup from the specified location.
          </p>
          <table class="table striped">
            <tbody>
              <tr>
                <td>Location</td>
                <td>
                  {{ `${bizData?.address}, ${bizData?.city}, ${bizData?.state}.` }}
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
                  <a :href="`tel:${bizData?.telephone}`">{{ bizData?.telephone }}</a>
                  or email
                  <a :href="`mailto:${bizData?.email}`">{{ bizData?.email }}</a>
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
          <button class="circular flat button as-text exit-modal" style="margin-left: auto">
            <Icon name="material-symbols:close" />
          </button>
        </div>
        <div class="content" style="padding-bottom: 0em">
          <useTemplate />
          <div
            class="footer flex-col flex gap-3 bg-surface sticky pin-bottom-blend"
            style="bottom: 0px; padding: 1rem 0rem; margin-top: 0.5rem"
          >
            <div class="flex flex-col" style="gap: 0.25rem">
              <div class="flex gap-3 justify-between">
                <div>Unit price</div>
                <div>₦{{ toCart.price.toLocaleString() }}</div>
              </div>
              <hr class="m-0" />
              <div class="flex gap-3 justify-between">
                <div class="font-bold">Total:</div>
                <div class="text-h5 font-bold">
                  ₦{{ (toCart.price * toCart.quantity).toLocaleString() }}
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
                  params: { slug: bizData?.slug },
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

@media only screen and (max-width: 959px) {
  .page-cont {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
