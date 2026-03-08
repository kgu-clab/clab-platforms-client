import { createContext } from "react";

export interface CurriculumItem {
  label: string;
  content: string;
}

export interface ActivityCreateContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;

  title: string;
  setTitle: (value: string) => void;
  category: "study" | "project";
  setCategory: (value: "study" | "project") => void;
  description: string;
  setDescription: (value: string) => void;
  curriculumList: CurriculumItem[];
  setCurriculumList: (value: CurriculumItem[]) => void;
  setCurriculumContent: (index: number, content: string) => void;
  editingCurriculumIndex: number | null;
  setEditingCurriculumIndex: (index: number | null) => void;

  target: string;
  setTarget: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  techStack: string;
  setTechStack: (value: string) => void;
  githubLink: string;
  setGithubLink: (value: string) => void;

  handleAddCurriculum: () => void;
  handleCurriculumClick: (index: number) => void;
  handleNext: () => void;
  handlePrev: () => void;
}

export const ActivityCreateContext = createContext<
  ActivityCreateContextType | undefined
>(undefined);
