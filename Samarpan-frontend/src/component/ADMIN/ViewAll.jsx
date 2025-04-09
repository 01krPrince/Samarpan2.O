import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import '../../../src/App.css';
import { IoReloadCircle } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";

const ViewAll = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allBatches, setAllBatches] = useState([]); // Store all batches for filtering
  const [subjects, setSubjects] = useState([]);
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [subject, setSubject] = useState('');
  const [sortCheckedOnTop, setSortCheckedOnTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch batches
        const batchesResponse = await fetch("http://localhost:8080/api/v1/Batch/getAllBatch");
        if (!batchesResponse.ok) throw new Error("Failed to fetch batches");
        const batchesData = await batchesResponse.json();
        console.log("batchesData  ",batchesData)

        setBatches(batchesData);
        setAllBatches(batchesData); // Store all batches for filtering later

        // Fetch branches
        const branchesResponse = await fetch("http://localhost:8080/api/v1/branch/getAllBranches", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!branchesResponse.ok) throw new Error("Failed to fetch branches");
        const branchesData = await branchesResponse.json();
        console.log("branchesData  ",branchesData)
        setBranches(branchesData);

        // Fetch subjects
        const subjectsResponse = await fetch("http://localhost:8080/api/subject/getAllSubjects", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!subjectsResponse.ok) throw new Error("Failed to fetch subjects");
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData.map(sub => sub.subjectName));

        // Fetch projects
        const user = JSON.parse(localStorage.getItem("user"));
        const adminId = user?.id;
        const projectsResponse = await fetch(`http://localhost:8080/api/projects/all?adminId=${adminId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!projectsResponse.ok) {
          if (projectsResponse.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch projects");
        }
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate]);

  const getFilteredProjects = () => {
    let filteredProjects = [...projects];

    if (branch) {
      filteredProjects = filteredProjects.filter(project => project.branch === branch);
    }
    if (batch) {
      filteredProjects = filteredProjects.filter(project => project.batch === batch);
    }
    if (subject) {
      filteredProjects = filteredProjects.filter(project => project.subject === subject);
    }
    if (searchQuery) {
      filteredProjects = filteredProjects.filter(project =>
        (project.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (project.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (project.status?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (project.branch?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (project.batch?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (project.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
      );
    }

    return filteredProjects.sort((a, b) =>
      sortCheckedOnTop
        ? (a.markAsCheck === true ? -1 : 1)
        : (a.markAsCheck === false ? -1 : 1)
    );
  };

  const filterByBranch = (selectedBranch) => {
    if (selectedBranch) {
      // Filter batches based on the selected branch
      const filteredBatches = allBatches.filter(b => b.branchName === selectedBranch); // Adjust 'branchName' to match your batch data structure
      setBatches(filteredBatches);
      setBatch(''); // Reset batch selection when branch changes
    } else {
      // If no branch is selected, show all batches
      setBatches(allBatches);
      setBatch('');
    }
  };

  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;
    setBranch(selectedBranch);
    filterByBranch(selectedBranch);
  };

  const handleReset = () => {
    setBranch('');
    setBatch('');
    setSubject('');
    setSearchQuery('');
    setSortCheckedOnTop(false);
    setBatches(allBatches); // Reset batches to all
  };

  // Format date helper function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  const filteredProjects = getFilteredProjects();

  return (
    <div className="mt-10 min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-8">
          <select
            className="w-full md:w-[45%] lg:w-[22%] p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={branch}
            onChange={handleBranchChange} // Use handleBranchChange instead
          >
            <option value="">Select Branch</option>
            {branches.map(b => (
              <option key={b.id} value={b.branchName}>{b.branchName}</option>
            ))}
          </select>

          <select
            className="w-full md:w-[45%] lg:w-[22%] p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          >
            <option value="">Select Batch</option>
            {batches.map(b => (
              <option key={b.id} value={b.batchName}>{b.batchName}</option>
            ))}
          </select>

          <select
            className="w-full md:w-[45%] lg:w-[22%] p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="w-full md:w-[45%] lg:w-[28%] relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sort Toggle */}
        <div className="flex items-center mb-6">
          <span className="mr-4 text-sm font-medium text-gray-700">
            {sortCheckedOnTop ? 'Checked' : 'Unchecked'}
          </span>
          <Switch
            checked={sortCheckedOnTop}
            onChange={(e) => setSortCheckedOnTop(e.target.checked)}
          />
          <button
            onClick={handleReset}
            className="ml-4 p-2 text-gray-600 hover:text-indigo-600"
          >
            <IoReloadCircle className="w-8 h-8" />
          </button>
        </div>

        {/* Projects Grid */}
        <div className="p-4 flex flex-wrap gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.projectId}
                className="w-[320px] sm:w-[280px] bg-white rounded-xl overflow-hidden shadow hover:shadow-lg"
              >
                <div className="w-full h-40 bg-gray-200">
                  <img
                    src={typeof project.imageUrls === 'string' ? project.imageUrls : 'https://via.placeholder.com/280x160'}
                    alt={project.projectName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/280x160'; }}
                  />
                </div>
                <div className="p-4 relative">
                  <div
                    className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full ${
                      project.markAsCheck ? 'bg-green-200' : 'bg-red-200'
                    }`}
                  >
                    {project.markAsCheck ? "Checked" : "Unchecked"}
                  </div>
                  <h2 className="text-lg font-semibold text-black">{project.projectName}</h2>
                  <p className="text-sm text-gray-600 mt-1">{project.studentName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {formatDate(project.submissionDate)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-black text-sm font-semibold py-2 px-3 rounded"
                      onClick={() => navigate(`/project/${project.projectId}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="flex-1 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2 px-3 rounded"
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">No projects found</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 py-4 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded-xl">
          © 2025 Project Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ViewAll;