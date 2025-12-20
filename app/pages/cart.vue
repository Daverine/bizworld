<script setup>
definePageMeta({ layout: 'details' });
const cartStore = useCartStore();
const allChecked = computed({
  get() {
    return cartStore.items.every((item) => item.checked);
  },
  set(val) {
    cartStore.items.forEach((item) => {
      item.checked = val;
    });
  },
});
</script>

<template>
  <Title>Shopping Cart | BizWorld</Title>
  <main class="grid-layout" style="padding-top: 1rem">
    <div class="page-cont">
      <section class="page-sec1">
        <h3>Shopping Cart</h3>
        <table class="compact clear table">
          <thead
            class="sticky z-level-1"
            style="
              top: 72px;
              box-shadow: 0px 1px 0px 0px var(--on-surface),
                0px 5px 10px 5px var(--blend-bg);
            "
          >
            <tr>
              <th>
                <input type="checkbox" v-model="allChecked" class="form-item" />
              </th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartStore.items">
              <td>
                <input
                  type="checkbox"
                  v-model="item.checked"
                  class="form-item"
                />
              </td>
              <td>
                <div class="flex gap-3">
                  <div class="flex-none">
                    <NuxtImg
                      preset="thumbnail"
                      class="thumbnail"
                      :src="item.media"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="heading line-clamp-2">
                      {{ item.title }}
                    </div>
                    <div
                      class="flex justify-between flex-wrap gap-3 items-center mini"
                    >
                      <a
                        :href="item.bizData.bizUrl"
                        class="font-semibold truncate"
                        >{{ item.bizData.bizName }}</a
                      >
                      <div
                        class="flex flex-wrap gap-2"
                        style="margin-top: 0.5em"
                      >
                        <div
                          v-for="option in item.productOptions"
                          class="label"
                        >
                          {{ option }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div
                    class="flex flex-wrap justify-between gap-3 small font-semibold"
                  >
                    <div>Unit Price: ₦{{ item.price.toLocaleString() }}</div>
                    <div>Dellivery: {{ item.delivery }}</div>
                    <div>
                      <div class="small input-box" style="width: 7rem">
                        <button
                          class="addon icon of-mini button"
                          @click="
                            () => {
                              if (item.quantity > 1) item.quantity--;
                            }
                          "
                        >
                          <Icon name="material-symbols:remove-rounded" />
                        </button>
                        <input
                          type="number"
                          placeholder="Enter product Quantity"
                          class="subject form-item compact text-center"
                          style="appearance: none !important"
                          min="1"
                          v-model="item.quantity"
                          @input="
                            (evt) => {
                              if (evt.target < 1) item.quantity = 1;
                            }
                          "
                          @keypress="
                            (evt) => {
                              if (evt.key === '-') evt.preventDefault();
                            }
                          "
                        />
                        <button
                          class="addon icon of-mini button"
                          @click="item.quantity++"
                        >
                          <Icon name="material-symbols:add-rounded" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-wrap justify-between gap-3 items-center"
                  >
                    <div>
                      Amount:
                      <span class="font-bold h6 primary-text"
                        >₦{{
                          (item.price * item.quantity).toLocaleString()
                        }}</span
                      >
                    </div>
                    <div class="flex gap-2">
                      <button class="flat compact icon button">
                        <Icon
                          name="material-symbols:bookmark-add-outline-rounded"
                        />
                      </button>
                      <button
                        @click="cartStore.removeFromCart(item.id)"
                        class="flat compact icon button"
                      >
                        <Icon name="material-symbols:delete-outline-rounded" />
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <!-- checkout details -->
      <section
        class="page-sec2 desktop-screen-only"
        v-scrollPin="{
          top: 80,
          bottom: 64,
          breakpoints: [{ maxWidth: 863, pinnable: false }],
        }"
      >
        <div class="heading">Order Summary</div>
        <div class="flex flex-col gap-3">
          <div class="flex justify-between gap-2">
            <div>Subtotal</div>
            <div>
              ₦{{
                cartStore.items
                  .filter((item) => item.checked)
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toLocaleString()
              }}
            </div>
          </div>
          <div class="flex justify-between gap-2">
            <div>Delivery</div>
            <div>₦0</div>
          </div>
          <div class="flex justify-between gap-2">
            <div>Tax</div>
            <div>₦0</div>
          </div>
          <div class="flex justify-between gap-2 h6 font-bold">
            <div>Total</div>
            <div>
              ₦{{
                cartStore.items
                  .filter((item) => item.checked)
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toLocaleString()
              }}
            </div>
          </div>
          <div>
            <button class="primary w-full button">Checkout</button>
          </div>
        </div>
      </section>

      <!-- checkout details mobile -->
      <div
        class="mobile-screen-only sticky surface-bg w-full z-level-2 pin-bottom-blend"
        style="bottom: 0px"
      >
        <div
          class="container flex items-center gap-3"
          style="padding: 0.5rem 0rem"
        >
          <div class="flex flex-col">
            <div
              class="flat as-text mute-interaction button open-modal"
              data-target="checkout-details"
            >
              <Icon name="material-symbols:keyboard-arrow-down-rounded" />
              Checkout details
            </div>
            <LimbModal id="checkout-details">
              <div class="dialog bottom-sheet p-4">
                <div class="flex flex-col gap-3">
                  <div class="flex justify-between gap-2">
                    <div>Subtotal</div>
                    <div>
                      ₦{{
                        cartStore.items
                          .filter((item) => item.checked)
                          .reduce(
                            (acc, item) => acc + item.price * item.quantity,
                            0
                          )
                          .toLocaleString()
                      }}
                    </div>
                  </div>
                  <div class="flex justify-between gap-2">
                    <div>Delivery</div>
                    <div>₦0</div>
                  </div>
                  <div class="flex justify-between gap-2">
                    <div>Tax</div>
                    <div>₦0</div>
                  </div>
                  <div class="flex justify-between gap-2 h6 font-bold">
                    <div>Total</div>
                    <div>
                      ₦{{
                        cartStore.items
                          .filter((item) => item.checked)
                          .reduce(
                            (acc, item) => acc + item.price * item.quantity,
                            0
                          )
                          .toLocaleString()
                      }}
                    </div>
                  </div>
                  <div>
                    <button class="primary w-full button">Checkout</button>
                  </div>
                </div>
              </div>
            </LimbModal> 
            <div class="flex justify-between gap-2 h6 font-bold">
              <div>Total</div>
              <div>
                ₦{{
                  cartStore.items
                    .filter((item) => item.checked)
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                    .toLocaleString()
                }}
              </div>
            </div>
          </div>
          <button class="primary button flex-1">Checkout</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.page-cont {
  display: grid;
  grid-template-columns: 1fr 20rem;
  gap: 2rem;
  align-items: start;

  .page-sec1,
  .page-sec2 {
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .page-sec2 {
    border: 1px solid var(--outline);
    border-radius: var(--radius-inline);
    padding: 1rem;
  }
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
