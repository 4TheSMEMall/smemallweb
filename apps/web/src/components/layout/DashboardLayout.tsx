"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export function DashboardLayout({ navItems, children }: { navItems: NavItem[]; children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-navy-900 text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-lg font-extrabold">
            SME<span className="text-red-500"> Mall</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-red-500 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
