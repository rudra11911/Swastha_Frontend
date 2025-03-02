import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ThermometerSun, Heart, Droplet, AlertCircle, Clock, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const PatientVitalsDashboard = () => {
  // Sample patient data - in a real app, this would come from an API
  const [patient, setPatient] = useState({
    id: "1",
    name: "Rudra Pratap",
    age: 22,
    gender: "Male",
    room: "101",
    admissionDate: "2025-02-25T08:30:00",
    attendingPhysician: "Dr. Sahil Goyat"
  });

  // Sample vital signs history data
  const [vitalHistory, setVitalHistory] = useState([
    { time: '08:00', heartRate: 72, systolic: 120, diastolic: 80, temperature: 37.0, respRate: 16, spo2: 98, pain: 2 },
    { time: '10:00', heartRate: 75, systolic: 122, diastolic: 78, temperature: 37.1, respRate: 18, spo2: 97, pain: 3 },
    { time: '12:00', heartRate: 78, systolic: 125, diastolic: 82, temperature: 37.3, respRate: 17, spo2: 96, pain: 4 },
    { time: '14:00', heartRate: 82, systolic: 128, diastolic: 84, temperature: 37.5, respRate: 18, spo2: 95, pain: 5 },
    { time: '16:00', heartRate: 79, systolic: 124, diastolic: 83, temperature: 37.2, respRate: 16, spo2: 97, pain: 3 },
    { time: '18:00', heartRate: 74, systolic: 118, diastolic: 79, temperature: 37.0, respRate: 15, spo2: 98, pain: 2 },
    { time: '20:00', heartRate: 70, systolic: 116, diastolic: 76, temperature: 36.8, respRate: 14, spo2: 99, pain: 1 },
  ]);

  // Current vital signs (most recent readings)
  const currentVitals = vitalHistory[vitalHistory.length - 1];

  // Function to determine status color based on value and normal range
  const getStatusColor = (value, type) => {
    const ranges = {
      heartRate: { low: 60, high: 100 },
      systolic: { low: 90, high: 140 },
      diastolic: { low: 60, high: 90 },
      temperature: { low: 36.5, high: 37.5 },
      respRate: { low: 12, high: 20 },
      spo2: { low: 95, high: 100 },
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

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
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
              <LineChart data={vitalHistory} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
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
              <LineChart data={vitalHistory} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
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
              <LineChart data={vitalHistory} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
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
              <Heart className="text-indigo-500" size={24} />
              <h3 className="font-medium">Oxygen Saturation</h3>
            </div>
            <span className={`text-2xl font-bold ${getStatusColor(currentVitals.spo2, 'spo2')}`}>
              {currentVitals.spo2} <span className="text-gray-500 text-sm">%</span>
            </span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vitalHistory} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
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
              <BarChart data={vitalHistory} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
              <BarChart data={vitalHistory} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="pain" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Vitals Trend Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Clock className="text-purple-500" size={24} />
              <h3 className="font-medium">Vitals Trends</h3>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalHistory} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" orientation="left" stroke="#ef4444" />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#ef4444" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="systolic" name="Systolic" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vitals Data Table */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Vitals History</h3>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vitalHistory.slice().reverse().map((record, index) => (
                <tr key={index} className={index === 0 ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(record.heartRate, 'heartRate')}`}>
                      {record.heartRate} bpm 
                      {index > 0 && record.heartRate > vitalHistory[vitalHistory.length - 1 - index].heartRate && 
                        <ArrowUpCircle size={16} className="inline ml-1 text-red-500" />}
                      {index > 0 && record.heartRate < vitalHistory[vitalHistory.length - 1 - index].heartRate && 
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientVitalsDashboard;