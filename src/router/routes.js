const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/admin/user/list",
        component: () => import("pages/admin/ListUsers.vue"),
      },

      {
        path: "/admin/user/new",
        component: () => import("pages/admin/ViewUser.vue"),
        props: () => ({
          mode: "new",
        }),
      },
      {
        path: "/admin/user/edit",
        component: () => import("pages/admin/ViewUser.vue"),
        props: (route) => ({
          mode: "edit",
          id: route.params.id,
        }),
      },
      {
        path: "/admin/project/list",
        component: () => import("pages/admin/ListProjects.vue"),
      },
      {
        path: "/admin/project/new",
        component: () => import("pages/admin/ViewProjects.vue"),
        props: () => ({
          mode: "new",
        }),
      },
      {
        path: "/admin/project/edit",
        component: () => import("pages/admin/ViewProjects.vue"),
        props: (route) => ({
          mode: "edit",
          id: route.params.id,
        }),
      },
      {
        path: "/admin/project/review",
        component: () => import("pages/admin/ReviewProject.vue"),
      },

      {
        path: "/admin/project/clone",
        component: () => import("pages/admin/CloneProject.vue"),
      },
      {
        path: "/admin/question/manage",
        component: () => import("pages/admin/ViewGroups.vue"),
      },
    ],
  },
  {
    path: "/client/project/list",
    component: () => import("layouts/ClientLayout.vue"),
    children: [
      {
        path: "/client/project/list",
        component: () => import("pages/client/ListProjectsClient.vue"),
      },
      {
        path: "/client/project/review",
        component: () => import("pages/client/AnswerProjectsClient.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/LoginPage.vue"),
    props: (route) => ({
      redirect: route.query.redirect,
    }),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
