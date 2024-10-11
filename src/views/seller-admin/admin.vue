<script setup lang="tsx">
import { ref, computed, Ref } from "vue";
import FixColumn from "./base/fix-column.vue";
import EditDrawer from "./base/edit-drawer.vue";
import { shortcuts } from "@/views/seller-admin/base/utils";
import { Category, getCategoryByDate } from "@/api/category";
import {
  deleteDistribution,
  DistributionVO,
  exportDistributionList,
  exportAllDistributionData,
  exportAllDistributionDataWithPrice,
  queryDistributionList,
  queryDistributionListByType
} from "@/api/distribution";
import { ElMessage, ElMessageBox } from "element-plus";
import { sellerTableColumns } from "@/views/seller-admin/base/seller-table-columns";

defineOptions({
  name: "PureTable"
});

// 调用接口获取相关数据
let categories: Category[] = [];

const date = ref(new Date());
// 根据数据生成表格列
const tableColumns = ref([]);

const dataList: Ref<DistributionVO[]> = ref([]);
// 将表格数据拍平
const tableData = computed(() => {
  return dataList.value.map(item => {
    let obj = {
      id: item.id,
      name: item.distributorName,
      phone: item.distributorPhone,
      distributionType: item.distributionType,
      date: date.value,
      sortBy: item.distributorSortBy,
      distributionDetailList: [],
      categories: categories
    };
    item.distributionDetailList.forEach(category => {
      obj[category.categoryCode] = category.count;
    });
    obj.distributionDetailList = item.distributionDetailList;
    return obj;
  });
});

let tbLoading = false;

const selectedType = ref("");
const { cellRenderer } = sellerTableColumns();
const refreshData = async () => {
  tbLoading = true;
  // 根据日期获取分类（表头）
  await getCategoryByDate(date.value.toISOString()).then(res => {
    categories = res.data;
    tableColumns.value = [
      {
        type: "selection",
        align: "left"
      },
      {
        label: "买方名称",
        prop: "name",
        fixed: true,
        cellRenderer: cellRenderer,
        "min-width": 140
      },
      ...categories.map(item => ({
        label: item.name,
        prop: item.code,
        fixed: false,
        cellRenderer: cellRenderer,
        "min-width": 124
      })),
      {
        label: "操作",
        prop: "operation",
        fixed: "right",
        slot: "operation",
        "min-width": "220px"
      }
    ];
  });
  await queryDistributionListByType(
    date.value.toISOString(),
    selectedType.value
  ).then(res => {
    dataList.value = res.data;
    console.log("dataList", dataList);
    console.log("tableData", tableData);
    tbLoading = false;
  });
};

refreshData();

const clickEdit = row => {
  defineData(row);
  drawerVisible.value = true;
};

const drawerVisible = ref(false);

let formData = ref({});
let formTableData = ref([]);
let inventory = ref([]);

const editDrawer = ref(null);

function defineData(row) {
  if (!row.id) {
    formData.value = { date: date.value, sortBy: 0 };
    formTableData.value = [];
  } else {
    formData.value = {
      id: row.id,
      user: row.name,
      phone: row.phone,
      date: date,
      sortBy: row.sortBy,
      distributionType: row.distributionType
    };
    formTableData.value = dataList.value.find(
      item => item.id === row.id
    ).distributionDetailList;
  }
  categories.forEach(category => {
    var find = formTableData.value.find(
      item => item.categoryCode === category.code
    );
    if (!find) {
      formTableData.value.push({
        categoryName: category.name,
        categoryCode: category.code,
        count: 0,
        price: Number(category.price),
        sortBy: category.sortBy
      });
    }
  });
  formTableData.value.sort((a, b) => a.sortBy - b.sortBy);
  inventory.value = categories;
  return;
}

const clickExport = row => {
  defineData(row);
  editDrawer.value.exportDataImage();
};

const clickExportWithoutPrice = row => {
  defineData(row);
  editDrawer.value.exportDataWithoutPriceImage();
};

const createDistributionData = () => {
  defineData({ distributionDetailList: [] });
  drawerVisible.value = true;
};

const clickDelete = async row => {
  ElMessageBox.confirm("确定删除这条记录？", "警告", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await deleteDistribution(row.id);
      await refreshData();
      ElMessage({
        message: "删除成功",
        type: "success"
      });
    })
    .catch(() => {});
};

const clickExportAllDistributionData = () => {
  exportAllDistributionData(date.value.toISOString()).then(response => {
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute(
      "download",
      date.value.toLocaleDateString() + "配货单.zip"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
const clickExportAllDistributionDataWithPrice = () => {
  exportAllDistributionDataWithPrice(date.value.toISOString()).then(
    response => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute(
        "download",
        date.value.toLocaleDateString() + "价格单.zip"
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  );
};
const exportDistributionData = () => {
  exportDistributionList(date.value.toISOString()).then(response => {
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute(
      "download",
      date.value.toLocaleDateString() + "汇总数据.xlsx"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

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

// 打印pdf文件
const sellerTable = ref(null);
const isPrint = ref(false);
async function printSignal(_type: string) {
  isPrint.value = true;
  await sellerTable.value
    .print(_type)
    .then(() => {
      isPrint.value = false;
    })
    .catch(() => {
      ElMessage({
        message: "打印错误",
        type: "error"
      });
      isPrint.value = false;
    });
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <el-row class="row-bg">
        <el-col :span="5">
          <el-text class="mx-1">订货日期：</el-text>
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="订货日期"
            :shortcuts="shortcuts"
            clearable
          />
        </el-col>
        <el-col :span="7">
          <el-row>
            <el-col :span="3"> <el-text class="mx-1">分类：</el-text></el-col>
            <el-col :span="10">
              <el-select
                v-model="selectedType"
                placeholder="Select"
                inline
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                /> </el-select
            ></el-col>
            <el-col :span="1" />
            <el-col :span="9">
              <el-button type="primary" @click="refreshData"
                >查询</el-button
              ></el-col
            >
          </el-row>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" @click="createDistributionData"
            >新建配货数据</el-button
          >
          <el-button @click="clickExportAllDistributionData"
            >导出配货单</el-button
          >
          <el-button @click="clickExportAllDistributionDataWithPrice"
            >导出价格单</el-button
          >
          <el-button @click="exportDistributionData">导出汇总数据</el-button>
          <el-button
            :disabled="isPrint"
            type="primary"
            @click="printSignal('goods')"
            >打印配货单</el-button
          >
          <el-button
            :disabled="isPrint"
            type="primary"
            @click="printSignal('price')"
            >打印价格单</el-button
          >
        </el-col>
      </el-row>
      <el-divider />
      <FixColumn
        ref="sellerTable"
        :table-data="tableData"
        :table-columns="tableColumns"
        :tb-loading="tbLoading"
        @clickEdit="clickEdit"
        @clickExport="clickExport"
        @clickDelete="clickDelete"
        @clickExportWithoutPrice="clickExportWithoutPrice"
      />
    </el-card>
    <EditDrawer
      ref="editDrawer"
      v-model:drawerVisible="drawerVisible"
      :formData="formData"
      :table-data="formTableData"
      :inventory="inventory"
      @emitSubmit="refreshData"
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
