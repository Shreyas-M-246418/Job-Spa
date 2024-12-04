import React from 'react';
import '../styles/JobDetails.css';

const JobDetails = ({ job, onClose }) => {
  return (
    <div className="job-details-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="job-header">
          <h2>{job.title}</h2>
          <div className="company-info">
            <h3>{job.companyName}</h3>
            <p>{job.location}</p>
          </div>
        </div>

        <div className="job-tags">
          <span className={`tag ${job.employmentType}`}>
            {job.employmentType}
          </span>
          <span className={`tag ${job.workType}`}>
            {job.workType}
          </span>
          <span className={`tag domain`}>
            {job.domain}
          </span>
          <span className={`tag user-type`}>
            {job.userType}
          </span>
        </div>

        <div className="job-description">
          <h4>Description</h4>
          <p>{job.description}</p>
        </div>

        {job.salaryRange && (
          <div className="salary-range">
            <h4>Salary Range</h4>
            <p>{job.salaryRange}</p>
          </div>
        )}

        {job.applyLink && (
          <div className="apply-section">
            <a 
              href={job.applyLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="apply-button"
            >
              Apply Now
            </a>
          </div>
        )}

        <div className="job-meta">
          <p>Posted by: {job.createdBy}</p>
          <p>Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
