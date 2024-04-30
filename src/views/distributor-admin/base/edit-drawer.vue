<script setup lang="ts">
import { deviceDetection } from "@pureadmin/utils";
import { Prop, ref, toRefs, reactive, computed, watch, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import type { TableColumnCtx } from "element-plus";
import { getSummaries } from "@/views/seller-admin/base/utils";
import { createDistributor, updateDistributor } from "@/api/distributor";

const isMobile = deviceDetection();
const drawerSize = isMobile ? "100%" : "60%";

const props = defineProps(["formData", "tableData", "inventory", "disabled"]);
const drawerVisible = defineModel("drawerVisible", { default: true });

const { formData, tableData, inventory, disabled } = toRefs(props);

const onSubmit = async () => {
  if (formData.value.id) {
    await updateDistributor(formData.value).then(res => {
      if (res.code != 0) {
        ElMessage({
          message: res.message,
          type: "error"
        });
        return;
      }

      ElMessage({
        message: "保存成功",
        type: "success"
      });
    });
  } else {
    await createDistributor(formData.value).then(res => {
      if (res.code != 0) {
        ElMessage({
          message: res.message,
          type: "error"
        });
        return;
      }

      ElMessage({
        message: "保存成功",
        type: "success"
      });
    });
  }
  drawerVisible.value = false;
};
</script>

<template>
  <el-drawer v-model="drawerVisible" title="编辑详情" :size="drawerSize">
    <!-- 买家详细信息 -->
    <el-form :model="formData" :disabled="disabled" class="demo-form-inline">
      <el-form-item label="客户姓名">
        <el-input v-model="formData.name" placeholder="王先生" clearable />
      </el-form-item>
      <el-form-item label="客户手机号">
        <el-input
          v-model="formData.phone"
          placeholder="18888888888"
          clearable
        />
      </el-form-item>
      <el-form-item label="客户短链接">
        <el-input v-model="formData.urlCode" placeholder="XIAOWANG" clearable />
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
