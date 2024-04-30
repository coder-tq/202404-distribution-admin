import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/util";
import type { Result } from "@/api/result";

type Distributor = {
  id: string;
  name: string;
  phone: string;
  urlCode: string;
};

export const getDistributor = (code: string) => {
  return http.request<Result<Distributor[]>>(
    "get",
    baseUrlApi("/distributor/getByUrlCode"),
    {
      params: {
        code: code
      }
    }
  );
};
export const getAllDistributor = () => {
  return http.request<Result<Distributor[]>>(
    "get",
    baseUrlApi("/distributor/getAll")
  );
};

export const createDistributor = (data: Distributor) => {
  return http.request<Result<boolean>>(
    "post",
    baseUrlApi("/distributor/create"),
    { data: data }
  );
};
export const updateDistributor = (data: Distributor) => {
  return http.request<Result<boolean>>(
    "post",
    baseUrlApi("/distributor/update"),
    { data: data }
  );
};
