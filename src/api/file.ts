import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/util";

export const printGoodsFileFDF = printIdList => {
  return http.request<any>(
    "post",
    baseUrlApi("/distribution/exportPDFDistributionDataList"),
    {
      data: {
        ids: printIdList
      }
    },
    { responseType: "blob" }
  );
};

export const printPriceFileFDF = printIdList => {
  return http.request<any>(
    "post",
    baseUrlApi("/distribution/exportPDFDistributionDataWithPriceList"),
    {
      data: {
        ids: printIdList
      }
    },
    { responseType: "blob" }
  );
};
