<template>
  <q-page class="flex flex-center">
    <q-tabs v-model="selectedTab">
      <q-tab name="users"
        ><q-icon color="orange" name="face" size="20em" />
        Clients
      </q-tab>
      <q-tab name="projects"
        ><q-icon color="green" name="edit_document" size="20em" />
        Projects
      </q-tab>
      <q-tab name="questions"
        ><q-icon color="blue" name="quiz" size="20em" />
        Questions
      </q-tab>
    </q-tabs>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>

<style>
.mainMenu {
  font-size: 32 pt !important;
}
</style>
