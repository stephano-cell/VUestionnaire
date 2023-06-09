const routes = [
  {
    path: "",
    name: "login",
    component: () => import("pages/LoginPage.vue"),
    props: (route) => ({
      redirect: route.query.redirect,
    }),
  },
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      { path: "", component: () => import("pages/admin/IndexPage.vue") },
      {
        path: "user/list",
        component: () => import("pages/admin/ListUsers.vue"),
      },
      {
        path: "user/new",
        component: () => import("pages/admin/ViewUser.vue"),
        props: () => ({
          mode: "new",
        }),
      },
      {
        path: "user/edit/:id",
        component: () => import("pages/admin/ViewUser.vue"),
        props: (route) => ({
          mode: "edit",
          id: route.params.id,
        }),
      },
      {
        path: "project/list",
        component: () => import("pages/admin/ListProjects.vue"),
      },
      {
        path: "project/new",
        component: () => import("pages/admin/ViewProjects.vue"),
        props: () => ({
          mode: "new",
        }),
      },
      {
        path: "project/edit/:id",
        component: () => import("pages/admin/ViewProjects.vue"),
        props: (route) => ({
          mode: "edit",
          id: route.params.id,
        }),
      },
      {
        path: "project/review",
        component: () => import("pages/admin/ReviewProject.vue"),
      },
      {
        path: "project/clone",
        component: () => import("pages/admin/CloneProject.vue"),
      },
      {
        path: "question/manage",
        component: () => import("pages/admin/ViewGroups.vue"),
      },
    ],
  },
  {
    path: "/session/",
    component: () => import("layouts/ClientLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/client/ListProjectsClient.vue"),
      },
      {
        path: "answer",
        component: () => import("pages/client/AnswerProjectsClient.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
