'use client'

import { useState } from 'react'

interface EmailPasswordFormProps {
  onSubmit: (formData: FormData) => void
  submitLabel: string
  showPasswordConfirm?: boolean
}

export function EmailPasswordForm({
  onSubmit,
  submitLabel,
  showPasswordConfirm = false,
}: EmailPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('[EmailPasswordForm] Form submitted')
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const passwordConfirm = formData.get('passwordConfirm') as string

    if (showPasswordConfirm && password !== passwordConfirm) {
      console.error('[EmailPasswordForm] Passwords do not match')
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      console.error('[EmailPasswordForm] Form submission error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
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
          className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          placeholder="••••••••"
        />
      </div>

      {showPasswordConfirm && (
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            required
            minLength={6}
            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
            placeholder="••••••••"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {isLoading ? 'Processing...' : submitLabel}
      </button>
    </form>
  )
}

