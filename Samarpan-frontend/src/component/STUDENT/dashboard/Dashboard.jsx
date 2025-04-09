import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch subjects");

        const data = await response.json();
        console.log(data);
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
        console.log("Student ID:", studentId);

        const response = await fetch(
          `http://localhost:8080/api/projects/getProjectByStudentId?studentId=${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        console.log("Fetched data from backend:", data);

        const projectData = Array.isArray(data) ? data : data.data || [];
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
  }, []);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.subject === selectedCategory);

  return (
    <div className="bg-gray-100">
      <div className="flex h-screen md:p-5 md:pt-[10vh] pt-[8vh]">
        <main className="flex-1 px-3">
          <h2 className="md:text-2xl text-xl font-semibold mb-4">Projects Overview</h2>
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : (
            <>
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
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <div key={index} className="md:p-4 p-2 bg-white shadow rounded-lg">
                      <img
                        src={project.imageUrls}
                        alt={project.projectName}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <h3 className="md:text-lg text-sm font-semibold">{project.projectName}</h3>
                      <p className="text-xs text-gray-500 mb-2">{project.subject}</p>
                      <p className="text-xs text-gray-500 mb-1">
                        Submission: {new Date(project.submissionDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs underline"
                        >
                          GitHub
                        </a>
                        <a
                          href={project.deployedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 text-xs underline"
                        >
                          Live Demo
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    No projects found in this category.
                  </p>
                )}

                <div
                  onClick={() => navigate("/submit-project")}
                  className="p-4 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <PlusCircle size={32} className="text-gray-500" />
                  <p className="text-sm text-gray-500 mt-2">Add New Project</p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}