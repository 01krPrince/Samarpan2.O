
// import './App.css'
// import Dashboard from './component/STUDENT/dashboard/Dashboard'
// import Sidebar from './component/STUDENT/navbar/SideNavbar'

// function App() {
  

//   return (
//     <>
//     <Sidebar/>
//      </>
//   )
// }

// export default App


import { Routes, Route } from "react-router-dom";
import Sidebar from "./component/STUDENT/navbar/SideNavbar";
import Dashboard from "./component/STUDENT/dashboard/Dashboard";


function App() {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 ">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
