import React, { useState } from 'react';
import { X, HeartHandshake } from 'lucide-react';

export default function ClaimModal({
  isOpen,
  onClose,
  donation,
  currentUser,
  onSubmit
}) {
  const [note, setNote] = useState('');
  const [estimatedPeopleFed, setEstimatedPeopleFed] = useState(donation?.quantity || 25);
  const [contactPerson, setContactPerson] = useState(currentUser?.fullName || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');

  if (!isOpen || !donation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(donation.id, {
      note,
      estimatedPeopleFed: Number(estimatedPeopleFed),
      contactPerson,
      contactPhone
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FFF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-orange)' }}>
              <HeartHandshake size={20} />
            </div>
            <h3 className="modal-title">Claim Food Donation</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: '#FFF6EC', border: '1px solid #F5D3B8', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {donation.title}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
            {donation.quantity} {donation.unit} • Donor: <strong style={{ color: 'var(--deep-orange)' }}>{donation.donor?.organizationName || donation.donor?.fullName}</strong> ({donation.city})
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Beneficiary / Distribution Plan</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Dispatched shelter van to pick up and distribute at community center..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estimated People Fed</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={estimatedPeopleFed}
                onChange={(e) => setEstimatedPeopleFed(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Person Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Coordinator Phone *</label>
            <input
              type="text"
              className="form-input"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" id="btn-confirm-claim" className="btn btn-primary">
              Confirm Food Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
