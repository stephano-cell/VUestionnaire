<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-btn
            label="Create"
            color="primary"
            @click="showCreateDialog = true"
            class="q-mb-md"
          />
          <q-tree
            :nodes="simple"
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

    <q-dialog v-model="showCreateDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Create a new panel</div>
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="newPanelName" label="Panel Name" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="addPanel" />
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

    const simple = ref([
      {
        label: "Relax Hotel",
        children: [
          {
            label: "Food",
            description:
              "Lorem ipsum dolor sit, amet consectetur adipisicing elit...",
          },
          {
            label: "Room service",
            description:
              "Lorem ipsum dolor sit, amet consectetur adipisicing elit...",
          },
          {
            label: "Room view",
            description:
              "Lorem ipsum dolor sit, amet consectetur adipisicing elit...",
          },
        ],
      },
    ]);

    const showCreateDialog = ref(false);
    const newPanelName = ref("");

    const addPanel = () => {
      if (newPanelName.value.trim() === "") {
        return;
      }

      simple.value.push({
        label: newPanelName.value,
        children: [],
      });
      selected.value;
      selected.value = newPanelName.value;
      newPanelName.value = "";
      showCreateDialog.value = false;
    };

    const flattenedNodes = computed(() => {
      const nodes = [];
      const traverse = (node) => {
        if (node.children) {
          node.children.forEach(traverse);
        }
        nodes.push(node);
      };
      simple.value.forEach(traverse);
      return nodes;
    });

    return {
      splitterModel,
      selected,
      simple,
      showCreateDialog,
      newPanelName,
      addPanel,
      flattenedNodes,
    };
  },
};
</script>
