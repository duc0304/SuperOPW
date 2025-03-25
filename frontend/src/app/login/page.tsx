'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiUserLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Gọi API login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Đăng nhập thành công
        login(data.data.token, data.data.user);
        router.push('/clients');
      } else {
        // Đăng nhập thất bại
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">
        {/* Left Side - Image/Illustration */}
        <div className="hidden lg:block relative bg-gradient-to-br from-primary-500 to-indigo-600 p-12">
          <div className="relative h-full flex flex-col justify-center">
            <Image
              src="/login_ill.jpg"
              alt="Login Illustration"
              width={500}
              height={400}
              className="mb-8 rounded-xl"
            />
            <h2 className="text-3xl font-bold text-white mb-4">
              Manage Your Business with Confidence
            </h2>
            <p className="text-white/80">
              Access your dashboard to track contracts, manage clients, and monitor transactions all in one place.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 translate-y-16"></div>
          
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 mb-8">Please sign in to continue</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Image src="/google.svg" alt="Google" width={20} height={20} />
                  <span className="ml-2 text-sm font-medium">Google</span>
                </button>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Image src="/github.svg" alt="GitHub" width={20} height={20} />
                  <span className="ml-2 text-sm font-medium">GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}