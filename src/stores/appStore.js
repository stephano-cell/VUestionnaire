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
      return this.auth != null;
    },
  },
  actions: {
    logout() {
      console.log("Logout");
      this.auth = null;
      LocalStorage.remove("auth"); // remove 'auth' state from local storage
    },
    authenticate(username, pass) {
      if (username == "admin" && pass == "pass") {
        this.auth = "admin";
        LocalStorage.set("auth", this.auth); // set 'auth' state to local storage
        console.log("Login as: " + this.auth);
        return true;
      }
      return false;
    },
  },
});
