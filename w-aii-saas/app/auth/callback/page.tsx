import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage() {
  console.log('[Auth Callback Page] Processing OAuth callback')
  
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('[Auth Callback Page] Error getting user:', error.message)
    redirect('/auth/login?error=callback_error')
  }

  if (user) {
    console.log('[Auth Callback Page] User authenticated successfully:', user.id)
    redirect('/')
  } else {
    console.warn('[Auth Callback Page] No user found after callback')
    redirect('/auth/login?error=no_user')
  }
}

