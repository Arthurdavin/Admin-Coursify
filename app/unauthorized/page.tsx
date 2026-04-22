import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">403</h1>
      <p className="text-muted-foreground text-lg">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        href="/login"
        className="text-primary underline underline-offset-4 hover:opacity-80"
      >
        Back to Login
      </Link>
    </div>
  )
}