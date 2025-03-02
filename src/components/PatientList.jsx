import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { usePatients } from '@/contexts/PatientContext';
import { useAlerts } from '@/contexts/AlertContext';
import { Search, Filter, ChevronDown, Heart, MoreVertical, Eye } from 'lucide-react';

// We'll redefine PatientStatusBadge with Tailwind CSS
const PatientStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Admitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ICU':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Stable':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Discharge Ready':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Discharged':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

const PatientList = ({ searchTerm: externalSearchTerm }) => {
  const { patients, setSelectedPatient } = usePatients();
  const { addAlert } = useAlerts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || '');
  const [statusFilter, setStatusFilter] = useState('Critical');
  
  // Update searchTerm if it changes from parent component
  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);
  
  const filteredPatients = patients?.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.roomNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];
  
  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    console.log('Opening existing patient dashboard for:', patient.id);
    
    // Simulating integration with existing dashboard
    addAlert({
      type: 'info',
      message: `Viewing vitals for ${patient.name}`,
      title: 'Patient Selected'
    });

    navigate('/vitals')
  };
  
  const handleStatusChange = (patientId, newStatus) => {
    // This would be an API call in a real application
    console.log(`Changing status for patient ${patientId} to ${newStatus}`);
  };

  // Helper functions for vitals
  const getVitalsStatus = (vitals) => {
    if (!vitals) return 'Unknown';
    
    if (vitals.oxygenSaturation < 90 || vitals.heartRate > 120 || vitals.heartRate < 50) {
      return 'Critical';
    } else if (vitals.oxygenSaturation < 94 || vitals.temperature > 100.4) {
      return 'Warning';
    } else {
      return 'Normal';
    }
  };

  const getVitalsStyles = (vitals) => {
    const status = getVitalsStatus(vitals);
    switch (status) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-500';
    }
  };
  
  // Sample data for demonstration (would be removed in your actual implementation)
  const samplePatients = [
    {
      id: 1,
      name: "James Wilson",
      roomNumber: "203",
      bedNumber: "A",
      status: "Stable",
      admissionDate: "2023-04-15",
      diagnosis: "Pneumonia",
      vitals: { oxygenSaturation: 96, heartRate: 72, temperature: 98.6 }
    },
    {
      id: 2,
      name: "Maria Garcia",
      roomNumber: "105",
      bedNumber: "B",
      status: "Critical",
      admissionDate: "2023-04-12",
      diagnosis: "Acute Respiratory Distress",
      vitals: { oxygenSaturation: 88, heartRate: 128, temperature: 101.2 }
    },
    {
      id: 3,
      name: "Robert Johnson",
      roomNumber: "310",
      bedNumber: "C",
      status: "ICU",
      admissionDate: "2023-04-10",
      diagnosis: "Cardiac Arrhythmia",
      vitals: { oxygenSaturation: 92, heartRate: 95, temperature: 99.8 }
    },
    {
      id: 4,
      name: "Emily Chen",
      roomNumber: "405",
      bedNumber: "A",
      status: "Discharge Ready",
      admissionDate: "2023-04-08",
      diagnosis: "Post-op Recovery",
      vitals: { oxygenSaturation: 98, heartRate: 68, temperature: 98.2 }
    }
  ];

  // Use real patients if available, otherwise use sample data
  const displayPatients = filteredPatients.length > 0 ? filteredPatients : samplePatients;
  
  return (
    <div className="patient-list-container">
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or room number..."
              className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select 
              className="pl-10 pr-8 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="ICU">ICU</option>
              <option defaultChecked value="Critical">Critical</option>
              <option value="Stable">Stable</option>
              <option value="Discharge Ready">Discharge Ready</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Patient Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room/Bed
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admission Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diagnosis
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vitals
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayPatients.map((patient) => (
              <tr 
                key={patient.id} 
                onClick={() => handlePatientClick(patient)}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-xs text-gray-500">Patient #{patient.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.roomNumber}/{patient.bedNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PatientStatusBadge status={patient.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(patient.admissionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.diagnosis}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getVitalsStyles(patient.vitals)}`}>
                    {getVitalsStatus(patient.vitals)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-150"
                      title="View Patient Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <div className="relative inline-block">
                      <select 
                        className="py-1 px-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={patient.status}
                        onChange={(e) => {
                          handleStatusChange(patient.id, e.target.value);
                        }}
                      >
                        <option value="Admitted">Admitted</option>
                        <option value="ICU">ICU</option>
                        <option value="Critical">Critical</option>
                        <option value="Stable">Stable</option>
                        <option value="Discharge Ready">Discharge Ready</option>
                        <option value="Discharged">Discharge</option>
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{displayPatients.length}</span> of{' '}
              <span className="font-medium">{displayPatients.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-600">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;