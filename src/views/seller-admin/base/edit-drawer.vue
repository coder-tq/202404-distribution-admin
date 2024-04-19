<script setup lang="ts">
import { deviceDetection } from "@pureadmin/utils";
import { Prop, ref, toRefs, reactive, computed, watch, watchEffect } from "vue";
import { useColumns } from "./columns";
import { ElMessage } from "element-plus";
import type { TableColumnCtx } from "element-plus";
import { getSummaries } from "@/views/seller-admin/base/utils";

const { columns } = useColumns();

const isMobile = deviceDetection();
const drawerSize = isMobile ? "100%" : "60%";

const props = defineProps(["formData", "tableData", "inventory", "disabled"]);
const drawerVisible = defineModel("drawerVisible", { default: true });

const { formData, tableData, inventory, disabled } = toRefs(props);

const computeTableData = computed(() => {
  return tableData.value.map((item: any) => {
    item.inventory =
      inventory.value.find((category: any) => category.code == item.code)
        ?.inventory - item.count;
    item.totalPrice = item.count * item.price;
    return item;
  });
});

const onSubmit = () => {
  console.log(disabled);
  drawerVisible.value = false;
  ElMessage({
    message: "保存成功",
    type: "success"
  });
};

// 日期组件快捷方式
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
</script>

<template>
  <el-drawer v-model="drawerVisible" title="编辑详情" :size="drawerSize">
    <!-- 买家详细信息 -->
    <el-form
      :inline="true"
      :model="formData"
      :disabled="disabled"
      class="demo-form-inline"
    >
      <el-form-item label="客户姓名">
        <el-input v-model="formData.user" placeholder="王先生" clearable />
      </el-form-item>
      <el-form-item label="订货日期">
        <el-date-picker
          v-model="formData.date"
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
        :data="computeTableData"
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
