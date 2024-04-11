<script setup lang="ts">
import { ref, computed } from "vue";
import FixColumn from "./base/fixColumn.vue";
import EditDrawer from "./base/editDrawer.vue";

defineOptions({
  name: "PureTable"
});

let columns = [
  {
    name: "护心肉",
    code: 1
  },
  {
    name: "心",
    code: 2
  },
  {
    name: "肝",
    code: 3
  },
  {
    name: "喉头",
    code: 4
  },
  {
    name: "肚芯",
    code: 5
  },
  {
    name: "肥肠",
    code: 6
  },
  {
    name: "长肠头",
    code: 7
  },
  {
    name: "短肠头",
    code: 8
  },
  {
    name: "明肠",
    code: 9
  },
  {
    name: "大肚",
    code: 10
  },
  {
    name: "沙肝",
    code: 11
  },
  {
    name: "花油",
    code: 12
  },
  {
    name: "十二指",
    code: 13
  },
  {
    name: "肺",
    code: 14
  }
];

const tableColumns = computed(() => {
  return [
    {
      label: "买方名称",
      prop: "name",
      fixed: true
    },
    ...columns.map(item => ({
      label: item.name,
      prop: item.code + "",
      fixed: false
    })),
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];
});

let tableData = [];

// tableData 生成30条数据，随机数，name不变
for (let i = 0; i < 30; i++) {
  tableData.push({
    id: i,
    name: "小张",
    categories: columns.map(item => ({
      id: item.code,
      name: item.name,
      code: item.code + "",
      count: Math.floor(Math.random() * 100),
      price: Math.floor(Math.random() * 100)
    }))
  });
}

console.log(tableData);

// 将表格数据拍平
const showTableData = tableData.map(item => {
  const obj = {
    id: item.id,
    name: item.name
  };
  item.categories.forEach(category => {
    obj[category.code] = category.count;
  });
  return obj;
});

console.log(tableData);
const formData = ref();
const formTableData = ref();

const drawerVisible = ref(false);

const viewDetail = row => {
  // 这里可以根据需要添加明细查看逻辑
  console.log("查看明细", row, drawerVisible);
  formData.value.user = row.name;

  drawerVisible.value = true;
};

const emitsClickDetail = row => {
  console.log(row);
  drawerVisible.value = true;
};

const emitsCloseDrawer = () => {
  drawerVisible.value = false;
};
</script>

<template>
  <div>
    <el-card shadow="never">
      <FixColumn
        :table-data="showTableData"
        :table-columns="tableColumns"
        @clickDetail="viewDetail"
      />
    </el-card>
    <EditDrawer v-model:drawerVisible="drawerVisible" :formData="formData" />
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
