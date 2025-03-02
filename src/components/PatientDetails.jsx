import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function PatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Connect to socket server
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    
    // Join the patient-specific room
    newSocket.emit("createRoom", { roomId: patientId });
    
    // Listen for patient data updates
    newSocket.on("roomCreated", (socketId, patientData) => {
      if (patientData.id === patientId) {
        setPatient(patientData);
        setLoading(false);
      }
    });
    
    // Clean up socket on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [patientId]);
  
  // Get risk level based on score
  const getRiskLevel = (score) => {
    if (score >= 50) return { level: "High", color: "destructive" };
    if (score >= 30) return { level: "Medium", color: "warning" };
    return { level: "Low", color: "success" };
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Patient Information...</h1>
        <p>Connecting to patient room: {patientId}</p>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
        <p>The patient information you're looking for couldn't be loaded.</p>
        <Button 
          className="mt-4" 
          onClick={() => navigate("/")}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  const risk = getRiskLevel(patient.totalScore);
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Details</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="bg-secondary/50">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <Badge variant={risk.color} className="text-md px-3 py-1">
              {risk.level} Risk Patient
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-3">Patient Information</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-medium">{patient.patientId || patient.id}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{patient.dateOfBirth}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{patient.sex}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Room Assignment:</span>
                  <span>Room {patient.room}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Admission Date:</span>
                  <span>{patient.admissionDate || "N/A"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Risk Score:</span>
                  <span className="font-bold">{patient.totalScore}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Diagnoses</h3>
              {patient.diseases && patient.diseases.length > 0 ? (
                <div className="space-y-2">
                  {patient.diseases.map((disease) => (
                    <div key={disease.name} className="flex justify-between items-center p-2 border rounded">
                      <span>{disease.name}</span>
                      <Badge>{disease.score} points</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No diagnoses recorded</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals" className="p-4 border rounded">
          <h3 className="font-medium text-lg mb-3">Patient Vitals</h3>
          <p className="text-muted-foreground text-center py-6">
            Vitals tracking functionality to be implemented
          </p>
        </TabsContent>
        
        <TabsContent value="medications" className="p-4 border rounded">
          <h3 className="font-medium text-lg mb-3">Medications</h3>
          <p className="text-muted-foreground text-center py-6">
            Medication tracking functionality to be implemented
          </p>
        </TabsContent>
        
        <TabsContent value="notes" className="p-4 border rounded">
          <h3 className="font-medium text-lg mb-3">Clinical Notes</h3>
          <p className="text-muted-foreground text-center py-6">
            Clinical notes functionality to be implemented
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PatientDetails;