import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            There was a problem signing you in. Please try again.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <Link
              href="/"
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 