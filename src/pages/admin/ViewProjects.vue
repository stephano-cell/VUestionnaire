<template>
  <div>
    <q-input
      filled
      v-model="projectName"
      label="Project Name"
      hint="Name of Project"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      class="q-ma-md q-mb-ml"
    />
    <q-input
      filled
      v-model="company"
      label="Company"
      hint="Name of company"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      class="q-ma-md q-mb-ml"
    />

    <q-splitter v-model="splitterModel" style="height: 500px">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-btn
            label="Create Group"
            color="primary"
            @click="showCreateGroupDialog = true"
            class="q-ma-md"
          />

          <q-btn
            label="Create Question"
            color="secondary"
            @click="showCreateQuestionDialog = true"
            class="q-ma-md"
          />
          <q-tree
            :nodes="groups"
            node-key="label"
            selected-color="primary"
            v-model:selected="selected"
            v-model:ticked="ticked"
            tick-strategy="leaf"
            ticked-color="primary"
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
            class="q-mb-md"
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
              ['fullscreen'],
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
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="addQuestion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "vue-router";
import { v4 } from "uuid";

export default {
  props: {
    mode: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const splitterModel = ref(20);
    const store = useAppStore();
    const router = useRouter();
    const projectName = ref("");
    const company = ref("");
    const selected = ref("Food");
    const ticked = ref([]);
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

    const groups = ref([]);
    onMounted(() => {
      if (store.groupsData) {
        groups.value = JSON.parse(JSON.stringify(store.groupsData)).map(
          (group) => {
            group.checked = ticked.value.includes(group.label) ? 1 : 0;
            group.children = group.children.map((question) => {
              question.checked = ticked.value.includes(question.label) ? 1 : 0;
              return question;
            });
            return group;
          }
        );
      }
    });

    const showCreateGroupDialog = ref(false);
    const showCreateQuestionDialog = ref(false);
    const groupName = ref("");

    const showEditGroupDialog = ref(false);
    const selectedGroupToEdit = ref("");
    const newGroupName = ref("");
    const showEditQuestionDialog = ref(false);
    const selectedQuestionToEdit = ref("");
    const newQuestionTitle = ref("");
    const newQuestionDescription = ref("");
    const toolbarOptions = ref(/* ... */); // toolbar options from previous q-editor
    const fontOptions = ref(/* ... */); // font options from previous q-editor

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
          question.checked = ticked.value.includes(newQuestionTitle.value)
            ? 1
            : 0; // Add this line

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
        group.checked = ticked.value.includes(newGroupName.value) ? 1 : 0; // Add this line
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

      groups.value = [
        ...groups.value,
        {
          id: v4(), // Assign a UUID to the new group
          label: groupName.value,
          children: [],
          checked: ticked.value.includes(groupName.value) ? 1 : 0, // Add this line
        },
      ];

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
        group.children = [
          ...group.children,
          {
            id: v4(), // Assign a UUID to the new question
            label: questionTitle.value,
            description: questionDescription.value,
            checked: ticked.value.includes(questionTitle.value) ? 1 : 0, // Add this line
          },
        ];

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
    if (props.mode === "new") {
      store.installActions([
        {
          label: "CREATE PROJECT",
          callback: () => {
            // Update the checked property of the groups and questions
            groups.value = groups.value.map((group) => {
              group.children = group.children.map((question) => {
                question.checked = ticked.value.includes(question.label)
                  ? 1
                  : 0;
                return question;
              });
              group.checked = group.children.some(
                (question) => question.checked === 1
              )
                ? 1
                : 0;
              return group;
            });

            // Create a deep copy of the groups
            const copiedGroups = JSON.parse(JSON.stringify(groups.value));

            // Assign new UUIDs to the groups and questions in the copy
            copiedGroups.forEach((group) => {
              group.id = v4();
              group.children.forEach((question) => {
                question.id = v4();
              });
            });

            store.insertNewProject({
              id: v4(),
              projectName: projectName.value,
              company: company.value,
              groups: copiedGroups,
              clients: [],
            });

            router.back();
          },
        },
      ]);
    }

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
      ticked,
      editSelected,
      projectName,
      company,
    };
  },
};
</script>
