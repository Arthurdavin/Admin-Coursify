'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  FolderOpen,
  UserPlus,
  FileText,
  ChevronLeft,
  ChevronRight,
  BookMarked,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux'
import { SIDEBAR_MENU_ITEMS } from '@/src/lib/constants'
import { toggleSidebar } from '@/src/store/slices/uiSlice'

const iconMap = {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Users,
  UserCheck,
  FolderOpen,
  UserPlus,
  FileText,
}

export function Sidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-64px)] bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {SIDEBAR_MENU_ITEMS.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const isActive = pathname.startsWith(item.href)

              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        sidebarOpen ? 'px-4' : 'px-2'
                      )}
                      title={item.label}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="ml-3 text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="w-full"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
