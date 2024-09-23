import { upsertDistribution } from "@/api/distribution";
import { ElMessage } from "element-plus";
import { ref } from "vue";

export function sellerTableColumns() {
  const activeRow = ref(-1);
  const activeColumn = ref(-1);
  const activeValue = ref(null); // 保存旧值
  // 单元格渲染器
  const cellRenderer = ({
    row,
    column,
    index
  }: {
    row?: any;
    column?: any;
    index?: any;
  }) => (
    <div
      className="flex-bc h-[32px]"
      onMouseenter={() =>
        mouseMove(
          index,
          column.getColumnIndex(),
          row[column.property],
          row,
          column
        )
      }
      onmouseleave={() => mouseMove(-1, -1, null)}
    >
      {activeRow.value != index ||
      activeColumn.value != column.getColumnIndex() ? (
        <p>{row[column.property] == "0" ? "" : row[column.property]}</p>
      ) : activeColumn.value == 1 ? (
        <el-input
          v-model={row[column.property]}
          placeholder="王先生"
          onChange={e => inputNumberChange(row, column, e)}
        />
      ) : (
        <el-input-number
          size="small"
          v-model={row[column.property]}
          onChange={e => inputNumberChange(row, column, e)}
        />
      )}
    </div>
  );

  function mouseMove(
    rowIndex: number,
    columnIndex: number,
    oldValue: any,
    row?,
    column?
  ) {
    activeRow.value = rowIndex;
    activeColumn.value = columnIndex;
    // 移入
    if (rowIndex != -1 && columnIndex != -1) {
      // 转换类型
      if (
        activeRow.value == rowIndex &&
        activeColumn.value == columnIndex &&
        activeColumn.value != 1 &&
        row[column.property]
      ) {
        row[column.property] = Number(row[column.property]);
        oldValue = row[column.property];
      }
      activeValue.value = oldValue;
    }
  }

  const inputNumberChange = async (row, column, e: Event) => {
    // 修改姓名
    if (column.getColumnIndex() == 1) {
      if (!row[column.property]) {
        ElMessage({
          message: "姓名不能为空",
          type: "error"
        });
        row[column.property] = activeValue.value;
        return;
      }
    } else {
      const targetElement = row.distributionDetailList.find(
        item => item.categoryName === column.label
      );

      if (targetElement) {
        // 存在对应品种数据
        targetElement.count = e;
      } else {
        // 新建品种数据
        const targetElement = row.categories.find(
          item => item.name === column.label
        );
        row.distributionDetailList.push({
          categoryId: targetElement.id,
          categoryName: targetElement.name,
          categoryCode: targetElement.code,
          price: targetElement.price,
          count: e,
          sortBy: targetElement.sortBy
        });
      }
    }
    let data = {
      id: row.id,
      distributorName: row.name,
      distributionType: row.distributionType,
      distributorPhone: row.phone,
      date: row.date.toISOString(),
      distributorSortBy: row.sortBy,
      distributionDetailList: row.distributionDetailList
    };
    await upsertDistribution(data);
    ElMessage({
      message: "保存成功",
      type: "success"
    });
  };

  return { cellRenderer };
}
