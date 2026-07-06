import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { validateLogin } from "../../utils/validation";

const roleHome = { PATIENT: "/patient/dashboard", DOCTOR: "/doctor/dashboard", PATHOLOGIST: "/pathologist/dashboard", ADMIN: "/admin/dashboard" };

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateLogin(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.fullName.split(" ")[0]}!`);
      navigate(roleHome[data.role] || "/");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your health card account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          error={errors.email}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
            if (errors.password) setErrors({ ...errors, password: null });
          }}
          error={errors.password}
          placeholder="••••••••"
        />
        <Button type="submit" className="w-full" loading={loading}>Log in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        New here? <Link to="/register" className="font-semibold text-vital">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
