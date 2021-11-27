import { useState, useEffect, ChangeEventHandler } from "react";
import { auth, storage, } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import Loader from "./Loader";
import toast from "react-hot-toast";

const ImageUploader: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");

  const uploadFile = async (file: File) => {
    const extentsion = file.type.split("/")[1];
    const imageRef = ref(
      storage,
      `uploads/${auth.currentUser?.uid}/${Date.now()}.${extentsion}`
    );
    setUploading(true);
    const task = uploadBytesResumable(imageRef, file);
    task.on("state_changed", (snapshot) => {
      const pct = parseInt(
        ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
      );

      setProgress(pct);
      task.then((d) => {
        getDownloadURL(d.ref).then((url) => {
          console.log("image donwload url is:- ", url);
          setDownloadURL(url);
          setUploading(false);
        });
      });
    });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input
              type="file"
              onChange={(e) => {
                e.target.files?.length && uploadFile(e.target.files[0]);
              }}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code
          onDoubleClick={(e) => {
            navigator.clipboard.writeText(e.currentTarget.innerText);
            toast.success("Copied to clipboard");
          }}
          className="upload-snippet"
        >{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
};

export default ImageUploader;
