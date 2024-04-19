<script setup lang="ts">
import { getSummaries, shortcuts } from "@/views/seller-admin/base/utils";
import { useColumns } from "@/views/seller-admin/base/columns";
import { onMounted, ref } from "vue";
import { useSettingStoreHook } from "@/store/modules/settings";
import { useLayout } from "@/layout/hooks/useLayout";

const { formColumns } = useColumns();

const formData = ref({
  user: "",
  date: new Date()
});

const onSubmit = () => {};

const data = [
  {
    name: "猪心肉"
  },
  {
    name: "心"
  },
  {
    name: "肝"
  },
  {
    name: "喉头"
  },
  {
    name: "肚芯"
  },
  {
    name: "肥肠"
  },
  {
    name: "长肠头"
  },
  {
    name: "短肠头"
  }
];
</script>

<template>
  <div class="select-none">
    <el-card>
      <!-- 买家详细信息 -->
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="客户姓名">
          <el-input v-model="formData.user" placeholder="王先生" clearable />
        </el-form-item>
        <el-form-item label="需求日期">
          <el-date-picker
            v-model="formData.date"
            type="date"
            placeholder="需求日期"
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
          :data="data"
          :columns="formColumns"
          show-summary
          :summary-method="getSummaries"
        />
        <!-- 分割线 -->
        <el-divider />
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
