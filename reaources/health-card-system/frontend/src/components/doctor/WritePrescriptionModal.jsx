import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { Trash2, Plus, FileText, Activity, Stethoscope, Pill } from "lucide-react";
import { doctorApi } from "../../api/doctorApi";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { useAuth } from "../../context/AuthContext";
import { validatePrescription } from "../../utils/validation";

const emptyItem = { medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" };

export default function WritePrescriptionModal({ open, onClose, cardCredentials, onCreated }) {
  const { user } = useAuth();
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setDiagnosis("");
      setAdvice("");
      setItems([{ ...emptyItem }]);
    }
  }, [open]);

  const updateItem = (idx, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = validatePrescription(diagnosis, items);
    if (Object.keys(errors).length > 0) {
      if (errors.diagnosis) toast.error(errors.diagnosis);
      if (errors.items) toast.error(errors.items);
      else {
        // Find first item error
        for (let i = 0; i < items.length; i++) {
          if (errors[`item_${i}_medicineName`]) {
            toast.error(`Medicine name is required for item ${i + 1}`);
            break;
          }
        }
      }
      return;
    }

    setSubmitting(true);
    try {
      await doctorApi.createPrescription({
        healthCardNumber: cardCredentials.healthCardNumber,
        healthCardId: cardCredentials.healthCardId,
        diagnosis,
        advice,
        items,
      });
      toast.success("Prescription issued successfully!");
      onCreated?.();
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Prescription Pad" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Prescription Header / Letterhead Vibe */}
        <div className="relative overflow-hidden rounded-2xl bg-card-gradient p-6 text-white shadow-lg">
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                <Stethoscope size={24} className="text-white/80" />
                Dr. {user?.fullName}
              </h2>
              <p className="mt-1 text-sm text-white/80 opacity-90">Centralized Health Card System • Verified E-Prescription</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Date</p>
              <p className="text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 opacity-10">
            <Activity size={120} />
          </div>
        </div>

        {/* Clinical Info */}
        <div className="space-y-4 rounded-2xl border border-mist-light bg-mist-light/20 p-5">
          <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2 mb-2">
            <Activity size={18} className="text-vital" /> Clinical Assessment
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input 
              label="Diagnosis" 
              required 
              placeholder="E.g., Acute Bronchitis"
              value={diagnosis} 
              onChange={(e) => setDiagnosis(e.target.value)} 
              className="w-full"
            />
            <Textarea 
              label="General Advice & Notes" 
              rows={1} 
              placeholder="Rest, hydration, avoid cold water..."
              value={advice} 
              onChange={(e) => setAdvice(e.target.value)} 
              className="w-full"
            />
          </div>
        </div>

        {/* Medication List */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
              <Pill size={18} className="text-vital" /> Rx Medications
            </h3>
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, { ...emptyItem }])}
              className="flex items-center gap-1.5 rounded-full bg-vital/10 px-3 py-1.5 text-xs font-semibold text-vital transition hover:bg-vital/20"
            >
              <Plus size={14} /> Add Medicine
            </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-xl border border-mist-light bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="absolute left-0 top-0 h-full w-1 bg-vital"></div>
                
                <div className="grid gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-4">
                    <Input 
                      label={idx === 0 ? "Medicine Name" : undefined}
                      placeholder="E.g., Amoxicillin 500mg" 
                      required 
                      value={item.medicineName} 
                      onChange={(e) => updateItem(idx, "medicineName", e.target.value)} 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input 
                      label={idx === 0 ? "Dosage" : undefined}
                      placeholder="1 tablet" 
                      value={item.dosage} 
                      onChange={(e) => updateItem(idx, "dosage", e.target.value)} 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input 
                      label={idx === 0 ? "Frequency" : undefined}
                      placeholder="Twice a day" 
                      value={item.frequency} 
                      onChange={(e) => updateItem(idx, "frequency", e.target.value)} 
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input 
                      label={idx === 0 ? "Duration" : undefined}
                      placeholder="5 days" 
                      value={item.duration} 
                      onChange={(e) => updateItem(idx, "duration", e.target.value)} 
                    />
                  </div>
                  <div className="flex items-end justify-center sm:col-span-1 pb-1">
                    {items.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))} 
                        className="rounded-lg p-2 text-mist transition hover:bg-coral/10 hover:text-coral"
                        title="Remove medicine"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-3">
                  <Input 
                    placeholder="Instructions (e.g. take after food)" 
                    value={item.instructions} 
                    onChange={(e) => updateItem(idx, "instructions", e.target.value)} 
                    className="w-full text-sm bg-mist-light/30 border-dashed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3 border-t border-mist-light pt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting} className="min-w-[150px]">
            <FileText size={16} className="mr-2" /> Issue Prescription
          </Button>
        </div>
      </form>
    </Modal>
  );
}
