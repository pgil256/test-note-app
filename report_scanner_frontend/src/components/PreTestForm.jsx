import React, { useState } from "react";

const PreTestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    runNumber: "1",
    vehicleTested: "",
    functionalityTested: "",
    gasLevel: "",
    engineHours: "",
    date: "",
  });

  const [isPreTestInfoOpen, setIsPreTestInfoOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePreTestInfoDropdown = () =>
    setIsPreTestInfoOpen(!isPreTestInfoOpen);

  return (
    <div className="bg-gray-100 p-4 sm:p-8 md:p-10 lg:p-12 font-sans">
      <div className="mx-auto max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Test Engineer Report Generator
        </h1>
        <div className="mb-6">
          <button
            onClick={togglePreTestInfoDropdown} // Adjust the function name as necessary
            className="mb-4 text-base font-semibold text-left text-gray-800 w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow"
          >
            Pre-Test Information
            <span>{isPreTestInfoOpen ? "▲" : "▼"}</span>{" "}
            {/* Adjust the state variable as necessary */}
          </button>

          {isPreTestInfoOpen && (
            <div className="bg-white p-4 rounded-lg shadow">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-4 gap-6"
              >
                {/* Vehicle Tested */}
                <div className="flex flex-col lg:col-span-2">
                  <label className="mb-2 text-lg font-medium text-gray-700">
                    Vehicle Tested:
                  </label>
                  <input
                    type="text"
                    name="vehicleTested"
                    className="border border-gray-300 bg-white rounded-md shadow-sm py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.vehicleTested}
                    onChange={handleChange}
                  />
                </div>
                {/* Date Field */}
                <div className="flex flex-col lg:col-span-2">
                  <label className="mb-2 text-lg font-medium text-gray-700">
                    Date:
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="border border-gray-300 bg-white rounded-md shadow-sm py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                {/* Functionality Tested */}
                <div className="flex flex-col lg:col-span-2">
                  <label className="mb-2 text-lg font-medium text-gray-700">
                    Functionality Tested:
                  </label>
                  <input
                    type="text"
                    name="functionalityTested"
                    className="border border-gray-300 bg-white rounded-md shadow-sm py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.functionalityTested}
                    onChange={handleChange}
                  />
                </div>
                {/* Gas Level Dropdown - Adjusted to take half the space */}
                <div className="flex flex-col lg:col-span-1">
                  <label className="mb-2 text-lg font-medium text-gray-700">
                    Gas Level:
                  </label>
                  <select
                    name="gasLevel"
                    className="border border-gray-300 bg-white rounded-md shadow-sm py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.gasLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select Gas Level</option>
                    <option value="1/8">1/8</option>
                    <option value="1/4">1/4</option>
                    <option value="3/8">3/8</option>
                    <option value="1/2">1/2</option>
                    <option value="5/8">5/8</option>
                    <option value="3/4">3/4</option>
                    <option value="7/8">7/8</option>
                    <option value="full">Full</option>
                  </select>
                </div>
                {/* Engine Hours - Adjusted to take half the space */}
                <div className="flex flex-col lg:col-span-1">
                  <label className="mb-2 text-lg font-medium text-gray-700">
                    Engine Hours:
                  </label>
                  <input
                    type="number"
                    name="engineHours"
                    className="border border-gray-300 bg-white rounded-md shadow-sm py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.engineHours}
                    onChange={handleChange}
                  />
                </div>
                {/* Submit Button */}
                <div className="col-span-1 lg:col-span-4 flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-lg text-white font-medium transition duration-150 ease-in-out"
                  >
                    Apply to Forms
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreTestForm;
