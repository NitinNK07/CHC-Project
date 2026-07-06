import { useState, useRef } from "react";
import { Upload, X, FileText, Image, File } from "lucide-react";
import { useLang } from "../../context/LanguageContext";

const fileIcon = (type) => {
  if (type?.startsWith("image/")) return Image;
  if (type === "application/pdf") return FileText;
  return File;
};

export default function FileUploadZone({
  onFileSelect,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  label,
  multiple = false,
}) {
  const { t } = useLang();
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    const valid = arr.filter((f) => {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${f.name}" exceeds ${maxSizeMB}MB limit.`);
        return false;
      }
      return true;
    });
    if (valid.length) {
      setFiles(multiple ? (prev) => [...prev, ...valid] : valid);
      onFileSelect?.(multiple ? valid : valid[0]);
      setError("");
    }
  };

  const removeFile = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{label}</label>}
      <div
        className={`drop-zone ${dragging ? "active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div className="h-12 w-12 rounded-xl bg-vital-light flex items-center justify-center">
            <Upload size={22} className="text-vital-500" />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{t("dragDropHere")}</p>
          <p className="text-xs text-[var(--text-secondary)]">{t("orClickToUpload")}</p>
          <p className="text-xs text-[var(--text-muted)]">{t("supportedFormats")} · {t("maxFileSize")}</p>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-coral">{error}</p>}

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => {
            const Icon = fileIcon(f.type);
            return (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                <div className="h-8 w-8 rounded-lg bg-vital-light flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-vital-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{f.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{(f.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => removeFile(i)} className="p-1 rounded-lg hover:bg-coral-light text-[var(--text-muted)] hover:text-coral">
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
