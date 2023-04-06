<template>
  <q-page class="q-pa-md">
    <q-toolbar>
      <q-toolbar-title>{{ mode }} {{ id }}</q-toolbar-title>
    </q-toolbar>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="username"
        label="username *"
        hint="username"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="fullName"
        label="Full Name *"
        hint="Name and surname"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        v-model="email"
        type="email"
        label="e-mail *"
        hint="type email"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        v-model="companyName"
        label="Company Name *"
        hint="copmany name"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-select
        filled
        v-model="role"
        label="Role *"
        :options="roles"
        emit-value
        map-options
      />
      <q-checkbox
        v-if="role !== 'admin'"
        v-model="allowLogin"
        label="Allow login"
      />

      <template v-if="role === 'client'">
        <q-select
          filled
          v-model="project"
          label="Project *"
          :options="projects"
          multiple
          emit-value
          map-options
          option-value="name"
          option-label="name"
        />
      </template>

      <q-input
        filled
        v-model="password"
        type="password"
        label="password *"
        hint="Type a secure password 8+ characters"
        lazy-rules
        :rules="[(val) => (val && val.length > 7) || 'Please type something']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import useQuasar from "quasar/src/composables/use-quasar.js";
import { ref } from "vue";

export default {
  props: {
    mode: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
  },
  setup() {
    const $q = useQuasar();
    const username = ref(null);
    const fullName = ref(null);
    const email = ref(null);
    const companyName = ref(null);
    const password = ref(null);
    const role = ref(null);
    const allowLogin = ref(false);
    const project = ref([]);
    const projects = [{ name: "test1" }, { name: "test2" }, { name: "test3" }];

    const roles = [
      { label: "admin", value: "admin" },
      { label: "client", value: "client" },
    ];

    return {
      username,
      fullName,
      email,
      companyName,
      password,
      role,
      roles,
      allowLogin,
      project, // add project ref
      projects, // add projects options

      onSubmit() {
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Submitted",
        });
      },

      onReset() {
        username.value = null;
        fullName.value = null;
        email.value = null;
        companyName.value = null;
        password.value = null;
        project.value = []; // add project reset
      },
    };
  },
};
</script>
