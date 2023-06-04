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

      <q-input
        filled
        v-model="password"
        type="password"
        label="password *"
        hint="Type a secure password 8+ characters"
        lazy-rules
        :rules="[(val) => (val && val.length > 7) || 'Please type something']"
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
          label="Project"
          :options="sortedProjects"
          multiple
          emit-value
          map-options
          option-value="name"
          option-label="name"
          filter
          filter-placeholder="Search projects"
        />
      </template>
    </q-form>
  </q-page>
</template>

<script>
import { computed, ref } from "vue";
import useQuasar from "quasar/src/composables/use-quasar.js";
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "vue-router";
import { v4 } from "uuid";
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
  setup(props) {
    const store = useAppStore();
    const router = useRouter();
    const $q = useQuasar();
    const username = ref(null);
    const fullName = ref(null);
    const email = ref(null);
    const companyName = ref(null);
    const password = ref(null);
    const role = ref(null);
    const allowLogin = ref(false);
    const project = ref([]);
    const projects = [
      { name: "astesttest1" },
      { name: "stephanos" },
      { name: "aristos" },
      { name: "spiderman" },
    ];
    const sortedProjects = computed(() => {
      return [...projects].sort((a, b) => a.name.localeCompare(b.name));
    });

    const roles = [
      { label: "admin", value: "admin" },
      { label: "client", value: "client" },
    ];

    console.log(props);
    if (props.mode == "new") {
      store.installActions([
        {
          label: "Insert",
          callback: () => {
            // TODO: Check all data
            store.insertNewUser({
              id: v4(),
              username: username.value,
              fullName: fullName.value,
              email: email.value,
              companyName: companyName.value,
              password: password.value,
              project: project.value,
            });
            router.back();
          },
        },
      ]);
    } else if (props.mode == "edit") {
      // TODO: get data
      store.installActions([{ label: "Save", callback: () => {} }]);
    }

    return {
      username,
      fullName,
      email,
      companyName,
      password,
      role,
      roles,
      allowLogin,
      project,
      sortedProjects, // use sortedProjects instead of projects
    };
  },
};
</script>
