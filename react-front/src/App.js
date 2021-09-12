import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [video, setVideo] = useState("");
  const [videoname, setVideoname] = useState("Choose File");
  const [uploadFile, setUploadFile] = useState({});
  const [files, setFiles] = useState([]);

  useEffect(async () => {
    loaddata();
  }, []);

  const loaddata = async () => {
    const input = await axios.get(`http://localhost:4000/files`);
    setFiles(input.data);
  }

  const onChange = (e) => {
    setVideo(e.target.files[0]);
    setVideoname(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", video);

    try {
      const res = await axios.post(`http://localhost:4000/`, formData);

      const { fileName, filePath } = res.data;

      setUploadFile({ fileName, filePath });
      
      alert("Coverted files are below");
      loaddata();

    } catch (error) {
       alert(`${error}`)
    }
  };  
   return (
    <div className="">
      <form onSubmit={onSubmit}>
      <nav class="navbar navbar-light bg-light">
      <div class="container">
      <a class="navbar-brand" href="#">
      <img src="https://getbootstrap.com/docs/5.1/assets/brand/bootstrap-logo.svg" alt="Image" width="30" height="24"/>
      <span class="navbar-brand ms-5 h1">Video Converter</span>
      </a>
      </div>
      </nav>
      <div class="input-group mb-3 container">
     <input type="file" class="form-control" placeholder="Select the file" accept='video/mp4' onChange={onChange} />
      </div> 
      <div className="text-center"> 
        {video && (
      <video width="60%" controls src={URL.createObjectURL(video)}>
      </video>  )}
        </div>       
      <div className="text-center mb-3">
      <input type="submit" value="Covert" className="btn btn-primary"/>
      </div>   
      </form>
      <h3 className="container">Converted HSL Files in Video Folder</h3>
      <ol class="list-group list-group-numbered container mb-3">
        {
          files.map((data,index) => {
            return( <li class="list-group-item">{data.fileName}</li>)
          })
        }
    </ol>
    </div>
  );
}

export default App;