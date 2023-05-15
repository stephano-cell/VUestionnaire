<template>
  <q-page class="flex flex-center">
    <q-tabs>
      <q-tab name="users"
        ><q-icon
          color="orange"
          name="face"
          size="20em"
          @click="adminUserList"
        />
        Clients
      </q-tab>
      <q-tab name="projects"
        ><q-icon color="green" name="edit_document" size="20em" />
        Projects
      </q-tab>
      <q-tab name="questions"
        ><q-icon color="blue" name="quiz" size="20em" />
        Questions
      </q-tab>
    </q-tabs>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/appStore";

export default defineComponent({
  name: "IndexPage",
  setup(props) {
    const { redirect } = toRefs(props);
    console.log("Redirection: " + redirect?.value);
    const username = ref("admin");
    const password = ref("pass");
    const router = useRouter();
    const store = useAppStore();

    const adminUserList = () => {
      // Call authenticate with the value properties of username and password
      if (store.authenticate(username.value, password.value)) {
        console.log("Navigating");
        router.replace("/admin/user/list");
      }
    };

    return {
      adminUserList,
      username,
      password,
    };
  },
});
</script>

<style>
.mainMenu {
  font-size: 32 pt !important;
}
</style>
