'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/apply', label: '지원하기' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${
          isScrolled ? 'bg-black/50 backdrop-blur-md' : 'bg-black'
        }`}
      >
        <div className="h-16 px-5 flex w-full justify-between items-center lg:grid lg:grid-cols-3">
          <Link href="/">
            <Image
              className={isOpen ? 'h-6 w-auto' : 'w-6 h-6'}
              src={isOpen ? '/images/clab-logo-long.png' : '/images/clab-logo.png'}
              alt="Clab Logo"
              width={isOpen ? 80 : 26}
              height={25}
            />
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block" />

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <Image
              src={isOpen ? '/images/icons/close.svg' : '/images/icons/menu.svg'}
              alt={isOpen ? '메뉴 닫기' : '메뉴 열기'}
              width={24}
              height={24}
              className="invert"
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
