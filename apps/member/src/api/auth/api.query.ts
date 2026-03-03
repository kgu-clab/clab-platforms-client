import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

import type { PostLoginRequest } from "./api.model";
import { TOAST_MESSAGES } from "@/constants";
import { postLogin } from "./postLogin";

export const authQueries = {
  postLoginMutation: mutationOptions<unknown, Error, PostLoginRequest>({
    mutationFn: ({ id, password }: PostLoginRequest) => postLogin(id, password),
    onError: () => {
      toast.error(TOAST_MESSAGES.LOGIN.error);
    },
  }),
};
