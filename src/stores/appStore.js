import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
// This stores the state of the entire app, specific features use their own stores
export const useAppStore = defineStore("appStore", {
  state: () => ({
    dynamicActions: [], // special: this has no storage, each page sets its actions
    auth: LocalStorage.getItem("auth") || null, // get auth from local storage
    usersData: LocalStorage.getItem("users") || [], // get users from local storage
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
    deleteAllUsers() {
      this.usersData = [];
      LocalStorage.set("users", this.usersData); // set auth to local storage
    },
    // ------------------------------------- For app
    installActions(actions) {
      this.dynamicActions = actions ?? [];
    },
    logout() {
      console.log("Logout");
      this.auth = null;
      LocalStorage.remove("auth"); // remove auth from local storage
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
  },
});
