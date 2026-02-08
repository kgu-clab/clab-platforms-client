export type ApplicationType = 'regular' | 'mentor';

export type ApplicationForm = {
  studentId: string;
  recruitmentId: number;
  name: string;
  contact: string;
  email: string;
  department: string;
  grade: number;
  birth: string;
  address: string;
  interests: string;
  otherActivities: string;
  githubUrl: string;
  applicationType: ApplicationType;
};

export const APPLICATION_TYPE_OPTIONS: { value: ApplicationType; label: string }[] = [
  { value: 'regular', label: '일반' },
  { value: 'mentor', label: '멘토' },
];
