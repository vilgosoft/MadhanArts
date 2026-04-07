import { useRef, useState } from 'react';
import '../../styles/components/_order-flow.scss';

interface Props {
  photo: File | null;
  onPhotoSelect: (file: File | null) => void;
}

export default function PhotoUpload({ photo, onPhotoSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    photo ? URL.createObjectURL(photo) : null
  );
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    onPhotoSelect(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const removePhoto = () => {
    onPhotoSelect(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="photo-upload">
      <div
        className={`photo-upload__dropzone ${dragActive ? 'photo-upload__dropzone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 18h16" />
        </svg>
        <h3>Upload your reference photo</h3>
        <span>Drag & drop or click to browse (JPEG, PNG, WebP — max 10MB)</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {preview && (
        <div className="photo-upload__preview">
          <img src={preview} alt="Reference preview" />
          <button onClick={removePhoto}>&times;</button>
        </div>
      )}
    </div>
  );
}
