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
    authenticate(username, pass) {
      if (username == "admin" && pass == "pass") {
        this.auth = "admin";
        return true;
      }
      return false;
    },
  },
});
