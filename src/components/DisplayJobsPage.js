import React, { useState, useEffect } from 'react';
import { getJobs } from '../utils/githubApi';
import JobDetails from './JobDetails';
import '../styles/DisplayJobsPage.css';

const DisplayJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    userType: [],
    domain: [],
    employmentType: [],
    workType: []
  });
  const domains = [
    'Frontend',
    'Backend',
    'Full Stack',
    'DevOps',
    'Mobile',
    'UI/UX',
    'Data Science',
    'Machine Learning'
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await getJobs();
        setJobs(jobsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (e, filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: e.target.value
    }));
  };

  const handleUserTypeChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      userType: prev.userType.includes(value)
        ? prev.userType.filter(type => type !== value)
        : [...prev.userType, value]
    }));
  };

  const handleClearFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType]) ? [] : ''
    }));
  };

  const handleDomainChange = (domain) => {
    setFilters(prev => ({
      ...prev,
      domain: prev.domain.includes(domain) 
        ? prev.domain.filter(d => d !== domain)
        : [...prev.domain, domain]
    }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      location: '',
      domain: [],
      employmentType: [],
      workType: []
    });
  };

  const filteredJobs = jobs.filter(job => {
    const titleMatch = job.title?.toLowerCase().includes(filters.title.toLowerCase()) ||
                      job.companyName?.toLowerCase().includes(filters.title.toLowerCase());
    const locationMatch = job.location?.toLowerCase().includes(filters.location.toLowerCase());
    const userTypeMatch = filters.userType.length === 0 || filters.userType.includes(job.userType);
    
    return titleMatch && locationMatch && userTypeMatch;
  });

  if (loading) return (
    <div className="loading">
      <div className="loader"></div>
    </div>
  );

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Title/skill or Company"
            value={filters.title}
            onChange={(e) => handleFilterChange(e, 'title')}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange(e, 'location')}
            className="search-input"
          />
          <div className="filter-dropdown">
            <button className={`filter-button ${filters.userType.length > 0 ? 'has-selection' : ''}`}>
              User Type {filters.userType.length > 0 && `(${filters.userType.length})`}
            </button>
            <div className="dropdown-content">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="fresher"
                  checked={filters.userType.includes('fresher')}
                  onChange={(e) => handleUserTypeChange(e)}
                />
                Fresher
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="professional"
                  checked={filters.userType.includes('professional')}
                  onChange={(e) => handleUserTypeChange(e)}
                />
                Professional
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={filters.userType.includes('student')}
                  onChange={(e) => handleUserTypeChange(e)}
                />
                College Student
              </label>
              <button className="clear-filter" onClick={() => handleClearFilter('userType')}>
                Clear
              </button>
            </div>
          </div>
          <div className="filter-dropdown">
            <button className={`filter-button ${filters.domain.length > 0 ? 'has-selection' : ''}`}>
              Domain {filters.domain.length > 0 && `(${filters.domain.length})`}
            </button>
            <div className="dropdown-content">
              {domains.map(domain => (
                <label key={domain}>
                  <input
                    type="checkbox"
                    value={domain}
                    checked={filters.domain.includes(domain)}
                    onChange={(e) => handleDomainChange(e)}
                  />
                  {domain}
                </label>
              ))}
              <button className="clear-filter" onClick={() => handleClearFilter('domain')}>
                Clear
              </button>
            </div>
          </div>
          <button onClick={clearFilters} className="clear-all-btn">
            clear all
          </button>
        </div>
      </div>

      {/* Jobs List Section */}
      <div className="jobs-container">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">No jobs found matching your criteria</div>
        ) : (
          filteredJobs.map(job => (
            <div 
              key={job.id} 
              className="job-card"
              onClick={() => setSelectedJob(job)}
            >
              <h3>{job.title}</h3>
              <p className="company">{job.companyName}</p>
              <p className="location">{job.location}</p>
              <div className="tags">
                <span className={`tag ${job.employmentType}`}>
                  {job.employmentType}
                </span>
                <span className={`tag ${job.workType}`}>
                  {job.workType}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetails 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
};

export default DisplayJobsPage;
