import { supabase } from './supabase'

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(`Unable to get current user: ${error.message}`)
  }

  return user
}

export async function isCurrentUserAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to verify admin access: ${error.message}`)
  }

  return Boolean(data)
}

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`Unable to sign in: ${error.message}`)
  }

  return data.user
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(`Unable to sign out: ${error.message}`)
  }
}