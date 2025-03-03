'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AuthProvider } from '@/context/AuthContext';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

// Loading fallback component
function Loading() {
  return <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Các trang không cần MainLayout
  const publicPages = ['/', '/login', '/register'];
  const isPublicPage = publicPages.includes(pathname);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <Suspense fallback={<Loading />}>
            <AuthProvider>
              {isPublicPage ? (
                children
              ) : (
                <MainLayout>{children}</MainLayout>
              )}
            </AuthProvider>
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}