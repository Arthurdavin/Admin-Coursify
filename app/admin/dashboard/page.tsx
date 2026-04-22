"use client";

import React from "react";
import { StatsCard } from "@/src/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  BookOpen,
  UserCheck,
  UserPlus,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useGetAdminStatsQuery,
  useGetCourseDistributionQuery,
  useGetEnrollmentTrendQuery,
  useGetTeacherStatusQuery,
} from "@/src/store/services/dashboardApi";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  // ✅ added isUninitialized
  const {
    data: stats,
    isLoading,
    isError,
    isUninitialized,
  } = useGetAdminStatsQuery();

  const { data: enrollmentTrend = [] } = useGetEnrollmentTrendQuery();
  const { data: courseDistribution = [] } = useGetCourseDistributionQuery();
  const { data: teacherStatus = [] } = useGetTeacherStatusQuery();

  // ✅ treat uninitialized as loading to prevent stats! crashing on first render
  const showSkeleton = isLoading || isUninitialized;

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s your platform overview.
        </p>
      </div>

      {/* Stats Cards */}
      {showSkeleton ? (
        <StatsCardSkeleton />
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
          Failed to load stats. Please refresh the page.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats!.totalUsers}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Students"
            value={stats!.totalStudents}
            icon={UserPlus}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Total Teachers"
            value={stats!.totalTeachers}
            icon={UserCheck}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Total Courses"
            value={stats!.totalCourses}
            icon={BookOpen}
            trend={{ value: 3, isPositive: true }}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {/* <LineChart data={enrollmentTrendData}> */}
              <LineChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#3b82f6"
                  dot={{ fill: "#3b82f6" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Course Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {courseDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Teacher Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Teacher Status
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10b981" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showSkeleton ? ( // ✅ use showSkeleton here too
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Published Courses
                    </span>
                    <span className="text-lg font-bold">
                      {stats?.publishedCourses ?? 0}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: stats
                          ? `${Math.round((stats.publishedCourses / stats.totalCourses) * 100)}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Total Enrollments
                    </span>
                    <span className="text-lg font-bold">
                      {stats?.totalEnrollments ?? 0}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: stats
                          ? `${Math.min(Math.round((stats.totalEnrollments / (stats.totalStudents || 1)) * 100), 100)}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Teachers / Students
                    </span>
                    <span className="text-lg font-bold">
                      {stats?.totalTeachers ?? 0} / {stats?.totalStudents ?? 0}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: stats
                          ? `${Math.round((stats.totalTeachers / stats.totalUsers) * 100)}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
