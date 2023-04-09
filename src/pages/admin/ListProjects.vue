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
        selection="single"
        v-model:selected="selected"
        v-model:pagination="pagination"
        :filter="filter"
        @focusin="activateNavigation"
        @focusout="deactivateNavigation"
        @keydown="onKey"
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
        <template v-slot:body-cell-assigned_projects="props">
          <q-td :props="props">
            <q-select
              v-if="props.row.role == 'client'"
              v-model="props.row.selected_project"
              :options="props.row.assigned_projects"
            />
            <span v-else>-</span>
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
    name: "yiki",
    required: true,
    label: "username",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },

  {
    name: "fullname",
    align: "center",
    label: "Full Name",
    field: "fullname",
    sortable: true,
  },
  { name: "email", label: "email", field: "email" },
  { name: "company", label: "Company", field: "company", sortable: true },

  {
    name: "assigned_projects",
    label: "Assigned Projects",
    field: "assigned_projects",
    format: (val) => {
      if (val && val.length > 0) {
        return `<q-select :options="${JSON.stringify(val)}" />`;
      } else {
        return "-";
      }
    },
  },
  { name: "role", label: "role", field: "role", sortable: true },

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
    name: "sm",
    fullname: "Stephanos Massouras",
    company: "VUbiquity",
    email: "s.massouras@vubqiquity.com",
    role: "admin",
  },
  {
    id: 2,
    name: "sm2",
    fullname: "Stephanos 2",
    company: "VUbiquity2",
    email: "s.massouras2@vu.com",
    assigned_projects: ["project1", "project2"],
    role: "client",
  },
];
const rows = rowsData.map((row) => {
  if (row.assigned_projects && row.assigned_projects.length > 0) {
    return {
      ...row,
      selected_project: row.assigned_projects[0], // Initialize with the first project in the array
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

    return {
      tableRef,
      navigationActive,
      filter: ref(""),
      selected,
      pagination,
      columns,
      rows,

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
