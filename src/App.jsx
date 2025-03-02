import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/components/Home";
import PatientDetails from "@/components/PatientDetails";
import Navbar from "@/components/Navbar";
import PatientList from "@/components/PatientList";
import PatientManagement from "@/components/PatientManagement";
import Dashboard from "@/components/Dashboard";
import Patient from "@/components/AddPatient";
import PatientVitalsDashboard from "./components/PatientVitalsDashboard";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/patients/*" element={<PatientManagement />} />
          <Route path="/patient/:patientId" element={<PatientDetails />} />
          <Route path="/vitals" element={<PatientVitalsDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;