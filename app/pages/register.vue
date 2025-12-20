<script setup>
const userStore = useUserStore();
</script>

<template>
  <header>
    <div class="menu" style="height: 64px">
      <div
        class="container items m-auto"
        style="border-radius: var(--default-radius)"
      >
        <div
          class="item as-icon open-sidepanel"
          v-tooltip:aria.unblocking
          aria-label="Menu"
          data-target="msidepanel"
        >
          <SvgIcon name="menu" />
        </div>
        <NuxtLink
          :to="userStore.auth ? '/home' : '/'"
          class="xhover item as-icon"
        >
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

  <div
    class="flex *:flex-1"
    style="gap: 1.5rem; max-width: 650px; margin: 2rem auto"
  >
    <div
      class="col"
      style="background-image: linear-gradient(rgb(48 187 48), rgb(10 81 194))"
    ></div>
    <div class="col">
      <div class="header" style="margin-bottom: 1rem">
        <div class="font-bold">Join BizWorld</div>
      </div>
      <div class="content">
        <div class="field">
          <button class="w-full button">
            <SvgIcon name="login" />
            Continue with Google
          </button>
        </div>
        <form @submit.prevent="userStore.signup()">
          <div class="field m-0">
            <label>Names</label>
            <div class="2-fields">
              <div class="field">
                <input
                  class="form-item w-full"
                  type="text"
                  placeholder="First name"
                />
              </div>
              <div class="field">
                <input
                  class="form-item w-full"
                  type="text"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <input
              class="form-item w-full"
              type="text"
              placeholder="Email address"
            />
          </div>
          <div class="field">
            <label>Password</label>
            <input class="form-item w-full" type="text" placeholder="Password" />
          </div>
          <div class="field">
            <label>Country</label>
            <input
              class="form-item w-full"
              type="text"
              placeholder="Select country"
            />
          </div>
          <p>
            By signing up, you agree to our <a href="#">terms of use</a> &
            <a href="#">privacy policy</a>
          </p>

          <div class="field">
            <button class="w-full primary button">Create Account</button>
          </div>
          <hr />
          <p>
            Already have an account?
            <NuxtLink to="/login">Login</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style></style>
