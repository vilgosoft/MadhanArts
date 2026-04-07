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
        <div className="photo-upload__dropzone-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h3>Drop your reference photo here</h3>
        <span>or click to browse &middot; JPEG, PNG, WebP &middot; Max 10MB</span>
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
          <img src={preview} alt="Your reference photo" />
          <button className="photo-upload__preview-remove" onClick={removePhoto}>&times;</button>
        </div>
      )}
    </div>
  );
}
