import { defineStore } from "pinia";

// This stores the state of the entire app, spesific features use their own stores
export const useAppStore = defineStore("appStore", {
  state: () => ({
    auth: null,
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
    },
    authenticate(username, pass) {
      if (username == "admin" && pass == "pass") {
        this.auth = "admin";
        console.log("Login as: " + this.auth);
        return true;
      }
      return false;
    },
  },
});
