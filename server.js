const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Octokit } = require('@octokit/rest');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

// GitHub API 路由
app.post('/api/github', async (req, res) => {
  const { keyword } = req.body;

  try {
    const result = await octokit.search.repos({
      q: `${keyword} stars:>100`,
      sort: 'stars',
      order: 'desc',
      per_page: 5,
    });

    res.json(result.data.items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching GitHub repositories' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 