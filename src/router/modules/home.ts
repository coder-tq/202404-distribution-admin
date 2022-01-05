import { $t } from "/@/plugins/i18n";
import Layout from "/@/layout/index.vue";

const homeRouter = {
  path: "/",
  name: "home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "HomeFilled",
    title: $t("menus.hshome"),
    showLink: true,
    i18n: true,
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "welcome",
      component: () => import("/@/views/welcome.vue"),
      meta: {
        title: $t("menus.hshome"),
        i18n: true,
        showLink: true
      }
    }
  ]
};

export default homeRouter;
