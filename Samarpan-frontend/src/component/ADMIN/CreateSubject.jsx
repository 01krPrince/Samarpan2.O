import React, { useEffect, useState } from 'react';

const CreateSubject = () => {
  const [subjectName, setSubjectName] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [subjects, setSubjects] = useState([]);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDM3NDcyNDYsImV4cCI6MTc1MTUyMzI0Nn0.m8mj7PdKBjNOeG2PWKnRfwRoAynS4XMoac5p0VsnPbHiNkLqcmBhie5hyjGKrp13_wd1x3QVTHyVL0ftt47Hxg';

  useEffect(() => {
    fetch('http://localhost:8080/api/subject/getAllSubjects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log("All Subjects :  ",response);
        setSubjects(data);
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
      });
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();

    if (!subjectName || !mentorName) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/subject/createsubject?subjectName=${encodeURIComponent(subjectName)}&mentorName=${encodeURIComponent(mentorName)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      });

      if (response.ok) {
        console.log("Subject creation :  ",response);
        const newSubject = await response.json();
        setSubjects([...subjects, newSubject]);
        setSubjectName('');
        setMentorName('');
      } else {
        alert('Failed to create subject');
      }
    } catch (error) {
      console.error('Error creating subject:', error);
    }
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
