document
  .getElementById("uploadBtn")
  .addEventListener("click", async function () {
    let file = document.getElementById("fileInput").files[0];
    if (!file) {
      console.log("No file chosen.");
      return;
    }

    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    let start = 0;
    let end = CHUNK_SIZE;
    let chunkNumber = 1;

    while (start < file.size) {
      let chunk = file.slice(start, end);

      let formData = new FormData();
      formData.append("file", chunk, `${file.name}.part${chunkNumber}`);

      try {
        let response = await fetch("/api/v1/clone-voice", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log(`Chunk ${chunkNumber} uploaded!`);
        } else {
          console.log(`Error uploading chunk ${chunkNumber}.`);
        }
      } catch (err) {
        console.error(`Failed to upload chunk ${chunkNumber}.`, err);
      }

      start = end;
      end = start + CHUNK_SIZE;
      chunkNumber++;
    }
  });
