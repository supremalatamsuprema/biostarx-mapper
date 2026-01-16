import { getUncachableGitHubClient } from '../server/github';

async function createRepository() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    // Create repository
    const repoName = 'biostarx-mapper';
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'BioStar X Mapper - B2B presales license calculator and BOM generator for Suprema BioStar X platform',
      private: false,
      auto_init: false
    });
    
    console.log(`Repository created: ${repo.html_url}`);
    console.log(`Clone URL: ${repo.clone_url}`);
    console.log(`SSH URL: ${repo.ssh_url}`);
    
    return repo;
  } catch (error: any) {
    if (error.status === 422) {
      console.log('Repository may already exist. Fetching existing repo...');
      const octokit = await getUncachableGitHubClient();
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: repo } = await octokit.repos.get({
        owner: user.login,
        repo: 'biostarx-mapper'
      });
      console.log(`Existing repository: ${repo.html_url}`);
      return repo;
    }
    throw error;
  }
}

createRepository().catch(console.error);
