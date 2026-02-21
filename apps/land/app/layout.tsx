import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Header } from '@/components/common';
import { QueryProvider } from '@/lib';
import { wantedSans } from './font';

import './globals.css';

export const metadata: Metadata = {
  title: 'C-Lab',
  icons: {
    icon: '/images/clab-logo-colored.png',
  },
  description: '경기대학교 컴퓨터공학부 개발보안동아리, C-Lab 입니다! 👋',
  keywords: ['C-Lab', '경기대학교', '컴퓨터공학부', '개발보안동아리'],
  openGraph: {
    title: 'C-Lab',
    description: '경기대학교 컴퓨터공학부 개발보안동아리, C-Lab 입니다! 👋',
    images: ['/images/clab-logo-long-colored.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${wantedSans.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Header />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
