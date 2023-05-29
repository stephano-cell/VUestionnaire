<template>
  <div></div>
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
                label="Client"
                style="width: 200px"
                class="q-mb-md"
                @update:model-value="updateClientResponse"
              />

              <div class="text-subtitle2 q-mb-xs">Reviewer Comment</div>
              <q-editor v-model="reviewerResponse" />
              <q-select
                v-model="selectedReviewerResponse"
                :options="reviewerResponses"
                label="Reviewer"
                style="width: 200px"
                class="q-mb-md"
                @update:model-value="updateReviewerResponse"
              />
            </div>

            <div class="q-mt-md">
              <div class="q-mb-md">
                <q-checkbox
                  v-model="isLocked"
                  color="primary"
                  label="Lock"
                  class="text-bold q-mr-md"
                />
                <q-checkbox
                  v-model="isComplete"
                  color="secondary"
                  label="Complete"
                  class="text-bold"
                />
              </div>

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
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const splitterModel = ref(20);
    const selected = ref(null);
    const clientResponse = ref("");
    const reviewerResponse = ref("");
    const isLocked = ref(false);
    const isComplete = ref(false);
    const clientResponses = ref([
      {
        name: "Client 1",
        date: "2023-05-18",
        response: "Client Response 1",
        label: "Client 1 - 2023-05-18",
      },
      {
        name: "Client 2",
        date: "2023-05-19",
        response: "Client Response 2",
        label: "Client 2 - 2023-05-19",
      },
    ]);

    const reviewerResponses = ref([
      {
        name: "Reviewer 1",
        date: "2023-05-20",
        response: "Reviewer Comment 1",
        label: "Reviewer 1 - 2023-05-20",
      },
      {
        name: "Reviewer 2",
        date: "2023-05-21",
        response: "Reviewer Comment 2",
        label: "Reviewer 2 - 2023-05-21",
      },
    ]);

    const selectedClientResponse = ref(
      clientResponses.value[clientResponses.value.length - 1]
    );
    const selectedReviewerResponse = ref(
      reviewerResponses.value[reviewerResponses.value.length - 1]
    );

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
      const clientNameDate = `Client X - ${
        new Date().toISOString().split("T")[0]
      }`;
      const reviewerNameDate = `Reviewer X - ${
        new Date().toISOString().split("T")[0]
      }`;

      clientResponses.value.push({
        name: "Client X",
        date: new Date().toISOString().split("T")[0],
        response: clientResponse.value,
        label: clientNameDate,
      });

      reviewerResponses.value.push({
        name: "Reviewer X",
        date: new Date().toISOString().split("T")[0],
        response: reviewerResponse.value,
        label: reviewerNameDate,
      });

      clientResponse.value = "";
      reviewerResponse.value = "";
      selectedClientResponse.value =
        clientResponses.value[clientResponses.value.length - 1];
      selectedReviewerResponse.value =
        reviewerResponses.value[reviewerResponses.value.length - 1];
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

    const updateClientResponse = (selectedObject) => {
      clientResponse.value = selectedObject ? selectedObject.response : "";
    };

    const updateReviewerResponse = (selectedObject) => {
      reviewerResponse.value = selectedObject ? selectedObject.response : "";
    };

    onMounted(() => {
      clientResponse.value = selectedClientResponse.value.response;
      reviewerResponse.value = selectedReviewerResponse.value.response;
    });

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
      updateClientResponse,
      updateReviewerResponse,
      isLocked,
      isComplete,
    };
  },
};
</script>
