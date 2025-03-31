import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import { initialProjects, branches, batches, subjects } from '../../data';
import '../../../src/App.css';
import { IoReloadCircle } from "react-icons/io5";


const ViewAll = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [subject, setSubject] = useState('');
  const [sortCheckedOnTop, setSortCheckedOnTop] = useState(false); // Default is "Unchecked on Top"
  const [searchQuery, setSearchQuery] = useState(''); // State for search bar

  // Apply filters, search, and sorting
  const applyFiltersAndSort = () => {
    let filteredProjects = [...initialProjects];

    if (branch) {
      filteredProjects = filteredProjects.filter((project) => project.branch === branch);
    }

    if (batch) {
      filteredProjects = filteredProjects.filter((project) => project.batch === batch);
    }

    if (subject) {
      filteredProjects = filteredProjects.filter((project) => project.subject === subject);
    }

    if (searchQuery) {
      filteredProjects = filteredProjects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    filteredProjects.sort((a, b) => {
      if (sortCheckedOnTop) {
        return a.status === 'Checked' && b.status !== 'Checked' ? -1 : a.status !== 'Checked' && b.status === 'Checked' ? 1 : 0;
      } else {
        return a.status === 'Unchecked' && b.status !== 'Unchecked' ? -1 : a.status !== 'Unchecked' && b.status === 'Unchecked' ? 1 : 0;
      }
    });

    setProjects(filteredProjects);
  };

  const handleFilterChange = () => {
    applyFiltersAndSort();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortToggle = (event) => {
    const isChecked = event.target.checked;
    setSortCheckedOnTop(isChecked);
  };

  const handleReset = () => {
    setBranch('');
    setBatch('');
    setSubject('');
    setSearchQuery('');
    setSortCheckedOnTop(false);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [branch, batch, subject, searchQuery, sortCheckedOnTop]);

  useEffect(() => {
    const sortedProjects = [...initialProjects].sort((a, b) => {
      return a.status === 'Unchecked' && b.status !== 'Unchecked' ? -1 : a.status !== 'Unchecked' && b.status === 'Unchecked' ? 1 : 0;
    });
    setProjects(sortedProjects);
  }, []);

  return (
    <div className="mt-16 min-h-screen/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
          </svg>
          <h1 className="text-3xl font-bold text-gray-800">Project Management</h1>
        </div>
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span className="text-gray-600 font-medium">Admin</span>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="flex flex-row items-center gap-4 mb-8">
        <div className="w-full sm:w-1/4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Branch</label>
          <select
            className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md"
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Batch</label>
          <select
            className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md"
            value={batch}
            onChange={(e) => {
              setBatch(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Subject</label>
          <select
            className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="text-2xl mt-5 sm:w-auto">
          <IoReloadCircle onClick={handleReset} />
        </div>
      </div>


      {/* Sort Toggle with MUI Switch */}
      <div className="flex items-center mb-8">
        <span className="mr-4 text-sm font-semibold text-gray-800 tracking-wide">
          {sortCheckedOnTop ? 'Checked on Top' : 'Unchecked on Top'}
        </span>
        <Switch
          checked={sortCheckedOnTop}
          onChange={handleSortToggle}
          inputProps={{ 'aria-label': 'Sort projects by status' }}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#1f2937',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#6b7280',
            },
            '& .MuiSwitch-switchBase': {
              color: '#9ca3af',
            },
            '& .MuiSwitch-track': {
              backgroundColor: '#d1d5db',
            },
          }}
        />
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{project.name}</h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${project.status === 'Checked'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                >
                  {project.status}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">{project.lead[0]}</span>
                </div>
                <p className="text-gray-600 font-medium">{project.lead}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            No projects match your filters.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 py-4 text-center text-gray-500 text-sm bg-white border border-gray-200">
        © 2025 Project Management System. All rights reserved.
      </div>
    </div>
  );
};

export default ViewAll;