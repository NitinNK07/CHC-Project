import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import API from '../api/axios';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { toast } from '../components/ui/Toast';

export default function PatientAppointments() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchAppointments();
  }, [user.healthCardNo]);

  const fetchAppointments = async () => {
    try {
      const res = await API.get(`/chc/appointments/patient/${user.healthCardNo}`);
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await API.get(`/chc/search-doctors?q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(res.data || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, [searchQuery]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast.error('Please select a doctor, date and time.');
      return;
    }

    setBookingLoading(true);
    try {
      await API.post('/chc/appointments/book', {
        patientHealthCardNo: user.healthCardNo,
        doctorRegiNo: Number(selectedDoctor.doctorRegiNo),
        appointmentDate,
        appointmentTime,
        reason
      });
      toast.success('Appointment requested successfully! The doctor will review it shortly.');
      // Reset form
      setSearchQuery('');
      setSelectedDoctor(null);
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');
      fetchAppointments();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to book appointment.';
      toast.error(typeof msg === 'string' ? msg : 'Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
        
        <div className="page-header">
          <div>
            <h1>Book an Appointment</h1>
            <p className="text-secondary">Search for a doctor and request a slot</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', padding: '0 24px' }}>
          
          {/* Booking Form */}
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Request New Appointment</h3>
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              
              <div style={{ position: 'relative' }}>
                <label className="form-label">Search Doctor (Name/Reg No)</label>
                <input className="form-input" placeholder="Type doctor name..."
                  value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSelectedDoctor(null); }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} />
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)', marginTop: '4px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.4)', maxHeight: '240px', overflowY: 'auto' }}>
                      {suggestions.map((s, i) => (
                        <div key={i} onClick={() => { setSelectedDoctor(s); setSearchQuery(s.firstName + ' ' + s.lastName); setShowSuggestions(false); }}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                            borderBottom: i < suggestions.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ fontWeight: 600 }}>Dr. {s.firstName} {s.lastName}</span>
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>{s.specialization} | Reg: {s.doctorRegiNo}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedDoctor && (
                <div style={{ padding: '8px 12px', background: '#10b98110', border: '1px solid #10b98130', borderRadius: 'var(--radius-sm)', color: '#10b981', fontSize: '0.85rem' }}>
                  ✅ Selected: Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} ({selectedDoctor.specialization})
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" required
                  value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input type="time" className="form-input" required
                  value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input type="text" className="form-input" placeholder="e.g. Fever and headache"
                  value={reason} onChange={e => setReason(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={bookingLoading || !selectedDoctor}>
                {bookingLoading ? 'Requesting...' : 'Request Appointment'}
              </button>
            </form>
          </motion.div>

          {/* Appointments List */}
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3>My Appointments</h3>
            {loading ? <p>Loading...</p> : (
              appointments.length > 0 ? (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {appointments.map(app => (
                    <div key={app.id} style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0' }}>{app.doctorName}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          📅 {app.appointmentDate} at ⏰ {app.appointmentTime}
                        </p>
                        {app.reason && <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Reason: {app.reason}</p>}
                      </div>
                      <div>
                        <span style={{
                          padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                          background: app.status === 'ACCEPTED' ? '#10b98120' : app.status === 'RESCHEDULED' ? '#f59e0b20' : '#3b82f620',
                          color: app.status === 'ACCEPTED' ? '#10b981' : app.status === 'RESCHEDULED' ? '#f59e0b' : '#3b82f6'
                        }}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
                  <p>No appointments requested yet.</p>
                </div>
              )
            )}
          </motion.div>

        </div>
      </div>
      </div>
    </div>
  );
}
