import localFont from 'next/font/local';

export const wantedSans = localFont({
  src: [
    {
      path: '../public/fonts/WantedSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/WantedSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/WantedSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-wantedSans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: 'Arial',
});
