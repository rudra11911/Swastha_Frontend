import { createContext, useState, useContext, useEffect } from 'react';

const PatientContext = createContext();

export const usePatients = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [beds, setBeds] = useState({
    total: 50,
    occupied: 35,
    available: 15,
    icu: { total: 10, occupied: 8 },
    general: { total: 40, occupied: 27 }
  });
  
  // Simulate fetching patients data
  useEffect(() => {
    // This would be replaced with actual API call
    const fetchPatients = async () => {
      try {
        // Mock data - replace with actual API call
        const mockPatients = [
          {
            id: 1, 
            name: 'Rudra Pratap', 
            age: 22, 
            gender: 'Male',
            roomNumber: '101',
            bedNumber: '2',
            admissionDate: '2025-02-15',
            status: 'Admitted',
            diagnosis: 'Scabies',
            vitals: {
              heartRate: 82,
              bloodPressure: '120/80',
              temperature: 99.1,
              oxygenSaturation: 95,
              respiratoryRate: 18
            },
            alerts: [
              { type: 'warning', message: 'Scheduled for X-ray at 2 PM' }
            ]
          },
          // Add more mock patients 
          {
            id: 2,
            name: "Samrat",
            age: 22, 
            gender: 'Male',
             roomNumber: '102', 
             bedNumber: '1',
             admissionDate: '202-02-15',
             status: 'Admitted',
             diagnosis: 'Scabies',
              vitals: {
                heartRate: 82,
                bloodPressure: '120/80',
                temperature: 99.1,
                oxygenSaturation: 95,
                respiratoryRate: 18
              },
              alerts: [
                { type: 'warning', message: 'Scheduled for X-ray at 2 PM' }
              ]
          },
          {
            id: 3,
            name: "Rajesh",
            age: 22,
            gender: 'Male',
             roomNumber: '103',
             bedNumber: '2',
             admissionDate: '202-02-15',
             status: 'Admitted',
             diagnosis: 'Scabies',
              vitals: {
                heartRate: 82,
                bloodPressure: '120/80',
                temperature: 99.1,
                oxygenSaturation: 95,
                respiratoryRate: 18
              },

          },
          {
            id: 4,
            name: "Rahul",
            age: 22,
            gender: 'Male',
            roomNumber: "101",
            bedNumber: "2",
            admissionDate: "202-02-15",
            status: "Admitted",
            diagnosis: "Scabies",
            vitals: {
              heartRate: 82,
              bloodPressure: '120/80',
              temperature: 99.1,
              oxygenSaturation: 95,
              respiratoryRate: 18
            },

          },
          {
            "id": 5,
            "name": "Ananya",
            "age": 30,
            "gender": "Female",
            "roomNumber": "102",
            "bedNumber": "1",
            "admissionDate": "2024-02-16",
            "status": "ICU",
            "diagnosis": "Pneumonia",
            "vitals": {
              "heartRate": 110,
              "bloodPressure": "135/90",
              "temperature": 101.2,
              "oxygenSaturation": 88,
              "respiratoryRate": 24
            }
          },
          {
            "id": 6,
            "name": "Rohan",
            "age": 25,
            "gender": "Male",
            "roomNumber": "103",
            "bedNumber": "3",
            "admissionDate": "2024-02-17",
            "status": "Stable",
            "diagnosis": "Fractured Leg",
            "vitals": {
              "heartRate": 75,
              "bloodPressure": "118/76",
              "temperature": 98.6,
              "oxygenSaturation": 97,
              "respiratoryRate": 16
            }
          },
          {
            "id": 7,
            "name": "Simran",
            "age": 40,
            "gender": "Female",
            "roomNumber": "104",
            "bedNumber": "2",
            "admissionDate": "2024-02-18",
            "status": "Critical",
            "diagnosis": "Heart Attack",
            "vitals": {
              "heartRate": 48,
              "bloodPressure": "90/60",
              "temperature": 99.0,
              "oxygenSaturation": 85,
              "respiratoryRate": 28
            }
          },
          {
            "id": 8,
            "name": "Amit",
            "age": 55,
            "gender": "Male",
            "roomNumber": "105",
            "bedNumber": "1",
            "admissionDate": "2024-02-19",
            "status": "Discharge Ready",
            "diagnosis": "Diabetes Complications",
            "vitals": {
              "heartRate": 80,
              "bloodPressure": "130/85",
              "temperature": 98.4,
              "oxygenSaturation": 96,
              "respiratoryRate": 18
            }
          },
          {
            "id": 9,
            "name": "Neha",
            "age": 28,
            "gender": "Female",
            "roomNumber": "106",
            "bedNumber": "3",
            "admissionDate": "2024-02-20",
            "status": "Admitted",
            "diagnosis": "Appendicitis",
            "vitals": {
              "heartRate": 92,
              "bloodPressure": "122/82",
              "temperature": 100.1,
              "oxygenSaturation": 94,
              "respiratoryRate": 20
            }
          },
          {
            "id": 10,
            "name": "Vikram",
            "age": 50,
            "gender": "Male",
            "roomNumber": "107",
            "bedNumber": "2",
            "admissionDate": "2024-02-21",
            "status": "ICU",
            "diagnosis": "Stroke",
            "vitals": {
              "heartRate": 65,
              "bloodPressure": "140/95",
              "temperature": 98.8,
              "oxygenSaturation": 89,
              "respiratoryRate": 22
            }
          },
          {
            "id": 11,
            "name": "Priya",
            "age": 35,
            "gender": "Female",
            "roomNumber": "108",
            "bedNumber": "1",
            "admissionDate": "2024-02-22",
            "status": "Stable",
            "diagnosis": "Migraine",
            "vitals": {
              "heartRate": 70,
              "bloodPressure": "115/75",
              "temperature": 98.2,
              "oxygenSaturation": 98,
              "respiratoryRate": 16
            }
          },
          {
            "id": 12,
            "name": "Karan",
            "age": 60,
            "gender": "Male",
            "roomNumber": "109",
            "bedNumber": "2",
            "admissionDate": "2024-02-23",
            "status": "Critical",
            "diagnosis": "Kidney Failure",
            "vitals": {
              "heartRate": 55,
              "bloodPressure": "85/55",
              "temperature": 99.3,
              "oxygenSaturation": 87,
              "respiratoryRate": 25
            }
          },
          {
            "id": 13,
            "name": "Sanya",
            "age": 45,
            "gender": "Female",
            "roomNumber": "110",
            "bedNumber": "3",
            "admissionDate": "2024-02-24",
            "status": "Discharge Ready",
            "diagnosis": "Hypertension",
            "vitals": {
              "heartRate": 76,
              "bloodPressure": "135/88",
              "temperature": 98.7,
              "oxygenSaturation": 96,
              "respiratoryRate": 17
            }
          },
          {
            "id": 14,
            "name": "Raj",
            "age": 32,
            "gender": "Male",
            "roomNumber": "111",
            "bedNumber": "1",
            "admissionDate": "2024-02-25",
            "status": "Admitted",
            "diagnosis": "Dengue Fever",
            "vitals": {
              "heartRate": 95,
              "bloodPressure": "118/78",
              "temperature": 102.4,
              "oxygenSaturation": 93,
              "respiratoryRate": 21
            }
          }
        ];
        
        setPatients(mockPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    
    fetchPatients();
  }, []);
  
  const value = {
    patients,
    setPatients,
    selectedPatient,
    setSelectedPatient,
    beds,
    setBeds
  };
  
  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};