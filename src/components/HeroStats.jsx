import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Heart, 
  CheckCircle2, 
  Users2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Store, 
  HeartHandshake,
  ChevronRight,
  Leaf
} from 'lucide-react';

// Animated Counter hook for smooth count-up from 0 to real value
function useAnimatedCount(targetValue, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
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
      // Ease out cubic
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

export default function HeroStats({ stats, currentUser, onNavigate, onOpenCreateModal }) {
  const mealsCount = useAnimatedCount(stats?.totalMealsRescued || 0);
  const activeCount = useAnimatedCount(stats?.availableDonations || 0);
  const rescuesCount = useAnimatedCount(stats?.completedDonations || 0);
  const membersCount = useAnimatedCount(stats?.totalCommunityMembers || 0);

  const cards = [
    {
      label: 'Total Meals Rescued',
      val: stats?.totalMealsRescued !== undefined ? mealsCount.toLocaleString() : '0',
      icon: Utensils,
      color: 'var(--deep-orange)',
      bgColor: '#FFF0E3',
      subtext: 'Safe food redistributed'
    },
    {
      label: 'Active Available Food',
      val: stats?.availableDonations !== undefined ? activeCount.toLocaleString() : '0',
      icon: Heart,
      color: '#A96816',
      bgColor: '#FFF8E6',
      subtext: 'Ready for immediate pickup'
    },
    {
      label: 'Successful Rescues',
      val: stats?.completedDonations !== undefined ? rescuesCount.toLocaleString() : '0',
      icon: CheckCircle2,
      color: 'var(--primary-orange)',
      bgColor: '#FFF5EC',
      subtext: 'Completed distributions'
    },
    {
      label: 'Community Members',
      val: stats?.totalCommunityMembers !== undefined ? membersCount.toLocaleString() : '0',
      icon: Users2,
      color: '#634A38',
      bgColor: '#F7EDE2',
      subtext: 'Donors & relief orgs'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Provider Lists Surplus',
      desc: 'Restaurants, hotels, or caterers post fresh surplus meals with pickup details and expiry times.',
      icon: Store,
      badge: 'Donation'
    },
    {
      step: '02',
      title: 'NGO Claims In Seconds',
      desc: 'Verified food banks, shelters, and relief charities instantly claim available batches nearby.',
      icon: HeartHandshake,
      badge: 'Match'
    },
    {
      step: '03',
      title: 'Pickup & Verification',
      desc: 'Volunteers and drivers collect the food safely following strict hygiene handling guidelines.',
      icon: Truck,
      badge: 'Transport'
    },
    {
      step: '04',
      title: 'Delivered & Nourished',
      desc: 'Meals are served to families, shelters, and communities before edible food ever goes to waste.',
      icon: ShieldCheck,
      badge: 'Impact'
    }
  ];

  return (
    <div className="hero-section-wrapper">
      {/* Hero Banner */}
      <section className="hero-banner">
        {/* Subtle decorative background floating shapes */}
        <div className="hero-decorative-shape hero-shape-1" aria-hidden="true" />
        <div className="hero-decorative-shape hero-shape-2" aria-hidden="true" />
        <div className="hero-decorative-shape hero-shape-3" aria-hidden="true" />

        <div className="hero-text">
          <div className="hero-badge reveal-fade-in" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={14} className="sparkle-icon" />
            <span>Community-Driven Surplus Food Rescue</span>
            <Leaf size={13} style={{ color: 'var(--success)' }} />
          </div>

          <h2 className="hero-heading reveal-fade-in" style={{ animationDelay: '0.2s' }}>
            Turn Surplus Food Into <span className="highlight-gradient">Nourishing Hope</span>
          </h2>

          <p className="hero-description reveal-fade-in" style={{ animationDelay: '0.3s' }}>
            Connecting restaurants, caterers, and bakeries with local NGOs, food banks, and shelters.
            Every donation prevents food waste and feeds families in need within hours.
          </p>

          <div className="hero-cta-group reveal-fade-in" style={{ animationDelay: '0.4s' }}>
            {currentUser?.role === 'DONOR' ? (
              <button
                className="btn btn-primary btn-hero-primary"
                onClick={onOpenCreateModal}
              >
                <span>Donate Food Now</span>
                <ArrowRight size={17} className="btn-icon-shift" />
              </button>
            ) : currentUser?.role === 'NGO' ? (
              <button
                className="btn btn-primary btn-hero-primary"
                onClick={() => onNavigate('home')}
              >
                <span>Browse Available Food</span>
                <ArrowRight size={17} className="btn-icon-shift" />
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-hero-primary"
                  onClick={() => onNavigate('register')}
                >
                  <span>Join FoodShare Free</span>
                  <ArrowRight size={17} className="btn-icon-shift" />
                </button>
                <button
                  className="btn btn-secondary btn-hero-secondary"
                  onClick={() => onNavigate('login')}
                >
                  <span>Sign In</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Decorative Hero Visual Card Composition */}
        <div className="hero-visual reveal-fade-in" style={{ animationDelay: '0.35s' }}>
          <div className="floating-card-composition">
            {/* Main Center Plate Card */}
            <div className="hero-plate-card">
              <div className="plate-icon-glow">
                <Utensils size={36} className="text-orange" />
              </div>
              <div className="plate-info">
                <span className="plate-tag">Fresh Surplus Rescued</span>
                <span className="plate-title">Hot Meals Ready For Pickup</span>
                <div className="plate-badge-row">
                  <span className="mini-pill pill-green">Verified Quality</span>
                  <span className="mini-pill pill-yellow">Zero Waste</span>
                </div>
              </div>
            </div>

            {/* Floating Top Mini Pill */}
            <div className="floating-badge-chip float-chip-top">
              <HeartHandshake size={15} style={{ color: 'var(--deep-orange)' }} />
              <span>Direct NGO Distribution</span>
            </div>

            {/* Floating Bottom Mini Pill */}
            <div className="floating-badge-chip float-chip-bottom">
              <ShieldCheck size={15} style={{ color: 'var(--success)' }} />
              <span>100% Safe Handling</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Stats Grid with Interactive Cards */}
      <div className="hero-stats-grid">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div 
              key={idx} 
              className="stat-card hover-lift"
              style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
            >
              <div className="stat-card-top">
                <div className="stat-icon" style={{ background: c.bgColor, color: c.color }}>
                  <Icon size={22} className="stat-svg-icon" />
                </div>
                <span className="stat-micro-pill">{c.subtext}</span>
              </div>
              <div className="stat-number">{c.val}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-title-wrap">
          <div className="section-pill">
            <Leaf size={14} style={{ color: 'var(--success)' }} />
            <span>Seamless Lifecycle</span>
          </div>
          <h3 className="section-heading">How FoodShare Works</h3>
          <p className="section-subheading">
            From surplus commercial kitchens to community plates in four transparent steps
          </p>
        </div>

        <div className="how-it-works-grid">
          {workflowSteps.map((s, i) => {
            const StepIcon = s.icon;
            return (
              <div key={i} className="how-step-card hover-lift">
                <div className="step-header">
                  <span className="step-number">{s.step}</span>
                  <span className="step-badge">{s.badge}</span>
                </div>
                <div className="step-icon-wrap">
                  <StepIcon size={24} className="step-icon" />
                </div>
                <h4 className="step-title">{s.title}</h4>
                <p className="step-desc">{s.desc}</p>
                {i < workflowSteps.length - 1 && (
                  <div className="step-connector-arrow" aria-hidden="true">
                    <ChevronRight size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
