import React, { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Footer from './Footer';

const CreateSubject = () => {
  const [subjectName, setSubjectName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [submitButton, setSubmitButton] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoadingSubjects(true);
    fetch('https://samarpan2-o.onrender.com/api/subject/getAllSubjects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
      })
      .finally(() => {
        setLoadingSubjects(false);
      });
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();

    if (!subjectName) {
      alert('Please enter the subject name.');
      return;
    }

    setSubmitButton(false);
    try {
      const response = await fetch(
        `https://samarpan2-o.onrender.com/api/subject/createsubject?subjectName=${encodeURIComponent(subjectName)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          },
        }
      );

      if (response.ok) {
        const newSubject = await response.json();
        setSubjects([...subjects, newSubject]);
        setSubjectName('');
      } else {
        alert('Failed to create subject');
      }
    } catch (error) {
      console.error('Error creating subject:', error);
    } finally {
      setSubmitButton(true);
    }
  };

  const handleMenuClick = (subjectId) => {
    console.log(`Menu clicked for subject ID: ${subjectId}`);
  };

  return (
    <div className="mt-16 min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Add Subject Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Subject</h2>
          <form onSubmit={handleAddSubject}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Enter subject name"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!subjectName || !submitButton}
              className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 mb-4 ${
                !subjectName || !submitButton
                  ? 'bg-gray-700 text-white cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white cursor-pointer'
              }`}
            >
              {submitButton ? '+ Add Subject' : 'Submitting...'}
            </button>
          </form>
        </div>

        {/* Existing Subjects */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Subjects</h2>
          <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loadingSubjects ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-3">
                  <Skeleton variant="rounded" height={48} />
                </div>
              ))
            ) : subjects.length > 0 ? (
              [...subjects].reverse().map((subject) => (
                <div
                  key={subject.id}
                  className="bg-gray-50 w-full py-3 px-4 mb-3 rounded-xl shadow-sm hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                  onClick={() => handleMenuClick(subject.id)}
                >
                  <p className="text-gray-700 text-base font-medium">{subject.subjectName}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No subjects available.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateSubject;
