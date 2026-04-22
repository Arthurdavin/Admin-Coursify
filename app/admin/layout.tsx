import { Navbar } from "@/src/components/admin/Navbar"
import { Sidebar } from "@/src/components/admin/Sidebar"
// import { AuthGuard } from "./_components/AuthGuard" 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <AuthGuard>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-16">
          <Sidebar />
          <main className="flex-1 overflow-auto ml-20 transition-all duration-300" id="main-content">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    // </AuthGuard>
  )
}