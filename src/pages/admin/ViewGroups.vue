<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 600px">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-btn
            label="Create Group"
            color="primary"
            @click="showCreateGroupDialog = true"
            class="q-ma-md q-mb-ml"
          />

          <q-btn
            label="Create Question"
            color="secondary"
            @click="showCreateQuestionDialog = true"
            class="q-ma-md q-mb-ml"
          />
          <q-tree
            :nodes="groups"
            node-key="label"
            selected-color="primary"
            v-model:selected="selected"
            default-expand-all
            @dblclick="editSelected"
          />
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selected"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            v-for="node in flattenedNodes"
            :key="node.label"
            :name="node.label"
          >
            <div class="text-h4 q-mb-md">{{ node.label }}</div>
            <p v-html="node.description"></p>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
    <q-btn
      label="Delete Group"
      color="orange"
      @click="showDeleteGroupDialog = true"
      class="q-ma-md q-mb-ml"
    />
    <q-btn
      label="Delete Question"
      color="orange"
      @click="showDeleteQuestionDialog = true"
      class="q-ma-md q-mb-ml"
    />
    <br />

    <q-dialog v-model="showEditGroupDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Edit Group Name</div>
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="selectedGroupToEdit"
            :options="groupOptions"
            label="Select a group"
          />
          <q-input filled v-model="newGroupName" label="New Group Name" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="editGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditQuestionDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Edit Question</div>
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="selectedQuestionToEdit"
            :options="questionOptions"
            label="Select a question"
          />
          <q-input
            filled
            v-model="newQuestionTitle"
            label="New Question Title"
          />
          <q-editor
            filled
            v-model="newQuestionDescription"
            label="New Question Description"
            :dense="$q.screen.lt.md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="editQuestion" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCreateGroupDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Create a new group</div>
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="groupName" label="Group Name" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="addGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCreateQuestionDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Create a new question</div>
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="questionTitle" label="Question Title" />
          <q-select
            filled
            v-model="selectedGroup"
            :options="groupOptions"
            label="Select a group"
          />
          <q-editor
            filled
            v-model="questionDescription"
            label="Question Description"
            :dense="$q.screen.lt.md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="addQuestion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDeleteGroupDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Delete Group</div>
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="selectedGroupToDelete"
            :options="groupOptions"
            label="Select a group"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- ... -->
    <q-dialog v-model="showDeleteQuestionDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Delete Question</div>
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="selectedQuestionToDelete"
            :options="questionOptions"
            label="Select a question"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteQuestion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "vue-router";
import { v4 } from "uuid";

