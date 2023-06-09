<template>
  <q-page class="q-pa-md">
    <q-toolbar>
      <q-toolbar-title>{{ mode }} {{ username }}</q-toolbar-title>
    </q-toolbar>
    <q-form class="q-gutter-md">
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
          option-value="projectName"
          option-label="projectName"
          filter
          filter-placeholder="Search projects"
        />
      </template>
    </q-form>
  </q-page>
</template>
<script>
import { computed, ref } from "vue";
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

    const username = ref(null);
    const fullName = ref(null);
    const email = ref(null);
    const companyName = ref(null);
    const password = ref(null);
    const role = ref(null);
    const allowLogin = ref(false);
    const project = ref([]);

    const sortedProjects = computed(() => {
      return [...store.projectData].sort((a, b) =>
        a.projectName.localeCompare(b.projectName)
      );
    });

    const roles = [
      { label: "admin", value: "admin" },
      { label: "client", value: "client" },
    ];

    if (props.mode === "edit" && props.id) {
      const user = store.usersData.find((user) => user.id === props.id);
      if (user) {
        username.value = user.username;
        fullName.value = user.fullName;
        email.value = user.email;
        companyName.value = user.companyName;
        role.value = user.role;
        allowLogin.value = user.allowLogin;
        project.value = user.project;
      }
    }

    if (props.mode === "new") {
      store.installActions([
        {
          label: "Insert",
          callback: () => {
            const userId = v4(); // Generate a UUID for the new user

            // Insert the new user
            store.insertNewUser({
              id: userId,
              username: username.value,
              fullName: fullName.value,
              email: email.value,
              companyName: companyName.value,
              password: password.value,
              project: project.value,
              role: role.value,
              allowLogin: allowLogin.value,
            });

            // If the new user is a client, add the user to the clients array of the selected projects
            if (role.value === "client") {
              project.value.forEach((projectName) => {
                const project = store.projectData.find(
                  (p) => p.projectName === projectName
                );
                if (project) {
                  project.clients.push({
                    id: userId,
                    fullName: email.value,
                  });
                }
              });
              // Update the projects in local storage
              store.updateProjects(store.projectData);
              store.updateUsers(store.usersData);
            }

            router.back();
          },
        },
      ]);
    } else if (props.mode === "edit") {
      store.installActions([
        {
          label: "Save",
          callback: () => {
            // Get the original user
            const originalUser = store.usersData.find(
              (user) => user.id === props.id
            );

            const updatedUser = {
              id: props.id,
              username: username.value,
              fullName: fullName.value,
              email: email.value,
              companyName: companyName.value,
              password: password.value,
              role: role.value,
              allowLogin: allowLogin.value,
              project: project.value,
            };
            const userIndex = store.usersData.findIndex(
              (user) => user.id === props.id
            );
            if (userIndex !== -1) {
              store.usersData[userIndex] = updatedUser;

              // If the updated user is a client, update the clients array of the selected projects
              if (role.value === "client") {
                // First, remove the user from the clients array of all projects
                store.projectData.forEach((project) => {
                  const clientIndex = project.clients.findIndex(
                    (client) => client.id === props.id
                  );
                  if (clientIndex !== -1) {
                    project.clients.splice(clientIndex, 1);
                  }
                });
                // Then, add the user to the clients array of the selected projects
                project.value.forEach((projectName) => {
                  const project = store.projectData.find(
                    (p) => p.projectName === projectName
                  );
                  if (project) {
                    project.clients.push({ id: props.id, email: email.value });
                  }
                });
              }

              // If the user's role has changed from 'client' to 'admin', remove the user from the clients array of all projects
              if (originalUser.role === "client" && role.value === "admin") {
                store.projectData.forEach((project) => {
                  const clientIndex = project.clients.findIndex(
                    (client) => client.id === props.id
                  );
                  if (clientIndex !== -1) {
                    project.clients.splice(clientIndex, 1);
                  }
                });
              }

              // Update the projects and users in the store
              store.updateProjects(store.projectData);
              store.updateUsers(store.usersData);

              router.back();
            }
          },
        },
      ]);
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
      sortedProjects,
    };
  },
};
</script>
