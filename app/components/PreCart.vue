<script lang="ts" setup>
const product: Ref<product | undefined> = ref(undefined);
const bizData: Ref<bizData | undefined> = ref(undefined);
const cartStore = useCartStore();

async function preCartController({ target, settings, exit }: Dialoger) {
  try {
    const productId = settings.caller?.dataset.ref;

    product.value = await $fetch("/api/product/query", {
      query: { id: productId },
    });
    bizData.value = await $fetch("/api/business/query", {
      query: { id: product.value?.business_id },
    });
  } catch (error) {
    console.error("Error occured", error);
    exit();
    return;
  }
}

function getItemForCart() {
  return {
    product: product.value,
    selectedOptions: toCart.spec,
    price: price.value,
    promo_price: promo_price.value,
    quantity: toCart.quantity,
    delivery: toCart.delivery,
    checked: true,
  };
}

const toCart = reactive<{
  spec: (string | undefined)[];
  quantity: number;
  delivery: string;
  note: string;
}>({
  spec: [],
  quantity: 1,
  delivery: "self-pickup",
  note: "",
});

const photos = computed(() => {
  if (!product.value) return [];
  let photos = [...product.value.photos];
  if (product.value.option_group) {
    product.value.option_group.options.forEach((item) => {
      if (item.photo) photos.push(item.photo);
    });
    if (product.value.sub_option_group) {
      product.value.sub_option_group.options.forEach((item) => {
        if (item.photo) photos.push(item.photo);
      });
    }
  }
  return photos;
});
const price = computed(() => {
  if (!product.value) return NaN;
  let option_price = product.value.option_group?.options.find(
    (option) => option.label === toCart.spec[0],
  )?.price;
  let sub_option_price = product.value.option_group?.options
    .find((option) => option.label === toCart.spec[0])
    ?.sub_options?.find((sub_option) => sub_option.label === toCart.spec[1])?.price;

  return parseFloat(sub_option_price || option_price || product.value.base_price);
});
const promo_price = computed(() => {
  if (!product.value) return undefined;
  let option = product.value.option_group?.options.find(
    (option) => option.label === toCart.spec[0],
  );
  let sub_option = product.value.option_group?.options
    .find((option) => option.label === toCart.spec[0])
    ?.sub_options?.find((sub_option) => sub_option.label === toCart.spec[1]);

  if (sub_option?.promo_price) return parseFloat(sub_option.promo_price);
  else if (option?.promo_price && !sub_option?.price) return parseFloat(option.promo_price);
  else if (product.value?.base_promo_price && !sub_option?.price && !option?.price)
    return parseFloat(product.value.base_promo_price);
  return undefined;
});
</script>
<template>
  <LimbModal id="general-pre-cart" :options="{ controller: preCartController }">
    <div class="dialog">
      <template v-if="product && bizData">
        <header class="pin-top-blend flex gap-3 px-6 py-4">
          <div class="truncate font-bold">Add product to cart</div>
          <button class="circular flat button as-text exit-modal" style="margin-left: auto">
            <Icon name="material-symbols:close" />
          </button>
        </header>
        <div class="px-6 pt-4">
          <div class="grid grid-cols-2 gap-3">
            <LimbCarousel :options="{ continuous: false }">
              <div v-for="slide in photos" class="cs-slide">
                <NuxtImg
                  format="webp"
                  sizes="960px"
                  densities="1x"
                  :src="slide"
                  :data-lightbox="slide"
                  data-target="lightbox1"
                />
              </div>
            </LimbCarousel>
            <div>
              <h5 class="font-semiboldm-0 page-title">{{ product.title }}</h5>
            </div>
          </div>

          <template v-if="product.option_group">
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
                  <input
                    type="radio"
                    class="form-item"
                    :value="option.label"
                    v-model="toCart.spec[0]"
                  />
                  <NuxtImg
                    v-if="option.photo"
                    preset="logo"
                    :src="option.photo"
                    class="thumbnail"
                  />
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
            <div class="input-box w-full text-sm">
              <button
                class="addon icon button text-xs"
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
              <button class="addon icon button text-xs" @click="toCart.quantity++">
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
              <label
                class="item as-icon disabled"
                :class="{ active: toCart.delivery === 'bizworld' }"
              >
                <div class="flex flex-col items-center gap-2">
                  <input
                    type="radio"
                    value="bizworld"
                    v-model="toCart.delivery"
                    class="form-item"
                  />
                  <Icon
                    name="material-symbols:delivery-truck-speed-outline-rounded"
                    style="font-size: 1.5em"
                  />
                </div>
                <div class="content" style="font-weight: normal">
                  <div class="flex justify-between gap-3">
                    <div class="text-sm font-bold">BizWorld Delivery Management</div>
                    <a href="#">Details</a>
                  </div>
                  <div class="flex justify-between gap-3">
                    <div>Delivery fee:</div>
                    <div>NA</div>
                  </div>
                  <div class="flex justify-between gap-3">
                    <div>Delivery time:</div>
                    <div>NA</div>
                  </div>
                </div>
              </label>
              <!-- Self pickup option -->
              <label class="item as-icon" :class="{ active: toCart.delivery === 'self-pickup' }">
                <div class="flex flex-col items-center gap-2">
                  <input
                    type="radio"
                    value="self-pickup"
                    v-model="toCart.delivery"
                    class="form-item"
                  />
                  <Icon name="material-symbols:package-outline-rounded" style="font-size: 1.5em" />
                </div>
                <div class="content" style="font-weight: normal">
                  <div class="flex justify-between gap-3">
                    <div class="text-sm font-bold">Self Pickup</div>
                    <a href="javascript:void(0)" class="open-modal" data-target="sp-details"
                      >Details</a
                    >
                  </div>
                  <div class="opacity-65">
                    Manage how your item gets to you. Pick up your item within 2 weeks of purchase.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div class="field mt-2">
            <label>Additional Notes</label>
            <textarea
              v-model="toCart.note"
              class="form-item"
              rows="2"
              placeholder="Add any notes about your order..."
            ></textarea>
          </div>
          <div
            class="footer bg-surface pin-bottom-blend sticky flex flex-col gap-3"
            style="bottom: 0px; padding: 1rem 0rem; margin-top: 0.5rem"
          >
            <div class="flex flex-col" style="gap: 0.25rem">
              <div class="flex items-center justify-between gap-3">
                <div class="font-semibold">Unit price</div>
                <div v-if="product.promo && promo_price" class="flex gap-2">
                  <div class="flex items-center gap-1">
                    <div class="text-on-surface-v1 line-through">
                      ₦{{ Number(price).toLocaleString() }}
                    </div>
                    <div class="label compact px-2 py-0.5 text-xs">
                      -{{ Math.round(100 - (Number(promo_price) / Number(price)) * 100) }}%
                    </div>
                  </div>
                  <div class="font-bold">₦{{ Number(promo_price).toLocaleString() }}</div>
                </div>
                <div v-else class="font-bold">₦{{ price.toLocaleString() }}</div>
              </div>
              <hr class="m-0" />
              <div class="flex justify-between gap-3">
                <div class="font-bold">Total:</div>
                <div class="text-h5 font-bold">
                  ₦{{
                    (
                      (product.promo && promo_price ? promo_price : price) * toCart.quantity
                    ).toLocaleString()
                  }}
                </div>
              </div>
            </div>
            <div class="flex flex-wrap items-start justify-between gap-3">
              <NuxtLink
                @click="cartStore.addToCart(getItemForCart())"
                to="/cart"
                class="primary exit-modal button flex-1"
              >
                Add and Go to cart
              </NuxtLink>
              <NuxtLink
                :to="{
                  name: 'biz-products',
                  params: { slug: bizData?.slug },
                }"
                @click="cartStore.addToCart(getItemForCart())"
                class="primary flat button exit-modal flex-1"
              >
                Add and Continue Shopping
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>
    </div>
  </LimbModal>
</template>
