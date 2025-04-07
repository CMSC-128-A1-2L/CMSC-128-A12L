"use client";

import React, { useState } from "react";
import JobCard from "./jobContentCard";
import { Grid, List, LayoutGrid, LayoutList } from "lucide-react";

const JobViewToggle = () => {
  const [isGridView, setIsGridView] = useState(true);
  const toggleView = () => {
    setIsGridView(!isGridView);
  };
  const displayedJobs = "";

  return (
    <>
      <button
        onClick={toggleView}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {isGridView ? (
          <>
            <LayoutList size={18} />
            <span>List View</span>
          </>
        ) : (
          <>
            <LayoutGrid size={18} />
            <span>Grid View</span>
          </>
        )}
      </button>

      <div className="w-full flex justify-center">
        <div className="flex flex-wrap gap-3 justify-center">
          {displayedJobs.length > 0 ? (
            displayedJobs.map((job, index) => (
              <JobCard
                key={index}
                title={job.title}
                company={job.company}
                location={job.location}
                jobType={job.job_type}
                workType={job.work_type}
                description={job.description}
                imageUrl={job.imageUrl}
                onDetailsClick={() => handleJobDetails(job)}
                onApplyClick={() => handleApply(job.title)}
              />
            ))
          ) : (
            <p className="text-gray-500">No jobs found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default JobViewToggle;
