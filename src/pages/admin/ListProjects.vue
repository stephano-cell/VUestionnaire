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
            </q-popup-edit>
          </q-td>
        </template>

        <template v-slot:body-cell-assigned_clients="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.selected_clients"
              :options="props.row.clients"
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
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "vue-router";

const columns = [
  {
    name: "projectName",
    align: "center",
    label: "Project Name",
    field: "projectName",
    sortable: true,
  },

  { name: "company", label: "Company", field: "company", sortable: true },
  {
    name: "assigned_clients",
    label: "Assigned Clients",
    field: "clients",
    format: (val) => {
      if (val && val.length > 0) {
        return `<q-select :options="${JSON.stringify(val)}" />`;
      } else {
        return "-";
      }
    },
  },
  {
    name: "comment",
    style: "min-width: 200px; width: 300px",
    align: "left",
    label: "Comment",
    field: "comment",
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

export default {
  setup() {
    const tableRef = ref(null);
    const navigationActive = ref(false);
    const pagination = ref({});
    const selected = ref([]);
    const store = useAppStore();
    const router = useRouter();
    const rows = computed(() => store.projectData);

    const onRowClick = (evt, row) => {
      console.log("Row clicked: ", row);
      // Do something when a row is clicked
    };

    store.installActions([
      {
        label: "New Project",
        callback: () => {
          router.push("/admin/project/new");
        },
      },
    ]);

    return {
      tableRef,
      store,
      router,
      navigationActive,
      filter: ref(""),
      selected,
      pagination,
      columns,
      rows,
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
