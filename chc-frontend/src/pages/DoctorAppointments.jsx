import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import API from '../api/axios';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

export default function DoctorAppointments() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reschedule Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [user.healthCardNo]); // Actually we need doctorRegNo, wait!

  const fetchAppointments = async () => {
    try {
      // Fetch doctor registration number using their username
      const profileRes = await API.get(`/user/getDoctorRegNo?userName=${user.userName}`);
      const docRegNo = profileRes.data;
      
      const res = await API.get(`/chc/appointments/doctor/${docRegNo}`);
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, date = null, time = null) => {
    try {
      await API.put(`/chc/appointments/${id}/status`, {
        status,
        appointmentDate: date,
        appointmentTime: time
      });
      fetchAppointments();
      setShowModal(false);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const openReschedule = (app) => {
    setSelectedAppId(app.id);
    setNewDate(app.appointmentDate);
    setNewTime(app.appointmentTime);
    setShowModal(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
        <div className="page-header">
          <div>
            <h1>Manage Appointments</h1>
            <p className="text-secondary">Review and accept or reschedule patient requests</p>
          </div>
        </div>

        <div style={{ padding: '0 24px' }}>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {loading ? <p>Loading...</p> : (
              appointments.length > 0 ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {appointments.map(app => (
                    <div key={app.id} style={{ padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 8px 0' }}>{app.patientName} <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>({app.patientHealthCardNo})</span></h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                          📅 {app.appointmentDate} at ⏰ {app.appointmentTime}
                        </p>
                        {app.reason && <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}><strong>Reason:</strong> {app.reason}</p>}
                        
                        <div style={{ marginTop: '12px' }}>
                          <span style={{
                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                            background: app.status === 'ACCEPTED' ? '#10b98120' : app.status === 'RESCHEDULED' ? '#f59e0b20' : '#3b82f620',
                            color: app.status === 'ACCEPTED' ? '#10b981' : app.status === 'RESCHEDULED' ? '#f59e0b' : '#3b82f6'
                          }}>
                            STATUS: {app.status}
                          </span>
                        </div>
                      </div>
                      
                      {app.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')} className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>
                            Accept
                          </button>
                          <button onClick={() => openReschedule(app)} className="btn btn-outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                            Reschedule
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>☕</div>
                  <h2>No Appointments</h2>
                  <p>You don't have any pending appointment requests.</p>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-lg)', width: '400px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ marginTop: 0 }}>Reschedule Appointment</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select a new date and time for this appointment. This decision is final.</p>
            
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">New Date</label>
              <input type="date" className="form-input" value={newDate} onChange={e => setNewDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">New Time</label>
              <input type="time" className="form-input" value={newTime} onChange={e => setNewTime(e.target.value)} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => handleStatusUpdate(selectedAppId, 'RESCHEDULED', newDate, newTime)} className="btn btn-primary" style={{ flex: 1, background: '#f59e0b', borderColor: '#f59e0b' }}>
                Confirm Reschedule
              </button>
              <button onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
