'use client';

import { Button, Input, Textarea } from '@clab/design-system';
import { cn } from '@clab/design-system/utils';
import Link from 'next/link';
import { useState } from 'react';

import { FORM_FIELD_MAX_LENGTH } from '@/constants/apply';
import { useApplicationMutation } from '@/hooks/apply';
import { formatBirth } from '@/lib';
import type { ApplicationForm as ApplicationFormType, ApplicationType } from '@/types';

interface Props {
  recruitmentId: number;
  applicationType: ApplicationType;
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  currentLength?: number;
  maxLength?: number;
}

function FormField({ label, required, children, currentLength, maxLength }: FormFieldProps) {
  const isOverLimit =
    currentLength !== undefined && maxLength !== undefined && currentLength > maxLength;

  return (
    <label className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
        {currentLength !== undefined && maxLength !== undefined && (
          <span
            className={cn('text-xs', isOverLimit ? 'text-red-500 font-semibold' : 'text-gray-500')}
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}

export default function ApplyFormSection({ recruitmentId, applicationType }: Props) {
  const [form, setForm] = useState<ApplicationFormType>({
    studentId: '',
    recruitmentId,
    name: '',
    contact: '',
    email: '',
    department: '',
    grade: 0,
    birth: '',
    address: '',
    interests: '',
    otherActivities: '',
    githubUrl: '',
    applicationType,
  });
  const [isApplySuccess, setIsApplySuccess] = useState<boolean | null>(null);
  const { applicationMutate, isPending } = useApplicationMutation({ setIsApplySuccess });

  const update = <K extends keyof ApplicationFormType>(key: K, value: ApplicationFormType[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid =
    form.studentId.trim() !== '' &&
    form.name.trim() !== '' &&
    form.contact.trim() !== '' &&
    form.email.trim() !== '' &&
    form.department.trim() !== '' &&
    form.grade > 0 &&
    form.birth.length === 8 &&
    form.address.trim() !== '' &&
    form.interests.length <= FORM_FIELD_MAX_LENGTH.INTERESTS &&
    form.otherActivities.length <= FORM_FIELD_MAX_LENGTH.OTHER_ACTIVITIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const trimmed = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    ) as ApplicationFormType;
    applicationMutate({ ...trimmed, birth: formatBirth(trimmed.birth) });
  };

  if (isApplySuccess === true) {
    return (
      <section className="px-10 py-16 lg:px-[30%]">
        <div className="text-center gap-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900">지원이 완료되었습니다!</h2>
          <p className="mt-2 text-gray-600">결과는 추후 안내드리겠습니다.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-2 text-white hover:opacity-90"
          >
            동아리 더 둘러보기
          </Link>
        </div>
      </section>
    );
  }

  if (isApplySuccess === false) {
    return (
      <section className="px-10 py-16 lg:px-[30%]">
        <div className="text-center gap-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900">지원에 실패했습니다.</h2>
          <p className="mt-2 text-gray-600">다시 시도해주세요.</p>
          <Button size="small" onClick={() => setIsApplySuccess(null)}>
            다시 시도
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-10 py-16 lg:px-[30%]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <h2 className="font-bold text-2xl">지원서 작성</h2>

        <FormField label="학번" required>
          <Input
            variant="outlined"
            className="bg-white"
            value={form.studentId}
            onChange={(e) => update('studentId', e.target.value)}
            placeholder="학번을 입력하세요"
          />
        </FormField>

        <FormField label="이름" required>
          <Input
            variant="outlined"
            className="bg-white"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </FormField>

        <FormField label="연락처" required>
          <Input
            variant="outlined"
            className="bg-white"
            value={form.contact}
            onChange={(e) => update('contact', e.target.value)}
            placeholder="01012340000"
          />
        </FormField>

        <FormField label="이메일" required>
          <Input
            variant="outlined"
            className="bg-white"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="email@example.com"
          />
        </FormField>

        <FormField label="학과" required>
          <Input
            variant="outlined"
            className="bg-white"
            value={form.department}
            onChange={(e) => update('department', e.target.value)}
            placeholder="학과를 입력하세요"
          />
        </FormField>

        <FormField label="학년" required>
          <Input
            variant="outlined"
            className="bg-white"
            type="number"
            min={1}
            max={6}
            value={form.grade || ''}
            onChange={(e) => update('grade', Number(e.target.value) || 0)}
            placeholder="1"
          />
        </FormField>

        <FormField label="생년월일" required>
          <Input
            variant="outlined"
            className="bg-white"
            value={form.birth}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
              update('birth', raw);
            }}
            placeholder="20031021"
            maxLength={8}
          />
        </FormField>

        <FormField label="주소" required>
          <Input
            variant="outlined"
            className="bg-white"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="수원시 (통학소요시간)"
          />
        </FormField>

        <FormField
          label="관심 분야"
          currentLength={form.interests.length}
          maxLength={FORM_FIELD_MAX_LENGTH.INTERESTS}
        >
          <Textarea
            value={form.interests}
            onChange={(e) => update('interests', e.target.value)}
            placeholder="관심 분야를 입력하세요 (최대 255자)"
            rows={4}
          />
        </FormField>

        <FormField
          label="다른 동아리/활동"
          currentLength={form.otherActivities.length}
          maxLength={FORM_FIELD_MAX_LENGTH.OTHER_ACTIVITIES}
        >
          <Textarea
            value={form.otherActivities}
            onChange={(e) => update('otherActivities', e.target.value)}
            placeholder="참여 중인 다른 동아리나 활동을 입력하세요 (최대 1000자)"
            rows={4}
          />
        </FormField>

        <FormField label="GitHub URL">
          <Input
            variant="outlined"
            className="bg-white"
            type="url"
            value={form.githubUrl}
            onChange={(e) => update('githubUrl', e.target.value)}
            placeholder="https://github.com/username"
          />
        </FormField>

        <Button
          type="submit"
          color={!isFormValid || isPending ? 'disabled' : 'active'}
          disabled={!isFormValid || isPending}
        >
          {isPending ? '제출 중...' : '제출하기'}
        </Button>
      </form>
    </section>
  );
}
