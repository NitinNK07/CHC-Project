import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { ShieldAlert } from "lucide-react";
import { validatePathologist } from "../../utils/validation";

export default function RegisterPathologist() {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", phone: "", labLicenseNumber: "", labName: "", labAddress: "", upiId: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { registerPathologist } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePathologist(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    
    setLoading(true);
    try {
      await registerPathologist(form);
      toast.success("Account created — pending verification.");
      navigate("/pathologist/dashboard");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Register as a Pathologist" subtitle="An admin will verify your lab license before requests appear in your queue" wide>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full name" required value={form.fullName} onChange={update("fullName")} error={errors.fullName} />
        <Input label="Email" type="email" required value={form.email} onChange={update("email")} error={errors.email} />
        <Input label="Password" type="password" required minLength={8} value={form.password} onChange={update("password")} error={errors.password} />
        <Input label="Phone" required value={form.phone} onChange={update("phone")} error={errors.phone} />
        <Input label="Lab license number" required value={form.labLicenseNumber} onChange={update("labLicenseNumber")} error={errors.labLicenseNumber} />
        <Input label="Lab name" value={form.labName} onChange={update("labName")} />
        <Input label="Lab address" className="sm:col-span-2" value={form.labAddress} onChange={update("labAddress")} />
        <Input label="UPI ID (for payments)" className="sm:col-span-2" value={form.upiId} onChange={update("upiId")} placeholder="e.g. lab@okhdfcbank" />

        <div className="sm:col-span-2 flex items-start gap-2 rounded-xl bg-gold/10 p-3 text-xs text-ink/70">
          <ShieldAlert size={28} className="text-gold shrink-0" />
          Your account needs admin verification before lab test requests appear in your queue.
        </div>

        <Button type="submit" className="sm:col-span-2 mt-1" loading={loading}>Submit for verification</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already registered? <Link to="/login" className="font-semibold text-vital">Log in</Link>
      </p>
    </AuthLayout>
  );
}
