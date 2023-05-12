<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 800px">
      <template v-slot:before>
        <div class="q-pa-md">
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
            <p v-html="node.description"></p>

            <div class="q-mt-md">
              <div class="text-subtitle2 q-mb-xs">Client Answer</div>
              <q-editor v-model="clientResponse" class="q-mb-md" />
              <q-select
                v-model="selectedClientResponse"
                :options="clientResponses"
                style="width: 200px"
                class="q-mb-md"
              />
              <div class="text-subtitle2 q-mb-xs">Reviewer Comment</div>
              <q-editor v-model="reviewerResponse" />
              <q-select
                v-model="selectedReviewerResponse"
                :options="reviewerResponses"
                style="width: 200px"
                class="q-mb-md"
              />
            </div>

            <div class="q-mt-md">
              <q-btn
                label="Submit"
                color="primary"
                @click="submit"
                class="q-mr-md"
              />
              <q-btn label="Next" color="secondary" @click="nextQuestion" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const splitterModel = ref(20);
    const selected = ref(null);
    const clientResponse = ref("");
    const reviewerResponse = ref("");
    const clientResponses = ref([]);
    const reviewerResponses = ref([]);
    const selectedClientResponse = ref(null);
    const selectedReviewerResponse = ref(null);

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

    const flattenedNodes = computed(() => {
      const nodes = [];
      const traverse = (node) => {
        if (node.children) {
          node.children.forEach(traverse);
        }
        if (node.description) {
          nodes.push(node);
        }
      };
      groups.value.forEach(traverse);
      return nodes;
    });

    const submit = () => {
      clientResponses.value.push(clientResponse.value);
      reviewerResponses.value.push(reviewerResponse.value);

      clientResponse.value = "";
      reviewerResponse.value = "";
      selectedClientResponse.value = null;
      selectedReviewerResponse.value = null;
    };

    const nextQuestion = () => {
      const currentIndex = flattenedNodes.value.findIndex(
        (node) => node.label === selected.value
      );
      const nextIndex = currentIndex + 1;
      if (nextIndex < flattenedNodes.value.length) {
        selected.value = flattenedNodes.value[nextIndex].label;
      }
    };

    return {
      splitterModel,
      selected,
      groups,
      flattenedNodes,
      clientResponse,
      reviewerResponse,
      clientResponses,
      reviewerResponses,
      selectedClientResponse,
      selectedReviewerResponse,
      submit,
      nextQuestion,
    };
  },
};
</script>
