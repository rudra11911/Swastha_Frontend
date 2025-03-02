import { useState, useEffect } from "react";
import { usePatients } from "@/contexts/PatientContext";

const BedManagement = () => {
  const { beds, patients } = usePatients();
  const [selectedWard, setSelectedWard] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const wards = [
    {
      id: "all",
      name: "All Wards",
      color: "bg-gradient-to-r from-blue-500 to-purple-600",
    },
    {
      id: "general",
      name: "General Ward",
      color: "bg-gradient-to-r from-green-500 to-teal-600",
    },
    {
      id: "icu",
      name: "ICU",
      color: "bg-gradient-to-r from-red-500 to-pink-600",
    },
    {
      id: "emergency",
      name: "Emergency",
      color: "bg-gradient-to-r from-yellow-500 to-orange-600",
    },
    {
      id: "pediatric",
      name: "Pediatric",
      color: "bg-gradient-to-r from-indigo-500 to-blue-600",
    },
  ];

  const generateBedData = () => {
    const bedData = [];
    for (let i = 1; i <= beds.icu.total; i++) {
      const isOccupied = i <= beds.icu.occupied;
      bedData.push({
        id: `ICU-${i}`,
        roomNumber: `ICU-${Math.ceil(i / 2)}`,
        bedNumber: i % 2 === 0 ? "B" : "A",
        ward: "icu",
        isOccupied,
        patient: isOccupied ? getRandomPatient() : null,
      });
    }
    for (let i = 1; i <= beds.general.total; i++) {
      const isOccupied = i <= beds.general.occupied;
      bedData.push({
        id: `GEN-${i}`,
        roomNumber: `${100 + Math.ceil(i / 4)}`,
        bedNumber: ["A", "B", "C", "D"][i % 4],
        ward: "general",
        isOccupied,
        patient: isOccupied ? getRandomPatient() : null,
      });
    }
    return bedData;
  };

  const getRandomPatient = () => {
    if (patients.length > 0) {
      return patients[Math.floor(Math.random() * patients.length)];
    }
    return {
      id: Math.floor(Math.random() * 1000),
      name: "Sample Patient",
      status: "Admitted",
      admissionDate: "2025-02-20",
    };
  };

  const bedData = generateBedData();
  const filteredBeds =
    selectedWard === "all"
      ? bedData
      : bedData.filter((bed) => bed.ward === selectedWard);

  const currentWard = wards.find((ward) => ward.id === selectedWard);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`relative overflow-hidden rounded-xl mb-8 shadow-lg ${currentWard.color} p-8`}
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Bed Management
            </h2>
            <p className="text-white text-opacity-90">
              {selectedWard === "all"
                ? "Overview of all hospital beds and occupancy"
                : `Managing beds in the ${
                    wards.find((w) => w.id === selectedWard)?.name
                  }`}
            </p>
          </div>
          <div className="absolute top-0 right-0 p-6 z-10">
            <div className="relative inline-block w-64">
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 
             rounded-lg px-4 py-2 focus:outline-none focus:ring-2 
             focus:ring-blue-500 focus:border-blue-500"
              >
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute top-20 right-40 w-20 h-20 rounded-full bg-white"></div>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Beds
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {beds.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-blue-500"></div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Occupied
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    {beds.occupied}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-red-500"></div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Available
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {beds.available}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-green-500"></div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Utilization
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.round((beds.occupied / beds.total) * 100)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-yellow-500"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Bed Capacity
          </h3>
          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-red-500 flex items-center justify-center text-xs font-medium text-white"
              style={{
                width: `${Math.round((beds.occupied / beds.total) * 100)}%`,
              }}
            >
              {Math.round((beds.occupied / beds.total) * 100)}%
            </div>
          </div>
        </div>

        {/* Bed Cards Section */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Bed Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-white rounded-lg p-4 shadow-md"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </div>
                ))
            : filteredBeds.map((bed) => (
                <div
                  key={bed.id}
                  className={`rounded-lg shadow-md p-5 transition duration-300 hover:shadow-lg ${
                    bed.isOccupied
                      ? "bg-gradient-to-br from-red-50 to-red-100"
                      : "bg-gradient-to-br from-green-50 to-green-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${
                          bed.isOccupied ? "bg-red-500" : "bg-green-500"
                        }`}
                      ></span>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {bed.roomNumber}-{bed.bedNumber}
                      </h4>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        bed.isOccupied
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {bed.isOccupied ? "Occupied" : "Available"}
                    </span>
                  </div>

                  {bed.isOccupied && bed.patient ? (
                    <div className="mt-2 space-y-2 text-sm border-t border-gray-200 pt-3">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                        <p className="font-medium text-gray-800">
                          {bed.patient.name}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <p className="text-gray-600">
                          Status: {bed.patient.status}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        <p className="text-gray-600">
                          Admitted:{" "}
                          {new Date(
                            bed.patient.admissionDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg border border-green-200 text-center">
                      <p className="text-green-700 text-sm">
                        This bed is ready for new patients
                      </p>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default BedManagement;
