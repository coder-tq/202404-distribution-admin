<script setup lang="ts">
import { deviceDetection } from "@pureadmin/utils";
import { Prop, ref, toRefs, reactive, computed, watch, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import type { TableColumnCtx } from "element-plus";
import { getSummaries } from "@/views/seller-admin/base/utils";
import { createDistributor, updateDistributor } from "@/api/distributor";
import { updateCategoryByDate } from "@/api/category";

const isMobile = deviceDetection();
const drawerSize = isMobile ? "100%" : "60%";

const props = defineProps(["formData", "tableData", "inventory", "disabled"]);
const drawerVisible = defineModel("drawerVisible", { default: true });
const emits = defineEmits(["emitSubmit"]);

const { formData, tableData, inventory, disabled } = toRefs(props);

const onSubmit = async () => {
  await updateCategoryByDate({
    categoryId: formData.value.id,
    price: formData.value.price,
    inventory: formData.value.inventory,
    date: new Date().toISOString()
  });
  drawerVisible.value = false;
  emits("emitSubmit");
};
</script>

<template>
  <el-drawer v-model="drawerVisible" title="编辑详情" :size="drawerSize">
    <!-- 买家详细信息 -->
    <el-form
      ref="exportImage"
      :model="formData"
      :disabled="disabled"
      class="demo-form-inline"
    >
      <el-form-item label="类别名称">
        <el-input
          v-model="formData.name"
          placeholder="猪肉"
          disabled
          clearable
        />
      </el-form-item>
      <el-form-item label="类别编码">
        <el-input
          v-model="formData.code"
          placeholder="pork"
          disabled
          clearable
        />
      </el-form-item>
      <el-form-item label="类别库存">
        <el-input v-model="formData.inventory" placeholder="10" clearable />
      </el-form-item>
      <el-form-item label="今日单价">
        <el-input v-model="formData.price" placeholder="10" clearable />
      </el-form-item>
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
