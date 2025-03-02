import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '@/contexts/PatientContext';
import { PieChart, LineChart, Line, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { 
  Calendar, 
  Clock, 
  Users, 
  Pill, 
  Bell, 
  ArrowUpRight, 
  Activity,
  CalendarClock,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    criticalCases: 0,
    todayAppointments: 0,
    pendingMedications: 0
  });
  
  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, patient: "Sarah Johnson", type: "medication", message: "Missed evening medication", time: "20 mins ago", severity: "high" },
    { id: 2, patient: "Michael Chen", type: "vitals", message: "Blood pressure exceeding threshold", time: "1 hour ago", severity: "critical" },
    { id: 3, patient: "Emma Wilson", type: "appointment", message: "Requested appointment reschedule", time: "3 hours ago", severity: "medium" },
    { id: 4, patient: "Robert Davis", type: "test", message: "Lab results ready for review", time: "5 hours ago", severity: "low" }
  ]);
  
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "David Miller", time: "09:00 AM", type: "Follow-up", status: "confirmed" },
    { id: 2, patient: "Anna Garcia", time: "10:30 AM", type: "Initial Consultation", status: "confirmed" },
    { id: 3, patient: "James Wilson", time: "01:15 PM", type: "Lab Review", status: "pending" },
    { id: 4, patient: "Sofia Rodriguez", time: "03:00 PM", type: "Annual Checkup", status: "confirmed" },
    { id: 5, patient: "Thomas Lee", time: "04:30 PM", type: "Prescription Renewal", status: "confirmed" }
  ]);
  
  // Alert popup state
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    patient: "",
    vitalSign: "",
    value: "",
    severity: "",
    time: ""
  });
  
  // Sample data for charts
  const patientStatusData = [
    { name: 'Critical', value: 8, color: '#EF4444' },
    { name: 'Serious', value: 15, color: '#F59E0B' },
    { name: 'Stable', value: 67, color: '#10B981' },
    { name: 'Recovering', value: 25, color: '#3B82F6' }
  ];
  
  const weeklyPatientData = [
    { day: 'Mon', patients: 15 },
    { day: 'Tue', patients: 22 },
    { day: 'Wed', patients: 19 },
    { day: 'Thu', patients: 28 },
    { day: 'Fri', patients: 32 },
    { day: 'Sat', patients: 12 },
    { day: 'Sun', patients: 8 }
  ];
  
  // Sample alerts for keyboard triggers
  const keyAlerts = {
    'h': { patient: "James Wilson", vitalSign: "Heart Rate", value: "120 bpm", severity: "critical", time: "Just now" },
    'b': { patient: "Sarah Johnson", vitalSign: "Blood Pressure", value: "160/95 mmHg", severity: "high", time: "Just now" },
    'o': { patient: "Michael Chen", vitalSign: "Oxygen Saturation", value: "92%", severity: "medium", time: "Just now" },
    't': { patient: "Emma Wilson", vitalSign: "Temperature", value: "38.9°C", severity: "high", time: "Just now" },
    'r': { patient: "Robert Davis", vitalSign: "Respiratory Rate", value: "28 breaths/min", severity: "high", time: "Just now" }
  };
  
  useEffect(() => {
    // In a real application, you would fetch this data from your API
    setStats({
      totalPatients: 115,
      criticalCases: 8,
      todayAppointments: 12,
      pendingMedications: 23
    });
    
    // Add keyboard event listener
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (keyAlerts[key]) {
        setAlertData(keyAlerts[key]);
        setShowAlert(true);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  // Function to determine alert color based on severity
  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Function to get alert icon color
  const getAlertIconColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="p-6 relative">
      {/* Alert Popup */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`max-w-md w-full mx-4 rounded-lg shadow-lg border-l-4 ${
            alertData.severity === 'critical' ? 'border-l-red-600' : 
            alertData.severity === 'high' ? 'border-l-orange-600' : 
            alertData.severity === 'medium' ? 'border-l-yellow-600' : 'border-l-blue-600'
          } bg-white overflow-hidden`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${
                  alertData.severity === 'critical' ? 'bg-red-100' : 
                  alertData.severity === 'high' ? 'bg-orange-100' : 
                  alertData.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                } mr-3`}>
                  <AlertTriangle className={`h-6 w-6 ${getAlertIconColor(alertData.severity)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">Vital Sign Alert</h3>
                    <span className={`px-2 py-1 text-xs rounded-full uppercase font-bold ${
                      alertData.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                      alertData.severity === 'high' ? 'bg-orange-100 text-orange-800' : 
                      alertData.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alertData.severity}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{alertData.time}</p>
                  <p className="font-medium text-lg mb-1">{alertData.patient}</p>
                  <p className="text-gray-700">
                    <span className="font-medium">{alertData.vitalSign}:</span> {alertData.value}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-between">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowAlert(false)}
              >
                Dismiss
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 border border-transparent rounded shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                onClick={() => setShowAlert(false)}
              >
                View Patient
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Clinical Dashboard</h1>
        <p className="text-gray-600">Welcome back</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Patients</p>
            <p className="text-2xl font-bold">{stats.totalPatients}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <Activity className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Critical Cases</p>
            <p className="text-2xl font-bold">{stats.criticalCases}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Appointments</p>
            <p className="text-2xl font-bold">{stats.todayAppointments}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Pill className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Medications</p>
            <p className="text-2xl font-bold">{stats.pendingMedications}</p>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Patient Status Overview</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                View Details <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={patientStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {patientStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyPatientData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="patients" stroke="#4F46E5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Alerts</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-3">
              {recentAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`border rounded-lg p-3 flex items-start ${getAlertColor(alert.severity)}`}
                >
                  <Bell className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="font-medium">{alert.patient}</p>
                      <span className="text-xs">{alert.time}</span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Appointments and Quick Actions */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Today's Schedule</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                Full Calendar <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {appointments.map(appointment => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition duration-150">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium">{appointment.patient}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.time}
                    <span className="mx-2">•</span>
                    <span>{appointment.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/patients" className="bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition duration-150">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium">Show Patients</span>
              </Link>
              <Link to="/medications" className="bg-purple-50 rounded-lg p-4 text-center hover:bg-purple-100 transition duration-150">
                <Pill className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <span className="text-sm font-medium">Prescribe Medication</span>
              </Link>
              <Link to="/appointments/schedule" className="bg-green-50 rounded-lg p-4 text-center hover:bg-green-100 transition duration-150">
                <CalendarClock className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <span className="text-sm font-medium">Schedule Appointment</span>
              </Link>
              <Link to="/vitals" className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition duration-150">
                <Activity className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium">View Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;