import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/subject/getAllSubjects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch subjects");

        const data = await response.json();
        setCategories(["All", ...data.map((subject) => subject.subjectName)]);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const studentId = user?.id;

        const response = await fetch(
          `http://localhost:8080/api/projects/getProjectByStudentId?studentId=${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        const projectData = Array.isArray(data) ? data : data.data || [];
        const sortedProjects = projectData.sort((a, b) => a.subject.localeCompare(b.subject));
        setProjects(sortedProjects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProjects();
  }, []);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.subject === selectedCategory);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="md:ml-[10px] ml-[60px] p-4 pt-[10vh]">
        <main className="px-3">
          <h2 className="md:text-2xl text-xl font-semibold mb-4">Projects Overview</h2>

          {loading ? (
            <>
              {/* Skeleton Buttons */}
              <div className="flex gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" width={90} height={32} />
                ))}
              </div>

              {/* Skeleton Cards */}
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-md">
                    <Skeleton variant="rectangular" width="100%" height={180} />
                    <Skeleton width="70%" height={30} style={{ marginTop: 10 }} />
                    <Skeleton width="50%" height={20} />
                    <Skeleton width="60%" height={20} />
                  </div>
                ))}
              </div>
            </>
          ) : error ? (
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : (
            <>
              {/* Category Filter Buttons */}
              <div className="overflow-x-auto max-w-full">
                <div className="flex gap-2 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`md:px-4 px-3 md:py-2 py-1 text-sm border rounded-lg transition min-w-fit ${selectedCategory === category
                          ? "bg-gray-800 text-white"
                          : "hover:bg-gray-200 bg-white"
                        }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Cards */}
              <div className="grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 gap-6">
                <div
                  onClick={() => navigate("/submit-project")}
                  className="p-6 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <PlusCircle size={36} className="text-gray-500" />
                  <p className="text-base text-gray-500 mt-2">Add New Project</p>
                </div>

                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 ease-in-out relative"
                      onClick={() => navigate("/view-project", { state: { project } })}
                    >
                      <div className="overflow-hidden rounded-md relative">
                        <img
                          src={project.imageUrls}
                          alt={project.projectName}
                          className="w-full h-40 md:h-48 lg:h-52 object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <span
                          className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded-full shadow-sm ${project.markAsCheck ? "bg-green-500" : "bg-red-500"
                            }`}
                        >
                          {project.markAsCheck ? "Checked" : "Pending"}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-900 truncate">
                            {project.projectName}
                          </h3>
                          <p className="text-sm text-gray-500 italic">
                            {new Date(project.submissionDate).toLocaleDateString()}
                          </p>
                        </div>

                        <p className="text-base text-gray-700 font-medium">{project.subject}</p>

                        <div className="flex flex-wrap justify-around gap-3 mt-3">
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 text-sm font-medium hover:text-blue-900"
                          >
                            GitHub Repo
                          </a>
                          <a
                            href={project.deployedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 text-sm font-medium hover:text-green-900"
                          >
                            Live Demo
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full">
                    No projects found in this category.
                  </p>
                )}
              </div>


            </>
          )}
        </main>
      </div>
    </div>
  );
}
