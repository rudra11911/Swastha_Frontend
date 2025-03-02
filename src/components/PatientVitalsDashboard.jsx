import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ThermometerSun, Heart, Droplet, AlertCircle, Clock, ArrowUpCircle, ArrowDownCircle, Brain, AlertTriangle, FileCheck } from 'lucide-react';

const PatientVitalsDashboard = () => {
  const ws = useRef(null);
  // Sample patient data
  const [patient, setPatient] = useState({
    id: "1",
    name: "Rudra Pratap",
    age: 22,
    gender: "Male",
    room: "101",
    admissionDate: "2025-02-25T08:30:00",
    attendingPhysician: "Dr. Sahil Goyat"
  });

  // Current vital signs (from WebSocket)
  const [currentVitals, setCurrentVitals] = useState(null);
  
  // Vital signs history data (will be updated from WebSocket)
  const [vitalHistory, setVitalHistory] = useState([]);

  // Sample AI-generated diet recommendations
  const [dietRecommendations, setDietRecommendations] = useState([
    "High protein meals to support recovery",
    "Increased fluid intake (2-3L daily)",
    "Low sodium options for blood pressure management",
    "Balanced fiber intake for digestive health",
    "Regular small meals throughout the day"
  ]);

  // Sample AI-generated limitations
  const [patientLimitations, setPatientLimitations] = useState([
    "Avoid strenuous physical activity for 2 weeks",
    "Limited stair climbing (1-2 flights maximum)",
    "No driving for 72 hours after medication adjustment",
    "Restricted bending and lifting (nothing >5kg)",
    "Avoid alcohol and caffeine"
  ]);

  // Discharge readiness state
  const [dischargeReadiness, setDischargeReadiness] = useState({
    score: 98,
    readyForDischarge: true,
    estimatedDate: "2025-03-05",
    pendingItems: ["Final blood work", "Physical therapy assessment", "Medication reconciliation"]
  });

  useEffect(() => {
    const connectWebSocket = () => {
      console.log('Connecting to WebSocket...');
      ws.current = new WebSocket('ws://localhost:5173/ws');

      ws.current.onopen = () => {
        console.log('Connected to WebSocket');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received:', data);
          if (data.vitals && data.vitals.length > 0) {
            const newVital = data.vitals[0];
            
            // Format the data to match our dashboard format
            const formattedVital = {
              time: new Date(newVital.timestamp).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
              heartRate: newVital.heartRate,
              systolic: newVital.bloodPressure.systolic,
              diastolic: newVital.bloodPressure.diastolic,
              temperature: newVital.bodyTemperature,
              respRate: newVital.respiratoryRate,
              spo2: newVital.oxygenSaturation,
              pain: newVital.painLevel,
              glucose: newVital.glucose
            };
            
            // Update current vitals
            setCurrentVitals(formattedVital);
            
            // Add to history (limited to last 10 readings)
            setVitalHistory(prevHistory => {
              const newHistory = [formattedVital, ...prevHistory];
              return newHistory.slice(0, 10); // Keep only the last 10 readings
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };

      ws.current.onclose = () => {
        console.warn('WebSocket disconnected, retrying in 3 seconds...');
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.current.close();
      };
    };

    connectWebSocket();

    // Initialize with some dummy data to avoid errors before first WebSocket message
    if (vitalHistory.length === 0) {
      setVitalHistory([
        { time: '08:00', heartRate: 72, systolic: 120, diastolic: 80, temperature: 37.0, respRate: 16, spo2: 98, pain: 2, glucose: 110 }
      ]);
      setCurrentVitals({ time: '08:00', heartRate: 72, systolic: 120, diastolic: 80, temperature: 37.0, respRate: 16, spo2: 98, pain: 2, glucose: 110 });
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Function to determine status color based on value and normal range
  const getStatusColor = (value, type) => {
    const ranges = {
      heartRate: { low: 60, high: 100 },
      systolic: { low: 90, high: 140 },
      diastolic: { low: 60, high: 90 },
      temperature: { low: 36.5, high: 37.5 },
      respRate: { low: 12, high: 20 },
      spo2: { low: 95, high: 100 },
      glucose: { low: 70, high: 140 },
    };

    if (!ranges[type]) return 'text-gray-700';
    if (value < ranges[type].low) return 'text-blue-600';
    if (value > ranges[type].high) return 'text-red-600';
    return 'text-green-600';
  };

  // Calculate time since admission
  const calculateTimeElapsed = () => {
    const admissionDate = new Date(patient.admissionDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - admissionDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffDays}d ${diffHours}h`;
  };

  // Handle discharge button click
  const handleDischargeClick = () => {
    if (dischargeReadiness.readyForDischarge) {
      alert("Initiating discharge process for patient " + patient.name);
    } else {
      alert("Patient not ready for discharge. Please resolve pending items: " + dischargeReadiness.pendingItems.join(", "));
    }
  };

  // If no data yet, show loading
  if (!currentVitals) {
    return (
      <div className="bg-gray-50 p-4 min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          Connecting to patient vitals... Please wait.
        </div>
      </div>
    );
  }

  // Sort history to show newest first in charts but oldest first in table
  const sortedHistoryForCharts = [...vitalHistory].reverse();

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      {/* WebSocket Connection Status */}
      <div className={`fixed top-2 right-2 px-3 py-1 rounded-full text-white text-xs ${ws.current && ws.current.readyState === 1 ? 'bg-green-500' : 'bg-red-500'}`}>
        {ws.current && ws.current.readyState === 1 ? 'Live' : 'Reconnecting...'}
      </div>
      
      {/* Header with patient info */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
            <div className="flex gap-4 text-gray-600 mt-1">
              <span>{patient.age} yrs, {patient.gender}</span>
              <span>ID: {patient.id}</span>
              <span>Room: {patient.room}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">Attending Physician</div>
              <div className="text-gray-700">{patient.attendingPhysician}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">Time Since Admission</div>
              <div className="text-gray-700">{calculateTimeElapsed()}</div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Patient Records
            </button>
          </div>
        </div>
      </div>

      {/* Current Vitals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Heart Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Heart className="text-red-500" size={24} />
              <h3 className="font-medium">Heart Rate</h3>
            </div>
            <span className={`text-2xl font-bold ${getStatusColor(currentVitals.heartRate, 'heartRate')}`}>
              {currentVitals.heartRate} <span className="text-gray-500 text-sm">bpm</span>
            </span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedHistoryForCharts} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={false} />
                <XAxis dataKey="time" hide={true} />
                <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Pressure Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Activity className="text-blue-500" size={24} />
              <h3 className="font-medium">Blood Pressure</h3>
            </div>
            <span className="text-2xl font-bold">
              <span className={getStatusColor(currentVitals.systolic, 'systolic')}>{currentVitals.systolic}</span>/<span className={getStatusColor(currentVitals.diastolic, 'diastolic')}>{currentVitals.diastolic}</span>
              <span className="text-gray-500 text-sm"> mmHg</span>
            </span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedHistoryForCharts} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="diastolic" stroke="#93c5fd" strokeWidth={2} dot={false} />
                <XAxis dataKey="time" hide={true} />
                <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <ThermometerSun className="text-orange-500" size={24} />
              <h3 className="font-medium">Temperature</h3>
            </div>
            <span className={`text-2xl font-bold ${getStatusColor(currentVitals.temperature, 'temperature')}`}>
              {currentVitals.temperature} <span className="text-gray-500 text-sm">°C</span>
            </span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedHistoryForCharts} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} />
                <XAxis dataKey="time" hide={true} />
                <YAxis hide={true} domain={[36, 38]} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SpO2 Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Droplet className="text-indigo-500" size={24} />
              <h3 className="font-medium">Oxygen Saturation</h3>
            </div>
            <span className={`text-2xl font-bold ${getStatusColor(currentVitals.spo2, 'spo2')}`}>
              {currentVitals.spo2} <span className="text-gray-500 text-sm">%</span>
            </span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sortedHistoryForCharts} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <Area type="monotone" dataKey="spo2" stroke="#6366f1" fill="#c7d2fe" fillOpacity={0.5} />
                <XAxis dataKey="time" hide={true} />
                <YAxis hide={true} domain={[90, 100]} />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second row of vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Respiratory Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Activity className="text-green-500" size={24} />
              <h3 className="font-medium">Respiratory Rate</h3>
            </div>
            <span className={`text-2xl font-bold ${getStatusColor(currentVitals.respRate, 'respRate')}`}>
              {currentVitals.respRate} <span className="text-gray-500 text-sm">bpm</span>
            </span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedHistoryForCharts} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis domain={[10, 25]} />
                <Tooltip />
                <Bar dataKey="respRate" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pain Level Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-yellow-500" size={24} />
              <h3 className="font-medium">Pain Level (0-10)</h3>
            </div>
            <span className="text-2xl font-bold text-yellow-600">
              {currentVitals.pain} <span className="text-gray-500 text-sm">/10</span>
            </span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedHistoryForCharts} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="pain" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Glucose Level Card (New) */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-purple-500" size={24} />
              <h3 className="font-medium">Glucose Level</h3>
            </div>
            <span className={`text-2xl font-bold ${getStatusColor(currentVitals.glucose, 'glucose')}`}>
              {currentVitals.glucose} <span className="text-gray-500 text-sm">mg/dL</span>
            </span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedHistoryForCharts} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis domain={[60, 180]} />
                <Tooltip />
                <Line type="monotone" dataKey="glucose" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vitals Data Table */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Vitals History</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={14} className="mr-1" />
            Last updated: {currentVitals.time}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Pressure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resp. Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO2</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Glucose</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vitalHistory.map((record, index) => (
                <tr key={index} className={index === 0 ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(record.heartRate, 'heartRate')}`}>
                      {record.heartRate} bpm 
                      {index > 0 && record.heartRate > vitalHistory[index-1].heartRate && 
                        <ArrowUpCircle size={16} className="inline ml-1 text-red-500" />}
                      {index > 0 && record.heartRate < vitalHistory[index-1].heartRate && 
                        <ArrowDownCircle size={16} className="inline ml-1 text-blue-500" />}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(record.systolic, 'systolic')}`}>{record.systolic}</span>/
                    <span className={`${getStatusColor(record.diastolic, 'diastolic')}`}>{record.diastolic}</span> mmHg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(record.temperature, 'temperature')}`}>
                      {record.temperature} °C
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(record.respRate, 'respRate')}`}>
                      {record.respRate} bpm
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(record.spo2, 'spo2')}`}>
                      {record.spo2}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span className="mr-2">{record.pain}/10</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{
                            width: `${record.pain * 10}%`,
                            backgroundColor: record.pain >= 7 ? '#ef4444' : record.pain >= 4 ? '#f97316' : '#84cc16'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(record.glucose, 'glucose')}`}>
                      {record.glucose} mg/dL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gen AI Footer Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center mb-4">
          <Brain className="text-purple-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-purple-800">AI Care Recommendations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Diet Recommendations */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-medium text-lg mb-3 text-purple-700 flex items-center">
              <Heart className="text-purple-500 mr-2" size={20} />
              Recommended Diet
            </h3>
            <ul className="space-y-2">
              {dietRecommendations.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <span className="ml-2 text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-purple-100 text-purple-700 px-4 py-2 rounded hover:bg-purple-200 flex items-center justify-center">
              <span>View Full Nutrition Plan</span>
            </button>
          </div>
          
          {/* Limitations */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-medium text-lg mb-3 text-purple-700 flex items-center">
              <AlertTriangle className="text-orange-500 mr-2" size={20} />
              Activity Limitations
            </h3>
            <ul className="space-y-2">
              {patientLimitations.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  </div>
                  <span className="ml-2 text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-purple-100 text-purple-700 px-4 py-2 rounded hover:bg-purple-200 flex items-center justify-center">
              <span>Print Patient Instructions</span>
            </button>
          </div>
          
          {/* Discharge Readiness */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-medium text-lg mb-3 text-purple-700 flex items-center">
              <FileCheck className="text-blue-500 mr-2" size={20} />
              Discharge Readiness
            </h3>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Readiness Score</span>
                <span className="font-medium">{dischargeReadiness.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{
                    width: `${dischargeReadiness.score}%`,
                    backgroundColor: dischargeReadiness.score >= 90 ? '#22c55e' : 
                                    dischargeReadiness.score >= 70 ? '#f59e0b' : '#ef4444'
                  }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              <p className="mb-1"><span className="font-medium">Estimated date:</span> {dischargeReadiness.estimatedDate}</p>
              <p className="mb-1"><span className="font-medium">Pending items:</span></p>
              <ul className="list-disc pl-5 text-xs space-y-1">
                {dischargeReadiness.pendingItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <button 
              onClick={handleDischargeClick}
              className={`mt-2 w-full px-4 py-2 rounded flex items-center justify-center ${
                dischargeReadiness.readyForDischarge 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
            >
              <span>Initiate Discharge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientVitalsDashboard;