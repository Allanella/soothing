'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f2ede2] text-[#181b1e] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-[#e5dec9]">
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-wide leading-tight">
            SOOTHING INTERIORS
          </h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">Director Portal Access</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#181b1e]"
              placeholder="admin@soothinginteriorsltd.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#181b1e]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#181b1e] text-[#f2ede2] font-medium rounded hover:bg-black transition cursor-pointer disabled:opacity-50 text-center"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-gray-600 hover:underline">
            ← Return to main website
          </Link>
        </div>
      </div>
    </main>
  )
}