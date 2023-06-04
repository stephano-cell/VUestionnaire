import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
// This stores the state of the entire app, specific features use their own stores
export const useAppStore = defineStore("appStore", {
  state: () => ({
    auth: LocalStorage.getItem("auth") || null, // get 'auth' state from local storage
  }),
  getters: {
    authenticated() {
      console.log("Authenticated: " + (this.auth != null ? "yes" : "no"));
      return this.auth;
    },
  },
  actions: {
    logout() {
      console.log("Logout");
      this.auth = null;
      LocalStorage.remove("auth"); // remove 'auth' state from local storage
    },
    authenticate(username, pass) {
      //TODO: Replace with API call /api/login/
      {
        if (username == "admin" && pass == "pass") {
          this.auth = { type: "admin", token: "testAdmin" };
          LocalStorage.set("auth", this.auth); // set 'auth' state to local storage
        } else if (username == "client" && pass == "pass") {
          this.auth = { type: "client", token: "testClient" };
          LocalStorage.set("auth", this.auth); // set 'auth' state to local storage
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
