import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project =>
    project?.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const adminId = user?.id;
    console.log("Admin ID:", adminId);

    fetch(`http://localhost:8080/api/projects/all?adminId=${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            console.warn("Unauthorized. Redirecting to login...");
            navigate("/login");
          }
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data);
        setProjects(data);
      })
      .catch((error) => console.error("Error fetching data:", error.message));
  }, [navigate]);

  return (
    <>
      <div className="pt-0 w-full min-h-auto px-4 mt-14 xl:mt-20 md:mt-16 bg-gray-100">
        <div className="w-full max-w-full mx-auto py-2">
          <input
            type="text"
            placeholder="Search by student name"
            className="w-full px-2 py-1 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="p-4 h-auto flex flex-wrap gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div
                key={index}
                className="w-[320px] sm:w-[280px] bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={project.imageUrls || 'path/to/fallback-image.jpg'}
                  alt={project.projectName || 'Project Image'}
                  className="w-full h-40 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.src = 'path/to/fallback-image.jpg';
                  }}
                />

                <div className="p-4 relative">
                  <div
                    className={`absolute top-4 right-4 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full ${project.markAsCheck ? 'bg-green-200' : 'bg-red-200'
                      }`}
                  >
                    {project.markAsCheck ? "Checked" : "Unchecked"}
                  </div>


                  <h2 className="text-lg font-semibold text-black">{project.projectName}</h2>
                  <p className="text-sm text-gray-600 mt-1">{project.studentName}</p>

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
      </div>
    </>
  );


};

export default Landing;
