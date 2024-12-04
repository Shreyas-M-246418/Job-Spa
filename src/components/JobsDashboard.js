import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJobs, deleteJob } from '../utils/githubApi';
import JobDetails from './JobDetails';
import '../styles/JobsDashboard.css';

const JobsDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const jobsData = await getJobs();
      // Filter jobs created by the current user
      const userJobs = jobsData.filter(job => String(job.userId) === String(user?.id));
      setJobs(userJobs);
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const success = await deleteJob(jobId, user.id);
      if (success) {
        await fetchJobs();
      } else {
        setError('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job');
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  const navigateToHire = () => {
    navigate('/hire');
  };

  if (loading) return (
    <div className="loading">
      <div className="loader"></div>
    </div>
  );

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Job Postings</h1>
        <button onClick={navigateToHire} className="create-job-btn">
          Create New Job
        </button>
      </div>

      <div className="jobs-grid">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>You haven't posted any jobs yet.</p>
            <button onClick={navigateToHire}>Post Your First Job</button>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p className="company">{job.companyName}</p>
              <p className="location">{job.location}</p>
              <div className="job-tags">
                <span className={`tag ${job.employmentType}`}>
                  {job.employmentType}
                </span>
                <span className={`tag ${job.workType}`}>
                  {job.workType}
                </span>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => handleEditJob(job.id)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteJob(job.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedJob && (
        <JobDetails 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
};

export default JobsDashboard;
