import React from 'react';
import { Clock, MapPin, Phone, Building2, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DonationCard({
  donation,
  currentUser,
  onClaim,
  onStatusUpdate
}) {
  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const isAvailable = donation.status === 'AVAILABLE';
  const isClaimed = donation.status === 'CLAIMED';
  const isPickedUp = donation.status === 'PICKED_UP';
  const isDelivered = donation.status === 'DELIVERED';

  return (
    <div className="donation-card hover-lift" id={`donation-card-${donation.id}`}>
      <div>
        <div className="donation-card-header">
          <span className={`food-category-tag food-${donation.foodType.toLowerCase()}`}>
            {donation.foodType}
          </span>
          <span className={`status-badge status-${donation.status.toLowerCase()}`}>
            {donation.status.replace('_', ' ')}
          </span>
        </div>

        <h3 className="donation-card-title">{donation.title}</h3>
        <p className="donation-card-desc">{donation.description || 'No additional description provided.'}</p>

        <div className="donation-metrics">
          <div className="metric-item">
            <span className="metric-label">Quantity</span>
            <span className="metric-val" style={{ color: 'var(--deep-orange)' }}>
              {donation.quantity} {donation.unit}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Expires At</span>
            <span className="metric-val" style={{ color: 'var(--text-primary)', fontSize: '0.84rem' }}>
              {formatTime(donation.expiryTime)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.15rem', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} style={{ color: 'var(--primary-orange)', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {donation.donor?.organizationName || donation.donor?.fullName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} style={{ color: 'var(--pastel-orange)', flexShrink: 0 }} />
            <span>{donation.address}, {donation.city}</span>
          </div>
          {donation.contactPhone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span>{donation.contactPhone}</span>
            </div>
          )}
        </div>

        {donation.claimedBy && (
          <div style={{ background: '#FFF6EC', border: '1px solid #F5D3B8', borderRadius: '10px', padding: '0.65rem 0.85rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--deep-orange)', fontWeight: 700 }}>Claimed by: </span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {donation.claimedBy.organizationName || donation.claimedBy.fullName}
            </span>
          </div>
        )}
      </div>

      <div className="donation-card-footer">
        {isAvailable && (
          currentUser?.role === 'DONOR' ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, padding: '0.5rem', background: 'var(--card-bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%' }}>
              <span>Available for NGO / Charity Claim</span>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              id={`btn-claim-${donation.id}`}
              onClick={() => onClaim(donation)}
            >
              <span>Claim This Food</span>
              <ArrowRight size={16} />
            </button>
          )
        )}

        {isClaimed && (
          <button
            className="btn btn-amber"
            style={{ width: '100%' }}
            id={`btn-pickup-${donation.id}`}
            onClick={() => onStatusUpdate(donation, 'PICKED_UP')}
          >
            <span>Mark as Picked Up</span>
          </button>
        )}

        {isPickedUp && (
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            id={`btn-deliver-${donation.id}`}
            onClick={() => onStatusUpdate(donation, 'DELIVERED')}
          >
            <ShieldCheck size={16} />
            <span>Confirm Delivery Complete</span>
          </button>
        )}

        {isDelivered && (
          <div style={{ textAlign: 'center', color: 'var(--success)', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', padding: '0.5rem', background: 'var(--success-bg)', borderRadius: '8px', border: '1px solid var(--success-border)' }}>
            <Check size={18} />
            <span>Delivered & Distributed</span>
          </div>
        )}
      </div>
    </div>
  );
}
