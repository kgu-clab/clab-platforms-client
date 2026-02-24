import type { Question } from '@/types';

export const RECRUITMENT_HEAD = ['상태', '모집명', '기간', '분류', '대상'] as const;

export const APPLICATION_TYPE = {
  CORE_TEAM: '코어팀',
  OPERATION: '운영진',
  NORMAL: '회원',
} as const;

export const FAQ: Array<Question> = [
  {
    id: 1,
    question: '모집 인원은 몇 명인가요?',
    answer:
      '신규 모집의 경우, 모집 인원의 수를 제한하고 있지 않아요. 열정을 가지고 활발하게 참여할 수 있는 사람을 찾고 있어요. 그러나 동아리 운영에 지장을 주거나 학습 분위기를 해치는 행위가 발생한다면, 해당 멤버는 동아리에서 제명될 수도 있어요. 다른 모집 단위의 경우, 인원이 명시되면 해당 인원 수에 맞춰 선발하지만, 우수한 지원자가 다수인 경우 더 많은 인원을 선발할 수도 있어요.',
  },
  {
    id: 2,
    question: '면접에선 어떤 것들을 물어보나요?',
    answer:
      '1학년에게는 기술적인 지식을 요구하지 않으므로 간단한 인성 질문만 진행해요. 2학년 이상부터는 인성 질문에 더해 전공 지식과 희망 개발 분야에 필요한 기초적인 기술 질문도 포함돼요.',
  },
  {
    id: 3,
    question: '타학과/복수전공/휴학생도 지원이 가능한가요?',
    answer:
      'C-Lab은 AI컴퓨터공학부 소속 동아리로, 타 학과나 복수전공 학생은 지원이 불가해요. 다만, 2025년부터 새롭게 추가되는 자율전공 학생은 모집 대상에 포함될 예정이에요. 휴학생도 희망하면 동아리 활동에 참여할 수 있어요.',
  },
  {
    id: 4,
    question: '기초적인 실력을 가추고 있어야만 지원이 가능할까요?',
    answer:
      '1학년과 2학년은 주로 스터디에 참여하기 때문에 개발 실력을 요구하지 않아요. 하지만 3학년 이상은 주로 프로젝트를 진행하므로, 이를 위해 필요한 개발 실력을 검증해요.',
  },
];

export const APPLY_PROCESS = {
  NORMAL: {
    title: '회원 지원 절차',
    steps: [
      { step: 1, title: '지원서 작성', description: '아래 양식을 통해 지원서를 제출해주세요.' },
      { step: 2, title: '서류 검토', description: '제출하신 지원서를 검토합니다.' },
      {
        step: 3,
        title: '면접',
        description: '1학년은 인성 면접, 2학년 이상은 기술 면접이 포함됩니다.',
      },
      { step: 4, title: '합격 발표', description: '결과를 개별 안내드립니다.' },
    ],
  },
  OPERATION: {
    title: '운영진 지원 절차',
    steps: [
      { step: 1, title: '지원서 작성', description: '아래 양식을 통해 지원서를 제출해주세요.' },
      { step: 2, title: '서류 검토', description: '운영진 경험 및 역량을 검토합니다.' },
      { step: 3, title: '면접', description: '운영 역량 및 리더십에 대한 면접을 진행합니다.' },
      { step: 4, title: '합격 발표', description: '결과를 개별 안내드립니다.' },
    ],
  },
  CORE_TEAM: {
    title: '코어팀 지원 절차',
    steps: [
      { step: 1, title: '지원서 작성', description: '아래 양식을 통해 지원서를 제출해주세요.' },
      { step: 2, title: '서류 검토', description: '기술 역량 및 프로젝트 경험을 검토합니다.' },
      { step: 3, title: '기술 면접', description: '심층 기술 면접을 진행합니다.' },
      { step: 4, title: '합격 발표', description: '결과를 개별 안내드립니다.' },
    ],
  },
} as const;

export const APPLY_MESSAGE = {
  CAN_APPLY: 'C-Lab은 현재 모집중!',
  CANNOT_APPLY: '지금은 모집기간이 아니에요 😢',
  NOW: '\n망설이지 말고 지금 바로',
  NEXT: '\n다음 모집 때 만나요!',
} as const;

export const FORM_FIELD_MAX_LENGTH = {
  INTERESTS: 255,
  OTHER_ACTIVITIES: 1000,
} as const;
