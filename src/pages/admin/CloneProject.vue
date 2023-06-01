<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input filled v-model="text" label="New Project Name" />
    </div>
  </div>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        :options="options"
        label="Existing Project"
      />
    </div>
  </div>
  <div class="q-pa-md q-gutter-sm">
    <q-btn color="primary" label="Submit" />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      text: ref(""),
      model: ref(null),
      options: ["Google", "Facebook", "Twitter", "Apple", "Oracle"],
    };
  },
};
</script>
