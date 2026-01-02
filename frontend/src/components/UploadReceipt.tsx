import React from "react";

interface Props {
  file: File | null;
  setFile: (file: File | null) => void;
  onUpload: () => void;
  uploading: boolean;
  error: string | null;
}

const UploadReceipt = ({ file, setFile, onUpload, uploading, error }: Props) => {
  return (
    <div>
      <h2>Upload Receipt</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={onUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default UploadReceipt;
