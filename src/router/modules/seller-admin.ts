// 最简代码，也就是这些字段必须有
export default {
  path: "/seller-admin",
  redirect: "/seller-admin/admin",
  meta: {
    icon: "ri:bar-chart-2-fill",
    title: "供销数据管理"
  },
  children: [
    {
      path: "/seller-admin/admin",
      name: "seller-admin",
      component: () => import("@/views/seller-admin/admin.vue"),
      meta: {
        title: "供销数据管理",
        roles: ["admin"]
      }
    },
    {
      path: "/seller-admin/form",
      name: "seller-form",
      component: () => import("@/views/seller-admin/seller-form.vue"),
      meta: {
        title: "供销数据填写",
        roles: ["admin"]
      }
    }
  ]
};
