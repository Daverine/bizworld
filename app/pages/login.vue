<script lang="ts" setup>
const auth = useAuth();
const callbackURL = (useRoute().query.redirect as string) || "/home";
const { data, validation } = useSignIn();
const status = ref<"" | "done" | "error" | "loading">("");
const errorMessage = ref<string>("");

async function submitLogin() {
  await validation.r$.$validate();
  if (validation.r$.$invalid) {
    await nextTick();
    (document.querySelector(".form-item.error") as HTMLElement)?.focus();
    document
      .querySelector(".form-item.error")
      ?.closest(".field")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  status.value = "loading";
  await auth.signIn.email(
    {
      ...data,
    },
    {
      async onSuccess() {
        status.value = "done";
        navigateTo(callbackURL, { replace: true });
      },
      onError(context) {
        status.value = "error";
        errorMessage.value = context.error.message;
        console.error("Login failed.", context.error);
      },
    },
  );
}
</script>

<template>
  <header>
    <div class="menu" style="height: 64px">
      <div class="auto-contain items m-auto max-w-6xl" style="border-radius: var(--default-radius)">
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
  <section class="auto-contain my-8 max-w-150">
    <header class="mb-12 text-center">
      <h5>Login to BizWorld</h5>
    </header>
    <div class="flex gap-6 *:flex-1">
      <div
        class="col"
        style="background-image: linear-gradient(rgb(48 187 48), rgb(10 81 194))"
      ></div>
      <div class="col relative flex flex-col py-8">
        <div class="content">
          <div class="field">
            <button
              class="outlined button"
              @click="
                async () => {
                  await auth.signIn.social({
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
          <form @submit.prevent="submitLogin">
            <div v-if="status === 'error'" class="error note mb-8">
              {{ errorMessage }}
              <button type="button" class="exit-note" @click="errorMessage = ''">
                <Icon name="material-symbols:close-small-rounded" />
              </button>
            </div>
            <div class="field">
              <label>Email</label>
              <input
                v-model="data.email"
                name="login-email"
                class="form-item"
                :class="{ error: validation.r$.email.$error }"
                type="text"
                placeholder="Email address"
              />
              <div
                class="text-error text-sm"
                v-for="error of validation.r$.email.$errors"
                :key="error"
              >
                <Icon name="material-symbols:error-rounded" />
                {{ error }}
              </div>
            </div>
            <div class="field">
              <label>Password</label>
              <input
                v-model="data.password"
                name="login-password"
                class="form-item"
                :class="{ error: validation.r$.password.$error }"
                type="password"
                placeholder="Password"
              />
              <div
                class="text-error text-sm"
                v-for="error of validation.r$.password.$errors"
                :key="error"
              >
                <Icon name="material-symbols:error-rounded" />
                {{ error }}
              </div>
            </div>
            <div class="field">
              <button
                class="primary button"
                :class="{ loading: status === 'loading' }"
                :disabled="status === 'loading'"
              >
                Continue
              </button>
            </div>
            <hr />
          </form>
          <p class="text-center">New to BizWorld? <NuxtLink to="/signup">Sign up</NuxtLink></p>
        </div>
        <div class="bg-overlay absolute inset-0" :class="{ hidden: status !== 'loading' }">
          <div class="progress-bar compact absolute right-0 bottom-0 left-0">
            <div class="indeterminate"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
