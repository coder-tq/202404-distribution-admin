<script setup lang="ts">
import { ref, watch } from "vue";
import EditDrawer from "@/views/category-admin/base/edit-drawer.vue";
import { getCategoryByDate } from "@/api/category";
import CreateDrawer from "@/views/category-admin/base/create-drawer.vue";

const categoryData = ref([]);

getCategoryByDate(new Date().toISOString()).then(res => {
  categoryData.value = res.data;
});

const tableColumns = [
  {
    label: "类别名称",
    prop: "name"
  },
  {
    label: "类别编码",
    prop: "code"
  },
  {
    label: "今日单价",
    prop: "price"
  },
  {
    label: "今日库存总量",
    prop: "totalInventory"
  },
  {
    label: "排序",
    prop: "sortBy"
  },
  {
    label: "操作",
    prop: "operation",
    fixed: "right",
    slot: "operation"
  }
];

const drawerVisible = ref(false);
const formData = ref({});
const handleClick = (row: any) => {
  drawerVisible.value = true;
  formData.value = row;
  drawerDisabled.value = true;
};
const handleCreateDistributor = () => {
  formData.value = {
    sortBy: 0
  };
  createDrawerVisible.value = true;
};
const emitSubmit = () => {
  getCategoryByDate(new Date().toISOString()).then(res => {
    categoryData.value = res.data;
  });
};
const date = new Date();
const drawerDisabled = ref(true);
const createDrawerVisible = ref(false);
</script>

<template>
  <div class="select-none">
    <el-card>
      <el-text class="mx-1">记录日期：</el-text>
      <el-date-picker v-model="date" type="date" disabled clearable />
      <el-button type="primary" @click="handleCreateDistributor()"
        >新建</el-button
      >
      <el-divider />
      <pure-table
        :data="categoryData"
        :columns="tableColumns"
        :border="true"
        class="!h-[70vh]"
      >
        <template #operation="{ row }">
          <el-button link type="primary" size="small" @click="handleClick(row)"
            >编辑</el-button
          >
        </template>
      </pure-table>
      <EditDrawer
        v-model:drawerVisible="drawerVisible"
        :form-data="formData"
        :disabled="drawerDisabled"
        @emitSubmit="emitSubmit"
      />
      <create-drawer
        v-model:drawer-visible="createDrawerVisible"
        :form-data="formData"
        @emitSubmit="emitSubmit"
      />
    </el-card>
  </div>
</template>
