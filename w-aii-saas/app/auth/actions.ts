'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInWithEmail(formData: FormData) {
  console.log('[Auth Action] signInWithEmail called')
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('[Auth Action] Attempting sign in for email:', email)

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[Auth Action] Sign in error:', error.message)
    return { error: error.message }
  }

  console.log('[Auth Action] Sign in successful for user:', data.user?.id)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUpWithEmail(formData: FormData) {
  console.log('[Auth Action] signUpWithEmail called')
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('[Auth Action] Attempting sign up for email:', email)

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('[Auth Action] Sign up error:', error.message)
    return { error: error.message }
  }

  console.log('[Auth Action] Sign up successful for user:', data.user?.id)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle() {
  console.log('[Auth Action] signInWithGoogle called')
  
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    console.error('[Auth Action] Google OAuth error:', error.message)
    return { error: error.message }
  }

  console.log('[Auth Action] Google OAuth redirect URL:', data.url)
  redirect(data.url)
}

export async function signOut() {
  console.log('[Auth Action] signOut called')
  
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('[Auth Action] Sign out error:', error.message)
    return { error: error.message }
  }

  console.log('[Auth Action] Sign out successful')
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function resetPassword(formData: FormData) {
  console.log('[Auth Action] resetPassword called')
  
  const email = formData.get('email') as string

  console.log('[Auth Action] Attempting password reset for email:', email)

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  })

  if (error) {
    console.error('[Auth Action] Password reset error:', error.message)
    return { error: error.message }
  }

  console.log('[Auth Action] Password reset email sent successfully')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  console.log('[Auth Action] updatePassword called')
  
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('passwordConfirm') as string

  if (password !== passwordConfirm) {
    console.error('[Auth Action] Passwords do not match')
    return { error: 'Passwords do not match' }
  }

  console.log('[Auth Action] Attempting to update password')

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    console.error('[Auth Action] Update password error:', error.message)
    return { error: error.message }
  }

  console.log('[Auth Action] Password updated successfully')
  revalidatePath('/', 'layout')
  redirect('/')
}

