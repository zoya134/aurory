import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  isCurrentUserAdmin,
  signInAdmin,
  signOutAdmin,
} from './lib/auth'

function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [status, setStatus] = useState('checking')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function checkSession() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          setStatus('login')
          return
        }

        const admin = await isCurrentUserAdmin()

        if (!admin) {
          setStatus('denied')
          return
        }

        setUser(currentUser)
        setIsAdmin(true)
        setStatus('authenticated')
      } catch (error) {
        console.error('Aurory admin session check failed:', error)
        setStatus('login')
      }
    }

    checkSession()
  }, [])

  async function handleLogin(event) {
    event.preventDefault()

    try {
      setErrorMessage('')
      setStatus('checking')

      const signedInUser = await signInAdmin(email, password)
      const admin = await isCurrentUserAdmin()

      if (!admin) {
        await signOutAdmin()
        setStatus('denied')
        return
      }

      setUser(signedInUser)
      setIsAdmin(true)
      setStatus('authenticated')
      setPassword('')
    } catch (error) {
      console.error('Aurory admin login failed:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to sign in.',
      )
      setStatus('login')
    }
  }

  async function handleSignOut() {
    await signOutAdmin()
    setUser(null)
    setIsAdmin(false)
    setStatus('login')
  }

  if (status === 'checking') {
    return <main><p>Checking admin access...</p></main>
  }

  if (status === 'denied') {
    return (
      <main>
        <h1>Access denied</h1>
        <p>This account does not have Aurory admin access.</p>
      </main>
    )
  }

  if (status === 'login') {
    return (
      <main>
        <section>
          <p>Admin</p>
          <h1>Sign in to Aurory</h1>

          <form onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {errorMessage && <p>{errorMessage}</p>}

            <button type="submit">
              Sign in
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section>
        <p>Admin dashboard</p>
        <h1>Welcome to Aurory</h1>

        <p>
          Signed in as {user?.email}
        </p>

        {isAdmin && <p>Admin access confirmed.</p>}

        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </section>
    </main>
  )
}

export default Admin