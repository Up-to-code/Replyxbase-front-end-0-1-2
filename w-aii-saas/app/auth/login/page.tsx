import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'
import { signInWithEmail } from '@/app/auth/actions'

export default function LoginPage() {
  console.log('[Login Page] Rendering login page')

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-3xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white mb-2">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Initialize your session or{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-white hover:text-gray-300 underline underline-offset-4 decoration-white/30"
            >
              create a new node
            </Link>
          </p>
        </div>
        <div>
          <AuthForm onSubmit={signInWithEmail} submitLabel="Sign in" />
          <div className="mt-6 text-center">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Lost access credentials?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

