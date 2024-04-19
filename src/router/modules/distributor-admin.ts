// 最简代码，也就是这些字段必须有
export default {
  path: "/distributor-admin",
  redirect: "/distributor-admin/admin",
  meta: {
    icon: "ri:bar-chart-2-fill",
    title: "供销商管理"
  },
  children: [
    {
      path: "/distributor-admin/admin",
      name: "distributor-admin",
      component: () => import("@/views/distributor-admin/index.vue"),
      meta: {
        title: "供销商管理",
        roles: ["admin"]
      }
    }
  ]
};
