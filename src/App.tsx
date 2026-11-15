import { useState, useEffect } from 'react'
import { Github, Loader, AlertCircle } from 'lucide-react'
import Dashboard from './components/Dashboard'
import './App.css'

interface GithubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  public_repos: number
  followers: number
  following: number
}

function App() {
  const [username, setUsername] = useState('daniandraaa')
  const [user, setUser] = useState<GithubUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    setError(null)
    setShowDashboard(false)

    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
      if (!response.ok) throw new Error('User not found')
      const data = await response.json()
      setUser(data)
      setShowDashboard(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">GitHub Analytics Dashboard</h1>
          </div>
          <p className="text-slate-400 text-lg">Visualize your GitHub contributions & coding velocity</p>
        </div>

        <form onSubmit={handleFetch} className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="flex-1 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition flex items-center gap-2"
            >
              {loading ? <Loader className="animate-spin w-5 h-5" /> : 'Analyze'}
            </button>
          </div>
        </form>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {showDashboard && user && <Dashboard user={user} />}

        {!showDashboard && !user && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-slate-300 text-lg">
              Enter a GitHub username above to view comprehensive analytics
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
