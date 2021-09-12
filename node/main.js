const cors = require("cors");
const express = require("express");
const fs = require("fs-extra")
const fileUpload = require("express-fileupload");;
const path = require("path");
var __dirname = path.resolve();
const app = express();
const port = process.env.PORT || 4000;
const { exec } = require("child_process");
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.static("./video"));

app.post("/", (req, res) => {
  if (req.files === null) {
    return res.json({ msg: "Please load the file" });
  }

  const file = req.files.file;
  fs.remove(`${__dirname}/video/HLS`, () => {
    fs.mkdirSync(`${__dirname}/video/HLS`);
    fs.remove(`${__dirname}/video/uploaded`, () => {
      fs.mkdirSync(`${__dirname}/video/uploaded`);

      file.mv(`${__dirname}/video/uploaded/${file.name}`, (error) => {
        if (error) {
          console.error(err);
          return res.send(err);
        }

        exec(
          `cd video && cd HLS && ffmpeg -i ${__dirname}/video/uploaded/${file.name} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${file.name}.m3u8`,
          (error, stdout, stderr) => {
            if (error) {
              console.log(error);
              return;
            } else if (stderr) {
              console.log(stderr);
            } else {
              console.log(stdout);
            }
          }
        );
       fs.readdirSync(`${__dirname}/video/HLS`);

        res.json({ fileName: file.name, filePath: `/uploaded/${file.name}` });
      });
    });
  });

  app.get("/files", (req, res) => {
    fs.readdir(
      `${__dirname}/video/HLS`,
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          console.log(err);
        } else {
          res.send(
            files.map((file) => {
              return {
                fileName: file.name,
                isFolder: file.isDirectory(),
              };
            })
          );
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Listening ${port}`);
});
