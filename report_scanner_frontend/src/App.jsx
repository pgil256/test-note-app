import React, { useState } from "react";
import PreTestForm from "./components/PreTestForm.jsx";
import RunFormManager from "./components/RunFormManager.jsx"; // Import RunFormManager

function App() {
  const [pretestData, setPretestData] = useState(null);

  const handlePretestSubmit = (data) => {
    setPretestData(data);
  };

  return (
    <div>
      <PreTestForm onSubmit={handlePretestSubmit} />
      <RunFormManager pretestData={pretestData} />
    </div>
  );
}

export default App;
