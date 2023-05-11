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
            <p>{{ node.description }}</p>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

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
          <q-input filled v-model="questionName" label="Question Name" />
          <q-select
            filled
            v-model="questionGroup"
            :options="groupOptions"
            label="Group"
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
import { ref, computed } from "vue";

export default {
  setup() {
    const splitterModel = ref(50);
    const selected = ref("Food");

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

    const addGroup = () => {
      if (groupName.value.trim() === "") {
        return;
      }

      groups.value.push({
        label: groupName.value,
        children: [],
      });

      selected.value = groupName.value;
      groupName.value = "";
      showCreateGroupDialog.value = false;
    };

    const addQuestion = () => {
      if (questionName.value.trim() === "" || questionGroup.value === "") {
        return;
      }

      const targetGroup = groups.value.find(
        (group) => group.label === questionGroup.value
      );
      if (targetGroup) {
        targetGroup.children.push({
          label: questionName.value,
          description: "",
        });
      }

      questionName.value = "";
      questionGroup.value = "";
      showCreateQuestionDialog.value = false;
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
      selected,
      groups,
      showCreateGroupDialog,
      showCreateQuestionDialog,
      groupName,
      questionName,
      questionGroup,
      addGroup,
      addQuestion,
      flattenedNodes,
      groupOptions,
    };
  },
};
</script>
