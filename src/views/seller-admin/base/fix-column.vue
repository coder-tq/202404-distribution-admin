<script setup lang="ts">
import { ref, toRefs } from "vue";
import { getSummaries } from "@/views/seller-admin/base/utils";
import { upsertDistribution } from "@/api/distribution";
import { ElMessage } from "element-plus";
import { printGoodsFileFDF, printPriceFileFDF } from "@/api/file";

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
  tbLoading?: boolean;
}>();
const tableData = toRefs(props).tableData;

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

// 斑马纹
function sellerTableRowClass(row) {
  if (row.rowIndex % 2 === 0) {
    return "seller-table-sign-row";
  } else {
    return "";
  }
}

const inputNumberChange = async (row: any, column: any, e: Event) => {
  row.oldDetailList[column.getColumnIndex() - 1]["count"] = e;
  // 其他逻辑...
  let data = {
    id: row.id,
    distributorName: row.name,
    distributionType: row.distributionType,
    distributorPhone: row.phone,
    date: row.date.toISOString(),
    distributorSortBy: row.sortBy,
    distributionDetailList: row.oldDetailList
  };
  await upsertDistribution(data);
  ElMessage({
    message: "保存成功",
    type: "success"
  });
};

function cellMouseEnterEvent(row, column, cell, event) {
  // 修改悬停列头样式
  if (column.label === "操作" || column.getColumnIndex() === 0) {
    return;
  }
  const cols = document.querySelectorAll("." + column.id);
  cols.forEach(col => {
    col.classList.add("seller_table-cell-active");
  });
}

function cellMouseLeaveEvent(row, column, cell, event) {
  if (column.label === "操作" || column.getColumnIndex() === 0) {
    return;
  }
  const cols = document.querySelectorAll("." + column.id);
  cols.forEach(col => {
    col.classList.remove("seller_table-cell-active");
  });
}

// 勾选
const multipleSelection = ref([]);
const handleSelectionChange = val => {
  multipleSelection.value = val;
};

// 打印(默认多行)
const isPrint = ref(false);
const print = async (printType: string, isSignal: boolean = false, row?) => {
  const printFunc =
    printType == "goods" ? printGoodsFileFDF : printPriceFileFDF;
  const selectedIds = isSignal
    ? [row.id]
    : multipleSelection.value.map(row => row.id);
  if (selectedIds.length === 0) {
    ElMessage({ message: "未勾选任何数据", type: "warning" });
    return;
  }
  isPrint.value = true;
  await printFunc(selectedIds).then(response => {
    const url = window.URL.createObjectURL(
      new Blob([response], { type: response.type })
    ); // 文件url
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
      iframe.contentWindow.onafterprint = () => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      };
    };
    isPrint.value = false;
  });
  return true;
};

defineExpose({
  print
});
</script>

<template>
  <pure-table
    id="seller-table"
    v-loading="tbLoading"
    :data="tableData"
    :columns="tableColumns"
    :border="true"
    show-summary
    :summary-method="getSummaries"
    class="!h-[70vh]"
    style="font-size: 16px; font-weight: 600"
    :row-class-name="sellerTableRowClass"
    header-cell-class-name="seller-table-header-cell"
    @cell-mouse-enter="cellMouseEnterEvent"
    @cell-mouse-leave="cellMouseLeaveEvent"
    @selection-change="handleSelectionChange"
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

      <el-button
        link
        :disabled="isPrint"
        type="primary"
        size="small"
        @click="print('goods', true, row)"
        >配货单</el-button
      >
      <el-button
        link
        :disabled="isPrint"
        type="primary"
        size="small"
        @click="print('price', true, row)"
        >价格单</el-button
      >
    </template>
  </pure-table>
</template>

<style lang="scss">
#seller-table {
  .seller-table-sign-row {
    background-color: #f0f7faff !important;
  }

  .el-table .el-table__body tr:hover > td {
    background-color: #accaf8 !important;
  }

  .seller-table-header-cell {
    color: black !important;
  }

  .seller_table-cell-active {
    background-color: #accaf8 !important;
    transition: 0.4s;
  }

  .el-button:hover {
    color: #002ead !important;
  }
}
</style>
