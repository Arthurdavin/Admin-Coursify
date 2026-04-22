export type UserRole = 'admin' | 'teacher' | 'student'

export interface LoginRequest {
    email: string;
    password: string;
}


export interface Lesson {
  id: number
  title: string
  description: string
  video_url: string
  course_id: number
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}


export interface Course {
  id: number
  title: string
  description: string
  thumbnail: string | null
  price: number
  isPublished: boolean
  teacherId: number
  teacherName: string
  categoryId: number
  categoryName: string
  tags: string[]
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  role: string
  imageUrl: string | null
  bgImageUrl: string | null
  bio: string | null
  createdAt: string
  status?: 'active' | 'inactive' | string;
}

export interface Teacher {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  role: string
  imageUrl: string | null
  bgImageUrl: string | null
  bio: string | null
  createdAt: string
  status?: 'active' | 'inactive' | string;
}

export interface Enrollment {
  id: string
  studentId: string
  student?: Student
  courseId: string
  course?: Course
  enrollmentDate: string
  status: 'active' | 'completed' | 'dropped'
  progress: number
  createdAt: string
  updatedAt: string
}

export interface Material {
  id: string
  title: string
  description?: string
  courseId: string
  course?: Course
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploader?: User
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalCourses: number
  totalEnrollments: number
  activeStudents: number
  activeTeachers: number
  newEnrollmentsThisMonth: number
  completedCoursesThisMonth: number
}

export interface PaginatedResponse<T> {
  data: T[]
  totalPages: number
  totalElements: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Matches the real API response from /api/admin/books
export interface Book {
  id: number
  title: string
  description?: string
  file_url?: string       // snake_case — matches backend/Postman
  thumbnail?: string
  category_ids?: number[] // snake_case — matches backend/Postman
  categories?: string[]   // returned by GET (category names, not IDs)
  uploadedById?: number
  uploadedByName?: string
  createdAt?: string
  updatedAt?: string
}
