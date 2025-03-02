import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Patient from "./AddPatient";

function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rooms, setRooms] = useState([
    { id: "101", name: "Room 101", type: "Single", patients: [] },
    { id: "102", name: "Room 102", type: "Double", patients: [] },
    { id: "103", name: "Room 103", type: "ICU", patients: [] },
    { id: "104", name: "Room 104", type: "Single", patients: [] },
    { id: "105", name: "Room 105", type: "Double", patients: [] },
  ]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Clean up socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to add a patient to a room
  const addPatientToRoom = (patientData) => {
    setRooms(prevRooms => 
      prevRooms.map(room => {
        if (room.id === patientData.room) {
          // Check if this is a double room and it's already full
          if (room.type === "Double" && room.patients.length >= 2) {
            alert(`${room.name} is already at capacity.`);
            return room;
          }
          
          // Check if this is a single room and it's already occupied
          if (room.type === "Single" && room.patients.length >= 1) {
            alert(`${room.name} is already occupied.`);
            return room;
          }
          
          // Create a socket room with patient ID
          if (socket) {
            socket.emit("createRoom", {
              roomId: patientData.id,
              ...patientData
            });
          }
          
          return {
            ...room,
            patients: [...room.patients, patientData]
          };
        }
        return room;
      })
    );
  };

  // Function to remove a patient from a room
  const removePatientFromRoom = (roomId, patientId) => {
    const confirmRemoval = window.confirm("Are you sure you want to discharge this patient?");
    
    if (confirmRemoval) {
      setRooms(prevRooms => 
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              patients: room.patients.filter(patient => patient.id !== patientId)
            };
          }
          return room;
        })
      );
      
      alert("Patient has been discharged.");
    }
  };

  // Function to navigate to patient details page
  const openPatientDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  // Get risk level based on score
  const getRiskLevel = (score) => {
    if (score >= 50) return { level: "High", color: "destructive" };
    if (score >= 30) return { level: "Medium", color: "warning" };
    return { level: "Low", color: "success" };
  };

  // Get room occupancy status
  const getRoomStatus = (room) => {
    const maxCapacity = room.type === "Double" ? 2 : 1;
    const currentCount = room.patients.length;
    
    if (currentCount === 0) return { status: "Empty", color: "bg-gray-100" };
    if (currentCount < maxCapacity) return { status: "Available", color: "bg-blue-50" };
    return { status: "Full", color: "bg-amber-50" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mt-4 md:mt-0">
              <Button 
                variant="default" 
                onClick={() => setDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Add New Patient
              </Button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Rooms</p>
                <p className="text-lg font-semibold">{rooms.length}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Patients</p>
                <p className="text-lg font-semibold">
                  {rooms.reduce((sum, room) => sum + room.patients.length, 0)}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">High Risk</p>
                <p className="text-lg font-semibold">
                  {rooms.reduce((sum, room) => sum + room.patients.filter(p => p.totalScore >= 50).length, 0)}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">ICU Beds</p>
                <p className="text-lg font-semibold">
                  {rooms.filter(r => r.type === "ICU").length}
                </p>
              </div>
            </div>
          </div>
        </header>

        <Patient 
          addPatientToRoom={addPatientToRoom} 
          dialogOpen={dialogOpen} 
          setDialogOpen={setDialogOpen} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const status = getRoomStatus(room);
            
            return (
              <Card key={room.id} className="overflow-hidden border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                <CardHeader className={`${status.color} border-b`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-gray-800">{room.name}</CardTitle>
                      <CardDescription className="text-gray-600 flex items-center gap-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {room.type}
                      </CardDescription>
                    </div>
                    <Badge variant={room.patients.length === 0 ? "outline" : (room.patients.length === (room.type === "Double" ? 2 : 1) ? "secondary" : "default")} className="px-3 py-1 text-xs font-medium">
                      {room.patients.length} / {room.type === "Double" ? 2 : 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 bg-white">
                  {room.patients.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <p>No patients assigned to this room</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                        className="mt-4 text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Assign Patient
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {room.patients.map((patient) => {
                        const risk = getRiskLevel(patient.totalScore);
                        
                        return (
                          <div key={patient.id} className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-800 text-lg">
                                  {patient.firstName} {patient.lastName}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                  </svg>
                                  ID: {patient.patientId || patient.id}
                                </p>
                              </div>
                              <Badge variant={risk.color} className="py-1 px-3">
                                {risk.level} Risk
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3 bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-600">DOB:</span> 
                                <span className="font-medium">{patient.dateOfBirth}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-gray-600">Gender:</span> 
                                <span className="font-medium">{patient.sex}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-600">Admitted:</span> 
                                <span className="font-medium">{patient.admissionDate || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="text-gray-600">Score:</span> 
                                <span className="font-medium">{patient.totalScore}</span>
                              </div>
                            </div>
                            
                            {patient.diseases && patient.diseases.length > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Diagnoses:
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {patient.diseases.map((disease) => (
                                    <Badge key={disease.name} variant="outline" className="text-xs bg-gray-50 text-gray-700 border border-gray-200">
                                      {disease.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-4 flex justify-between">
                              <Link
                                to='/patients'
                                className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                                size="sm"
                                onClick={() => openPatientDetails(patient.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Details
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => removePatientFromRoom(room.id, patient.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Discharge
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;