'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Chỉ thực hiện kiểm tra khi đã load xong trạng thái xác thực
    if (!isLoading) {
      checkAuthorization();
    }
    
    function checkAuthorization() {
      // Danh sách các trang công khai (không cần đăng nhập)
      const publicPages = ['/', '/login', '/register'];
      const isPublicPage = publicPages.includes(pathname);

      // Danh sách các trang chỉ dành cho người chưa đăng nhập
      const authPages = ['/login', '/register'];
      const isAuthPage = authPages.includes(pathname);

      // Xử lý các trường hợp điều hướng
      if (isAuthenticated && isAuthPage) {
        // Người dùng đã đăng nhập nhưng đang cố truy cập trang login/register
        router.push('/dashboard');
        setAuthorized(false);
      } else if (!isAuthenticated && !isPublicPage) {
        // Người dùng chưa đăng nhập nhưng đang cố truy cập trang nội bộ
        router.push('/login');
        setAuthorized(false);
      } else {
        // Người dùng được phép truy cập trang hiện tại
        setAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Hiển thị loading khi đang kiểm tra xác thực
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Chỉ hiển thị nội dung khi người dùng được phép truy cập
  return authorized ? <>{children}</> : null;
} 