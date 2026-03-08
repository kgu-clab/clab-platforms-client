import { useState, type ReactNode } from "react";

import { ActivityCreateContext } from "./ActivityCreateContext";
import type { CurriculumItem } from "./ActivityCreateContext";

interface ActivityCreateProviderProps {
  children: ReactNode;
}

const initialCurriculumList: CurriculumItem[] = [
  { label: "1주차", content: "" },
  { label: "2주차", content: "" },
  { label: "3주차", content: "" },
];

export const ActivityCreateProvider = ({
  children,
}: ActivityCreateProviderProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"study" | "project">("study");
  const [description, setDescription] = useState("");
  const [curriculumList, setCurriculumList] = useState<CurriculumItem[]>(
    initialCurriculumList,
  );
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<
    number | null
  >(null);

  const [target, setTarget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubLink, setGithubLink] = useState("");

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
