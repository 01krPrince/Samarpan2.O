import React, { useState, useEffect } from 'react';
import Switch from "@mui/material/Switch";
import Skeleton from '@mui/material/Skeleton';
import { IoReloadCircle } from "react-icons/io5";
import '../../../src/App.css';
import { useNavigate } from "react-router-dom";

const ViewAll = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branch, setBranch] = useState('');
  const [branchName, setBranchName] = useState('');
  const [batch, setBatch] = useState('');
  const [subject, setSubject] = useState('');
  const [sortCheckedOnTop, setSortCheckedOnTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const batchesResponse = await fetch("https://samarpan2-o.onrender.com/api/v1/Batch/getAllBatch");
      if (!batchesResponse.ok) throw new Error("Failed to fetch batches");
      const batchesData = await batchesResponse.json();
      setBatches(batchesData);
      setAllBatches(batchesData);

      const branchesResponse = await fetch("https://samarpan2-o.onrender.com/api/v1/branch/getAllBranches", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!branchesResponse.ok) throw new Error("Failed to fetch branches");
      const branchesData = await branchesResponse.json();
      setBranches(branchesData);

      const subjectsResponse = await fetch("https://samarpan2-o.onrender.com/api/subject/getAllSubjects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!subjectsResponse.ok) throw new Error("Failed to fetch subjects");
      const subjectsData = await subjectsResponse.json();
      setSubjects(subjectsData.map(sub => sub.subjectName));

      const user = JSON.parse(localStorage.getItem("user"));
      const adminId = user?.id;

      
      const projectsResponse = await fetch(`https://samarpan2-o.onrender.com/api/projects/all?adminId=${adminId}&page=${0}&size=${1000}`, {
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
      const projectsArray = Array.isArray(projectsData?.content) ? projectsData.content : [];
setProjects(projectsArray);
setTotalPages(projectsData.totalPages || 0);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [navigate, page, size]);

  const filterByBranch = (selectedBranchId) => {
    if (selectedBranchId) {
      const filtered = allBatches.filter(b => b.branchId === selectedBranchId);
      setBatches(filtered);
      setBatch('');
    } else {
      setBatches(allBatches);
      setBatch('');
    }
  };

  const handleBranchChange = (e) => {
    const selectedBranchId = e.target.value;
    const selectedBranch = branches.find(b => b.id === selectedBranchId);
    setBranch(selectedBranchId);
    setBranchName(selectedBranch?.branchName || '');
    filterByBranch(selectedBranchId);
    setPage(0);
  };

  const handleReset = () => {
    setBranch('');
    setBranchName('');
    setBatch('');
    setSubject('');
    setSearchQuery('');
    setSortCheckedOnTop(false);
    setBatches(allBatches);
    setError('');
    setPage(0);
  };

  const getFilteredProjects = () => {
    let filtered = [...projects];

    if (branchName) {
      filtered = filtered.filter(project => project.branch === branchName);
    }

    if (batch) {
      filtered = filtered.filter(project => project.batch === batch);
    }

    if (subject) {
      filtered = filtered.filter(project => project.subject === subject);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        (project.projectName?.toLowerCase().includes(query) || '') ||
        (project.studentName?.toLowerCase().includes(query) || '') ||
        (project.status?.toLowerCase().includes(query) || '') ||
        (project.branch?.toLowerCase().includes(query) || '') ||
        (project.batch?.toLowerCase().includes(query) || '') ||
        (project.subject?.toLowerCase().includes(query) || '')
      );
    }

    filtered.sort((a, b) => {
      if (sortCheckedOnTop) {
        return (b.markAsCheck === true) - (a.markAsCheck === true);
      } else {
        return (a.markAsCheck === false) - (b.markAsCheck === false);
      }
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredProjects = getFilteredProjects();

  return (
    <div className="mt-16 min-h-screen bg-gray-100 flex flex-col items-center py-4 px-2 sm:px-4 lg:px-8 w-full">
      <div className="w-full max-w-7xl">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-8">
          <select
            className="w-full md:w-[45%] lg:w-[22%] p-3 bg-white border border-gray-200 rounded-xl shadow-sm"
            value={branch}
            onChange={handleBranchChange}
          >
            <option value="">Select Branch</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.branchName}</option>
            ))}
          </select>

          <select
            className="w-full md:w-[45%] lg:w-[22%] p-3 bg-white border border-gray-200 rounded-xl shadow-sm"
            value={batch}
            onChange={(e) => { setBatch(e.target.value); setPage(0); }}
          >
            <option value="">Select Batch</option>
            {batches.map(b => (
              <option key={b.id} value={b.batchName}>{b.batchName}</option>
            ))}
          </select>

          <select
            className="w-full md:w-[45%] lg:w-[22%] p-3 bg-white border border-gray-200 rounded-xl shadow-sm"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setPage(0); }}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="w-full md:w-[45%] lg:w-[28%] relative">
            <input
              type="text"
              placeholder="Search projects, students, batch..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl shadow-sm"
              autoComplete="off"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 w-full text-red-700 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center mb-4">
          <span className="mr-4 text-sm font-medium text-gray-700">
            {sortCheckedOnTop ? 'Checked' : 'Unchecked'}
          </span>
          <Switch
            checked={sortCheckedOnTop}
            onChange={(e) => setSortCheckedOnTop(e.target.checked)}
          />
          <button onClick={handleReset} className="ml-4 p-2 text-gray-600 cursor-pointer hover:text-indigo-600">
            <IoReloadCircle className="w-8 h-8" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </p>

        <div className="p-4 flex flex-wrap gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="w-[320px] sm:w-[280px] bg-white rounded-xl shadow overflow-hidden">
                <Skeleton variant="rectangular" width="100%" height={160} />
                <div className="p-4">
                  <Skeleton width="80%" height={24} />
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="40%" height={18} />
                  <Skeleton variant="rounded" width="100%" height={36} />
                </div>
              </div>
            ))
          ) : filteredProjects.length === 0 ? (
            <p className="text-gray-600 text-center w-full">No projects found.</p>
          ) : (
            filteredProjects.map(project => (
              <div
                key={project.projectId}
                className="w-[320px] sm:w-[280px] bg-white rounded-xl shadow-md p-4 relative cursor-pointer"
                onClick={() => navigate('/admin/review-project', { state: { project } })}
              >
                <div className={`absolute top-4 right-4 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full z-10 ${project.markAsCheck ? 'bg-green-200' : 'bg-red-200'}`}>
                  {project.markAsCheck ? "Checked" : "Unchecked"}
                </div>

                <img
                  src={project.imageUrls || "https://via.placeholder.com/320x160?text=No+Image"}
                  alt={project.projectName}
                  className="rounded-md w-full h-40 object-cover hover:scale-105 transition-transform"
                />

                <h3 className="mt-2 text-lg font-semibold">{project.projectName}</h3>
                <p className="text-sm text-gray-500">Student: {project.studentName}</p>
                <p className="text-sm text-gray-500">Branch: {project.branch}</p>
                <p className="text-sm text-gray-500">Batch: {project.batch}</p>
                <p className="text-sm text-gray-500">Subject: {project.subject}</p>
                <p className="text-xs text-gray-400">Submitted: {project.submissionDate ? formatDate(project.submissionDate) : 'N/A'}</p>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredProjects.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 0}
              onClick={() => setPage(prev => Math.max(prev - 1, 0))}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAll;
