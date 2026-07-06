import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import EmptyState from "../../components/ui/EmptyState";
import { patientApi } from "../../api/patientApi";
import { patientNavItems } from "./patientNav";
import { formatDateTime, formatCurrency, statusColors } from "../../utils/format";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { Receipt } from "lucide-react";

export default function MyBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBill, setPayingBill] = useState(null);
  const [method, setMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const load = () => {
    patientApi.getMyBills().then((res) => setBills(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handlePay = async () => {
    setSubmitting(true);
    try {
      await patientApi.payBill({ billId: payingBill.id, paymentMethod: method });
      toast.success("Payment successful!");
      setPayingBill(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={patientNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Bills & Payments</h1>
      <p className="mb-6 text-sm text-ink/60">Bills raised by your doctors and labs.</p>

      {loading ? (
        <Loader />
      ) : bills.length === 0 ? (
        <EmptyState icon={Receipt} title="No bills yet" />
      ) : (
        <div className="space-y-3">
          {bills.map((b) => (
            <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display font-semibold text-ink">{b.description}</p>
                <p className="text-xs text-mist">{b.raisedBy} · {formatDateTime(b.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display text-lg font-bold text-ink">{formatCurrency(b.amount)}</p>
                <Badge color={statusColors[b.status]}>{b.status}</Badge>
                {b.status === "PENDING" && (
                  <Button size="sm" onClick={() => setPayingBill(b)}>Pay now</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!payingBill} onClose={() => setPayingBill(null)} title="Complete payment" maxWidth="max-w-sm">
        <div className="mb-4 rounded-xl bg-mist-light p-4 text-center">
          <p className="text-xs text-mist">Amount payable</p>
          <p className="font-display text-2xl font-bold text-ink">{formatCurrency(payingBill?.amount)}</p>
          <p className="mt-1 text-xs text-ink/70">To: <strong>{payingBill?.raisedBy}</strong></p>
        </div>
        <Select label="Payment method" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="UPI">UPI / PhonePe / GPay</option>
          <option value="CARD">Card</option>
          <option value="NET_BANKING">Net Banking</option>
          <option value="WALLET">Wallet</option>
          <option value="CASH">Cash</option>
        </Select>

        {method === "UPI" && payingBill?.payeeUpiId && (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-vital p-4 bg-vital-light/30">
            <div className="mb-2 h-32 w-32 bg-white flex items-center justify-center shadow-sm">
              <span className="text-xs text-mist">[ QR Code ]</span>
            </div>
            <p className="text-sm font-semibold text-ink">Scan to pay</p>
            <p className="text-xs text-ink/70 mt-1">UPI ID: <span className="font-mono bg-white px-1 py-0.5 rounded border border-mist-light">{payingBill.payeeUpiId}</span></p>
          </div>
        )}

        {method === "UPI" && !payingBill?.payeeUpiId && (
          <div className="mt-4 rounded-xl border border-dashed border-coral p-3 bg-coral-light/30 text-center">
            <p className="text-xs text-coral-dark">This provider has not set up a UPI ID. Payment will be routed to the hospital's general account.</p>
          </div>
        )}

        <Button className="mt-4 w-full bg-gold text-ink hover:bg-gold-light border-none shadow-glow-gold" loading={submitting} onClick={handlePay}>
          Simulate Payment Success
        </Button>
        <p className="mt-2 text-center text-[10px] text-mist uppercase tracking-wide">Test Environment</p>
      </Modal>
    </DashboardLayout>
  );
}
