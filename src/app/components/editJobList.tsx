"use client";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [jobSpecs, setJobSpecs] = useState("");
  
  const [errors, setErrors] = useState({
    jobTitle: "",
    location: "",
    jobType: "",
    jobSpecs: "",
  });

  const handleSubmit = () => {
    let newErrors = {
      jobTitle: jobTitle ? "" : "Job title is required.",
      location: location ? "" : "Location is required.",
      jobType: jobType ? "" : "Job type is required.",
      jobSpecs: jobSpecs ? "" : "Job specifications are required.",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) return;

    const jobData = {
      title: jobTitle,
      location: location,
      type: jobType,
      specifications: jobSpecs,
    };

    console.log("Saved Job Data:", jobData);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="relative bg-white bg-opacity-80 text-[#0c0051] p-6 rounded-lg w-96 shadow-lg"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "700" }}
          >
            {/* X Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-xl text-[#0c0051]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "200" }}
            >
              &times;
            </button>

            <h2
              className="text-lg text-center"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "700" }}
            >
              Edit Job Post
            </h2>

            <div className="mt-4 space-y-3">
              {/* Job Title */}
              <label className="block" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "200" }}>
                Enter Job title:
              </label>
              <input
                type="text"
                className="w-full p-2 bg-[#0c0051] text-white rounded-md"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "400" }}
              />
              {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}

              {/* Location */}
              <label className="block" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "200" }}>
                Enter location:
              </label>
              <input
                type="text"
                className="w-full p-2 bg-[#0c0051] text-white rounded-md"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "200" }}
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

              {/* Job Type */}
              <label className="block" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "200" }}>
                Select job type:
              </label>
              <select
                className="w-full p-2 bg-[#0c0051] text-white rounded-md"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "200" }}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Freelance</option>
              </select>
              {errors.jobType && <p className="text-red-500 text-sm">{errors.jobType}</p>}

              {/* Job Specifications */}
              <label className="block" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "200" }}>
                Enter job specifications
              </label>
              <textarea
                className="w-full p-2 bg-[#0c0051] text-white rounded-md h-24"
                value={jobSpecs}
                onChange={(e) => setJobSpecs(e.target.value)}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "200" }}
              ></textarea>
              {errors.jobSpecs && <p className="text-red-500 text-sm">{errors.jobSpecs}</p>}
            </div>

           {/* Submit Button */}
           <div className="flex justify-center">
            <button
                onClick={handleSubmit}
                className="bg-[#0c0051] text-white mt-4 px-4 py-1 rounded-md text-sm"
                style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "200",
                }}
                >
                Done
             </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
