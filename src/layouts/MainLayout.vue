<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>VUestionnaire</q-toolbar-title>
        <q-tabs v-model="selectedTab">
          <q-tab name="users" label="view users" />
          <q-tab name="create_project" label="new project" />
          <q-tab name="view_projects" label="view projects" />
        </q-tabs>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  components: {},
  setup() {
    return {
      selectedTab: ref("users"),
    };
  },
});
</script>
