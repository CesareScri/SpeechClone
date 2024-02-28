import React, { useState } from "react";
import Gif from "../assets/img/wired-lineal-237-star-rating.gif";

const WriteText = ({
  setCurrentPage,
  setInput,
  file,
  setData,
  isLoading,
  setIsLoading,
}) => {
  const handleForward = async () => {
    if (!file) {
      console.log("No file chosen.");
      return;
    }

    setIsLoading(true);

    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    let start = 0;
    let end = CHUNK_SIZE;
    let chunkNumber = 1;

    while (start < file.size) {
      let chunk = file.slice(start, end);

      let formData = new FormData();
      formData.append("file", chunk, `${file.name}.part${chunkNumber}`);

      try {
        let response = await fetch("http://localhost:3000/api/v1/clone-voice", {
          method: "POST",
          body: formData,
        });

        const res = await response.json();

        if (response.ok) {
          if (res.success) {
            setIsLoading(false);
            setCurrentPage(2);
            setData(res);
          } else {
            alert(res);
          }
        } else {
          setIsLoading(false);
          console.log(`Error uploading.`);
          alert(`Error uploading.`);
        }
      } catch (err) {
        console.error(`Failed to upload chunk ${chunkNumber}.`, err);
      }

      start = end;
      end = start + CHUNK_SIZE;
      chunkNumber++;
    }
  };

  const hendleBack = () => {
    setCurrentPage(0);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="input-text">
      <div className="page-2">
        <div className="button-back">
          <button onClick={hendleBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-chevron-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
            Back
          </button>
        </div>

        <img src={Gif} />
        <p>STEP 2</p>
        <h2>Time to try it out!</h2>
      </div>
      <div className="text-area">
        <textarea
          placeholder="Write your text here..."
          onChange={handleInput}
        ></textarea>
        <p>
          I hereby confirm that I am cloning my own voice samples and that I
          will not use the platform-generated content for any illegal,
          fraudulent, or harmful purpose.
        </p>
        <button onClick={handleForward}>
          {isLoading ? (
            <svg className="svg" viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>) : (
            "Generate Audio"
          )}
        </button>
      </div>
    </div>
  );
};

export default WriteText;
