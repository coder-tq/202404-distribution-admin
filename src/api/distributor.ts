import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/util";

type Distributor = {
  id: number;
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
