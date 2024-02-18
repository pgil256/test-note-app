import React from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const RunFormTools = ({
  onMicrophoneClick,
  isRecording,
}) => {
  return (
    <div className="inline-flex items-center justify-center bg-white rounded-lg shadow-md p-2" style={{ backdropFilter: 'blur(10px)' }}>
      <button
        onClick={onMicrophoneClick}
        className={`transition duration-300 ease-in-out transform hover:-translate-y-1 bg-gradient-to-r ${isRecording ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600'} hover:${isRecording ? 'from-red-600 to-red-700' : 'from-blue-600 to-blue-700'} text-white font-bold py-1 px-3 rounded-full flex items-center justify-center shadow-md hover:shadow-lg`}
      >
        {isRecording ? <FaMicrophoneSlash className="text-xl mr-2" /> : <FaMicrophone className="text-xl mr-2" />}
      </button>
    </div>
  );
};

export default RunFormTools;
