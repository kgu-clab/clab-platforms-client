'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/apply', label: '지원하기' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCovered, setIsCovered] = useState(false);

  useEffect(() => {
    const updateHeaderState = () => {
      const panel = document.querySelector<HTMLElement>('[data-header-cover-panel]');
      setIsCovered(panel ? panel.getBoundingClientRect().top <= 64 : false);
    };

    const animationFrame = window.requestAnimationFrame(updateHeaderState);
    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('resize', updateHeaderState);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateHeaderState);
      window.removeEventListener('resize', updateHeaderState);
    };
  }, [pathname]);

  const isLandingHome = pathname === '/';
  const isDarkSurface = isOpen || (!isCovered && !isLandingHome);
  const headerClassName = isOpen
    ? 'bg-black/90 text-white'
    : isCovered
      ? 'border-b border-slate-200 bg-white text-slate-950'
      : isLandingHome
        ? 'bg-transparent text-slate-950'
        : 'bg-black/70 text-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-[background-color,border-color,color] duration-200 ${headerClassName}`}
      >
        <div className="h-16 px-5 flex w-full justify-between items-center lg:grid lg:grid-cols-3">
          <Link href="/">
            <Image
              className={isOpen ? 'h-8 w-auto' : 'w-8 h-8'}
              src={isOpen ? '/images/clab-logo-long-colored.png' : '/images/clab-logo-colored.png'}
              alt="Clab Logo"
              width={isOpen ? 80 : 26}
              height={25}
            />
          </Link>

          <nav className="hidden h-full items-center justify-center gap-1 lg:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium leading-none transition-colors hover:bg-slate-950/10 ${
                  isDarkSurface ? 'text-white hover:bg-white/10' : 'text-current'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block" />

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-950/10 lg:hidden ${
              isDarkSurface ? 'text-white hover:bg-white/10' : 'text-current'
            }`}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <Image
              src={isOpen ? '/icons/close.svg' : '/icons/menu.svg'}
              alt={isOpen ? '메뉴 닫기' : '메뉴 열기'}
              width={24}
              height={24}
              className={isDarkSurface ? 'invert' : ''}
            />
          </button>
        </div>

        <nav
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-2 px-5 pb-4">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {isOpen && <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}
