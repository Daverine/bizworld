import { inferAdditionalFields } from "better-auth/client/plugins";
import { required, email, minLength } from "@regle/rules";
import { createAuthClient } from "better-auth/vue";
import type { RouteLocationRaw } from "vue-router";

export function useAuth() {
  const url = useRequestURL();
  const headers = import.meta.server ? useRequestHeaders() : undefined;

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: {
      headers,
    },
    plugins: [inferAdditionalFields<typeof auth>()],
  });

  const session = useState<typeof client.$Infer.Session.session | null>("auth:session", () => null);
  const user = useState<typeof client.$Infer.Session.user | null>("auth:user", () => null);
  const sessionFetching = import.meta.server
    ? ref(false)
    : useState("auth:sessionFetching", () => false);

  const fetchSession = async () => {
    if (sessionFetching.value) {
      return;
    }
    sessionFetching.value = true;
    const { data } = await client.getSession({
      fetchOptions: {
        headers,
      },
    });
    session.value = data?.session || null;
    user.value = data?.user || null;
    sessionFetching.value = false;
    return data;
  };

  if (import.meta.client) {
    client.$store.listen("$sessionSignal", async (signal) => {
      if (!signal) return;
      await fetchSession();
    });
  }

  return {
    session,
    user,
    loggedIn: computed(() => !!session.value),
    signIn: client.signIn,
    signUp: client.signUp,
    async signOut({ redirectTo }: { redirectTo?: RouteLocationRaw } = { redirectTo: "/" }) {
      const route = useRoute();
      const res = await client.signOut();
      session.value = null;
      user.value = null;
      if (route.meta.auth && redirectTo) {
        await navigateTo(redirectTo);
      }
      return res;
    },
    fetchSession,
    client,
  };
}

export const useSignIn = () => {
  const data = reactive({
    email: "",
    password: "",
  });
  const validation = useRegle(data, {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
  });

  function reset() {
    data.email = "";
    data.password = "";
    validation.r$.$reset();
  }

  return {
    data,
    validation,
    reset,
  };
};

export const useSignUp = (callbackURL: string = "/home") => {
  const data = reactive({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const validation = useRegle(data, {
    first_name: {
      required,
    },
    last_name: {
      required,
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
  });

  function reset() {
    data.first_name = "";
    data.last_name = "";
    data.email = "";
    data.password = "";
    validation.r$.$reset();
  }
  const status = reactive<{ isLoading: boolean; error: any; success: boolean }>({
    isLoading: false,
    error: null,
    success: false,
  });

  async function submit() {
    await validation.r$.$validate();
    if (validation.r$.$invalid) {
      await nextTick();
      (document.querySelector(".error") as HTMLElement)?.focus();
      document
        .querySelector(".error")
        ?.closest(".field")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    await useAuth().signUp.email(
      {
        name: data.first_name,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        callbackURL,
      },
      {
        onRequest() {
          status.isLoading = true;
          status.error = null;
        },
        onSuccess() {
          status.isLoading = false;
          status.success = true;
        },
        onError(context) {
          status.isLoading = false;
          status.error = context.error;
        },
      },
    );
  }

  return {
    data,
    validation,
    submit,
    reset,
    status,
  };
};
