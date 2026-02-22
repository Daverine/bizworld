import { createAuthClient } from 'better-auth/vue'; // make sure to import from better-auth/vue
import { required, email, minLength } from '@regle/rules';

export const useAuth = () => {
  return createAuthClient();
};

export const useSignIn = (callbackURL: string) => {
  const data = reactive({
    email: '',
    password: '',
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
  const status = reactive<{ isLoading: boolean; error: any; success: boolean }>(
    {
      isLoading: false,
      error: null,
      success: false,
    },
  );

  async function submit() {
    validation.r$.$validate();
    if (validation.r$.$invalid) {
      await nextTick();
      (document.querySelector('.error') as HTMLElement)?.focus();
      document
        .querySelector('.error')
        ?.closest('.field')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    useAuth().signIn.email(
      {
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
    status,
  };
};

export const useSignUp = (callbackURL: string = '/home') => {
  const data = reactive({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const validation = useRegle(data, {
    firstname: {
      required,
    },
    lastname: {
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
  const status = reactive<{ isLoading: boolean; error: any; success: boolean }>(
    {
      isLoading: false,
      error: null,
      success: false,
    },
  );
  async function submit() {
    validation.r$.$validate();
    if (validation.r$.$invalid) {
      await nextTick();
      (document.querySelector('.error') as HTMLElement)?.focus();
      document
        .querySelector('.error')
        ?.closest('.field')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    useAuth().signUp.email(
      {
        name: `${data.firstname} ${data.lastname}`,
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
    status,
  };
};
