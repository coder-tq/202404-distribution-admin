<script setup lang="ts">
import { deviceDetection } from "@pureadmin/utils";
import { Prop, ref, toRefs, reactive } from "vue";
import { useColumns } from "./columns";
import { ElMessage } from "element-plus";
import type { TableColumnCtx } from "element-plus";

const { columns } = useColumns();

const isMobile = deviceDetection();
const drawerSize = isMobile ? "100%" : "60%";

const props = defineProps(["formData", "tableData"]);
const drawerVisible = defineModel("drawerVisible", { default: true });

const formInline = props.formData;
const tableData = props.tableData;

const onSubmit = () => {
  console.log(formInline);
  console.log(tableData);
  drawerVisible.value = false;
  ElMessage({
    message: "保存成功",
    type: "success"
  });
};

const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "一周前",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];

interface Product {
  id: string;
  name: string;
  amount1: string;
  amount2: string;
  amount3: number;
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "Total Cost";
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    if (!values.every(value => Number.isNaN(value))) {
      sums[index] = `$ ${values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0)}`;
    } else {
      sums[index] = "N/A";
    }
  });

  return sums;
};
</script>

<template>
  <el-drawer v-model="drawerVisible" title="编辑详情" :size="drawerSize">
    <!-- 买家详细信息 -->
    <el-form
      :inline="true"
      :model="formInline"
      :disabled="false"
      class="demo-form-inline"
    >
      <el-form-item label="客户姓名">
        <el-input v-model="formInline.user" placeholder="王先生" clearable />
      </el-form-item>
      <el-form-item label="订货日期">
        <el-date-picker
          v-model="formInline.date"
          type="date"
          placeholder="订货日期"
          :shortcuts="shortcuts"
          clearable
        />
      </el-form-item>

      <!-- 分割线 -->
      <el-divider />
      <pure-table
        class="!w-[80vw];display: flex;justify-content: center;"
        row-key="id"
        border
        :data="tableData"
        :columns="columns"
        show-summary
        :summary-method="getSummaries"
      />
      <!-- 分割线 -->
      <el-divider />
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
