import { useState, type ReactNode } from "react";

import { ActivityCreateContext } from "./ActivityCreateContext";
import type { CurriculumItem } from "./ActivityCreateContext";

export interface ActivityCreateInitialValues {
  title: string;
  category: "study" | "project";
  description: string;
  curriculumList: CurriculumItem[];
  target: string;
  startDate: string;
  endDate: string;
  techStack: string;
  githubLink: string;
}

interface ActivityCreateProviderProps {
  children: ReactNode;
  initialValues?: ActivityCreateInitialValues;
}

const defaultCurriculumList: CurriculumItem[] = [
  { label: "1주차", content: "" },
  { label: "2주차", content: "" },
  { label: "3주차", content: "" },
];

export const ActivityCreateProvider = ({
  children,
  initialValues,
}: ActivityCreateProviderProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [category, setCategory] = useState<"study" | "project">(
    initialValues?.category ?? "study",
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [curriculumList, setCurriculumList] = useState<CurriculumItem[]>(
    initialValues?.curriculumList?.length
      ? initialValues.curriculumList
      : defaultCurriculumList,
  );
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<
    number | null
  >(null);

  const [target, setTarget] = useState(initialValues?.target ?? "");
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? "");
  const [techStack, setTechStack] = useState(initialValues?.techStack ?? "");
  const [githubLink, setGithubLink] = useState(initialValues?.githubLink ?? "");

  const setCurriculumContent = (index: number, content: string) => {
    setCurriculumList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, content } : item)),
    );
  };

  const handleAddCurriculum = () => {
    const nextWeek = curriculumList.length + 1;
    setCurriculumList([
      ...curriculumList,
      { label: `${nextWeek}주차`, content: "" },
    ]);
  };

  const handleCurriculumClick = (index: number) => {
    setEditingCurriculumIndex(index);
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const value = {
    currentStep,
    setCurrentStep,
    title,
    setTitle,
    category,
    setCategory,
    description,
    setDescription,
    curriculumList,
    setCurriculumList,
    setCurriculumContent,
    editingCurriculumIndex,
    setEditingCurriculumIndex,
    target,
    setTarget,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    techStack,
    setTechStack,
    githubLink,
    setGithubLink,
    handleAddCurriculum,
    handleCurriculumClick,
    handleNext,
    handlePrev,
  };

  return (
    <ActivityCreateContext.Provider value={value}>
      {children}
    </ActivityCreateContext.Provider>
  );
};
