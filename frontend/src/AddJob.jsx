import { useState } from "react";
import axios from "axios";

function AddJob() {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
    `${window.API_URL}/api/jobs/add`,
    job
   );

      console.log("Job added:", res.data);
      alert("✅ Job added successfully");

      // clear form
      setJob({
        title: "",
        company: "",
        location: "",
        description: "",
      });

      // reload page to see job
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Error adding job");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Job</h2>

      <input
        name="title"
        placeholder="Job Title"
        value={job.title}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        name="company"
        placeholder="Company"
        value={job.company}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        name="location"
        placeholder="Location"
        value={job.location}
        onChange={handleChange}
        required
      /><br /><br />

      <textarea
        name="description"
        placeholder="Description"
        value={job.description}
        onChange={handleChange}
        required
      ></textarea><br /><br />

      <button type="submit">Add Job</button>
    </form>
  );
}

export default AddJob;
