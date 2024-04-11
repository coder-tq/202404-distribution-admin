<script setup lang="ts">
import { ref } from "vue";

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

const emits = defineEmits(["clickDetail", "clickEdit"]);

const columns: TableColumnList = [
  {
    label: "买方名称",
    prop: "name",
    // "min-width": "",
    fixed: true
  },
  {
    label: "操作",
    // "min-width": "120",
    fixed: "right",
    slot: "operation"
  }
];

// 将category 插入 columns中间
// columns.splice(1, 0, ...category);

function handleClick(row) {
  emits("clickDetail", row);
}
</script>

<template>
  <pure-table :data="tableData" :columns="tableColumns" class="!h-[70vh]">
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="handleClick(row)"
        >查看明细</el-button
      >
      <el-button link type="primary" size="small">编辑</el-button>
    </template>
  </pure-table>
</template>
