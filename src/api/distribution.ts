import { http } from "@/utils/http";
import type { Result } from "@/api/result";
import { baseUrlApi } from "@/api/util";

export type DistributionVO = {
  id: string;
  distributorName: string;
  distributionType: string;
  distributorPhone: string;
  date: string;
  distributionDetailList: {
    id: string;
    categoryId: string;
    categoryName: string;
    categoryCode: string;
    price: string;
    count: string;
  }[];
};

export const upsertDistribution = (distributionVO: DistributionVO) => {
  return http.request<Result<boolean>>(
    "post",
    baseUrlApi("/distribution/upsert"),
    {
      data: distributionVO
    }
  );
};

export const deleteDistribution = (id: String) => {
  return http.request<Result<boolean>>(
    "post",
    baseUrlApi("/distribution/delete"),
    {
      params: {
        id: id
      }
    }
  );
};

export const queryDistributionList = (date: String) => {
  return http.request<Result<DistributionVO[]>>(
    "get",
    baseUrlApi("/distribution/queryByDate"),
    {
      params: {
        date: date
      }
    }
  );
};

export const queryDistributionListByType = (
  date: String,
  distributionType: String
) => {
  return http.request<Result<DistributionVO[]>>(
    "get",
    baseUrlApi("/distribution/queryByDateAndType"),
    {
      params: {
        date: date,
        distributionType: distributionType
      }
    }
  );
};

export const exportDistributionList = (date: String) => {
  return http.request<any>(
    "get",
    baseUrlApi("/distribution/export"),
    {
      params: {
        date: date
      }
    },
    { responseType: "blob" }
  );
};

export const exportAllDistributionData = (date: String) => {
  return http.request<any>(
    "get",
    baseUrlApi("/distribution/exportAllByDate"),
    {
      params: {
        date: date
      }
    },
    { responseType: "blob" }
  );
};

export const exportAllDistributionDataWithPrice = (date: String) => {
  return http.request<any>(
    "get",
    baseUrlApi("/distribution/exportAllWithPriceByDate"),
    {
      params: {
        date: date
      }
    },
    { responseType: "blob" }
  );
};
