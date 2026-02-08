'use client';

import Input from '@clab/design-system/input';
import Textarea from '@clab/design-system/textarea';
import { useState } from 'react';

import type { ApplicationForm as ApplicationFormType, ApplicationType } from './types';
import { APPLICATION_TYPE_OPTIONS } from './types';

const initialForm: ApplicationFormType = {
  studentId: '',
  recruitmentId: 0,
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
  applicationType: 'regular',
};

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

export default function ApplyPage() {
  const [form, setForm] = useState<ApplicationFormType>(initialForm);

  const update = <K extends keyof ApplicationFormType>(key: K, value: ApplicationFormType[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="flex min-h-screen flex-col relative bg-gray-50">
      <div className="w-full mx-auto pb-12">
        <h1 className="text-2xl font-bold text-white mb-8 bg-primary py-10 px-10">
          C-Lab 지원하기
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mx-auto max-w-[800px] px-10">
          <h3 className="font-bold text-2xl">개인 정보</h3>
          <FormField label="지원 유형" required>
            <select
              value={form.applicationType}
              onChange={(e) => update('applicationType', e.target.value as ApplicationType)}
              className="text-15-medium placeholder:text-gray-3 focus:outline-none focus:text-black w-full border border-gray-2 rounded-md px-xl py-lg bg-white"
            >
              {APPLICATION_TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FormField>

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
              placeholder="010-0000-0000"
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
              onChange={(e) => update('birth', e.target.value)}
              placeholder="2000-01-01"
            />
          </FormField>

          <FormField label="주소" required>
            <Input
              variant="outlined"
              className="bg-white"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="주소를 입력하세요"
            />
          </FormField>

          <h3 className="font-bold text-2xl">지원 동기 및 관심 분야</h3>

          <FormField label="관심 분야">
            <Textarea
              value={form.interests}
              onChange={(e) => update('interests', e.target.value)}
              placeholder="관심 분야를 입력하세요"
              rows={4}
            />
          </FormField>

          <FormField label="다른 동아리/활동">
            <Textarea
              value={form.otherActivities}
              onChange={(e) => update('otherActivities', e.target.value)}
              placeholder="참여 중인 다른 동아리나 활동을 입력하세요"
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

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-primary py-3 text-base font-semibold text-white hover:opacity-90"
          >
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
}
