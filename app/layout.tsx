import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'
import { Providers } from '@/src/components/providers';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://admin-coursify.vercel.app"),

  title: {
    default: "E-Learning Coursify Admin Dashboard",
    template: "%s | Coursify",
  },

  description:
    "Coursify is a modern e-learning platform to learn programming, web development, and IT skills in Cambodia. Start learning today.",

  keywords: [
    "Coursify",
    "online courses Cambodia",
    "learn programming",
    "web development course",
    "IT training Cambodia",
    "e-learning platform",
  ],

  authors: [{ name: "Coursify | Master Programming in Cambodia" }],

  openGraph: {
    title: "Coursify | Learn Anytime, Anywhere",
    description:
      "Explore top courses in programming, design, and technology with Coursify.",
    url: "/",
    siteName: "Coursify",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/thumbnail.jpg", // Make sure this is in your /public folder
        width: 1200,
        height: 630,
        alt: "Coursify - Cambodia's Premier IT Learning Platform",
      },
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Coursify",
    description: "Level up your career with modern programming and IT courses. Learn in Khmer and English, build real projects, and join Cambodia's tech revolution.",
    images: ["/thumbnail.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },

  // ✅ EXTRA (improves SEO)
  robots: {
    index: true,
    follow: true,
  },

  category: "education",

  verification: {
    google: "jtTKWpNt9U1Qd124cT2ScI5ERuT7t6Rk6NX1GOvAjsg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}