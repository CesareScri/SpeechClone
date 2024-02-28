import React from "react";

const UploadFile = ({setFile}) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
    }
}
  return (
    <div className="welcome-page">
      <div className="top-div">
        <img
          className="data-image"
          src="https://storage.googleapis.com/speechify-ai-api-prod-centralized-voice-list/variants%2Fios/avatars/en-US-snoop-resemble.webp"
          alt="Snoop"
        />
        <img
          className="data-image"
          src="https://storage.googleapis.com/speechify-ai-api-prod-centralized-voice-list/variants%2Fios/avatars/en-US-mrbeast-speechify.webp"
          alt="Mrbeast"
        />
        <img
          className="data-image"
          src="https://storage.googleapis.com/speechify-ai-api-prod-centralized-voice-list/variants%2Fios/avatars/en-US-Jenny-azure.webp"
          alt="Jenny"
        />
      </div>
      <h2>Want to clone your own voice?</h2>
      <p>It only takes 2 steps, less than 30 seconds! No account required.</p>

      <div className="labed-file">
        <label htmlFor="images" className="drop-container" id="dropcontainer">
          <span className="drop-title">Drop files here</span>
          or
          <small>Click to upload</small>
          <input type="file" id="images" required style={{display: 'none'}} onChange={handleFileChange} />
        </label>
      </div>

    </div>
  );
};

export default UploadFile;
