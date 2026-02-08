import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'C-Lab 지원하기',
  icons: {
    icon: '/images/clab-logo-colored.png',
  },
  description: '경기대학교 컴퓨터공학부 개발보안동아리, C-Lab 입니다! 👋',
  keywords: ['C-Lab', '경기대학교', '컴퓨터공학부', '개발보안동아리'],
  openGraph: {
    title: 'C-Lab 지원하기',
    description: '경기대학교 컴퓨터공학부 개발보안동아리, C-Lab 입니다! 👋',
    images: ['/images/clab-logo-long-colored.png'],
  },
};

export default function ApplyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
