<script lang="ts" setup>
const callbackURL = (useRoute().query.redirect as string) || "/home";
const { data, validation, submit, status } = useSignIn(callbackURL);
</script>

<template>
  <header>
    <div class="menu" style="height: 64px">
      <div class="max-w-6xl auto-contain items m-auto" style="border-radius: var(--default-radius)">
        <div
          class="item as-icon open-sidepanel"
          v-tooltip:aria.unblocking
          aria-label="Menu"
          data-target="msidepanel"
        >
          <SvgIcon name="menu" />
        </div>
        <NuxtLink to="/" class="xhover item as-icon">
          <NuxtImg
            preset="logo"
            src="/images/logo_sqr.png"
            alt="site logo"
            class="logo-lg site-logo"
          />
        </NuxtLink>
      </div>
    </div>
  </header>
  <section class="max-w-150 auto-contain my-8">
    <header class="text-center mb-12">
      <h5>Login to BizWorld</h5>
    </header>
    <div class="flex *:flex-1 gap-6">
      <div
        class="col"
        style="background-image: linear-gradient(rgb(48 187 48), rgb(10 81 194))"
      ></div>
      <div class="col flex flex-col py-8">
        <div class="content">
          <div class="field">
            <button
              class="outlined button"
              @click="
                async () => {
                  await useAuth().signIn.social({
                    provider: 'google',
                    callbackURL,
                  });
                }
              "
            >
              <Icon name="material-icon-theme:google" />
              Continue with Google
            </button>
          </div>
          <div class="divider">or</div>
          <form @submit.prevent="submit">
            <div v-if="status.error" class="error note mb-8">
              {{ status.error.message }}
              <button type="button" class="exit-note" @click="status.error = null">
                <Icon name="material-symbols:close-small-rounded" />
              </button>
            </div>
            <div class="field">
              <label>Email</label>
              <input
                v-model="data.email"
                class="form-item"
                :class="{ error: validation.r$.email.$error }"
                type="text"
                placeholder="Email address"
              />
              <div
                class="text-sm text-error"
                v-for="error of validation.r$.email.$errors"
                :key="error"
              >
                <Icon name="material-symbols:warning-outline-rounded" />
                {{ error }}
              </div>
            </div>
            <div class="field">
              <label>Password</label>
              <input
                v-model="data.password"
                class="form-item"
                :class="{ error: validation.r$.password.$error }"
                type="password"
                placeholder="Password"
              />
              <div
                class="text-sm text-error"
                v-for="error of validation.r$.password.$errors"
                :key="error"
              >
                <Icon name="material-symbols:warning-outline-rounded" />
                {{ error }}
              </div>
            </div>
            <div class="field">
              <button
                class="primary button"
                :class="{ loading: status.isLoading }"
                :disabled="status.isLoading"
              >
                Continue
              </button>
            </div>
            <hr />
          </form>
          <p class="text-center">New to BizWorld? <NuxtLink to="/signup">Sign up</NuxtLink></p>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
