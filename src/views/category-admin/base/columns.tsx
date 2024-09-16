import { ElMessage } from "element-plus";
import { updateCategoryByDate } from "@/api/category";

export function categoryColumns() {
  const cellRenderer = ({ row, column }: { row?: any; column?: any }) => (
    <div class="flex-bc w-full h-[32px]">
      {
        <el-input-number
          size="small"
          v-model={row[column.property]}
          onChange={e => inputNumberChange(row, column, e)}
        />
      }
    </div>
  );

  const inputNumberChange = async (row: any, column: any, e: Event) => {
    row[column.property] = e;
    console.log(row);
    let data = {
      categoryId: row.id,
      price: row.price,
      inventory: row.inventory,
      sortBy: row.sortBy,
      date: new Date().toISOString()
    };
    await updateCategoryByDate(data);
    ElMessage({
      message: "保存成功",
      type: "success"
    });
  };

  return {
    cellRenderer
  };
}
