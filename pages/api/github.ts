import { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_API_TOKEN,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { keyword } = req.body

    try {
      const result = await octokit.search.repos({
        q: `${keyword} stars:>100`,
        sort: 'stars',
        order: 'desc',
        per_page: 5,
      })

      res.status(200).json(result.data.items)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching GitHub repositories' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 