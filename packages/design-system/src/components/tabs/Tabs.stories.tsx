import type { Meta, StoryObj } from '@storybook/react-vite';

import Tabs from './Tabs';
import { IoBook, IoPeople, IoSettings } from 'react-icons/io5';
import { MdHomeFilled } from 'react-icons/md';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tabs 컴포넌트는 탭 네비게이션 바를 렌더링하는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[375px]',
    children: (
      <>
        <Tabs.Item icon={<MdHomeFilled />} label="홈" href="/" />
        <Tabs.Item icon={<IoBook />} label="도서" href="/books" />
        <Tabs.Item icon={<IoPeople />} label="스터디" href="/studies" />
        <Tabs.Item icon={<IoSettings />} label="설정" href="/settings" />
      </>
    ),
  },
};

const CountBadge = ({ count }: { count: number }) => (
  <span className="bg-primary/10 text-primary rounded-full px-2 text-[11px] font-semibold leading-[1.4]">
    {count}
  </span>
);

export const LabelOnly: Story = {
  args: {
    className: 'w-[375px]',
    children: (
      <>
        <Tabs.Item label="전체" href="/" />
        <Tabs.Item label="진행중" href="/?status=ongoing" />
        <Tabs.Item label="완료" href="/?status=done" />
      </>
    ),
  },
};

export const WithEndSlot: Story = {
  args: {
    className: 'w-[375px]',
    children: (
      <>
        <Tabs.Item label="미답변" href="/?tab=pending" endSlot={<CountBadge count={3} />} />
        <Tabs.Item label="전체" href="/" />
      </>
    ),
  },
};
