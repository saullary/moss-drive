const routes = [
  {
    path: "/",
    component: () => import("../layouts/main-layout.vue"),
    children: [
      { path: "", component: () => import("./home-page.vue") },
      {
        path: "/drive/:catchAll(.*)*",
        component: () => import("./drive/page-drive.vue"),
        meta: {
          title: "My Drive",
        },
      },
      {
        path: "/stone",
        component: () => import("./stone/page-stone.vue"),
        meta: {
          title: "My Stones",
        },
      },
    ],
  },
  {
    path: "/mossyland",
    component: () => import("../layouts/mossy-layout.vue"),
    children: [
      {
        path: "moments",
        component: () => import("./mossy/page-moments.vue"),
      },
      {
        path: "explore",
        component: () => import("./mossy/page-explore.vue"),
      },
      {
        path: "collected",
        component: () => import("./mossy/page-collected.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("./ErrorNotFound.vue"),
  },
];

export default routes;
