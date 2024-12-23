<script setup>
const userStore = useUserStore();
</script>

<template>
  <header>
    <div class="menu" style="height: 64px;">
      <div class="container items auto-margined" style="border-radius: var(--default-radius)">
        <div class="item as-icon open-sidepanel" v-tooltip.unblocking data-tooltip="Menu" data-target="msidepanel">
          <SvgIcon name="menu" />
        </div>
        <router-link :to="userStore.auth ? '/home' : '/'" class="xhover item as-icon">
          <img src="/images/logo_sqr.png" alt="site logo" class="logo-lg site-logo">
        </router-link>
      </div>
    </div>
  </header>

  <div class="flexbox flex-items-to-basis" style="gap: 1.5rem; max-width: 650px; margin: 2rem auto;">
    <div class="col" style="background-image: linear-gradient(rgb(48 187 48), rgb(10 81 194));"></div>
    <div class="col">
      <div class="header" style="margin-bottom: 1rem;">
        <div class="bold">
          Join BizWorld
        </div>
      </div>
      <div class="content">
        <div class="field">
          <button class="fluid button">
            <SvgIcon name="login" />
            Continue with Google
          </button>
        </div>
        <form @submit.prevent="userStore.signup()">
          <div class="field 0-margined">
            <label>Names</label>
            <div class="2-fields">
              <div class="field">
                <input class="form-item" type="text" placeholder="First name" />
              </div>
              <div class="field">
                <input class="form-item" type="text" placeholder="Last name" />
              </div>
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <input class="form-item" type="text" placeholder="Email address" />
          </div>
          <div class="field">
            <label>Password</label>
            <input class="form-item" type="text" placeholder="Password" />
          </div>
          <div class="field">
            <label>Country</label>
            <input class="form-item" type="text" placeholder="Select country" />
          </div>
          <div class="field">
            <p>By signing up, you agree to our <a href="#">terms of use</a> & <a href="#">privacy policy</a></p>
            <button class="fluid primary button">Create Account</button>
          </div>
          <hr />
          <div class="field centered">
            <p>Already have an account? <router-link to="/login">Login</router-link></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style></style>