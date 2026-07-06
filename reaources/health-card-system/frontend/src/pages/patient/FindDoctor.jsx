import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import EmptyState from "../../components/ui/EmptyState";
import { patientApi } from "../../api/patientApi";
import { patientNavItems } from "./patientNav";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { Stethoscope, ShieldCheck, CalendarPlus } from "lucide-react";

export default function FindDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [authorized, setAuthorized] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [form, setForm] = useState({ appointmentTime: "", reasonForVisit: "" });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const load = () => {
    Promise.all([patientApi.browseDoctors(), patientApi.getAuthorizedDoctors()])
      .then(([d, a]) => {
        setDoctors(d.data);
        setAuthorized(a.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const isAuthorized = (doctorId) => authorized.some((a) => a.doctorId === doctorId);

  const handleAuthorize = async (doctorId) => {
    try {
      await patientApi.authorizeDoctor({ doctorId });
      toast.success("Doctor authorized for standing access.");
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleRevoke = async (doctorId) => {
    try {
      await patientApi.revokeDoctor(doctorId);
      toast.success("Access revoked.");
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await patientApi.bookAppointment({ doctorId: bookingDoctor.doctorId, ...form });
      toast.success("Appointment requested!");
      setBookingDoctor(null);
      setForm({ appointmentTime: "", reasonForVisit: "" });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={patientNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Find a Doctor</h1>
      <p className="mb-6 text-sm text-ink/60">Book appointments with verified doctors, or grant standing record access.</p>

      {loading ? (
        <Loader />
      ) : doctors.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No verified doctors yet" subtitle="Check back once doctors on the platform are verified by an admin." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <Card key={d.doctorId}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-vital-light text-vital-dark">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <p className="font-display font-semibold text-ink">Dr. {d.fullName}</p>
                  <p className="text-xs text-mist">{d.specialization}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-vital-dark">
                <ShieldCheck size={13} /> Verified · {d.experienceYears ?? 0} yrs exp.
              </div>
              {d.hospitalName && <p className="mt-1 text-xs text-mist">{d.hospitalName}</p>}

              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => setBookingDoctor(d)}>
                  <CalendarPlus size={15} /> Book
                </Button>
                {isAuthorized(d.doctorId) ? (
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRevoke(d.doctorId)}>
                    Revoke access
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleAuthorize(d.doctorId)}>
                    Authorize
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!bookingDoctor} onClose={() => setBookingDoctor(null)} title={`Book with Dr. ${bookingDoctor?.fullName}`}>
        <form onSubmit={handleBook} className="space-y-4">
          <Input
            label="Preferred date & time"
            type="datetime-local"
            required
            value={form.appointmentTime}
            onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
          />
          <Textarea
            label="Reason for visit"
            required
            rows={3}
            value={form.reasonForVisit}
            onChange={(e) => setForm({ ...form, reasonForVisit: e.target.value })}
          />
          <Button type="submit" className="w-full" loading={submitting}>Request appointment</Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
