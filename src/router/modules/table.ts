// 最简代码，也就是这些字段必须有
export default {
  path: "/table",
  redirect: "/table/index",
  meta: {
    icon: "ri:bar-chart-2-fill",
    title: "供销商管理"
  },
  children: [
    {
      path: "/table/index",
      name: "供销商管理",
      component: () => import("@/views/table/index.vue"),
      meta: {
        title: "供销商管理"
      }
    }
  ]
};
