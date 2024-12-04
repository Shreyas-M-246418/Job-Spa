const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const REPO_OWNER = 'Shreyas-M-246418';
const REPO_NAME = 'Job-Spa';

export const getJobs = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/jobs.json`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    const data = await response.json();
    const content = atob(data.content);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

export const updateJobs = async (jobs) => {
  try {
    const currentFile = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/jobs.json`
    );
    const fileData = await currentFile.json();
    
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/jobs.json`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update jobs.json',
          content: btoa(JSON.stringify(jobs, null, 2)),
          sha: fileData.sha
        })
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error updating jobs:', error);
    return false;
  }
};

export const deleteJob = async (jobId, userId) => {
  try {
    const jobs = await getJobs();
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    return await updateJobs(updatedJobs);
  } catch (error) {
    console.error('Error deleting job:', error);
    return false;
  }
};

export const updateJob = async (jobId, updatedData, userId) => {
  try {
    const jobs = await getJobs();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex === -1) return false;
    
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    return await updateJobs(jobs);
  } catch (error) {
    console.error('Error updating job:', error);
    return false;
  }
}; 