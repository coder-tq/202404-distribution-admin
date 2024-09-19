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
        mouseMove(index, column.getColumnIndex(), row[column.property])
      }
      onmouseleave={() => mouseMove(-1, -1, null)}
    >
      {activeRow.value != index ||
      activeColumn.value != column.getColumnIndex() ? (
        <p>{row[column.property] == "0" ? "-" : row[column.property]}</p>
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

  function mouseMove(rowIndex: number, columnIndex: number, oldValue: any) {
    activeRow.value = rowIndex;
    activeColumn.value = columnIndex;
    // 移入
    if (rowIndex != -1 && columnIndex != -1) {
      activeValue.value = oldValue;
    }
  }

  const inputNumberChange = async (row: any, column: any, e: Event) => {
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
      row.oldDetailList.forEach((item: any) => {
        if (item.categoryName == column.label) {
          item.count = e;
        }
      });
    }
    let data = {
      id: row.id,
      distributorName: row.name,
      distributionType: row.distributionType,
      distributorPhone: row.phone,
      date: row.date.toISOString(),
      distributorSortBy: row.sortBy,
      distributionDetailList: row.oldDetailList
    };
    await upsertDistribution(data);
    ElMessage({
      message: "保存成功",
      type: "success"
    });
  };

  return { cellRenderer };
}
