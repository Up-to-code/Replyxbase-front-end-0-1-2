import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'
import { signUpWithEmail } from '@/app/auth/actions'

export default function SignupPage() {
  console.log('[Signup Page] Rendering signup page')

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-3xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white mb-2">
            Initialize Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link
              href="/auth/login"
              className="font-medium text-white hover:text-gray-300 underline underline-offset-4 decoration-white/30"
            >
              access existing node
            </Link>
          </p>
        </div>
        <div>
          <AuthForm
            onSubmit={signUpWithEmail}
            submitLabel="Deploy Node"
            showPasswordConfirm={true}
          />
        </div>
      </div>
    </div>
  )
}

