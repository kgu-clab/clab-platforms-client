import Image from 'next/image';

export default function LandingFooter() {
  return (
    <footer className="flex h-40 w-full items-center justify-between bg-white px-5 py-4 sm:px-10 md:px-20">
      <Image src="/images/clab-logo-long-colored.png" alt="Clab Logo" width={80} height={40} />
      <span className="text-sm text-gray-400">© 2026 C-Lab. All Rights Reserved</span>
    </footer>
  );
}
