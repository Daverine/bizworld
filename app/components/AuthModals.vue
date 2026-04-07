<script setup lang="ts">
const callbackURL = useRoute().fullPath === '/' ? '/home' : useRoute().fullPath;
const login = useSignIn(callbackURL);
const signup = useSignUp(callbackURL);
</script>
<template>
  <LimbModal id="register-modal">
    <div class="dialog">
      <div class="header flex gap-3">
        <div class="font-bold truncate">Join BizWorld</div>
        <button
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </div>
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
        <form @submit.prevent="signup.submit">
          <div v-if="signup.status.error" class="error note mb-8">
            {{ signup.status.error.message }}
            <button
              type="button"
              class="exit-note"
              @click="signup.status.error = null"
            >
              <Icon name="material-symbols:close-small-rounded" />
            </button>
          </div>
          <div class="field m-0">
            <label>Names</label>
            <div class="2-fields">
              <div class="field">
                <input
                  v-model="signup.data.firstname"
                  class="form-item"
                  :class="{ error: signup.validation.r$.firstname.$error }"
                  type="text"
                  placeholder="First name"
                />
                <div
                  v-for="error of signup.validation.r$.firstname.$errors"
                  :key="error"
                  class="text-sm error-text"
                >
                  <Icon name="material-symbols:warning-outline-rounded" />
                  {{ error }}
                </div>
              </div>
              <div class="field">
                <input
                  v-model="signup.data.lastname"
                  class="form-item"
                  :class="{ error: signup.validation.r$.lastname.$error }"
                  type="text"
                  placeholder="Last name"
                />
                <div
                  v-for="error of signup.validation.r$.lastname.$errors"
                  :key="error"
                  class="text-sm error-text"
                >
                  <Icon name="material-symbols:warning-outline-rounded" />
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <input
              v-model="signup.data.email"
              class="form-item"
              :class="{ error: signup.validation.r$.email.$error }"
              type="text"
              placeholder="Email address"
            />
            <div
              v-for="error of signup.validation.r$.email.$errors"
              :key="error"
              class="text-sm error-text"
            >
              <Icon name="material-symbols:warning-outline-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label>Password</label>
            <input
              v-model="signup.data.password"
              class="form-item"
              :class="{ error: signup.validation.r$.password.$error }"
              type="password"
              placeholder="Password"
            />
            <div
              v-for="error of signup.validation.r$.password.$errors"
              :key="error"
              class="text-sm error-text"
            >
              <Icon name="material-symbols:warning-outline-rounded" />
              {{ error }}
            </div>
          </div>
          <p>
            By signing up, you agree to our <a href="#">terms of use</a> &
            <a href="#">privacy policy</a>
          </p>

          <div class="field">
            <button class="primary button">Create Account</button>
          </div>
        </form>
        <hr />
        <p class="text-center">
          Already have an account?
          <NuxtLink to="/login">Login</NuxtLink>
        </p>
      </div>
    </div>
  </LimbModal>
  <LimbModal id="login-modal">
    <div class="dialog max-w-125">
      <div class="header flex gap-3">
        <div class="font-bold truncate">Login to BizWorld</div>
        <button
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </div>
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
        <form @submit.prevent="login.submit">
          <div v-if="login.status.error" class="error note mb-8">
            {{ login.status.error.message }}
            <button
              type="button"
              class="exit-note"
              @click="login.status.error = null"
            >
              <Icon name="material-symbols:close-small-rounded" />
            </button>
          </div>
          <div class="field">
            <label>Email</label>
            <input
              v-model="login.data.email"
              class="form-item"
              :class="{ error: login.validation.r$.email.$error }"
              type="text"
              placeholder="Email address"
            />
            <div
              class="text-sm error-text"
              v-for="error of login.validation.r$.email.$errors"
              :key="error"
            >
              <Icon name="material-symbols:warning-outline-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label>Password</label>
            <input
              v-model="login.data.password"
              class="form-item"
              :class="{ error: login.validation.r$.password.$error }"
              type="password"
              placeholder="Password"
            />
            <div
              class="text-sm error-text"
              v-for="error of login.validation.r$.password.$errors"
              :key="error"
            >
              <Icon name="material-symbols:warning-outline-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <button
              class="primary button"
              :class="{ loading: login.status.isLoading }"
              :disabled="login.status.isLoading"
            >
              Continue
            </button>
          </div>
          <hr />
        </form>
        <p class="text-center">
          New to BizWorld? <NuxtLink to="/signup">Sign up</NuxtLink>
        </p>
      </div>
    </div>
  </LimbModal>
</template>
