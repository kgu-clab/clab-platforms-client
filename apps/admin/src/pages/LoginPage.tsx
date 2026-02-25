import { useState } from 'react';

import { useIsLoggedInState } from '@/model/auth/useIsLoggedIn';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

import { postLogin } from '@/api/auth';
import { setHeaders } from '@/api/client';
import { setTokens, authorization } from '@/lib/auth';

export function LoginPage() {
  const [, setLoggedIn] = useIsLoggedInState();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!id.trim() || !password) {
      setError('아이디와 비밀번호를 입력해 주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await postLogin({ id: id.trim(), password });
      const refreshToken = result.refreshToken ?? result.accessToken;
      setTokens({ accessToken: result.accessToken, refreshToken });
      setHeaders({ Authorization: authorization() });
      setLoggedIn(true);
    } catch {
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-8 rounded-lg border bg-background p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">관리자 로그인</h1>
          <p className="text-muted-foreground text-sm">아이디와 비밀번호를 입력해 주세요.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p className="text-destructive rounded-md bg-destructive/10 px-3 py-2 text-sm">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <label htmlFor="id" className="text-muted-foreground text-sm font-medium">
              아이디
            </label>
            <Input
              id="id"
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-muted-foreground text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
}
