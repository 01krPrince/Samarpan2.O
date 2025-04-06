import React, { useState, useEffect } from 'react';

const CreateBatch = () => {
  const [batches, setBatches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [batchName, setBatchName] = useState('');
  const [submitButton, setSubmitButton] = useState(true);

  // Fetch all batches
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
      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  // Fetch all branches
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
    setSubmitButton(false);

    try {
      const token = localStorage.getItem('token');
      const selectedBranch = branches.find((b) => b.id === selectedBranchId);

      const response = await fetch(
        `http://localhost:8080/api/v1/Batch/createBatch?batchName=${encodeURIComponent(batchName)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
          body: JSON.stringify({
            id: selectedBranchId,
            branchName: selectedBranch?.branchName || '',
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create batch: ${errorText}`);
      }

      const result = await response.json();
      console.log('Batch created:', result);

      // Reset form and refresh list
      setBatchName('');
      setSelectedBranchId('');
      fetchBatches();
    } catch (error) {
      console.error('Error creating batch:', error);
    } finally {
      setSubmitButton(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Right Panel - Form (Appears first on mobile) */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-md border border-gray-200 order-1 lg:order-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Batch</h2>
          <form onSubmit={handleSubmit}>
            {/* Branch Radio Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <div className="flex flex-wrap gap-4">
                {branches.map((b) => (
                  <label key={b.id} className="flex items-center">
                    <input
                      type="radio"
                      name="branch"
                      value={b.id}
                      checked={selectedBranchId === b.id}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-gray-700">{b.branchName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Batch Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="Enter batch name e.g., Cage-K1"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedBranchId || !batchName || !submitButton}
              className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 mb-4 ${
                !selectedBranchId || !batchName || !submitButton
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-900 text-white cursor-pointer'
              }`}
            >
              {submitButton ? '+ Add Batch' : 'Submitting...'}
            </button>
          </form>
        </div>

        {/* Sidebar - List of batches (Appears second on mobile) */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md border border-gray-200 order-2 lg:order-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Batches</h2>
          <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {batches.length > 0 ? (
              [...batches].reverse().map((batch) => (
                <div
                  key={batch.id}
                  className="bg-gray-50 w-full py-3 px-4 mb-3 rounded-xl shadow-sm hover:bg-gray-100 transition-all duration-200"
                >
                  <p className="text-gray-700 font-medium">{batch.batchName}</p>
                  <p className="text-gray-600 text-sm">{batch.branchName}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No batches found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBatch;