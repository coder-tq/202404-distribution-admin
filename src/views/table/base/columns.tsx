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
      onMouseenter={() => {
        activeIndex.value = index;
        activeColumn.value = column.getColumnIndex();
      }}
      onMouseleave={() => onMouseleave(index, column.getColumnIndex())}
    >
      {!editing.value(index, column.getColumnIndex()) ? (
        <p>{row[column.property]}</p>
      ) : (
        <>
          <el-input v-model={row[column.property]} />
          <iconify-icon-offline
            icon={Check}
            class={iconClass.value(index, column.getColumnIndex())}
            onClick={() => onSave(index, column.getColumnIndex())}
          />
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
  const columns: TableColumnList = [
    {
      label: "品类",
      prop: "name"
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
      label: "库存",
      prop: "inventory"
    }
  ];

  function onMouseleave(index, column) {
    editing.value[index]?.[column]
      ? ((activeIndex.value = index), (activeColumn.value = column))
      : ((activeIndex.value = -1), (activeColumn.value = -1));
  }

  function onEdit(row, index, column) {
    console.log(index, column);
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
    columns
  };
}
