import { baseApi, END_POINT, type ApiResponse } from "@/shared/config";

export const postReissueToken = () => {
  return baseApi.post<ApiResponse<{ accessToken: string }>>(
    END_POINT.AUTH.REISSUE_TOKEN,
  );
};
