import React, { useState, useEffect, useRef } from "react";
import RunForm from "./RunForm"; // Import RunForm component

const RunFormManager = ({ pretestData }) => {
  const [forms, setForms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!pretestData) {
      console.error("Pretest data is null or undefined.");
      return;
    }
    setForms([pretestData]); // Initialize with pretestData
  }, [pretestData]);

  const generateDocument = async () => {
    try {
      if (!forms || forms.length === 0) {
        console.error("Forms data is empty or not initialized.");
        return;
      }

      console.log(forms);
      const response = await fetch("http://127.0.0.1:5000/generate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ forms }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "concatenated_forms.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  const addForm = () => {
    // Clone the pretestData to modify its run number
    const newFormData = { ...pretestData, runNumber: forms.length + 1 };

    // Add the new form data to the forms array
    const updatedForms = [...forms, newFormData];

    setForms(updatedForms);
    setCurrentIndex(updatedForms.length - 1); // Switch to the new form
    generateDocument();
  };

  const deleteCurrentForm = () => {
    if (forms.length > 1) {
      const updatedForms = forms.filter((_, index) => index !== currentIndex);
      setForms(updatedForms);
      setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
    }
  };

  const goToNextForm = () => {
    if (currentIndex < forms.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousForm = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="bg-gray-100 p-2 font-sans flex">
      <div className="relative flex-grow">
        <button onClick={generateDocument}>Generate Document</button>
        <RunForm
          key={currentIndex}
          pretestData={forms[currentIndex]}
          addForm={addForm}
          deleteCurrentForm={deleteCurrentForm}
          goToNextForm={goToNextForm}
          goToPreviousForm={goToPreviousForm}
          currentIndex={currentIndex + 1} // Adjust for human-readable indexing (1-based instead of 0-based)
          totalForms={forms.length}
        />
      </div>
    </div>
  );
};

export default RunFormManager;
