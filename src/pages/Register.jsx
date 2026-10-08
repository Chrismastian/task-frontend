import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Create account</h2>
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password (min 8 chars)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="8"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating…' : 'Create account'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Have an account? <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
