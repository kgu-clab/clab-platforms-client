import { mutationOptions } from "@tanstack/react-query";

import { TOAST_MESSAGES } from "@/constants";
import { showErrorToast } from "@/utils/toast";

import type { PostLoginRequest } from "./api.model";
import { postLogin } from "./postLogin";

export const authQueries = {
  postLoginMutation: mutationOptions<unknown, Error, PostLoginRequest>({
    mutationFn: ({ id, password }: PostLoginRequest) => postLogin(id, password),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.LOGIN);
    },
  }),
};
