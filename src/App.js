import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import NotFound from "./Components/NotFound";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import StudentDashboard from "./Components/Student/Dashboard/StudentDashboard"
function App() {
  return (
    <Routes>       
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/studentdashboard/*" element={<StudentDashboard/>} />
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
