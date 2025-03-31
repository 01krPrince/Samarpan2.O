
import { Routes, Route } from "react-router-dom";
import Sidebar from "./component/STUDENT/navbar/SideNavbar";
import Dashboard from "./component/STUDENT/dashboard/Dashboard";
import SubmitProject from "./component/STUDENT/dashboard/SubmitProject";
import AdminLogin from "./component/ADMIN/AdminLogin";
import AdminSignUp from "./component/ADMIN/AdminSignUp";
import CreateBatch from "./component/ADMIN/CreateBatch";
import CreateSubject from "./component/ADMIN/CreateSubject";
import ViewAll from "./component/ADMIN/viewAll";


function App() {
  return (
    <div className="flex ">
      <Sidebar/>
      <div className="flex-1 ">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/signup" element={<AdminSignUp />} />
          <Route path="/createBatch" element={<CreateBatch />} />
          <Route path="/createSubject" element={<CreateSubject />} />
          <Route path="/viewAll" element={<ViewAll />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
