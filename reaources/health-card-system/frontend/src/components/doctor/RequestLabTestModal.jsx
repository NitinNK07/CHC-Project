import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { doctorApi } from "../../api/doctorApi";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { validateLabTestRequest } from "../../utils/validation";
import { formatDateTime } from "../../utils/format";

export default function RequestLabTestModal({ open, onClose, cardCredentials, prescriptions = [], onCreated }) {
  const [testName, setTestName] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [prescriptionId, setPrescriptionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateLabTestRequest(testName);
    if (Object.keys(errors).length > 0) {
      if (errors.testName) toast.error(errors.testName);
      return;
    }

    setSubmitting(true);
    try {
      await doctorApi.requestLabTest({
        healthCardNumber: cardCredentials.healthCardNumber,
        healthCardId: cardCredentials.healthCardId,
        testName,
        clinicalNotes,
        prescriptionId: prescriptionId ? Number(prescriptionId) : undefined,
      });
      toast.success("Lab test requested!");
      setTestName("");
      setClinicalNotes("");
      setPrescriptionId("");
      onCreated?.();
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Request a lab test" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Test name" required placeholder="e.g. Complete Blood Count" value={testName} onChange={(e) => setTestName(e.target.value)} />
        <Textarea label="Clinical notes" rows={3} value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} />
        
        {prescriptions.length > 0 && (
          <Select label="Link to Prescription (Optional)" value={prescriptionId} onChange={(e) => setPrescriptionId(e.target.value)}>
            <option value="">No prescription</option>
            {prescriptions.map(p => (
              <option key={p.id} value={p.id}>
                {p.diagnosis} ({formatDateTime(p.createdAt)})
              </option>
            ))}
          </Select>
        )}

        <Button type="submit" className="w-full" loading={submitting}>Send to lab queue</Button>
      </form>
    </Modal>
  );
}
