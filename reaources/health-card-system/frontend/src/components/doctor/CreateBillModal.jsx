import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { doctorApi } from "../../api/doctorApi";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { validateBill } from "../../utils/validation";

export default function CreateBillModal({ open, onClose, cardCredentials, onCreated }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateBill(description, amount);
    if (Object.keys(errors).length > 0) {
      if (errors.description) toast.error(errors.description);
      if (errors.amount) toast.error(errors.amount);
      return;
    }

    setSubmitting(true);
    try {
      await doctorApi.createBill({
        healthCardNumber: cardCredentials.healthCardNumber,
        healthCardId: cardCredentials.healthCardId,
        description,
        amount: Number(amount),
      });
      toast.success("Bill raised!");
      setDescription("");
      setAmount("");
      onCreated?.();
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Raise a bill" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Description" required placeholder="Consultation fee" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Amount (₹)" type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button type="submit" className="w-full" loading={submitting}>Raise bill</Button>
      </form>
    </Modal>
  );
}
