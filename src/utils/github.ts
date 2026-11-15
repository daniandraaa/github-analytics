export interface GithubStats {
  totalContributions: number
  currentStreak: number
  longestStreak: number
  totalRepos: number
  topLanguages: { [key: string]: number }
  recentRepos: any[]
  followerCount: number
  followingCount: number
}

export async function fetchGithubStats(username: string): Promise<GithubStats> {
  try {
    // Fetch user data
    const userRes = await fetch(`https://api.github.com/users/${username}`)
    const userData = await userRes.json()

    // Fetch repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    const repos = await reposRes.json()

    // Calculate stats
    const topLanguages: { [key: string]: number } = {}
    repos.forEach((repo: any) => {
      if (repo.language) {
        topLanguages[repo.language] = (topLanguages[repo.language] || 0) + 1
      }
    })

    // Get recent repos
    const recentRepos = repos.slice(0, 5).map((r: any) => ({
      name: r.name,
      url: r.html_url,
      stars: r.stargazers_count,
      language: r.language || 'N/A',
      description: r.description
    }))

    return {
      totalContributions: userData.public_repos,
      currentStreak: Math.floor(Math.random() * 10) + 1, // Placeholder
      longestStreak: Math.floor(Math.random() * 30) + 5, // Placeholder
      totalRepos: userData.public_repos,
      topLanguages,
      recentRepos,
      followerCount: userData.followers,
      followingCount: userData.following
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    throw error
  }
}

export async function fetchContributionData(username: string): Promise<any[]> {
  // Generate mock data for contribution graph
  const data = []
  for (let i = 365; i > 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      contributions: Math.floor(Math.random() * 20)
    })
  }
  return data
}
