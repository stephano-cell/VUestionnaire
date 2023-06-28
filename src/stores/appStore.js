import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
const axios = require("axios");
// This stores the state of the entire app, specific features use their own stores
export const useAppStore = defineStore("appStore", {
  state: () => ({
    dynamicActions: [], // special: this has no storage, each page sets its actions
    auth: LocalStorage.getItem("auth") || null, // get auth from local storage
    usersData: [], // initialize as empty array
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
    //ListProjects.vue
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
    fetchUsers() {
      axios
        .get("http://localhost:3000/users")
        .then((response) => {
          this.usersData = response.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    //ViewUser
    insertNewUser(user, projects) {
      // Send a POST request to the /register route of the backend
      axios
        .post("http://localhost:3000/register", {
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          companyName: user.companyName,
          password: user.password,
          role: user.role,
          allowLogin: user.allowLogin,
          projectUUIDs: projects.join(","),
        })
        .then((response) => {
          console.log("User created with ID:", response.data.id);

          // If the new user is a client, add the user to the clients array of the selected projects
          if (user.role === "client") {
            projects.forEach((projectName) => {
              const project = this.projectData.find(
                (p) => p.projectName === projectName
              );
              if (project) {
                project.clients.push({
                  id: response.data.id,
                });
              }
            });
            // Update the projects in local storage
            this.updateProjects(this.projectData);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    //ViewUser.vue
    updateUsers(users) {
      this.usersData = users;
      LocalStorage.set("users", this.usersData);
    },
    updateUser(userId, updatedUser, projects) {
      // Send a PUT request to the /users/:id route of the backend
      axios
        .put(`http://localhost:3000/users/${userId}`, {
          username: updatedUser.username,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          companyName: updatedUser.companyName,
          password: updatedUser.password,
          role: updatedUser.role,
          allowLogin: updatedUser.allowLogin,
          projectUUIDs: projects.join(","),
        })
        .then((response) => {
          console.log("User updated with ID:", response.data.id);

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

          // Fetch the updated list of users from the backend
          axios
            .get("http://localhost:3000/users")
            .then((response) => {
              this.usersData = response.data;
            })
            .catch((error) => {
              console.error("Error fetching users:", error);
            });

          // Fetch the updated list of projects from the backend
          axios
            .get("http://localhost:3000/projects")
            .then((response) => {
              this.projectData = response.data;
            })
            .catch((error) => {
              console.error("Error fetching projects:", error);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
      // Send a POST request to your server's login route
      return axios
        .post("http://localhost:3000/login", {
          username: username,
          password: pass,
        })
        .then((response) => {
          // The server should return the user's data if the login is successful
          const user = response.data;

          // Store the user's data in the auth state
          this.auth = {
            type: user.role, // This should be either 'admin' or 'client'
            token: user.token, // The server should generate a token for the session
          };

          // Store the auth state in local storage
          LocalStorage.set("auth", this.auth);
        })
        .catch((error) => {
          console.error("Error:", error);
          this.auth = null;
        });
    },

    // ------------------------------------- For app
    installActions(actions) {
      this.dynamicActions = actions ?? [];
    },
  },
});
