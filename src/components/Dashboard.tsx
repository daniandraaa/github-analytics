import { useState, useEffect } from 'react'
import { Loader, TrendingUp, Users, Code, Star } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchGithubStats, fetchContributionData } from '../utils/github'

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState<any>(null)
  const [contribData, setContribData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, data] = await Promise.all([
          fetchGithubStats(user.login),
          fetchContributionData()
        ])
        setStats(statsData)
        setContribData(data)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user.login])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
  const languages = Object.entries(stats.topLanguages).slice(0, 6).map(([lang, count]) => ({
    name: lang,
    value: count as number
  }))

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-lg p-6 flex items-center gap-4">
        <img src={user.avatar_url} alt={user.name} className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold text-white">{user.name || user.login}</h2>
          <p className="text-slate-400">@{user.login}</p>
          {user.bio && <p className="text-slate-300 mt-1">{user.bio}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-5 h-5 text-blue-400" />
            <span className="text-slate-400 text-sm">Repositories</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalRepos}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-slate-400 text-sm">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.currentStreak} days</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-slate-400 text-sm">Longest Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.longestStreak} days</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-slate-400 text-sm">Followers</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.followerCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Contribution Activity (Last Year)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={contribData.slice(-90)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Line
                type="monotone"
                dataKey="contributions"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Top Languages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languages}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {languages.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Contribution Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contribData.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Bar dataKey="contributions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Repositories</h3>
        <div className="space-y-3">
          {stats.recentRepos.map((repo: any, idx: number) => (
            <div key={idx} className="p-3 bg-slate-700 rounded hover:bg-slate-600 transition">
              <div className="flex items-start justify-between">
                <div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-400 hover:text-blue-300"
                  >
                    {repo.name}
                  </a>
                  {repo.description && (
                    <p className="text-sm text-slate-300 mt-1">{repo.description}</p>
                  )}
                </div>
                <div className="flex gap-4 text-sm text-slate-400">
                  <span>{repo.language}</span>
                  <span>⭐ {repo.stars}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
