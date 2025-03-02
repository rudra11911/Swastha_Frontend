import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function Patient({ addPatientToRoom, dialogOpen, setDialogOpen }) {
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    patientId: "",
    dateOfBirth: "",
    sex: "",
    room: "",
    // New fields
    bloodGroup: "",
    age: "",
    physicalActivity: ""
  });
  const [searchDisease, setSearchDisease] = useState("");
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([
    { id: "101", name: "Room 101", type: "Single" },
    { id: "102", name: "Room 102", type: "Double" },
    { id: "103", name: "Room 103", type: "ICU" },
    { id: "104", name: "Room 104", type: "Single" },
    { id: "105", name: "Room 105", type: "Double" },
  ]);

  const diseases = [
    { name: "Hepatitis A & E", score: 25 },
    { name: "Hepatitis B & C", score: 10 },
    { name: "Immunodeficiency", score: 25 },
    { name: "Legionnaires", score: 20 },
    { name: "Palliative Care", score: 20 },
    { name: "Respiratory Syncytial Virus", score: 25 },
    { name: "Scabies", score: 20 },
    { name: "Scarlet Fever", score: 30 },
    { name: "Strep-Smith-MacMahan Syndrome", score: 40 },
  ];

  // Blood group options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  // Physical activity levels
  const activityLevels = ["Sedentary", "Light", "Moderate", "Active", "Very Active"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleDiagnosisChange = (disease) => {
    const isSelected = selectedDiseases.some((d) => d.name === disease.name);
    setSelectedDiseases(
      isSelected
        ? selectedDiseases.filter((d) => d.name !== disease.name)
        : [...selectedDiseases, disease]
    );
  };

  const calculateTotalScore = () => {
    return selectedDiseases.reduce((total, disease) => total + disease.score, 0);
  };

  const resetForm = () => {
    setPatient({
      firstName: "",
      lastName: "",
      patientId: "",
      dateOfBirth: "",
      sex: "",
      room: "",
      bloodGroup: "",
      age: "",
      physicalActivity: ""
    });
    setSelectedDiseases([]);
    setSearchDisease("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!patient.room) {
      alert("Please select a room for the patient");
      return;
    }
    
    const patientData = { 
      ...patient, 
      diseases: selectedDiseases,
      totalScore: calculateTotalScore(),
      id: `PAT-${Date.now().toString().slice(-6)}`,
      admissionDate: new Date().toISOString().split('T')[0]
    };
    
    // Call the function to add patient to room in Home component
    addPatientToRoom(patientData);
    
    console.log("Patient Data:", JSON.stringify(patientData, null, 2));
    alert("Patient added successfully!");
    resetForm();
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Fill in the details to register a new patient and assign to a room.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="firstName" placeholder="First Name" value={patient.firstName} onChange={handleInputChange} required />
            <Input name="lastName" placeholder="Last Name" value={patient.lastName} onChange={handleInputChange} required />
          </div>
          <Input name="patientId" placeholder="Patient ID" value={patient.patientId} onChange={handleInputChange} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" name="dateOfBirth" value={patient.dateOfBirth} onChange={handleInputChange} required />
            <Input type="number" name="age" placeholder="Age" min="0" max="120" value={patient.age} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Gender</label>
            <div className="flex gap-4">
              <Button 
                type="button"
                variant={patient.sex === "Male" ? "default" : "outline"} 
                onClick={() => setPatient({ ...patient, sex: "Male" })}
              >
                Male
              </Button>
              <Button 
                type="button"
                variant={patient.sex === "Female" ? "default" : "outline"} 
                onClick={() => setPatient({ ...patient, sex: "Female" })}
              >
                Female
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Group</label>
              <Select 
                value={patient.bloodGroup} 
                onValueChange={(value) => setPatient({ ...patient, bloodGroup: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Physical Activity</label>
              <Select 
                value={patient.physicalActivity} 
                onValueChange={(value) => setPatient({ ...patient, physicalActivity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assign Room</label>
            <Select 
              value={patient.room} 
              onValueChange={(value) => setPatient({ ...patient, room: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} ({room.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Diagnoses</label>
            <Input 
              placeholder="Search Disease..." 
              value={searchDisease} 
              onChange={(e) => setSearchDisease(e.target.value)} 
            />
            <div className="max-h-40 overflow-y-auto border p-2 rounded">
              {diseases
                .filter((d) => 
                  d.name.toLowerCase().includes(searchDisease.toLowerCase())
                )
                .map((disease) => (
                  <div key={disease.name} className="flex items-center gap-2 py-1">
                    <Checkbox 
                      checked={selectedDiseases.some((d) => d.name === disease.name)} 
                      onCheckedChange={() => handleDiagnosisChange(disease)} 
                    />
                    <span>{disease.name} (Score: {disease.score})</span>
                  </div>
                ))
              }
            </div>
          </div>

          {selectedDiseases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Diagnoses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedDiseases.map((disease) => (
                    <Badge key={disease.name} variant="secondary">
                      {disease.name} ({disease.score})
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 font-medium">
                  Total Score: {calculateTotalScore()}
                </div>
              </CardContent>
            </Card>
          )}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Add Patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Patient;