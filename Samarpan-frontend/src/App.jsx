
import { Routes, Route } from "react-router-dom";
import Sidebar from "./component/STUDENT/navbar/SideNavbar";
import Dashboard from "./component/STUDENT/dashboard/Dashboard";
import SubmitProject from "./component/STUDENT/dashboard/SubmitProject";


function App() {
  return (
    <div className="flex ">
      <Sidebar/>
      <div className="flex-1 ">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
