import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nirman - Innovate. Connect. Build. | Precision Supplier Discovery OS',
  description: 'AI-Powered Precision Supplier Discovery & Strategic Sourcing Operating System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-navy-50 text-navy-950 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
