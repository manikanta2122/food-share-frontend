import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Utensils, 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import DonationCard from './DonationCard';

// Animated Counter hook for dashboard metrics
function useAnimatedCount(targetValue, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(targetValue || 0);
      return;
    }

    if (!targetValue || targetValue === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = parseInt(targetValue, 10);
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * end);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [targetValue, duration]);

  return count;
}

export default function DashboardView({
  currentUser,
  stats,
  donations,
  onOpenCreateModal,
  onStatusUpdate
}) {
  const isProvider = currentUser?.role === 'DONOR';

  // Filter donations strictly owned by this provider or claimed by this recipient
  const myDonations = isProvider
    ? donations.filter(d => d.donor?.id === currentUser?.id)
    : donations.filter(d => d.claimedBy?.id === currentUser?.id);

  // Animated counters backed strictly by real data
  const mealsCount = useAnimatedCount(stats?.totalMealsRescued || 0);
  const activeCount = useAnimatedCount(stats?.availableDonations || 0);
  const ongoingClaimsCount = useAnimatedCount(stats?.activeClaims || 0);
  const completedCount = useAnimatedCount(stats?.completedDonations || 0);

  const statCards = [
    {
      label: isProvider ? 'Meals You Saved' : 'Meals Received & Distributed',
      val: stats?.totalMealsRescued !== undefined ? mealsCount.toLocaleString() : '0',
      icon: Utensils,
      color: 'var(--deep-orange)',
      bgColor: '#FFF0E3',
      badge: 'Verified Impact'
    },
    {
      label: isProvider ? 'Your Active Listings' : 'Platform Active Meals',
      val: stats?.availableDonations !== undefined ? activeCount.toLocaleString() : '0',
      icon: Clock,
      color: '#A96816',
      bgColor: '#FFF8E6',
      badge: 'Live Status'
    },
    {
      label: isProvider ? 'Awaiting Pickup' : 'Your Ongoing Claims',
      val: stats?.activeClaims !== undefined ? ongoingClaimsCount.toLocaleString() : '0',
      icon: HeartHandshake,
      color: 'var(--primary-orange)',
      bgColor: '#FFF5EC',
      badge: 'In Progress'
    },
    {
      label: isProvider ? 'Completed Deliveries' : 'Completed Rescues',
      val: stats?.completedDonations !== undefined ? completedCount.toLocaleString() : '0',
      icon: CheckCircle2,
      color: 'var(--success)',
      bgColor: 'var(--success-bg)',
      badge: 'Delivered'
    }
  ];

  return (
    <div className="dashboard-wrapper reveal-fade-in">
      {/* Dashboard Header Banner */}
      <div className="dashboard-header-card hover-lift">
        <div className="dashboard-welcome">
          <div className="dashboard-badge-row">
            <span className="dashboard-badge">
              <Sparkles size={13} style={{ color: 'var(--primary-orange)' }} />
              <span>{isProvider ? 'FOOD PROVIDER CONSOLE' : 'NGO / RECIPIENT CONSOLE'}</span>
            </span>
            <span className="live-status-pill">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <span>Live Console</span>
            </span>
          </div>

          <h2 className="dashboard-title">
            {currentUser?.organizationName || currentUser?.fullName}
          </h2>

          <p className="dashboard-subtitle">
            <Building2 size={16} style={{ color: 'var(--primary-orange)' }} />
            <span>{currentUser?.address}, {currentUser?.city}</span>
            {currentUser?.providerCategory && (
              <span className="category-pill">{currentUser.providerCategory}</span>
            )}
          </p>
        </div>

        {isProvider && (
          <button
            className="btn btn-primary"
            id="btn-dash-donate"
            onClick={onOpenCreateModal}
          >
            <PlusCircle size={18} />
            <span>Post New Food Donation</span>
          </button>
        )}
      </div>

      {/* Scoped Dashboard Metrics */}
      <div className="hero-stats-grid" style={{ marginBottom: '2.5rem' }}>
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div 
              key={i} 
              className="stat-card hover-lift"
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            >
              <div className="stat-card-top">
                <div className="stat-icon" style={{ background: c.bgColor, color: c.color }}>
                  <Icon size={22} />
                </div>
                <span className="stat-micro-pill">{c.badge}</span>
              </div>
              <div className="stat-number">{c.val}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* List of my donations or claimed meals */}
      <div className="dashboard-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <h3 className="section-title">
            {isProvider ? 'Your Surplus Food Donations' : 'Your Claimed Food Deliveries'}
          </h3>
          <span className="section-count">{myDonations.length} records</span>
        </div>
      </div>

      {myDonations.length === 0 ? (
        <div className="empty-state-card hover-lift">
          <div className="empty-icon-circle">
            <Utensils size={32} style={{ color: 'var(--primary-orange)' }} />
          </div>
          <h4>No activity records yet</h4>
          <p>
            {isProvider
              ? "You haven't posted any surplus food yet. Click 'Post New Food Donation' above to list available meals."
              : "You haven't claimed any surplus food donations yet. Head over to 'Browse Food' to claim available meals."}
          </p>
          {isProvider && (
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem' }}
              onClick={onOpenCreateModal}
            >
              <PlusCircle size={15} />
              <span>Publish First Donation</span>
            </button>
          )}
        </div>
      ) : (
        <div className="donations-grid">
          {myDonations.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              currentUser={currentUser}
              onClaim={() => {}}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
