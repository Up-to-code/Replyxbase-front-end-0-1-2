'use client'

import Link from 'next/link'
import { useState } from 'react'
import { resetPassword } from '@/app/auth/actions'

export default function ForgotPasswordPage() {
  console.log('[Forgot Password Page] Rendering forgot password page')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('[Forgot Password Page] Form submitted')
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await resetPassword(formData)
      if (result?.error) {
        console.error('[Forgot Password Page] Error:', result.error)
        setError(result.error)
        setIsLoading(false)
      } else {
        console.log('[Forgot Password Page] Password reset email sent successfully')
        setSuccess(true)
        setIsLoading(false)
      }
    } catch (err) {
      console.error('[Forgot Password Page] Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-3xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white mb-2">
            Reset Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your node identifier (email) to initiate recovery protocols.
          </p>
        </div>
        <div>
          {success ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-500 font-mono">
                > RECOVERY_LINK_SENT <br/>
                Please check your inbox.
              </div>
              <Link
                href="/auth/login"
                className="block text-center text-sm text-white hover:text-gray-300 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500 font-mono">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? 'Processing...' : 'Send Recovery Link'}
              </button>
              <div className="text-center mt-4">
                <Link
                  href="/auth/login"
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

