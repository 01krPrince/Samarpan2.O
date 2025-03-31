import React, { useState } from 'react';

const CreateSubject = () => {
  // State for form inputs
  const [subjectName, setSubjectName] = useState('');
  const [mentorName, setMentorName] = useState('');

  // State for the list of existing subjects
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Web Development', mentor: 'John Doe' },
    { id: 2, name: 'Data Structures', mentor: 'Jane Smith' },
  ]);

  // Handle form submission to add a new subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!subjectName || !mentorName) {
      alert('Please fill in both fields.');
      return;
    }

    const newSubject = {
      id: subjects.length + 1, // Simple ID generation (replace with a better method in production)
      name: subjectName,
      mentor: mentorName,
    };

    setSubjects([...subjects, newSubject]);
    setSubjectName(''); // Reset form
    setMentorName('');
  };

  const handleMenuClick = (subjectId) => {
    console.log(`Menu clicked for subject ID: ${subjectId}`);
  };

  return (
    <div className="mt-16 h-auto bg-gray-50 flex justify-between px-[7vw] py-10">
      <div className="w-[50%] p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Subject Details</h2>
        <form onSubmit={handleAddSubject}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Subject Name</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Mentor Name</label>
            <input
              type="text"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              placeholder="Enter mentor name"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition-all duration-300"
          >
            + Add Subject
          </button>
        </form>
      </div>

      <div className="w-[45%] p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Existing Subjects</h2>
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white p-4 mb-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700 font-semibold">{subject.name}</p>
                <p className="text-gray-600 text-sm">Mentor: {subject.mentor}</p>
              </div>
              <button
                onClick={() => handleMenuClick(subject.id)}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v.01M12 12v.01M12 18v.01"
                  />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No subjects available.</p>
        )}
      </div>
    </div>
  );
};

export default CreateSubject;