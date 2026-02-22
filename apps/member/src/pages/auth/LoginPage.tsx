import { LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <section className="via-primary-sub/50 bg-linear-to-b px-gutter my-auto grid h-[90vh] place-items-center from-white to-white">
      <div className="flex w-full flex-col items-center pb-[60px]">
        <img src="/logo/logo.svg" alt="logo" className="size-40" />
        <div className="text-tertiary -mt-8 mb-8 text-lg font-medium">
          C-Lab 계정으로 로그인하기
        </div>
        <LoginForm />
      </div>
    </section>
  );
}
