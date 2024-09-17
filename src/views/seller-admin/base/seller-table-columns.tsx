import { upsertDistribution } from "@/api/distribution";
import { ElMessage } from "element-plus";
import { ref } from "vue";

export function sellerTableColumns() {
  const activeIndex = ref(-1);
  const activeColumn = ref(-1);

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
      onMouseenter={() => mouseMove(index, column.getColumnIndex())}
      onmouseleave={() => mouseMove(-1, -1)}
    >
      {activeIndex.value != index ||
      activeColumn.value != column.getColumnIndex() ? (
        <p>{row[column.property] == "0" ? "-" : row[column.property]}</p>
      ) : (
        <el-input-number
          size="small"
          v-model={row[column.property]}
          onChange={e => inputNumberChange(row, column, e)}
        />
      )}
    </div>
  );

  function mouseMove(rowIndex: number, columnIndex: number) {
    activeIndex.value = rowIndex;
    activeColumn.value = columnIndex;
  }

  const inputNumberChange = async (row: any, column: any, e: Event) => {
    row.oldDetailList.forEach((item: any) => {
      if (item.categoryName == column.label) {
        item.count = e;
      }
    });
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
