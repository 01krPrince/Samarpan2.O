
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [projects, setProjects] = useState([
   
    {
      title: "Web Development Basics",
      category: "HTML",
      description: "Introduction to HTML and building web pages.",
      dueDate: "Feb 10, 2025",
    },
    {
      title: "Object-Oriented Programming",
      category: "Java",
      description: "A project covering OOP principles in Java.",
      dueDate: "Mar 20, 2025",
    },
  ]);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex h-screen  md:p-5 relative md:top-[8vh] top-[7vh] bg-gray-100 ">
     
      <main className="flex-1 p-6 ">
        <h2 className="md:text-2xl text-xl font-semibold mb-4 ">Projects Overview</h2>

      
        <div className="overflow-x-auto whitespace-nowrap">
  <div className="flex gap-2 mb-4">
    {["All", "C", "Java", "HTML", "CSS"].map((category) => (
      <button
        key={category}
        className={`px-4 py-2 text-sm border rounded-lg transition ${
          selectedCategory === category
            ? "bg-gray-800 text-white"
            : "hover:bg-gray-200"
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
                <h3 className="md:text-lg text-sm font-semibold">{project.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{project.category}</p>
                <p className="md:text-sm text-xs text-gray-700 mb-4">{project.description}</p>
                <p className="text-xs text-gray-500"> {project.dueDate}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No projects found in this category.
            </p>
          )}

          <div className="p-4 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <PlusCircle size={32} className="text-gray-500" />
            <p className="text-sm text-gray-500 mt-2">Add New Project</p>
          </div>
        </div>
      </main>
    </div>
  );
}
