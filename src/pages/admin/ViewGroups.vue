<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-btn
            label="Create Group"
            color="primary"
            @click="showCreateGroupDialog = true"
            class="q-mb-md"
          />

          <q-btn
            label="Create Question"
            color="secondary"
            @click="showCreateQuestionDialog = true"
            class="q-mb-md"
          />
          <q-tree
            :nodes="groups"
            node-key="label"
            selected-color="primary"
            v-model:selected="selected"
            default-expand-all
            @dblclick="editSelected"
          />
          <q-btn
            label="Delete Group"
            color="orange"
            @click="showDeleteGroupDialog = true"
            class="q-mb-md"
          />
          <q-btn
            label="Delete Question"
            color="orange"
            @click="showDeleteQuestionDialog = true"
            class="q-mb-md"
          />
          <br />
          <q-btn
            label="Save"
            color="primary"
            @click="Save = true"
            class="q-mb-md"
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
            v-model="questionDescription"
            label="Question Description"
            :dense="$q.screen.lt.md"
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],

              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7',
                  ],
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana',
                  ],
                },
                'removeFormat',
              ],
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify'],
                },
                'unordered',
                'ordered',
              ],

              ['undo', 'redo'],
              ['fullscreen', 'viewsource'],
            ]"
            :fonts="{
              arial: 'Arial',
              arial_black: 'Arial Black',
              comic_sans: 'Comic Sans MS',
              courier_new: 'Courier New',
              impact: 'Impact',
              lucida_grande: 'Lucida Grande',
              times_new_roman: 'Times New Roman',
              verdana: 'Verdana',
            }"
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
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],

              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7',
                  ],
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana',
                  ],
                },
                'removeFormat',
              ],
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify'],
                },
                'unordered',
                'ordered',
              ],

              ['undo', 'redo'],
              ['fullscreen', 'viewsource'],
            ]"
            :fonts="{
              arial: 'Arial',
              arial_black: 'Arial Black',
              comic_sans: 'Comic Sans MS',
              courier_new: 'Courier New',
              impact: 'Impact',
              lucida_grande: 'Lucida Grande',
              times_new_roman: 'Times New Roman',
              verdana: 'Verdana',
            }"
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
import { ref, computed } from "vue";

export default {
  setup() {
    const splitterModel = ref(50);
    const selected = ref("Food");
    const editSelected = () => {
      const group = groups.value.find((g) => g.label === selected.value);
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

    const groups = ref([
      {
        label: "Group 1",
        children: [
          {
            label: "Question 1",
            description: "Description for Question 1",
          },
          {
            label: "Question 2",
            description: "Description for Question 2",
          },
        ],
      },
      {
        label: "Group 2",
        children: [
          {
            label: "Question 3",
            description: "Description for Question 3",
          },
        ],
      },
    ]);

    const showCreateGroupDialog = ref(false);
    const showCreateQuestionDialog = ref(false);
    const groupName = ref("");
    const questionName = ref("");
    const questionGroup = ref("");
    const showEditGroupDialog = ref(false);
    const selectedGroupToEdit = ref("");
    const newGroupName = ref("");
    const showEditQuestionDialog = ref(false);
    const selectedQuestionToEdit = ref("");
    const newQuestionTitle = ref("");
    const newQuestionDescription = ref("");
    const toolbarOptions = ref(/* ... */); // toolbar options from previous q-editor
    const fontOptions = ref(/* ... */); // font options from previous q-editor
    const showDeleteGroupDialog = ref(false);
    const selectedGroupToDelete = ref("");
    const showDeleteQuestionDialog = ref(false);
    const selectedQuestionToDelete = ref("");

    const deleteGroup = () => {
      const index = groups.value.findIndex(
        (g) => g.label === selectedGroupToDelete.value
      );

      if (index !== -1) {
        groups.value.splice(index, 1);
        selectedGroupToDelete.value = "";
        showDeleteGroupDialog.value = false;
      }
    };

    const deleteQuestion = () => {
      groups.value.forEach((group) => {
        const index = group.children.findIndex(
          (c) => c.label === selectedQuestionToDelete.value
        );

        if (index !== -1) {
          group.children.splice(index, 1);
          selectedQuestionToDelete.value = "";
          showDeleteQuestionDialog.value = false;
        }
      });
    };
    const editQuestion = () => {
      if (
        selectedQuestionToEdit.value.trim() === "" ||
        newQuestionTitle.value.trim() === "" ||
        newQuestionDescription.value.trim() === ""
      ) {
        return;
      }

      const group = groups.value.find((g) =>
        g.children.find((c) => c.label === selectedQuestionToEdit.value)
      );

      if (group) {
        const question = group.children.find(
          (c) => c.label === selectedQuestionToEdit.value
        );

        if (question) {
          question.label = newQuestionTitle.value;
          question.description = newQuestionDescription.value;

          // Sort the questions alphabetically within the group.
          group.children.sort((a, b) => a.label.localeCompare(b.label));

          newQuestionTitle.value = "";
          newQuestionDescription.value = "";
          selectedQuestionToEdit.value = "";
          showEditQuestionDialog.value = false;
        }
      }
    };

    const questionOptions = computed(() => {
      const options = [];
      groups.value.forEach((group) => {
        group.children.forEach((child) => {
          options.push(child.label);
        });
      });
      return options;
    });

    const editGroup = () => {
      if (
        selectedGroupToEdit.value.trim() === "" ||
        newGroupName.value.trim() === ""
      ) {
        return;
      }

      const group = groups.value.find(
        (g) => g.label === selectedGroupToEdit.value
      );

      if (group) {
        group.label = newGroupName.value;
        newGroupName.value = "";
        selectedGroupToEdit.value = "";
        showEditGroupDialog.value = false;

        // Sort the groups alphabetically.
        groups.value.sort((a, b) => a.label.localeCompare(b.label));
      }
    };

    const addGroup = () => {
      if (groupName.value.trim() === "") {
        return;
      }

      groups.value.push({
        label: groupName.value,
        children: [],
      });

      // Sort the groups alphabetically.
      groups.value.sort((a, b) => a.label.localeCompare(b.label));

      selected.value = groupName.value;
      groupName.value = "";
      showCreateGroupDialog.value = false;
    };

    const questionTitle = ref("");
    const selectedGroup = ref("");
    const questionDescription = ref("");

    const addQuestion = () => {
      if (
        questionTitle.value.trim() === "" ||
        questionDescription.value.trim() === "" ||
        selectedGroup.value.trim() === ""
      ) {
        return;
      }

      const group = groups.value.find((g) => g.label === selectedGroup.value);

      if (group) {
        group.children.push({
          label: questionTitle.value,
          description: questionDescription.value,
        });

        // Sort the questions alphabetically within the group.
        group.children.sort((a, b) => a.label.localeCompare(b.label));

        questionTitle.value = "";
        questionDescription.value = "";
        selectedGroup.value = "";
        showCreateQuestionDialog.value = false;
      }
    };

    const flattenedNodes = computed(() => {
      const nodes = [];
      const traverse = (node) => {
        if (node.children) {
          node.children.forEach(traverse);
        }
        nodes.push(node);
      };
      groups.value.forEach(traverse);
      return nodes;
    });

    const groupOptions = computed(() => {
      return groups.value.map((group) => group.label);
    });

    return {
      splitterModel,
      questionTitle,
      selectedGroup,
      selected,
      groups,
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
      toolbarOptions,
      fontOptions,
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
