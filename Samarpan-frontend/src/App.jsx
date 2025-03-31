import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Landing from './Components/Landing'
import ProjectDetails from './Components/ProjectDetails'
import Sidebar from "./Components/Sidebar";

function App() {

  return (
  
     <Router>
      <div className="flex">
      <Sidebar/>
      <div className="">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
      </div>
    </div>
    </Router>

  )
}

export default App