export default {
  setup() {
    const splitterModel = ref(20);
    const selected = ref("Food");
    const store = useAppStore();
    const router = useRouter();

    const groups = ref([]);
    const tempGroups = ref([]); // Temporary copy of groups

    // Load groups from the store when the component is mounted
    onMounted(() => {
      const storedGroups = store.groupsData;
      if (storedGroups) {
        groups.value = storedGroups;
        tempGroups.value = JSON.parse(JSON.stringify(storedGroups)); // Make a deep copy of groups
      }
    });

    const editSelected = () => {
      const group = tempGroups.value.find((g) => g.label === selected.value);
      if (group) {
        // The selected node is a group
        selectedGroupToEdit.value = selected.value;
        showEditGroupDialog.value = true;
      } else {
        // The selected node is a question
        selectedQuestionToEdit.value = selected.value;
        showEditQuestionDialog.value = true;
      }
    };

    const showCreateGroupDialog = ref(false);
    const showCreateQuestionDialog = ref(false);
    const groupName = ref("");
    const questionTitle = ref("");
    const questionDescription = ref("");
    const selectedGroup = ref("");
    const showEditGroupDialog = ref(false);
    const selectedGroupToEdit = ref("");
    const newGroupName = ref("");
    const showEditQuestionDialog = ref(false);
    const selectedQuestionToEdit = ref("");
    const newQuestionTitle = ref("");
    const newQuestionDescription = ref("");
    const showDeleteGroupDialog = ref(false);
    const selectedGroupToDelete = ref("");
    const showDeleteQuestionDialog = ref(false);
    const selectedQuestionToDelete = ref("");

    const flattenedNodes = computed(() => {
      // Flatten the tree nodes for the q-tab-panels
      let nodes = [];
      tempGroups.value.forEach((group) => {
        nodes.push(group);
        if (group.children) {
          nodes = nodes.concat(group.children);
        }
      });
      return nodes;
    });

    const groupOptions = computed(() => {
      // Map the groups to an array of options for the q-select
      return tempGroups.value.map((group) => group.label);
    });

    const questionOptions = computed(() => {
      // Map the questions to an array of options for the q-select
      let options = [];
      tempGroups.value.forEach((group) => {
        if (group.children) {
          options = options.concat(group.children.map((child) => child.label));
        }
      });
      return options;
    });

    const addGroup = () => {
      // Add a new group to the temporary data
      tempGroups.value.push({
        label: groupName.value,
        children: [],
      });
      tempGroups.value.sort((a, b) => a.label.localeCompare(b.label)); // Sort groups alphabetically
      groupName.value = "";
      showCreateGroupDialog.value = false;
    };

    const addQuestion = () => {
      // Add a new question to the selected group
      const group = tempGroups.value.find(
        (g) => g.label === selectedGroup.value
      );
      if (group) {
        group.children.push({
          label: questionTitle.value,
          description: questionDescription.value,
        });
        group.children.sort((a, b) => a.label.localeCompare(b.label)); // Sort questions alphabetically
        questionTitle.value;
        questionTitle.value = "";
        questionDescription.value = "";
        selectedGroup.value = "";
        showCreateQuestionDialog.value = false;
      }
    };

    const editGroup = () => {
      // Edit the selected group
      const group = tempGroups.value.find(
        (g) => g.label === selectedGroupToEdit.value
      );

      if (group) {
        group.label = newGroupName.value;
        newGroupName.value = "";
        selectedGroupToEdit.value = "";
        showEditGroupDialog.value = false;
      }
    };

    const editQuestion = () => {
      // Edit the selected question
      let question = null;
      tempGroups.value.forEach((group) => {
        if (group.children) {
          const found = group.children.find(
            (q) => q.label === selectedQuestionToEdit.value
          );
          if (found) {
            question = found;
          }
        }
      });
      if (question) {
        question.label = newQuestionTitle.value;
        question.description = newQuestionDescription.value;
        newQuestionTitle.value = "";
        newQuestionDescription.value = "";
        selectedQuestionToEdit.value = "";
        showEditQuestionDialog.value = false;
      }
    };

    const deleteGroup = () => {
      // Delete the selected group
      const index = tempGroups.value.findIndex(
        (g) => g.label === selectedGroupToDelete.value
      );
      if (index !== -1) {
        tempGroups.value.splice(index, 1);
        selectedGroupToDelete.value = "";
        showDeleteGroupDialog.value = false;
      }
    };

    const deleteQuestion = () => {
      // Delete the selected question
      tempGroups.value.forEach((group) => {
        if (group.children) {
          const index = group.children.findIndex(
            (q) => q.label === selectedQuestionToDelete.value
          );
          if (index !== -1) {
            group.children.splice(index, 1);
            selectedQuestionToDelete.value = "";
            showDeleteQuestionDialog.value = false;
          }
        }
      });
    };

    store.installActions([
      {
        label: "Save",
        callback: () => {
          // Copy the temporary data back to groups and save it to the store
          groups.value = JSON.parse(JSON.stringify(tempGroups.value));
          store.saveGroups(groups.value);
          router.back();
        },
      },
    ]);

    return {
      splitterModel,
      questionTitle,
      selectedGroup,
      selected,
      groups: tempGroups, // Use tempGroups in your template
      showCreateGroupDialog,
      showCreateQuestionDialog,
      groupName,
      addGroup,
      addQuestion,
      flattenedNodes,
      groupOptions,
      questionDescription,
      showEditGroupDialog,
      selectedGroupToEdit,
      newGroupName,
      editGroup,
      showEditQuestionDialog,
      selectedQuestionToEdit,
      newQuestionTitle,
      newQuestionDescription,
      editQuestion,
      questionOptions,
      showDeleteGroupDialog,
      selectedGroupToDelete,
      showDeleteQuestionDialog,
      selectedQuestionToDelete,
      deleteGroup,
      deleteQuestion,
      editSelected,
    };
  },
};
</script>
