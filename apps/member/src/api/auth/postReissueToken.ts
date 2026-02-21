import { baseApi, END_POINT, type ApiResponse } from "@/api/config";

export const postReissueToken = () => {
  return baseApi.post<ApiResponse<{ accessToken: string }>>(
    END_POINT.AUTH.REISSUE_TOKEN,
  );
};
