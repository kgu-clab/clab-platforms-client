import { IoAdd } from 'react-icons/io5';

interface PlusButtonProps {
  onClick?: () => void;
}

export default function PlusButton({ onClick }: PlusButtonProps) {
  return (
    <button
      className="bg-primary fixed bottom-32 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-4xl text-white shadow-2xl"
      onClick={onClick}
    >
      <IoAdd />
    </button>
  );
}
