<script setup lang="ts">
import { ref, computed } from "vue";
import FixColumn from "./base/fix-column.vue";
import EditDrawer from "./base/edit-drawer.vue";
import { shortcuts } from "@/views/seller-admin/base/utils";

defineOptions({
  name: "PureTable"
});

// 调用接口获取相关数据
let categories = [
  {
    name: "护心肉",
    code: 1,
    // 初始库存
    inventory: 10000
  },
  {
    name: "心",
    code: 2,
    // 初始库存
    inventory: 10000
  },
  {
    name: "肝",
    code: 3,
    // 初始库存
    inventory: 10000
  },
  {
    name: "喉头",
    code: 4,
    // 初始库存
    inventory: 10000
  },
  {
    name: "肚芯",
    code: 5,
    // 初始库存
    inventory: 10000
  },
  {
    name: "肥肠",
    code: 6,
    // 初始库存
    inventory: 10000
  },
  {
    name: "长肠头",
    code: 7,
    // 初始库存
    inventory: 10000
  },
  {
    name: "短肠头",
    code: 8,
    // 初始库存
    inventory: 10000
  },
  {
    name: "明肠",
    code: 9,
    // 初始库存
    inventory: 10000
  },
  {
    name: "大肚",
    code: 10,
    // 初始库存
    inventory: 10000
  },
  {
    name: "沙肝",
    code: 11,
    // 初始库存
    inventory: 10000
  },
  {
    name: "花油",
    code: 12,
    // 初始库存
    inventory: 10000
  },
  {
    name: "十二指",
    code: 13,
    // 初始库存
    inventory: 10000
  },
  {
    name: "肺",
    code: 14,
    // 初始库存
    inventory: 10000
  }
];

let dataList = [];
// tableData 生成30条数据，随机数，name不变
for (let i = 0; i < 30; i++) {
  dataList.push({
    id: i,
    name: "小张",
    categories: categories.map(item => ({
      id: item.code,
      name: item.name,
      code: item.code + "",
      count: Math.floor(Math.random() * 100),
      price: Math.floor(Math.random() * 100)
    }))
  });
}

// 根据数据生成表格列
const tableColumns = computed(() => {
  return [
    {
      label: "买方名称",
      prop: "name",
      fixed: true
    },
    ...categories.map(item => ({
      label: item.name,
      prop: item.code + "",
      fixed: false
    })),
    {
      label: "操作",
      prop: "operation",
      fixed: "right",
      slot: "operation"
    }
  ];
});

// 将表格数据拍平
const tableData = dataList.map(item => {
  const obj = {
    id: item.id,
    name: item.name
  };
  item.categories.forEach(category => {
    obj[category.code] = category.count;
  });
  return obj;
});

console.log(dataList);

const clickEdit = row => {
  // 这里可以根据需要添加明细查看逻辑
  console.log("查看明细", row, drawerVisible);
  formData.value = { user: row.name };
  formTableData.value = dataList.find(item => item.id === row.id).categories;
  // 遍历 dataList，并对每个类别的库存进行累加
  dataList.forEach(item => {
    if (item.id === row.id) {
      return;
    }
    item.categories.forEach(category => {
      let inventoryItem = categories.find(i => i.code == category.code);
      if (inventoryItem) {
        inventoryItem.inventory -= category.count;
      }
    });
  });

  // 将计算出的剩余库存赋值给 inventory
  inventory.value = categories;
  drawerVisible.value = true;
};

const drawerVisible = ref(false);

let formData = ref({});
let formTableData = ref([]);
let inventory = ref([]);

const date = ref(new Date());
</script>

<template>
  <div>
    <el-card shadow="never">
      <el-row class="row-bg">
        <el-col :span="8"
          ><el-text class="mx-1">订货日期：</el-text>
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="订货日期"
            :shortcuts="shortcuts"
            clearable
        /></el-col>
        <el-col :span="16">
          <el-button>导出所有数据</el-button>
        </el-col>
      </el-row>
      <el-divider />
      <FixColumn
        :table-data="tableData"
        :table-columns="tableColumns"
        @clickEdit="clickEdit"
      />
    </el-card>
    <EditDrawer
      v-model:drawerVisible="drawerVisible"
      :formData="formData"
      :table-data="formTableData"
      :inventory="inventory"
    />
  </div>
</template>

<style scoped>
:deep(.el-tabs__nav-wrap)::after {
  height: 1px;
}

:deep(.el-tabs__header) {
  margin-top: 10px;
}

:deep(.el-alert__title) {
  font-size: 15px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.el-tabs__nav-next.is-disabled),
:deep(.el-tabs__nav-prev.is-disabled) {
  opacity: 0.5;
}
</style>
./base/render
