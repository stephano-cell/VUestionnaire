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
  },
  actions: {
    // ------------------------------------- Api calls
    insertNewUser(newUser) {
      this.usersData.push(newUser);
      LocalStorage.set("users", this.usersData); // set auth to local storage
    },
    updateProjects(projects) {
      this.projectData = projects;
      LocalStorage.set("projects", this.projectData);
    },

    updateUsers(users) {
      this.usersData = users;
      LocalStorage.set("users", this.usersData);
    },

    insertNewProject(newProject) {
      this.projectData.push(newProject);
      LocalStorage.set("projects", this.projectData); // set projects to local storage
    },
    deleteAllUsers() {
      this.usersData = [];
      LocalStorage.set("users", this.usersData); // set auth to local storage
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
