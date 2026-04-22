export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const

export const COURSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const

export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const

export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
} as const

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE: 1,
} as const

export const SIDEBAR_MENU_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Courses',
    href: '/admin/courses',
    icon: 'BookOpen',
  },
  {
    label: 'Book',
    href: '/admin/books',
    icon: 'BookMarked',
  },
  {
    label: 'Students',
    href: '/admin/students',
    icon: 'Users',
  },
  {
    label: 'Teachers',
    href: '/admin/teachers',
    icon: 'UserCheck',
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: 'FolderOpen',
  },
  // {
  //   label: 'Enrollments',
  //   href: '/admin/enrollments',
  //   icon: 'UserPlus',
  // },
  // {
  //   label: 'Materials',
  //   href: '/admin/materials',
  //   icon: 'FileText',
  // },
] as const
