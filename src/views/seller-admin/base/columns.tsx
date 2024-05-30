import { ref, computed } from "vue";

import EditPen from "@iconify-icons/ep/edit-pen";
import Check from "@iconify-icons/ep/check";

export function useColumns() {
  const editMap = ref({});
  const activeIndex = ref(-1);
  const activeColumn = ref(-1);

  const editing = computed(() => {
    return (index, column) => {
      return editMap.value[index]?.[column]?.editing;
    };
  });

  const iconClass = computed(() => {
    return (index, column, other = false) => {
      return [
        "cursor-pointer",
        "ml-2",
        "transition",
        "delay-100",
        other
          ? ["hover:scale-110", "hover:text-red-500"]
          : editing.value(index, column) && ["scale-150", "text-red-500"]
      ];
    };
  });

  const cellRenderer = ({
    row,
    index,
    column
  }: {
    row?: any;
    index?: number;
    column?: any;
  }) => (
    <div
      class="flex-bc w-full h-[32px]"
      // onMouseenter={() => {
      //   activeIndex.value = index;
      //   activeColumn.value = column.getColumnIndex();
      // }}
      onMouseleave={() => onMouseleave(index, column.getColumnIndex())}
    >
      {
      //   !editing.value(index, column.getColumnIndex()) ? (
      //   <p>
      //     {column.property === "price" ? "￥" : ""}
      //     {row[column.property]}
      //   </p>
      // ) :
          (
        <>
          <el-input-number size="small" v-model={row[column.property]} />
          {/*<iconify-icon-offline*/}
          {/*  icon={Check}*/}
          {/*  class={iconClass.value(index, column.getColumnIndex())}*/}
          {/*  onClick={() => onSave(index, column.getColumnIndex())}*/}
          {/*/>*/}
        </>
      )}
      {activeIndex.value == index &&
      activeColumn.value == column.getColumnIndex() ? (
        <iconify-icon-offline
          v-show={
            activeIndex.value === index &&
            !editing.value(index, column.getColumnIndex())
          }
          icon={EditPen}
          class={iconClass.value(index, column.getColumnIndex(), true)}
          onClick={() => onEdit(row, index, column.getColumnIndex())}
        />
      ) : (
        <></>
      )}
    </div>
  );

  const priceCellRenderer = ({
    row,
    column
  }: {
    row?: any;
    index?: number;
    column?: any;
  }) => (
    <div class="flex-bc w-full h-[32px]">
      <p>
        {column.property === "totalPrice" ? "￥" : ""}
        {row[column.property]}
      </p>
    </div>
  );

  const columns: TableColumnList = [
    {
      label: "品类",
      prop: "categoryName"
    },
    {
      label: "数量",
      prop: "count",
      cellRenderer: cellRenderer
    },
    {
      label: "单价",
      prop: "price",
      cellRenderer: cellRenderer
    },
    {
      label: "总价",
      prop: "totalPrice",
      cellRenderer: priceCellRenderer
    },
    {
      label: "库存",
      prop: "inventory"
    }
  ];

  const formColumns: TableColumnList = [
    {
      label: "品类",
      prop: "name"
    },
    {
      label: "数量",
      prop: "count",
      cellRenderer: cellRenderer
    }
  ];

  function onMouseleave(index, column) {
    editing.value[index]?.[column]
      ? ((activeIndex.value = index), (activeColumn.value = column))
      : ((activeIndex.value = -1), (activeColumn.value = -1));
  }

  function onEdit(row, index, column) {
    for (let rowIndex in editMap.value) {
      for (let columnIndex in editMap.value[rowIndex]) {
        editMap.value[rowIndex][columnIndex].editing = false;
      }
    }
    if (!editMap.value[index]) {
      // 如果不存在，首先创建一个空对象
      editMap.value[index] = {};
    }

    // 然后，为特定的列设置编辑状态和行数据
    // 使用 Object.assign 来合并行数据和 { editing: true }
    editMap.value[index][column] = Object.assign({}, row, { editing: true });
  }

  function onSave(index, column) {
    editMap.value[index][column].editing = false;
  }

  return {
    columns,
    formColumns
  };
}
