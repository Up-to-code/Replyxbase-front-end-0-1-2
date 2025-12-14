'use client'

import { GoogleButton } from './GoogleButton'
import { EmailPasswordForm } from './EmailPasswordForm'

interface AuthFormProps {
  onSubmit: (formData: FormData) => void
  submitLabel: string
  showPasswordConfirm?: boolean
  showGoogleAuth?: boolean
}

export function AuthForm({
  onSubmit,
  submitLabel,
  showPasswordConfirm = false,
  showGoogleAuth = true,
}: AuthFormProps) {
  console.log('[AuthForm] Rendering auth form with submitLabel:', submitLabel)

  return (
    <div className="space-y-6">
      {showGoogleAuth && (
        <>
          <GoogleButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
        </>
      )}
      <EmailPasswordForm
        onSubmit={onSubmit}
        submitLabel={submitLabel}
        showPasswordConfirm={showPasswordConfirm}
      />
    </div>
  )
}

