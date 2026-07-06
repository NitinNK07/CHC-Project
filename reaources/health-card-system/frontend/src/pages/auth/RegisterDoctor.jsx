import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { ShieldAlert } from "lucide-react";
import { validateDoctor } from "../../utils/validation";

export default function RegisterDoctor() {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", phone: "", medicalLicenseNumber: "",
    specialization: "", hospitalName: "", experienceYears: "", qualifications: "", upiId: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { registerDoctor } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateDoctor(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    
    setLoading(true);
    try {
      await registerDoctor({ ...form, experienceYears: form.experienceYears ? Number(form.experienceYears) : null });
      toast.success("Account created — pending verification.");
      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Register as a Doctor" subtitle="An admin will verify your medical license before you can access patient records" wide>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full name" required value={form.fullName} onChange={update("fullName")} error={errors.fullName} />
        <Input label="Email" type="email" required value={form.email} onChange={update("email")} error={errors.email} />
        <Input label="Password" type="password" required minLength={8} value={form.password} onChange={update("password")} error={errors.password} />
        <Input label="Phone" required value={form.phone} onChange={update("phone")} error={errors.phone} />
        <Input label="Medical license number" required value={form.medicalLicenseNumber} onChange={update("medicalLicenseNumber")} error={errors.medicalLicenseNumber} />
        <Input label="Specialization" required value={form.specialization} onChange={update("specialization")} error={errors.specialization} />
        <Input label="Hospital / Clinic name" value={form.hospitalName} onChange={update("hospitalName")} />
        <Input label="Years of experience" type="number" min={0} value={form.experienceYears} onChange={update("experienceYears")} error={errors.experienceYears} />
        <Input label="UPI ID (for payments)" value={form.upiId} onChange={update("upiId")} placeholder="e.g. doctor@okhdfcbank" />
        <Textarea label="Qualifications" className="sm:col-span-2" rows={2} value={form.qualifications} onChange={update("qualifications")} />

        <div className="sm:col-span-2 flex items-start gap-2 rounded-xl bg-gold/10 p-3 text-xs text-ink/70">
          <ShieldAlert size={28} className="text-gold shrink-0" />
          You won't be able to look up patients by health card until an administrator verifies your license number.
        </div>

        <Button type="submit" className="sm:col-span-2 mt-1" loading={loading}>Submit for verification</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already registered? <Link to="/login" className="font-semibold text-vital">Log in</Link>
      </p>
    </AuthLayout>
  );
}
