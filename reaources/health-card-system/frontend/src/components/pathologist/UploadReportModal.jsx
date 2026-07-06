import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import FileUploadZone from "../ui/FileUploadZone";
import { pathologistApi } from "../../api/pathologistApi";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { validateFile } from "../../utils/validation";

export default function UploadReportModal({ open, onClose, labTest, onUploaded }) {
  const [findings, setFindings] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const toast = useToast();

  const reset = () => {
    setFindings("");
    setRemarks("");
    setFile(null);
    setUploadKey(prev => prev + 1);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!findings.trim()) {
      toast.error("Findings are required");
      return;
    }
    
    if (file) {
      const fileError = validateFile(file, ".pdf,.jpg,.jpeg,.png", 10);
      if (fileError) {
        toast.error(fileError);
        return;
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("findings", findings);
      if (remarks) formData.append("remarks", remarks);
      if (file) formData.append("attachment", file);
      
      await pathologistApi.uploadReport(labTest.id, formData);
      toast.success("Report uploaded — patient and doctor notified.");
      onUploaded?.();
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Upload report — ${labTest?.testName ?? ""}`} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea 
          label="Findings" 
          required 
          rows={4} 
          value={findings} 
          onChange={(e) => setFindings(e.target.value)} 
        />
        <Textarea 
          label="Remarks (optional)" 
          rows={2} 
          value={remarks} 
          onChange={(e) => setRemarks(e.target.value)} 
        />

        <div className="pt-2">
          <FileUploadZone 
            key={uploadKey}
            label="Import Lab Report File"
            onFileSelect={setFile}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
            multiple={false}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full mt-2" 
          loading={submitting} 
          disabled={!findings.trim() || submitting}
        >
          Submit report
        </Button>
      </form>
    </Modal>
  );
}
