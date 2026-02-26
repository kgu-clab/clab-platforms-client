import { Button, Input } from "@clab/design-system";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback, useState } from "react";

import { authQueries } from "@/api/auth/api.query";

type InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;
type InputProps = {
  value: string;
  onChange: InputChangeHandler;
};

const IDInput = memo(({ value, onChange }: InputProps) => (
  <Input
    type="text"
    name="id"
    placeholder="아이디"
    value={value}
    onChange={onChange}
    variant="outlined"
    className="rounded-lg bg-white text-black placeholder:text-black/40"
  />
));
IDInput.displayName = "IDInput";

const PasswordInput = memo(({ value, onChange }: InputProps) => (
  <Input
    name="password"
    type="password"
    placeholder="비밀번호"
    value={value}
    onChange={onChange}
    variant="outlined"
    className="rounded-lg bg-white text-black placeholder:text-black/40"
  />
));
PasswordInput.displayName = "PasswordInput";

export default function LoginForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const postLoginMutation = useMutation(authQueries.postLoginMutation);

  const hasError = false;
  const isFormValid = id.length > 0 && password.length > 0;

  const onIdChange = useCallback<InputChangeHandler>(
    (e) => setId(e.target.value),
    [],
  );

  const onPasswordChange = useCallback<InputChangeHandler>(
    (e) => setPassword(e.target.value),
    [],
  );

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    postLoginMutation.mutate({ id, password });
  };

  return (
    <form className="space-y-lg w-full" onSubmit={handleSubmit}>
      <IDInput value={id} onChange={onIdChange} />
      <PasswordInput value={password} onChange={onPasswordChange} />
      {hasError && (
        <p className="text-warning text-12-regular">
          아이디 또는 비밀번호가 잘못되었어요.
        </p>
      )}
      <Button
        type="submit"
        size="large"
        color={isFormValid ? "active" : "disabled"}
      >
        로그인
      </Button>
    </form>
  );
}
