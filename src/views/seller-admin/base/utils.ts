import { create, all } from "mathjs";

export function getSummaries(param) {
  const { columns, data } = param;
  const sums: string[] = [];

  const math = create(all);
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计";
      return;
    }
    if (
      column.property == "price" ||
      column.property == "inventory" ||
      column.property == "operation"
    ) {
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    if (!values.every(value => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return math.add(math.bignumber(prev), math.bignumber(curr));
        } else {
          return prev;
        }
      }, 0)}`;
    } else {
      sums[index] = "";
    }
    if (sums[index] == "0") {
      sums[index] = "";
    }
  });

  return sums;
}
export const shortcuts = [
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
