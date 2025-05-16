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
            class="sticky z-level-3"
            style="
              top: 64px;
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
                <div class="flexbox guttered">
                  <div class="flex-none">
                    <img class="image thumbnail" :src="item.media" />
                  </div>
                  <div class="flexible">
                    <div class="heading truncate" style="--line-clamp: 2">
                      {{ item.title }}
                    </div>
                    <div
                      class="flexbox flex-separate flex-wrap guttered align-center mini"
                    >
                      <a
                        :href="item.bizData.bizUrl"
                        class="semibold truncate"
                        >{{ item.bizData.bizName }}</a
                      >
                      <div
                        class="flexbox flex-wrap sm-guttered"
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
                <div class="flexbox flex-column sm-guttered">
                  <div
                    class="flexbox flex-wrap flex-separate guttered small semibold"
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
                    class="flexbox flex-wrap flex-separate guttered align-center"
                  >
                    <div>
                      Amount:
                      <span class="bold h6 primary-text"
                        >₦{{
                          (item.price * item.quantity).toLocaleString()
                        }}</span
                      >
                    </div>
                    <div class="flexbox sm-guttered">
                      <button class="flat compact icon button">
                        <Icon
                          name="material-symbols:bookmark-add-outline-rounded"
                        />
                      </button>
                      <button @click="cartStore.removeFromCart(item.id)" class="flat compact icon button">
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
      <section
        class="page-sec2 desktop-screen-only"
        v-scrollPin="{
          top: 80,
          bottom: 64,
          breakpoints: [{ maxWidth: 863, pinnable: false }],
        }"
      >
        <div class="heading">Order Summary</div>
        <div class="flexbox flex-column guttered">
          <div class="flexbox flex-separate sm-guttered">
            <div>Subtotal</div>
            <div>
              ₦{{
                cartStore.items.filter((item) => item.checked)
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toLocaleString()
              }}
            </div>
          </div>
          <div class="flexbox flex-separate sm-guttered">
            <div>Delivery</div>
            <div>₦0</div>
          </div>
          <div class="flexbox flex-separate sm-guttered">
            <div>Tax</div>
            <div>₦0</div>
          </div>
          <div class="flexbox flex-separate sm-guttered h6 bold">
            <div>Total</div>
            <div>
              ₦{{
                cartStore.items.filter((item) => item.checked)
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toLocaleString()
              }}
            </div>
          </div>
          <div>
            <button class="primary fluid button">Checkout</button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
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
    border-radius: var(--comp-radius);
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
