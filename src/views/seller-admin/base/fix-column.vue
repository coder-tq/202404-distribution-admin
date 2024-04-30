<script setup lang="ts">
import { ref } from "vue";
import { getSummaries } from "@/views/seller-admin/base/utils";

type TableColumn = {
  label: string;
  prop?: string;
  fixed?: boolean | "left" | "right";
  slot?: string;
}[];

const props = defineProps<{
  height?: string;
  tableData?: any[];
  tableColumns?: any[];
}>();

const emits = defineEmits([
  "clickEdit",
  "clickExport",
  "clickDelete",
  "clickExportWithoutPrice"
]);

function handleClick(row) {
  emits("clickEdit", row);
}

function handleClickExport(row) {
  emits("clickExport", row);
}

function handleClickExportWithoutPrice(row) {
  emits("clickExportWithoutPrice", row);
}
function handleClickDelete(row) {
  emits("clickDelete", row);
}
</script>

<template>
  <pure-table
    :data="tableData"
    :columns="tableColumns"
    :border="true"
    show-summary
    :summary-method="getSummaries"
    class="!h-[70vh]"
  >
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="handleClick(row)"
        >编辑</el-button
      >

      <el-button
        link
        type="primary"
        size="small"
        @click="handleClickDelete(row)"
        >删除</el-button
      >
    </template>
  </pure-table>
</template>
