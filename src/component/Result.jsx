import React, { useState, useRef, useEffect } from 'react';
import Gif from "../assets/img/confetti.gif";


const Result = ({setCurrentPage, input, dataId, setIsLoading}) => {
  const audioRef = useRef(null);
  const [audioLoading, setAudioIsloading] = useState(true)

  if (!dataId) {
    console.error("No dataId provided");
    return;
  }
  useEffect(() => {
    getData();
  }, [])

  let getData = async () => {
    try {
      const url = "https://audio.api.speechify.dev/generateAudioFiles";
      const postData = {
        audioFormat: "mp3",
        paragraphChunks: [input],
        voiceParams: {
          name: "PVL:" + dataId,
          engine: "speechify",
          languageCode: "it-IT",
        },
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };

      const req = await fetch(url, options);
      const res = await req.json();

      translateAudio(res.audioStream);
    } catch (error) {
      console.error(error);
    }
  };

  const translateAudio = (text) => {
    const audioStream = text;

    // Create a Blob from the base64 encoded audio stream
    const byteCharacters = atob(audioStream);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/mpeg" }); // Change the MIME type to 'audio/mpeg' for MP3

    // Create an Object URL from the Blob
    const audioUrl = URL.createObjectURL(blob);
    setIsLoading(false)

    setAudioIsloading(false)
    audioRef.current.src = audioUrl;
  };

  const hendleBack = () => {
    setCurrentPage(1);
  }

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
              className="bi bi-chevron-left"
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
      </div>
      <div className="page-2-audio text-area">
          <textarea value={input} readOnly></textarea>
         {audioLoading ? 
<div class="loader"></div> : <audio ref={audioRef} src='' controls/>}
      </div>
    </div>
  );
};

export default Result;
