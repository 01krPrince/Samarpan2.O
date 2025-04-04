import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project =>
    project.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch("http://localhost:8080/api/projects/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            console.warn("Unauthorized. Redirecting to login...");
            navigate("/login"); // redirect if not logged in
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

        <div className="w-full max-w-full mx-auto py-2 border-black rounded">
          <input
            type="text"
            placeholder="Search by student name"
            className="w-full px-2 py-1 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


        <div className="p-4 h-[80vh] flex flex-wrap gap-2 xl:justify-evenly ">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div
                key={index}
                className=" w-[260px] sm:w-[200px] md:w-[280px]   lg:w-[280px] xl:w-[400px] h-auto bg-white rounded-lg shadow-md shadow-black overflow-hidden mt-2"
              >

                <div className="w-full h-48">
                  <img
                    src={project.imageUrls}
                    alt={project.projectName}
                    className="w-full h-full object-cover"
                  />
                </div>


                <div className=" p-4">
                  <h2 className="text-xl font-bold"><span className='font-light'>Project Name:</span> {project.projectName}</h2>
                  <h3 className="text-lg font-semibold"><span className='font-light'>Student:</span> {project.student.name}</h3>
                  <div className="flex items-center mt-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < project.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <button className='w-16 bg-slate-400 rounded ' onClick={() => navigate(`/project/${project.projectId}`)}>Details</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No projects found</p>
          )}
        </div>
      </div>
    </>
  );

}

export default Landing
