import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs-extra";
import fetch from "node-fetch";
import FormData from "form-data";
import path from "path";
import { get } from "https";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

const getIdToken = async () => {
  try {
    const API_URL =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDbAIg5AN6Cb5kITejfovleb5VDWw0Kv7s";
    const postData = {
      email: "pilepemavopi@labworld.org",
      password: "Qwerty2020!",
      returnSecureToken: true,
    };

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    };

    console.log("The token is begin generating");
    const request = await fetch(API_URL, option);
    const response = await request.json();

    if (response?.error?.code) {
      console.log("Getting the id failed.", response);
    } else {
      console.log("token ok");
      return response.idToken;
    }
  } catch (error) {
    console.log("Error", error);
  }
};

const SPEECHIFY_API_ENDPOINT = "https://voices.api.speechify.dev/v0/voices";

let AUTH_TOKEN = null;

(async () => {
  try {
    AUTH_TOKEN = await getIdToken();
    // console.log(AUTH_TOKEN);
  } catch (error) {
    console.error("Failed to retrieve auth token:", error);
  }
})();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create a new filename using the current date and the original filename
    const newFilename = `${Date.now()}-${file.originalname}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

app.post("/api/v1/clone-voice", upload.single("file"), async (req, res) => {
  const fileNameWithoutPart = req.file.filename.split(".part")[0];
  const chunkFilePath = `uploads/${req.file.filename}`;
  const combinedFilePath = `uploads/${fileNameWithoutPart}`;

  if (fs.existsSync(combinedFilePath)) {
    await fs.appendFile(combinedFilePath, await fs.readFile(chunkFilePath));
    console.log(combinedFilePath);
    await fs.remove(chunkFilePath);
  } else {
    await fs.rename(chunkFilePath, combinedFilePath);
  }

  const result = await sendLatestFileToSpeechify(combinedFilePath);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function generateRandomID(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to send the latest file from 'uploads' to Speechify API
const sendLatestFileToSpeechify = async (filename) => {
  if (!filename) {
    console.error("Filename not provided.");
    return { success: false, message: "Filename not provided." };
  }

  const lexaFrom = new FormData();
  lexaFrom.append("file", fs.createReadStream(filename), {
    filename: path.basename(filename),
    contentType: "audio/mpeg",
  });

  // Get the last uploaded file in the 'uploads' directory
  const lexa_endpoint = "https://cdn.lexai.me/upload";
  const lexaPost = await fetch(lexa_endpoint, {
    method: "POST",
    body: lexaFrom,
  });

  const lexaResponse = await lexaPost.json();

  console.log(lexaResponse);

  console.log("I'm begin called!");

  const formData = new FormData();
  formData.append("sampleUrl", lexaResponse.fileUrl);

  const randomID = generateRandomID();

  formData.append("visibility", "private");
  formData.append(
    "meta",
    JSON.stringify({ product: "voiceovers", name: `clone-voice/${randomID}` })
  );
  formData.append("avatar", fs.createReadStream(filename), {
    filename: path.basename(filename),
    contentType: "audio/mpeg",
  });
  formData.append("prompt", "neutral");

  try {
    const response = await fetch(SPEECHIFY_API_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        ...formData.getHeaders(),
      },
    });

    const dataReceived = await response.json();
    // console.log("Data received from Lexa API:", dataReceived);

    if (response.ok) {
      console.log("Uploaded to Lexa successfully!");
      return {
        success: true,
        message: "File uploaded to Lexa.",
        data: {
          id: dataReceived.id,
          meta: dataReceived.meta,
        },
      };
    } else {
      console.error("Failed to upload to Lexa");
      return {
        success: false,
        message: "Failed to upload to Lexa.",
        error: dataReceived,
      };
    }
  } catch (error) {
    console.error("Error uploading to Speechify:", error.message);
    return { success: false, message: "Server error." };
  }
};
