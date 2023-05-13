<template>
  <div class="fixed-center">
    <h4>VUestionnaire</h4>
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 500px">
        <q-input outlined v-model="username" label="username *" />
        <q-input
          outlined
          v-model="password"
          type="password"
          label="password *"
        />
      </div>
      <div class="q-pa-md q-gutter-sm">
        <q-btn color="blue" text-color="white" label="Login" @click="login" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/appStore";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    redirect: {
      type: String,
      default: "/",
    },
  },
  setup(props) {
    const { redirect } = toRefs(props);
    console.log("Redirection: " + redirect?.value);
    const username = ref("admin");
    const password = ref("pass");
    const router = useRouter();
    const store = useAppStore();

    const login = () => {
      // Call authenticate with the value properties of username and password
      if (store.authenticate(username.value, password.value)) {
        console.log("Navigating");
        router.replace(redirect?.value ?? "/");
      }
    };

    return {
      login,
      username,
      password,
    };
  },
});
</script>
