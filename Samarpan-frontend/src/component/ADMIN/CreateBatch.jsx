import React, { useState, useEffect } from 'react';

const CreateBatch = () => {
  const [batches, setBatches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState('');
  const [batchName, setBatchName] = useState('');
  const [session, setSession] = useState('');

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/Batch/getAllBatch', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch batches');
      const data = await response.json();
      console.log('Fetched batches:', data);
      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/branch/getAllBranches', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch branches');
      const data = await response.json();
      console.log('Fetched branches:', data);
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/v1/Batch/createBatch?batchName=${batchName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({
          branchName: branch,
        }),
      });

      if (!response.ok) throw new Error('Failed to create batch');
      const result = await response.json();
      console.log('Batch created:', result);

      // Clear form
      setBranch('');
      setBatchName('');
      setSession('');

      // Refresh batches list
      fetchBatches();
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  return (
    <div className="mt-16 min-auto px-auto py-10 px-[7vw] bg-gray-50 flex justify-between">
      {/* ✅ Sidebar showing batches */}
      <div className="w-[20vw] p-6 bg-white border-r border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Batches</h2>
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-gray-100 w-full py-3 px-4 mb-3 rounded-xl shadow-sm hover:bg-gray-200 transition-all duration-200"
          >
            <p className="text-gray-800 font-bold">{batch.batchName}</p>
            <p className="text-gray-600 text-sm font-semibold">{batch.branchName}</p>
          </div>
        ))}
      </div>

      {/* ✅ Form for adding a new batch */}
      <div className="w-[70%] flex justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Batch</h2>
          <form onSubmit={handleSubmit}>
            {/* Branch Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Branch</label>
              <div className="flex items-center gap-4 flex-wrap">
                {branches.map((b, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="branch"
                      value={b.branchName}
                      checked={branch === b.branchName}
                      onChange={(e) => setBranch(e.target.value)}
                      className="mr-2"
                    />
                    {b.branchName}
                  </label>
                ))}
              </div>
            </div>

            {/* Batch Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Batch Name</label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="Enter batch name eg. [Cage-K1]"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                required
              />
            </div>

            {/* Session Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                required
              >
                <option value="">Select session</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition-all duration-300 mb-4"
            >
              + Add Batch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBatch;
