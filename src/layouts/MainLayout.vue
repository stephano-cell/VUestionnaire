<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>VUestionnaire</q-toolbar-title>
        <q-space />
        <q-btn outline @click="logout">Logout</q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/appStore";

export default defineComponent({
  name: "MainLayout",
  components: {},
  setup() {
    const store = useAppStore();
    const router = useRouter();

    const logout = () => {
      store.logout();
      router.replace("/login");
    };
    return { logout };
  },
});
</script>
