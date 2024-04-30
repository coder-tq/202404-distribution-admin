import { http } from "@/utils/http";
import type { Result } from "@/api/result";
import { baseUrlApi } from "@/api/util";

export type Category = {
  id: string;
  name: string;
  code: string;
  price: string;
  inventory: string | number;
};

export const getCategoryByDate = (date: string) => {
  return http.request<Result<Category[]>>("get", baseUrlApi("/category"), {
    params: {
      date: date
    }
  });
};

type UpdateCategoryListRequest = {
  categoryDetailList: {
    categoryId: string;
    price: string;
    inventory: string;
  }[];
  date: string;
};

export const updateCategoryListByDate = (
  updateCategoryRequest: UpdateCategoryListRequest
) => {
  return http.request<Result<boolean>>(
    "post",
    baseUrlApi("/category/updateListByDate"),
    {
      data: updateCategoryRequest
    }
  );
};

type UpdateCategoryRequest = {
  categoryId: string;
  price: string;
  inventory: string;
  date: string;
};

export const updateCategoryByDate = (
  updateCategoryRequest: UpdateCategoryRequest
) => {
  return http.request<Result<boolean>>(
    "post",
    baseUrlApi("/category/updateByDate"),
    {
      data: updateCategoryRequest
    }
  );
};
