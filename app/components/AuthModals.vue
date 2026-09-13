<script setup lang="ts">
const route = useRoute();
const auth = useAuth();
const signIn = useSignIn();
const signUp = useSignUp();
const status = ref<"" | "done" | "error" | "loading">("");
const errorMessage = ref<string>("");

async function submitLogin({ settings, exit }: Dialoger) {
  await signIn.validation.r$.$validate();
  if (signIn.validation.r$.$invalid) {
    await nextTick();
    (document.querySelector("#login-modal .form-item.error") as HTMLElement)?.focus();
    document
      .querySelector("#login-modal .form-item.error")
      ?.closest(".field")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  status.value = "loading";
  settings.dismissible = false;
  await auth.signIn.email(
    { ...signIn.data },
    {
      async onSuccess() {
        status.value = "done";
        settings.dismissible = true;
        if (route.path === "/") navigateTo("/home");
        await utils.delay(1000);
        exit();
      },
      onError(context) {
        status.value = "error";
        errorMessage.value = context.error.message;
        console.error("Login failed.", context.error);
        settings.dismissible = true;
      },
    },
  );
}
async function submitSignup({ settings, exit }: Dialoger) {
  await signUp.validation.r$.$validate();
  if (signUp.validation.r$.$invalid) {
    await nextTick();
    (document.querySelector("#register-modal .form-item.error") as HTMLElement)?.focus();
    document
      .querySelector("#register-modal .form-item.error")
      ?.closest(".field")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  status.value = "loading";
  settings.dismissible = false;
  await auth.signUp.email(
    {
      name: signUp.data.first_name,
      ...signUp.data,
    },
    {
      async onSuccess() {
        status.value = "done";
        settings.dismissible = true;
        navigateTo({ path: "/login", query: { redirect: route.path } });
        await utils.delay(1000);
        exit();
      },
      onError(context) {
        status.value = "error";
        errorMessage.value = context.error.message;
        console.error("Signup failed.", context.error);
        settings.dismissible = true;
      },
    },
  );
}
onMounted(() => {
  const loginModal = document.getElementById("login-modal");
  loginModal?.addEventListener("isComplete", () => {
    status.value = "";
    errorMessage.value = "";
    signIn.reset();
  });

  const registerModal = document.getElementById("register-modal");
  registerModal?.addEventListener("isComplete", () => {
    status.value = "";
    errorMessage.value = "";
    signUp.reset();
  });
});
</script>
<template>
  <LimbModal id="register-modal" v-slot="{ control }">
    <div class="dialog flex flex-col">
      <header class="flex gap-3 px-6 py-4">
        <div class="truncate font-bold">Join BizWorld</div>
        <button class="circular flat button as-text exit-modal" style="margin-left: auto">
          <Icon name="material-symbols:close-rounded" />
        </button>
      </header>
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div class="field">
          <button
            class="outlined button"
            @click="
              async () => {
                await auth.signIn.social({
                  provider: 'google',
                  callbackURL: route.fullPath === '/' ? '/home' : route.fullPath,
                });
              }
            "
          >
            <Icon name="material-icon-theme:google" />
            Continue with Google
          </button>
        </div>
        <div class="divider">or</div>
        <form @submit.prevent="submitSignup(control)">
          <div v-if="status === 'error'" class="error note mb-8">
            <Icon name="material-symbols:error-rounded" />
            {{ errorMessage }}
            <button type="button" class="exit-note" @click="errorMessage = ''">
              <Icon name="material-symbols:close-small-rounded" />
            </button>
          </div>
          <div class="field m-0">
            <label>Names</label>
            <div class="2-fields">
              <div class="field">
                <input
                  v-model="signUp.data.first_name"
                  name="signup-firstname"
                  class="form-item"
                  :class="{ error: signUp.validation.r$.first_name.$error }"
                  type="text"
                  placeholder="First name"
                />
                <div
                  v-for="error of signUp.validation.r$.first_name.$errors"
                  :key="error"
                  class="text-error text-sm"
                >
                  <Icon name="material-symbols:error-rounded" />
                  {{ error }}
                </div>
              </div>
              <div class="field">
                <input
                  v-model="signUp.data.last_name"
                  name="signup-lastname"
                  class="form-item"
                  :class="{ error: signUp.validation.r$.last_name.$error }"
                  type="text"
                  placeholder="Last name"
                />
                <div
                  v-for="error of signUp.validation.r$.last_name.$errors"
                  :key="error"
                  class="text-error text-sm"
                >
                  <Icon name="material-symbols:error-rounded" />
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <input
              v-model="signUp.data.email"
              name="signup-email"
              class="form-item"
              :class="{ error: signUp.validation.r$.email.$error }"
              type="text"
              placeholder="Email address"
            />
            <div
              v-for="error of signUp.validation.r$.email.$errors"
              :key="error"
              class="text-error text-sm"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label>Password</label>
            <input
              v-model="signUp.data.password"
              name="signup-password"
              class="form-item"
              :class="{ error: signUp.validation.r$.password.$error }"
              type="password"
              placeholder="Password"
            />
            <div
              v-for="error of signUp.validation.r$.password.$errors"
              :key="error"
              class="text-error text-sm"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <p>
            By signing up, you agree to our <a href="#">terms of use</a> &
            <a href="#">privacy policy</a>
          </p>

          <div class="field">
            <button
              class="primary button"
              :class="{ loading: status === 'loading' }"
              :disabled="status === 'loading'"
            >
              Create Account
            </button>
          </div>
        </form>
        <hr />
        <p class="text-center">
          Already have an account?
          <button class="link open-modal exit-modal" data-target="login-modal">Login</button>
        </p>
      </div>
      <div class="bg-overlay absolute inset-0" :class="{ hidden: status !== 'loading' }">
        <div class="progress-bar compact absolute right-0 bottom-0 left-0">
          <div class="indeterminate"></div>
        </div>
      </div>
    </div>
  </LimbModal>
  <LimbModal id="login-modal" v-slot="{ control }">
    <div class="dialog flex max-w-125 flex-col">
      <header class="flex gap-3 px-6 py-4">
        <div class="truncate font-bold">Login to BizWorld</div>
        <button class="circular flat button as-text exit-modal" style="margin-left: auto">
          <Icon name="material-symbols:close-rounded" />
        </button>
      </header>
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div class="field">
          <button
            class="outlined button"
            @click="
              async () => {
                await auth.signIn.social({
                  provider: 'google',
                  callbackURL: route.fullPath === '/' ? '/home' : route.fullPath,
                });
              }
            "
          >
            <Icon name="material-icon-theme:google" />
            Continue with Google
          </button>
        </div>
        <div class="divider">or</div>
        <form @submit.prevent="submitLogin(control)">
          <div v-if="status === 'error'" class="error note mb-8">
            {{ errorMessage }}
            <button type="button" class="exit-note" @click="status = ''">
              <Icon name="material-symbols:close-small-rounded" />
            </button>
          </div>
          <div class="field">
            <label>Email</label>
            <input
              v-model="signIn.data.email"
              name="login-email"
              class="form-item"
              :class="{ error: signIn.validation.r$.email.$error }"
              type="text"
              placeholder="Email address"
            />
            <div
              class="text-error text-sm"
              v-for="error of signIn.validation.r$.email.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label>Password</label>
            <input
              v-model="signIn.data.password"
              name="login-password"
              class="form-item"
              :class="{ error: signIn.validation.r$.password.$error }"
              type="password"
              placeholder="Password"
            />
            <div
              class="text-error text-sm"
              v-for="error of signIn.validation.r$.password.$errors"
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
        <p class="text-center">
          New to BizWorld?
          <button class="link open-modal exit-modal" data-target="register-modal">Sign up</button>
        </p>
      </div>
      <div class="bg-overlay absolute inset-0" :class="{ hidden: status !== 'loading' }">
        <div class="progress-bar compact absolute right-0 bottom-0 left-0">
          <div class="indeterminate"></div>
        </div>
      </div>
    </div>
  </LimbModal>
</template>
