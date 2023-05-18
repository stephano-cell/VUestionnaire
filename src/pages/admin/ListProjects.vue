<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <q-table
        flat
        bordered
        ref="tableRef"
        :class="tableClass"
        tabindex="0"
        title="Projects"
        :rows="rows"
        :columns="columns"
        row-key="name"
        v-model:selected="selected"
        v-model:pagination="pagination"
        :filter="filter"
        @focusin="activateNavigation"
        @focusout="deactivateNavigation"
        @keydown="onKey"
        @row-click="onRowClick"
        wrap-cells
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-comment="props">
          <q-td :props="props">
            <div v-html="props.row.comment"></div>
            <q-popup-edit buttons v-model="props.row.comment" v-slot="scope">
              <q-editor
                v-model="scope.value"
                min-height="5rem"
                autofocus
                @keyup.enter.stop
              />
            </q-popup-edit>
          </q-td>
        </template>

        <template v-slot:body-cell-assigned_clients="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.selected_clients"
              :options="props.row.assigned_clients"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn flat icon="edit" @click="editRow(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script>
import { ref, computed, nextTick, toRaw } from "vue";
import { QSelect } from "quasar";

const columns = [
  {
    name: "projectName",
    align: "center",
    label: "Project Name",
    field: "projectName",
    sortable: true,
  },
  {
    name: "comment",
    style: "min-width: 200px; width: 200px",
    align: "left",
    label: "Comment (editable)",
    field: "comment",
  },

  { name: "company", label: "Company", field: "company", sortable: true },
  {
    name: "assigned_clients",
    label: "Assigned Clients",
    field: "assigned_clients",
    format: (val) => {
      if (val && val.length > 0) {
        return `<q-select :options="${JSON.stringify(val)}" />`;
      } else {
        return "-";
      }
    },
  },

  {
    name: "last_client_activity",
    align: "center",
    label: "last_client_activity",
    field: "last_client_activity",
    sortable: true,
  },
  {
    name: "client_remaining_questions",
    align: "center",
    label: "Client:Remaining Question",
    field: "client_remaining_questions",
    sortable: true,
  },
  {
    name: "last_admin_activity",
    align: "center",
    label: "last_admin_activity",
    field: "last_admin_activity",
    sortable: true,
  },
  {
    name: "admin_remaining_review",
    align: "center",
    label: "Admin:remaining to review",
    field: "admin_remaining_reviewed",
    sortable: true,
  },
  {
    name: "status",
    align: "center",
    label: "status",
    field: "status",
    sortable: true,
  },
  {
    name: "edit",
    label: "",
    align: "center",
    field: () => "edit",
    sortable: false,
  },
];

const rowsData = [
  {
    id: 1,
    projectName: "Tvod SVOD",
    comment:
      "<p>It's cold but great and tastes different than normal ice cream, but it's great too!</p><p><strong>Have a taste!</strong></p>",

    company: "Plex",
    assigned_clients: ["satephanos", "asdfasfe"],

    last_client_activity: "2023-03-01",
    client_remaining_questions: "20",
    last_admin_activity: "2023-03-02",
    admin_remaining_reviewed: "10",
    status: "completed: 50%",
  },
  {
    id: 1,
    projectName: "Tvod EST SVOD",

    company: "Spidernet",
    assigned_clients: ["satephanos", "hello"],

    last_client_activity: "2022-03-01",
    client_remaining_questions: "23",
    last_admin_activity: "2023-03-03",
    admin_remaining_reviewed: "12",
    status: "completed: 60%",
  },
];
const rows = rowsData.map((row) => {
  if (row.assigned_clients && row.assigned_clients.length > 0) {
    return {
      ...row,
      selected_clients: row.assigned_clients[0], // Initialize with the first project in the array
    };
  }
  return row;
});

export default {
  setup() {
    const tableRef = ref(null);
    const navigationActive = ref(false);
    const pagination = ref({});
    const selected = ref([]);

    const onRowClick = (evt, row) => {
      console.log("Row clicked: ", row);
      // Do something when a row is clicked
    };

    return {
      tableRef,
      navigationActive,
      filter: ref(""),
      selected,
      pagination,
      columns,
      rows: ref(rows),
      onRowClick,

      tableClass: computed(() =>
        navigationActive.value === true ? "shadow-8 no-outline" : null
      ),

      activateNavigation() {
        navigationActive.value = true;
      },

      deactivateNavigation() {
        navigationActive.value = false;
      },

      onKey(evt) {
        if (
          navigationActive.value !== true ||
          [33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
          tableRef.value === null
        ) {
          return;
        }

        evt.preventDefault();

        const { computedRowsNumber, computedRows } = tableRef.value;

        if (computedRows.length === 0) {
          return;
        }

        const currentIndex =
          selected.value.length > 0
            ? computedRows.indexOf(toRaw(selected.value[0]))
            : -1;
        const currentPage = pagination.value.page;
        const rowsPerPage =
          pagination.value.rowsPerPage === 0
            ? computedRowsNumber
            : pagination.value.rowsPerPage;
        const lastIndex = computedRows.length - 1;
        const lastPage = Math.ceil(computedRowsNumber / rowsPerPage);

        let index = currentIndex;
        let page = currentPage;

        switch (evt.keyCode) {
          case 36: // Home
            page = 1;
            index = 0;
            break;
          case 35: // End
            page = lastPage;
            index = rowsPerPage - 1;
            break;
          case 33: // PageUp
            page = currentPage <= 1 ? lastPage : currentPage - 1;
            if (index < 0) {
              index = 0;
            }
            break;
          case 34: // PageDown
            page = currentPage >= lastPage ? 1 : currentPage + 1;
            if (index < 0) {
              index = rowsPerPage - 1;
            }
            break;
          case 38: // ArrowUp
            if (currentIndex <= 0) {
              page = currentPage <= 1 ? lastPage : currentPage - 1;
              index = rowsPerPage - 1;
            } else {
              index = currentIndex - 1;
            }
            break;
          case 40: // ArrowDown
            if (currentIndex >= lastIndex) {
              page = currentPage >= lastPage ? 1 : currentPage + 1;
              index = 0;
            } else {
              index = currentIndex + 1;
            }
            break;
        }

        if (page !== pagination.value.page) {
          pagination.value.page = page;

          nextTick(() => {
            const { computedRows } = tableRef.value;
            selected.value = [
              computedRows[Math.min(index, computedRows.length - 1)],
            ];
            tableRef.value.$el.focus();
          });
        } else {
          selected.value = [computedRows[index]];
        }
      },
    };
  },
  components: {
    QSelect,
  },
};
</script>
