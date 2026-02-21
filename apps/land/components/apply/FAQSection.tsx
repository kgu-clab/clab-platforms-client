'use client';

import { useState } from 'react';

import { FAQ } from '@/constants';

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="px-10 py-16 lg:px-[30%]">
      <h2 className="text-2xl font-bold mb-8">자주 묻는 질문</h2>
      <div className="flex flex-col divide-y divide-gray-200 border-t border-b border-gray-200">
        {FAQ.map(({ id, question, answer }) => (
          <div key={id}>
            <button
              type="button"
              onClick={() => toggle(id)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="font-medium text-gray-900">{question}</span>
              <span className="ml-4 shrink-0 text-gray-400">{openId === id ? '−' : '+'}</span>
            </button>
            {openId === id && (
              <p className="pb-4 text-sm leading-relaxed text-gray-600">{answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
