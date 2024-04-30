<script setup lang="ts">
import { getAllDistributor, getDistributor } from "@/api/distributor";
import { getSummaries } from "@/views/seller-admin/base/utils";
import { ref, watch } from "vue";
import EditDrawer from "@/views/distributor-admin/base/edit-drawer.vue";

const distributorData = ref([]);
getAllDistributor().then(res => {
  distributorData.value = res.data;
});

const tableColumns = [
  {
    label: "分销商名称",
    prop: "name"
  },
  {
    label: "分销商手机号",
    prop: "phone"
  },
  {
    label: "分销商短链接",
    prop: "urlCode"
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
};

const handleCreateDistributor = () => {
  drawerVisible.value = true;
  formData.value = {};
};

watch(drawerVisible, () => {
  if (drawerVisible.value == false) {
    // location.reload();
  }
});
</script>

<template>
  <div class="select-none">
    <el-card>
      <el-button type="primary" @click="handleCreateDistributor()"
        >新建</el-button
      >
      <el-divider />
      <pure-table
        :data="distributorData"
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
      <EditDrawer v-model:drawerVisible="drawerVisible" :form-data="formData" />
    </el-card>
  </div>
</template>
