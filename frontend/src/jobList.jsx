import { useEffect, useState } from "react";
import axios from "axios";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${window.API_URL}/api/job/all`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Featured Jobs</h2>

      <input
        placeholder="Search job by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {jobs.length === 0 && <p>No jobs found</p>}

      {jobs
        .filter((job) =>
          job.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
          </div>
        ))}
    </div>
  );
}

export default JobList;
