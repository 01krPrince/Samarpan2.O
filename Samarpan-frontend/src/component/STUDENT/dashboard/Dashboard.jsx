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
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      setLoading(false);
      navigate("/", { replace: true });
      return;
    }

    let user;
    try {
      user = JSON.parse(userString);
    } catch {
      setLoading(false);
      navigate("/", { replace: true });
      return;
    }

    const studentId = user?.id;
    if (!studentId) {
      setLoading(false);
      navigate("/", { replace: true });
      return;
    }

    setError(null);

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://samarpan2-o.onrender.com/api/subject/getAllSubjects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/", { replace: true });
            return;
          }
          throw new Error("Failed to fetch subjects");
        }
        const data = await response.json();
        setCategories(["All", ...data.map((subject) => subject.subjectName)]);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `https://samarpan2-o.onrender.com/api/projects/getProjectByStudentId?studentId=${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/", { replace: true });
            return;
          }
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        const projectData = data.content || [];
        const sortedProjects = projectData.sort((a, b) =>
          a.subject.localeCompare(b.subject)
        );
        setProjects(sortedProjects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProjects();
  }, [navigate]);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.subject === selectedCategory);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pb-80 max-w-[100vw] px-5">
      <div className="pt-[10vh]">
        <main>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Projects Overview</h2>
          {loading ? (
            <>
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" width={90} height={32} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="overflow-x-auto max-w-full">
                <div className="flex gap-2 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1.5 text-sm border rounded-lg transition min-w-fit whitespace-nowrap cursor-pointer ${
                        selectedCategory === category
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
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div
                  onClick={() => navigate("/submit-project")}
                  className="p-6 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <PlusCircle size={36} className="text-gray-500" />
                  <p className="text-base text-gray-500 mt-2">Add New Project</p>
                </div>

                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all border cursor-pointer"
                      onClick={() =>
                        navigate("/view-project", { state: { project } })
                      }
                    >
                      <div className="relative rounded overflow-hidden">
                        <img
                          src={project.imageUrls}
                          alt={project.projectName}
                          className="w-full h-40 sm:h-44 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <span
                          className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded-full shadow-sm ${
                            project.markAsCheck
                              ? "bg-indigo-500"
                              : "bg-yellow-200 text-yellow-700"
                          }`}
                        >
                          {project.markAsCheck ? "Reviewed" : "Pending"}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {project.projectName}
                          </h3>
                          <p className="text-xs text-gray-500 italic">
                            {new Date(project.submissionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {project.subject}
                        </p>
                        <div className="flex flex-wrap justify-start gap-4 mt-3">
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm font-medium hover:underline"
                          >
                            GitHub Repo
                          </a>
                          <a
                            href={project.deployedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 text-sm font-medium hover:underline"
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
