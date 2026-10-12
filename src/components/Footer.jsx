import React from 'react';
import { HeartHandshake, Heart, Sparkles, ArrowUpRight, Leaf, ShieldCheck, Users } from 'lucide-react';

export default function Footer({ onNavigate, currentUser, onOpenCreateModal }) {
  const currentYear = new Date().getFullYear();

  const handleNav = (view) => {
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHowItWorks = () => {
    if (onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const el = document.querySelector('.how-it-works-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column A: FoodShare Branding */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand" onClick={() => handleNav('home')}>
              <div className="footer-brand-icon">
                <HeartHandshake size={22} strokeWidth={2.4} />
              </div>
              <span className="footer-brand-name">FoodShare</span>
            </div>
            
            <p className="footer-tagline">
              Sharing surplus. Nourishing communities.
            </p>

            <p className="footer-description">
              Connecting restaurants, bakeries, and food establishments with verified NGOs, charities, and shelters to rescue surplus food and eliminate hunger.
            </p>

            <div className="footer-badge">
              <Leaf size={14} style={{ color: 'var(--success)' }} />
              <span>Zero-Waste Mission</span>
            </div>
          </div>

          {/* Column B: Quick Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-heading">Platform Navigation</h4>
            <ul className="footer-nav-list">
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleNav('home')}
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleNav('home')}
                >
                  <span>Browse Food Listings</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={handleHowItWorks}
                >
                  <span>How It Works</span>
                </button>
              </li>
              {currentUser?.role === 'DONOR' ? (
                <li>
                  <button
                    type="button"
                    className="footer-nav-link"
                    onClick={() => {
                      if (onOpenCreateModal) onOpenCreateModal();
                    }}
                  >
                    <span>Donate Food</span>
                    <ArrowUpRight size={14} className="link-arrow" />
                  </button>
                </li>
              ) : !currentUser ? (
                <li>
                  <button
                    type="button"
                    className="footer-nav-link"
                    onClick={() => handleNav('register')}
                  >
                    <span>Register to Donate</span>
                    <ArrowUpRight size={14} className="link-arrow" />
                  </button>
                </li>
              ) : null}
              {currentUser && (
                <li>
                  <button
                    type="button"
                    className="footer-nav-link"
                    onClick={() => handleNav('dashboard')}
                  >
                    <span>Activity Dashboard</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column C: Community & Impact */}
          <div className="footer-col footer-col-community">
            <h4 className="footer-heading">Our Community Pledge</h4>
            <p className="footer-community-text">
              "Together, we can make every meal count."
            </p>
            <p className="footer-community-subtext">
              Every listing published on FoodShare directly helps reduce landfill waste while supporting local food banks, shelters, and families in need.
            </p>
            
            <div className="footer-community-stats-chip">
              <ShieldCheck size={16} style={{ color: 'var(--primary-orange)' }} />
              <span>100% Community Powered & Verified</span>
            </div>
          </div>
        </div>

        {/* Divider & Dynamic Copyright Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {currentYear} FoodShare. All rights reserved.
          </p>
          <div className="footer-bottom-badge">
            <Heart size={13} style={{ color: 'var(--primary-orange)', fill: 'var(--primary-orange)' }} />
            <span>Nourishing communities with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
