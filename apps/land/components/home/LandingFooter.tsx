import Image from 'next/image';

export default function LandingFooter() {
  return (
    <footer className="flex w-full items-center justify-between bg-white px-5 sm:px-10 md:px-20 h-40 py-4">
      <Image src="/images/clab-logo-long-colored.png" alt="Clab Logo" width={80} height={40} />
      <span className="text-sm text-gray-400">© 2025 C-Lab. All Rights Reserved</span>
    </footer>
  );
}
