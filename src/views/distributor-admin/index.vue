<script setup lang="ts">
import { getAllDistributor, getDistributor } from "@/api/distributor";
import { getSummaries } from "@/views/seller-admin/base/utils";
import { ref } from "vue";

const distributorData = ref([]);
getAllDistributor().then(res => {
  distributorData.value = res.data;
});

const tableColumns = [
  {
    label: "name",
    prop: "name"
  },
  {
    label: "操作",
    prop: "operation",
    fixed: "right",
    slot: "operation"
  }
];
</script>

<template>
  <div class="select-none">
    <el-card>
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
    </el-card>
  </div>
</template>
