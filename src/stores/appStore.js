import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
// This stores the state of the entire app, specific features use their own stores
export const useAppStore = defineStore("appStore", {
  state: () => ({
    dynamicActions: [], // special: this has no storage, each page sets its actions
    auth: LocalStorage.getItem("auth") || null, // get auth from local storage
    usersData: LocalStorage.getItem("users") || [], // get users from local storage
    groupsData: LocalStorage.getItem("groups") || [], // get groups from local storage
    projectData: LocalStorage.getItem("projects") || [], // get projects from local storage
  }),
  getters: {
    getActions() {
      var id = 1;
      const actions =
        this.dynamicActions?.map((a) => {
          a.id = id++;
          return a;
        }) ?? [];
      return actions;
    },
    authenticated() {
      console.log("Authenticated: " + (this.auth != null ? "yes" : "no"));
      return this.auth;
    },
    getUserEmail: (state) => (userId) => {
      const userOption = state.userOptions.find(
        (option) => option.value === userId
      );
      return userOption ? userOption.label : "";
    },
    userOptions(state) {
      const assignedClientIds = state.projectData.flatMap((project) =>
        project.clients.map((client) => client.id)
      );
      return state.usersData
        .filter((user) => assignedClientIds.includes(user.id))
        .map((user) => ({
          label: user.email,
          value: user.id,
        }));
    },
  },
  actions: {
    // ------------------------------------- Api calls
    //ViewUser
    getUserByID(id) {
      const user = this.usersData.find((u) => u.id === id);
      if (!user) {
        return null;
      } else {
        // Check if the user is assigned to any project
        user.assignedProjects = [];
        this.projectData.forEach((project) => {
          const userIndex = project.clients.findIndex((c) => c.id === id);
          if (userIndex !== -1) user.assignedProjects.push(project.projectName);
        });
        return user;
      }
    },
    //ViewUser
    insertNewUser(user, projects) {
      this.usersData.push(user);
      LocalStorage.set("users", this.usersData); // set users to local storage

      // If the new user is a client, add the user to the clients array of the selected projects
      if (user.role === "client") {
        projects.forEach((projectName) => {
          const project = this.projectData.find(
            (p) => p.projectName === projectName
          );
          if (project) {
            project.clients.push({
              id: user.id,
            });
          }
        });
        // Update the projects in local storage
        this.updateProjects(this.projectData);
      }
    },
    //ViewUser.vue
    updateUsers(users) {
      this.usersData = users;
      LocalStorage.set("users", this.usersData);
    },
    updateUser(userId, updatedUser, projects) {
      const userIndex = this.usersData.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        const originalUser = this.usersData[userIndex];
        this.usersData[userIndex] = updatedUser;

        // If the updated user is a client, update the clients array of the selected projects
        if (updatedUser.role === "client") {
          // First, remove the user from the clients array of all projects
          this.projectData.forEach((project) => {
            const clientIndex = project.clients.findIndex(
              (client) => client.id === userId
            );
            if (clientIndex !== -1) {
              project.clients.splice(clientIndex, 1);
            }
          });
          // Then, add the user to the clients array of the selected projects
          projects.forEach((projectName) => {
            const project = this.projectData.find(
              (p) => p.projectName === projectName
            );
            if (project) {
              project.clients.push({ id: userId });
            }
          });
        }

        // If the user's role has changed from 'client' to 'admin', remove the user from the clients array of all projects
        if (originalUser.role === "client" && updatedUser.role === "admin") {
          this.projectData.forEach((project) => {
            const clientIndex = project.clients.findIndex(
              (client) => client.id === userId
            );
            if (clientIndex !== -1) {
              project.clients.splice(clientIndex, 1);
            }
          });
        }

        // Update the projects and users in the store
        this.updateProjects(this.projectData);
        this.updateUsers(this.usersData);
      }
    },
    //ViewProjects.vue
    updateProjects(projects) {
      this.projectData = projects;
      LocalStorage.set("projects", this.projectData);
    },
    insertNewProject(newProject) {
      this.projectData.push(newProject);
      LocalStorage.set("projects", this.projectData); // set projects to local storage
    },
    //ListUsers.vue
    editUser(router, info) {
      router.push(`/admin/user/edit/${info.id}`);
    },
    mapUserRecords() {
      const usersData = this.usersData;
      const projectData = this.projectData;

      return usersData.map((user) => {
        const assignedProjects = projectData
          .filter((project) =>
            project.clients.some((client) => client.id === user.id)
          )
          .map((project) => project.projectName);

        return {
          ...user,
          project: assignedProjects,
        };
      });
    },
    deleteAllUsers() {
      this.usersData = [];
      LocalStorage.set("users", this.usersData); // set auth to local storage
    },
    // ... ListProjects.vue
    reviewProject(router, info) {
      router.push(`/admin/project/review/${info.id}`);
    },

    editProject(router, info) {
      router.push(`/admin/project/edit/${info.id}`);
    },

    logout() {
      console.log("Logout");
      this.auth = null;
      LocalStorage.remove("auth"); // remove auth from local storage
    },
    saveGroups(groups) {
      this.groupsData = groups;
      LocalStorage.set("groups", this.groupsData); // set groups to local storage
    },

    // ...

    authenticate(username, pass) {
      //TODO: Replace with API call /api/login/
      {
        if (username == "admin" && pass == "pass") {
          this.auth = { type: "admin", token: "testAdmin" };
          LocalStorage.set("auth", this.auth); // set auth to local storage
        } else if (username == "client" && pass == "pass") {
          this.auth = { type: "client", token: "testClient" };
          LocalStorage.set("auth", this.auth); // set auth to local storage
        } else {
          this.auth = null;
        }
      }
      //TODO: End
      console.log("Login as: " + JSON.stringify(this.auth));
      return this.auth;
    },
    // ------------------------------------- For app
    installActions(actions) {
      this.dynamicActions = actions ?? [];
    },
  },
});
