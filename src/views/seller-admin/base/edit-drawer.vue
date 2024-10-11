<script setup lang="ts">
import { deviceDetection } from "@pureadmin/utils";
import {
  Prop,
  ref,
  toRefs,
  reactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  onUnmounted
} from "vue";
import { useColumns } from "./columns";
import { ElMessage } from "element-plus";
import { getSummaries } from "@/views/seller-admin/base/utils";
import { upsertDistribution } from "@/api/distribution";
import { all, create } from "mathjs";

const { columns } = useColumns();
// 去除库存、单价列
const snapshotColumns = columns.slice(0, -3);

const isMobile = deviceDetection();
const drawerSize = isMobile ? "100%" : "60%";

const props = defineProps(["formData", "tableData", "inventory", "disabled"]);
const drawerVisible = defineModel("drawerVisible", { default: true });
const emits = defineEmits(["emitSubmit"]);

const { formData, tableData, inventory, disabled } = toRefs(props);

const math = create(all, { number: "BigNumber", precision: 20 });

const computeTableData = computed(() => {
  return tableData.value.map((item: any) => {
    item.inventory = inventory.value.find(
      (category: any) => category.code == item.categoryCode
    )?.inventory;
    item.totalPrice = math
      .multiply(math.bignumber(item.count), math.bignumber(item.price))
      .toString();
    return item;
  });
});

// 表单校验规则
const rules = {
  user: [{ required: true, message: "请输入名称", trigger: "blur" }],
  sortBy: [{ required: true, message: "请输入排序", trigger: "blur" }],
  distributionType: [{ required: true, message: "请选择分类", trigger: "blur" }]
};

const form = ref();

const onSubmit = async () => {
  await form.value.validate();
  let data = {
    id: formData.value.id,
    distributorName: formData.value.user,
    distributionType: formData.value.distributionType,
    distributorPhone: formData.value.phone,
    date: formData.value.date.toISOString(),
    distributorSortBy: formData.value.sortBy,
    distributionDetailList: tableData.value
  };
  await upsertDistribution(data);
  drawerVisible.value = false;
  ElMessage({
    message: "保存成功",
    type: "success"
  });
  emits("emitSubmit");
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

const options = [
  {
    value: "自家车",
    label: "自家车"
  },
  {
    value: "冯车",
    label: "冯车"
  },
  {
    value: "自提",
    label: "自提"
  }
];

// 窗口高度
const screenHeight = ref(window.innerHeight);

const updateTableHeight = () => {
  screenHeight.value = window.innerHeight;
};
// 监听窗口变化
onMounted(() => {
  window.addEventListener("resize", updateTableHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateTableHeight);
});
// 表格高度自适应窗口
const heights = computed(() => {
  return Number(Math.ceil(screenHeight.value - 400));
});
</script>

<template>
  <div>
    <el-drawer v-model="drawerVisible" title="编辑详情" :size="drawerSize">
      <!-- 买家详细信息 -->
      <el-form
        ref="form"
        :inline="true"
        :model="formData"
        :disabled="disabled"
        class="demo-form-inline"
        :rules="rules"
      >
        <el-form-item prop="user" label="客户名称">
          <el-input v-model="formData.user" placeholder="王先生" clearable />
        </el-form-item>
        <el-form-item prop="phone" label="客户手机号">
          <el-input
            v-model="formData.phone"
            placeholder="18888888888"
            clearable
          />
        </el-form-item>

        <el-form-item prop="sortBy" label="客户排序">
          <el-input-number v-model="formData.sortBy" :precision="0" />
        </el-form-item>
        <el-form-item prop="distributionType" label="客户自提分类">
          <el-select
            v-model="formData.distributionType"
            placeholder="Select"
            style="width: 240px"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          border
          :data="computeTableData"
          :columns="columns"
          show-summary
          :summary-method="getSummaries"
          :max-height="heights"
          header-cell-class-name="edit-table-header-cell"
          style="font-size: 16px; font-weight: 600"
        />

        <!-- 分割线 -->
        <el-divider />
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

:deep(.edit-table-header-cell) {
  color: black !important;
}
</style>
