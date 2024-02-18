import React, { useState, useEffect, useRef } from "react";
import RunFormTools from "./RunFormTools";
import { startRecording, stopRecording } from "../helpers/audioUtils";
import { convertSpeechToText } from "../helpers/convertSpeechToText";
import { FaPlus, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const RunForm = ({
  pretestData,
  addForm,
  deleteCurrentForm,
  goToNextForm,
  goToPreviousForm,
  currentIndex,
  totalForms,
}) => {
  const [formData, setFormData] = useState({
    runNumber: currentIndex,
    vehicleTested: "",
    timeBegin: "",
    gasLevel: "",
    engineHours: "",
    functionalityTested: "",
    timeEnd: "",
    startingStation: "",
    endingStation: "",
    gpsStart: "",
    gpsEnd: "",
    errors: "",
    log: "",
    estopActivated: "",
    missionStatus: "",
    missionStatusOtherText: "",
    stateAfterTest: "",
    acceleration: "",
    braking: "",
    curves: "",
    downhill: "",
    uphill: "",
    hmi: "",
    description: "",
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isVehicleInfoOpen, setIsVehicleInfoOpen] = useState(false);
  const [isGeneralTestInfoOpen, setIsGeneralTestInfoOpen] = useState(false);
  const [isRoboticsMessagesOpen, setIsRoboticsMessagesOpen] = useState(false);
  const [isVehicleBehaviorOpen, setIsVehicleBehaviorOpen] = useState(false);
  const [isDescriptionAndLogOpen, setIsDescriptionAndLogOpen] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");

  useEffect(() => {
    if (!totalForms || totalForms === 0) {
      addForm();
    }
  }, [addForm]);

  // Effect to handle transcribed text updates
  useEffect(() => {
    if (isRecording) {
      // Append "Listening..." to the description when recording starts
      setFormData((prevFormData) => ({
        ...prevFormData,
        description: prevFormData.description
          ? `${prevFormData.description}\nListening...`
          : "Listening...",
      }));
    } else if (transcribedText) {
      // Replace "Listening..." with transcribedText once recording stops and text is available
      setFormData((prevFormData) => {
        const lines = prevFormData.description.split("\n");
        if (lines[lines.length - 1] === "Listening...") {
          // Remove "Listening..." before appending transcribed text
          lines.pop();
        }
        const newDescription =
          lines.join("\n") +
          (lines.length > 0 ? `\n${transcribedText}` : transcribedText);
        return {
          ...prevFormData,
          description: newDescription,
        };
      });
    }
  }, [transcribedText, isRecording]);

  // Effect to handle pretestData updates
  useEffect(() => {
    if (pretestData) {
      setFormData(pretestData);
    }
  }, [pretestData]);

  useEffect(() => {
    // Initialize formData with pretestData and mutate the date format for the log
    if (pretestData) {
      // Mutate the date format from "YYYY-MM-DD" to "YYYYMMDD"
        const mutatedDate = pretestData.date ? pretestData.date.replaceAll('-', '') + '_' : '';

      setFormData({
        ...formData,
        runNumber: pretestData.runNumber,
        vehicleTested: pretestData.vehicleTested,
        gasLevel: pretestData.gasLevel,
        functionalityTested: pretestData.functionalityTested,
        engineHours: pretestData.engineHours,
        log: mutatedDate,
      });
    }
  }, [pretestData]);

  const handleMicrophoneClick = async () => {
    if (isRecording) {
      const audio = await stopRecording();
      setIsRecording(false);
      convertSpeechToText(audio)
        .then((text) => {
          setTranscribedText(text);
        })
        .catch((error) =>
          console.error("Error converting speech to text:", error)
        );
    } else {
      await startRecording();
      setIsRecording(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const toggleVehicleInfoDropdown = () =>
    setIsVehicleInfoOpen(!isVehicleInfoOpen);
  const toggleGeneralTestInfoDropdown = () =>
    setIsGeneralTestInfoOpen(!isGeneralTestInfoOpen);
  const toggleRoboticsMessagesDropdown = () =>
    setIsRoboticsMessagesOpen(!isRoboticsMessagesOpen);
  const toggleVehicleBehaviorDropdown = () =>
    setIsVehicleBehaviorOpen(!isVehicleBehaviorOpen);
  const toggleDescriptionAndLogDropdown = () =>
    setIsDescriptionAndLogOpen(!isDescriptionAndLogOpen);

  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Left side: Row for Previous, Run Number Input, and Next Buttons */}
            <div className="flex justify-start items-center space-x-4">
              <button
                onClick={goToPreviousForm}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow transform transition duration-150 ease-in-out hover:scale-105"
              >
                <FaArrowLeft className="inline mr-2" />
              </button>
              <div className="flex-1 flex flex-col mx-4 max-w-xs">
                <label
                  htmlFor="runNumber"
                  className="mb-2 text-sm font-medium text-gray-700"
                >
                  Run
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="runNumber"
                    name="runNumber"
                    className="mt-1 block w-24 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    value={formData.runNumber}
                    onChange={handleChange}
                  />
                  <h2 className="ml-2">of {totalForms}</h2>
                </div>
              </div>

              <button
                onClick={goToNextForm}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow transform transition duration-150 ease-in-out hover:scale-105"
              >
                <FaArrowRight className="inline mr-2" />
              </button>
            </div>

            {/* Right side: Row for Add and Delete Buttons */}
            <div className="flex justify-end items-center space-x-4">
              <button
                onClick={addForm}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow transform transition duration-150 ease-in-out hover:scale-105"
              >
                <FaPlus className="inline mr-2" /> Add
              </button>
              <button
                onClick={deleteCurrentForm}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow transform transition duration-150 ease-in-out hover:scale-105"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="mb-6">
            <button
              onClick={toggleVehicleInfoDropdown}
              className="mb-4 text-base font-semibold text-left text-gray-800 w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow"
            >
              Vehicle Information
              <span>{isVehicleInfoOpen ? "▲" : "▼"}</span>
            </button>

            {isVehicleInfoOpen && (
              <div className="bg-white p-4 rounded-lg shadow">
                {/* Vehicle Tested on its own row */}
                <div className="mb-6">
                  <label
                    htmlFor="vehicleTested"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Vehicle Tested:
                  </label>
                  <input
                    type="text"
                    id="vehicleTested"
                    name="vehicleTested"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.vehicleTested}
                    onChange={handleChange}
                  />
                </div>

                {/* Gas Level and Engine Hours*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Gas Level */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="gasLevel"
                      className="mb-2 text-sm font-medium text-gray-700"
                    >
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

                  {/* Engine Hours */}
                  <div className="fle flex-col">
                    <label
                      htmlFor="engineHours"
                      className="mb-2 text-sm font-medium text-gray-700"
                    >
                      Engine Hours:
                    </label>
                    <input
                      type="number"
                      id="engineHours"
                      name="engineHours"
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.engineHours}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* General Test Info Section */}
          <div className="mb-6">
            <button
              onClick={toggleGeneralTestInfoDropdown}
              className="mb-4 text-base font-semibold text-left text-gray-800 w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow"
            >
              General Test Info
              <span>{isGeneralTestInfoOpen ? "▲" : "▼"}</span>
            </button>

            {isGeneralTestInfoOpen && (
              <div className="bg-white p-4 rounded-lg shadow">
                {/* Functionality Tested */}
                <div className="flex flex-col">
                  <label
                    htmlFor="functionalityTested"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Functionality Tested:
                  </label>
                  <input
                    type="text"
                    id="functionalityTested"
                    name="functionalityTested"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.functionalityTested}
                    onChange={handleChange}
                  />
                </div>

                {/* Time Start and Time End on the same row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Time Start */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="timeStart"
                      className="mb-2 text-sm font-medium text-gray-700"
                    >
                      Time Start:
                    </label>
                    <input
                      type="time"
                      id="timeStart"
                      name="timeStart"
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.timeStart}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Time End */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="timeEnd"
                      className="mb-2 text-sm font-medium text-gray-700"
                    >
                      Time End:
                    </label>
                    <input
                      type="time"
                      id="timeEnd"
                      name="timeEnd"
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.timeEnd}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Gps Start and Gps End on the same row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gps Start */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="gpsStart"
                      className="mb-2 text-sm font-medium text-gray-700"
                    >
                      GPS Start:
                    </label>
                    <input
                      type="text"
                      id="gpsStart"
                      name="gpsStart"
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.gpsStart}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Gps End */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="gpsEnd"
                      className="mb-2 text-sm font-medium text-gray-700"
                    >
                      GPS End:
                    </label>
                    <input
                      type="text"
                      id="gpsEnd"
                      name="gpsEnd"
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.gpsEnd}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Robotics Messages Section */}
          <div className="mb-6">
            <button
              onClick={toggleRoboticsMessagesDropdown}
              className="mb-4 text-base font-semibold text-left text-gray-800 w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow"
            >
              Robotics Messages
              <span>{isRoboticsMessagesOpen ? "▲" : "▼"}</span>
            </button>

            {isRoboticsMessagesOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow">
                {/* Errors Textarea */}
                <div className="flex flex-col col-span-2">
                  <label
                    htmlFor="errors"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Errors:
                  </label>
                  <textarea
                    id="errors"
                    name="errors"
                    rows="1"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.errors}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Mission Status */}
                <div className="flex flex-col col-span-1 md:col-span-2">
                  <label
                    htmlFor="missionStatus"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Mission Status:
                  </label>
                  <select
                    id="missionStatus"
                    name="missionStatus"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.missionStatus}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="successfulTermination">
                      Successful Termination
                    </option>
                    <option value="other">Other</option>
                  </select>
                  {formData.missionStatus === "other" && (
                    <input
                      type="text"
                      name="missionStatusOther"
                      placeholder="Please specify"
                      className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.missionStatusOther}
                      onChange={handleChange}
                    />
                  )}
                </div>

                {/* State of Vehicle After Test Section */}
                <div className="flex flex-col col-span-1 md:col-span-2 mt-4">
                  <label
                    htmlFor="stateAfterTest"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    State of Vehicle After Test:
                  </label>
                  <select
                    id="stateAfterTest"
                    name="stateAfterTest"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.stateAfterTest}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="waitingStation">Waiting Station</option>
                    <option value="goToStation">Go to Station</option>
                    <option value="authorizedDrive">Authorized Drive</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Behavior Section */}
          <div className="mb-6">
            <button
              onClick={toggleVehicleBehaviorDropdown}
              className="mb-4 text-base font-semibold text-left text-gray-800 w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow"
            >
              Vehicle Behavior
              <span>{isVehicleBehaviorOpen ? "▲" : "▼"}</span>
            </button>

            {isVehicleBehaviorOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-4 rounded-lg shadow">
                {/* Acceleration */}
                <div className="flex flex-col">
                  <label
                    htmlFor="acceleration"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Acceleration:
                  </label>
                  <select
                    id="acceleration"
                    name="acceleration"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.acceleration}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="satisfactory">Satisfactory</option>
                    <option value="inadequate">Inadequate</option>
                    <option value="na">N/A</option>
                  </select>
                </div>

                {/* Braking */}
                <div className="flex flex-col">
                  <label
                    htmlFor="braking"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Braking:
                  </label>
                  <select
                    id="braking"
                    name="braking"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.braking}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="satisfactory">Satisfactory</option>
                    <option value="inadequate">Inadequate</option>
                    <option value="na">N/A</option>
                  </select>
                </div>

                {/* Curves */}
                <div className="flex flex-col">
                  <label
                    htmlFor="curves"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Curves:
                  </label>
                  <select
                    id="curves"
                    name="curves"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.curves}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="satisfactory">Satisfactory</option>
                    <option value="inadequate">Inadequate</option>
                    <option value="na">N/A</option>
                  </select>
                </div>

                {/* Downhill */}
                <div className="flex flex-col">
                  <label
                    htmlFor="downhill"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Downhill:
                  </label>
                  <select
                    id="downhill"
                    name="downhill"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.downhill}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="satisfactory">Satisfactory</option>
                    <option value="inadequate">Inadequate</option>
                    <option value="na">N/A</option>
                  </select>
                </div>

                {/* Uphill */}
                <div className="flex flex-col">
                  <label
                    htmlFor="uphill"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Uphill:
                  </label>
                  <select
                    id="uphill"
                    name="uphill"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.uphill}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="satisfactory">Satisfactory</option>
                    <option value="inadequate">Inadequate</option>
                    <option value="na">N/A</option>
                  </select>
                </div>

                {/* HMI */}
                <div className="flex flex-col">
                  <label
                    htmlFor="HMI"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    HMI:
                  </label>
                  <select
                    id="hmi"
                    name="hmi"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.hmi}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="satisfactory">Satisfactory</option>
                    <option value="inadequate">Inadequate</option>
                    <option value="na">N/A</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          {/* Description and Log Section */}
          <div className="mb-6">
            <button
              onClick={toggleDescriptionAndLogDropdown}
              className="mb-4 text-base font-semibold text-left text-gray-800 w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow"
            >
              Description and Log
              <span>{isDescriptionAndLogOpen ? "▲" : "▼"}</span>
            </button>

            {isDescriptionAndLogOpen && (
              <div className="bg-white p-4 rounded-lg shadow space-y-4">
                {/* Description Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Description:
                    </label>
                    <RunFormTools
                      onMicrophoneClick={handleMicrophoneClick}
                      isRecording={isRecording}
                    />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Log Section */}
                <div className="flex flex-col">
                  <label
                    htmlFor="log"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Log:
                  </label>
                  <textarea
                    id="log"
                    name="log"
                    rows="1"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.log}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RunForm;
