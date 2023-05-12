const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/admin",
        component: () => import("pages/admin/ListUsers.vue"),
      },
      {
        path: "/admin/projects",
        component: () => import("pages/admin/ListProjects.vue"),
      },
      {
        path: "/admin/new",
        component: () => import("pages/admin/ViewUser.vue"),
        props: () => ({
          mode: "new",
        }),
      },
      {
        path: "/admin/new_project",
        component: () => import("pages/admin/ViewProjects.vue"),
        props: () => ({
          mode: "new",
        }),
      },
      {
        path: "/admin/edit",
        component: () => import("pages/admin/ViewUser.vue"),
        props: (route) => ({
          mode: "edit",
          id: route.params.id,
        }),
      },
      {
        path: "/admin/edit_project",
        component: () => import("pages/admin/ViewProjects.vue"),
        props: (route) => ({
          mode: "edit",
          id: route.params.id,
        }),
      },

      {
        path: "/admin/groups",
        component: () => import("pages/admin/ViewGroups.vue"),
      },
    ],
  },

  {
    path: "/login",
    name: "login",
    component: () => import("pages/LoginPage.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
