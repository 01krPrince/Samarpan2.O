import React, { useState } from 'react'

const CreateBatch = () => {
  const batches = [
    { id: 1, name: 'Batch 2023-A', location: 'Kankarbagh' },
    { id: 2, name: 'Batch 2023-B', location: 'Boring Road' },
  ];

  const [branch, setBranch] = useState('');
  const [batchName, setBatchName] = useState('');
  const [session, setSession] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Batch:', { branch, batchName, session });
    setBranch('');
    setBatchName('');
    setSession('');
  };

  return (
    <div className="mt-16 min-auto px-auto py-10 px-[7vw] bg-gray-50 flex justify-between">
      <div className="w-[20vw] p-6 bg-white border-r border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Batches</h2>
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-gray-100 w-full py-3 px-4 mb-3 rounded-xl shadow-sm hover:bg-gray-200 transition-all duration-200"
          >
            <p className="text-gray-800 font-bold">{batch.name}</p>
            <p className="text-gray-600 text-sm font-semibold">{batch.location}</p>
          </div>
        ))}
      </div>

      <div className="w-[70%] flex justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Batch</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Branch</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="branch"
                    value="Kankarbagh"
                    checked={branch === 'Kankarbagh'}
                    onChange={(e) => setBranch(e.target.value)}
                    className="mr-2"
                  />
                  Kankarbagh
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="branch"
                    value="Boring Road"
                    checked={branch === 'Boring Road'}
                    onChange={(e) => setBranch(e.target.value)}
                    className="mr-2"
                  />
                  Boring Road
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Batch Name</label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="Enter batch name eg.[Cage-K1]"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                required
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
              </select>
            </div>

            <button
              type="button"
              className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition-all duration-300 mb-4"
            >
              + Add Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBatch;