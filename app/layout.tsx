import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apocalypse Survival',
  description: 'Survive global catastrophes in this turn-based survival game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
