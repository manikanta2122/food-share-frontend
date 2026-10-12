import React, { useState } from 'react';
import { UserPlus, UtensilsCrossed, Building2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin }) {
  const [role, setRole] = useState('DONOR'); // DONOR = Food Provider, NGO = Recipient Organization
  const [providerCategory, setProviderCategory] = useState('RESTAURANT');
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms of service and food sharing safety policy');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        phone: phone.trim(),
        role,
        providerCategory: role === 'DONOR' ? providerCategory : null,
        organizationName: organizationName.trim(),
        address: address.trim(),
        city: city.trim(),
        termsAccepted: true
      };

      await onRegisterSuccess(payload);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-wrapper">
      <div className="auth-card reveal-fade-in">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <UserPlus size={28} className="text-emerald" />
          </div>
          <h2 className="auth-title">Create your FoodShare account</h2>
          <p className="auth-subtitle">
            Join the verified network to donate surplus food or claim meals for your community
          </p>
        </div>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Account Type Selection */}
          <div className="form-group">
            <label className="form-label">Select Account Type *</label>
            <div className="account-type-grid">
              <div
                className={`account-type-card ${role === 'DONOR' ? 'selected' : ''}`}
                onClick={() => setRole('DONOR')}
                id="select-type-provider"
              >
                <UtensilsCrossed size={22} className="type-icon" />
                <div className="type-info">
                  <span className="type-title">Food Provider</span>
                  <span className="type-desc">Restaurant, Hotel, Hostel, Bakery, or Cafeteria</span>
                </div>
              </div>

              <div
                className={`account-type-card ${role === 'NGO' ? 'selected' : ''}`}
                onClick={() => setRole('NGO')}
                id="select-type-ngo"
              >
                <Building2 size={22} className="type-icon" />
                <div className="type-info">
                  <span className="type-title">NGO / Recipient</span>
                  <span className="type-desc">Food Bank, Shelter, Charity, or Relief Org</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional provider category */}
          {role === 'DONOR' && (
            <div className="form-group">
              <label className="form-label">Provider Business Category *</label>
              <select
                className="form-select"
                id="input-provider-category"
                value={providerCategory}
                onChange={(e) => setProviderCategory(e.target.value)}
              >
                <option value="RESTAURANT">Restaurant / Food Joint</option>
                <option value="HOTEL">Hotel or Hostel Kitchen</option>
                <option value="CAFETERIA">Corporate / Institutional Cafeteria</option>
                <option value="BAKERY">Bakery & Pastry Shop</option>
                <option value="CATERER">Event Caterer</option>
                <option value="OTHER">Other Food Provider</option>
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                id="reg-full-name"
                required
                placeholder="e.g. Anand Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {role === 'DONOR' ? 'Establishment / Organization Name *' : 'NGO / Relief Org Name *'}
              </label>
              <input
                type="text"
                className="form-input"
                id="reg-org-name"
                required
                placeholder={role === 'DONOR' ? 'e.g. Royal Spice Restaurant' : 'e.g. Hope Relief Trust'}
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Official Email Address *</label>
              <input
                type="email"
                className="form-input"
                id="reg-email"
                required
                placeholder="contact@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                id="reg-phone"
                required
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location / Pickup Address *</label>
              <input
                type="text"
                className="form-input"
                id="reg-address"
                required
                placeholder="Building, Street, Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                className="form-input"
                id="reg-city"
                required
                placeholder="e.g. Bengaluru, Hyderabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password * (min 6 chars)</label>
              <input
                type="password"
                className="form-input"
                id="reg-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-input"
                id="reg-confirm-password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-checkbox-wrapper">
            <input
              type="checkbox"
              id="reg-terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="reg-terms" className="checkbox-label">
              I agree to the FoodShare safety charter, food handling standards, and privacy terms.
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            id="btn-submit-register"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <button
            type="button"
            className="auth-link"
            id="link-to-login"
            onClick={onNavigateToLogin}
          >
            Log in here
          </button>
        </div>
      </div>
    </div>
  );
}
