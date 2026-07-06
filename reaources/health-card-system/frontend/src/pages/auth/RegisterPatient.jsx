import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { validatePatient } from "../../utils/validation";

export default function RegisterPatient() {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", phone: "", dateOfBirth: "", gender: "",
    bloodGroup: "", address: "", emergencyContactName: "", emergencyContactPhone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { registerPatient } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePatient(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    
    setLoading(true);
    try {
      await registerPatient(form);
      toast.success("Your health card has been issued!");
      navigate("/patient/dashboard");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your patient account" subtitle="We'll issue your health card the moment you sign up" wide>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full name" required value={form.fullName} onChange={update("fullName")} error={errors.fullName} />
        <Input label="Email" type="email" required value={form.email} onChange={update("email")} error={errors.email} />
        <Input label="Password" type="password" required minLength={8} value={form.password} onChange={update("password")} error={errors.password} />
        <Input label="Phone" required value={form.phone} onChange={update("phone")} error={errors.phone} />
        <Input label="Date of birth" type="date" required value={form.dateOfBirth} onChange={update("dateOfBirth")} error={errors.dateOfBirth} />
        <Select label="Gender" required value={form.gender} onChange={update("gender")} error={errors.gender}>
          <option value="">Select</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </Select>
        <Select label="Blood group" value={form.bloodGroup} onChange={update("bloodGroup")}>
          <option value="">Select (optional)</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </Select>
        <Input label="Address" className="sm:col-span-2" value={form.address} onChange={update("address")} />
        <Input label="Emergency contact name" value={form.emergencyContactName} onChange={update("emergencyContactName")} />
        <Input label="Emergency contact phone" value={form.emergencyContactPhone} onChange={update("emergencyContactPhone")} />

        <Button type="submit" className="sm:col-span-2 mt-1" loading={loading}>Create my health card</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already registered? <Link to="/login" className="font-semibold text-vital">Log in</Link>
      </p>
    </AuthLayout>
  );
}
