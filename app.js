require("dotenv").config();
const fs = require("fs");
const { google } = require("googleapis");
// A Function that can provide access to google drive api
async function authorize() {
  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY,
    process.env.SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}
// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient) {
  const drive = google.drive({ version: "v3", auth: authClient });
  console.log("upload...");
  return new Promise((resolve, rejected) => {
    const imageToUpload = process.env.FILE_NAME; // Path for picture
    var fileMetaData = {
      name: imageToUpload,
      parents: [process.env.FOLDER_ID], // A folder ID to which file will get uploaded
    };
    drive.files.create(
      {
        resource: fileMetaData,
        media: {
          body: fs.createReadStream(`./images/${process.env.FILE_NAME}`), // files that will get uploaded
          mimeType: "image/jpeg", // mimeType for picture
        },
        fields: "id",
      },
      function (error, file) {
        if (error) {
          return rejected(error);
        }
        console.log("uploaded...");
        resolve(file);
      }
    );
  });
}
authorize().then(uploadFile).catch("error", console.error()); // function call
