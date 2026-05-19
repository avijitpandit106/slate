import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Slate | Clean notes, Clear mind.',
  description: 'A clean, minimal note-taking app built for quick thoughts, focused writing, and organized productivity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
