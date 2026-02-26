import { mutationOptions } from "@tanstack/react-query";

import type { PostLoginRequest } from "./api.model";
import { postLogin } from "./postLogin";

export const authQueries = {
  postLoginMutation: mutationOptions<unknown, Error, PostLoginRequest>({
    mutationFn: ({ id, password }: PostLoginRequest) => postLogin(id, password),
  }),
};
