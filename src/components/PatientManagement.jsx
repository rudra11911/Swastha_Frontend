import { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import PatientList from '@/components/PatientList';
import BedManagement from '@/components/BedManagement';
import { Users, Clipboard, PlusCircle, Search } from 'lucide-react';
import Patient from './AddPatient';

const PatientManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'list' ? '/patients' : '/patients/beds');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header with Search and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage patients and hospital bed assignments</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link
            to="/home"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Patient
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-4 py-4 text-sm font-medium border-b-2 -mb-px flex items-center ${activeTab === 'list'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => handleTabChange('list')}
            >
              <Users className={`h-4 w-4 mr-2 ${activeTab === 'list' ? 'text-blue-600' : 'text-gray-400'
                }`} />
              Patient List
            </button>
            <button
              className={`px-4 py-4 text-sm font-medium border-b-2 -mb-px flex items-center ${activeTab === 'beds'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => handleTabChange('beds')}
            >
              <Clipboard className={`h-4 w-4 mr-2 ${activeTab === 'beds' ? 'text-blue-600' : 'text-gray-400'
                }`} />
              Bed Management
            </button>
          </nav>
        </div>

        {/* Content Area with Shadow and Proper Padding */}
        <div className="p-4">
          <Routes>
            <Route index element={<PatientList searchTerm={searchTerm} />} />
            <Route path="beds" element={<BedManagement />} />
          </Routes>
        </div>
      </div>

      {/* Stats Cards - Optional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Patients</p>
              <p className="text-xl font-bold">248</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Available Beds</p>
              <p className="text-xl font-bold">42</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Clipboard className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Admissions Today</p>
              <p className="text-xl font-bold">8</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <PlusCircle className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table example - For reference, would be replaced by actual PatientList or BedManagement components */}
      {/* This is just to demonstrate the table styling that could be used in your child components */}
      {!activeTab && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {item}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Patient Name</div>
                          <div className="text-sm text-gray-500">patient@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">PT-{1000 + item}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cardiology</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 hours ago</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                      <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                  <span className="font-medium">97</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-600">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    4
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;