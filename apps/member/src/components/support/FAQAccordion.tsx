import { useState } from "react";
import { GoChevronDown } from "react-icons/go";

import type { FAQ } from "@/constants/faq";

interface FAQAccordionProps {
  faq: FAQ;
}

export default function FAQAccordion({ faq }: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { question, answer } = faq;

  return (
    <div className="border-b-gray-2 gap-md px-gutter py-xl flex flex-col border-b">
      <div
        className="flex cursor-pointer items-center justify-between"
        role="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-14-medium mr-3 text-black">{question}</span>
        <GoChevronDown
          className={`text-gray-4 size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && (
        <p className="text-13-regular text-gray-4 whitespace-pre-wrap">
          {answer}
        </p>
      )}
    </div>
  );
}
