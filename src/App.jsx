import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroStats from './components/HeroStats';
import FilterBar from './components/FilterBar';
import DonationCard from './components/DonationCard';
import CreateDonationModal from './components/CreateDonationModal';
import ClaimModal from './components/ClaimModal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardView from './components/DashboardView';
import Footer from './components/Footer';
import {
  fetchStats,
  fetchDonations,
  createDonation,
  claimDonation,
  updateDonationStatus,
  registerUser,
  loginUser,
  fetchCurrentUser,
  logoutUser
} from './services/api';
import { RefreshCw, CheckCircle2, AlertCircle, PlusCircle, LogIn } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'login', 'register', 'dashboard'
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters
  const [city, setCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [claimingDonation, setClaimingDonation] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Restore authenticated session on page load
  useEffect(() => {
    const token = localStorage.getItem('foodshare_token');
    if (token) {
      fetchCurrentUser()
        .then((res) => {
          setCurrentUser(res);
        })
        .catch(() => {
          localStorage.removeItem('foodshare_token');
          setCurrentUser(null);
        });
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, donationsData] = await Promise.all([
        fetchStats().catch(() => null),
        fetchDonations({ city, foodType: selectedType, status: selectedStatus }).catch(() => [])
      ]);

      if (statsData) {
        setStats(statsData);
        setBackendConnected(true);
      }
      setDonations(donationsData);
    } catch (err) {
      console.error(err);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [city, selectedType, selectedStatus, currentUser]);

  // Auth Handlers
  const handleRegisterSuccess = async (payload) => {
    await registerUser(payload);
    showToast('Account created successfully! Please log in with your credentials.');
    setCurrentView('login');
  };

  const handleLoginSuccess = async (credentials) => {
    const res = await loginUser(credentials);
    localStorage.setItem('foodshare_token', res.token);
    setCurrentUser(res);
    showToast(`Welcome back, ${res.fullName}!`);
    setCurrentView(res.role === 'DONOR' ? 'dashboard' : 'home');
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentView('home');
    showToast('You have been logged out.');
  };

  // Business Action Handlers
  const handleCreateDonation = async (payload) => {
    if (!currentUser) {
      showToast('Please log in as a food provider to donate food.', 'error');
      setCurrentView('login');
      return;
    }
    try {
      await createDonation(payload);
      showToast('Surplus food donation published successfully!');
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to create donation', 'error');
    }
  };

  const handleClaimDonation = async (donationId, claimData) => {
    if (!currentUser) {
      showToast('Please log in as an NGO or recipient to claim meals.', 'error');
      setCurrentView('login');
      return;
    }
    try {
      await claimDonation(donationId, claimData);
      showToast('Food donation claimed successfully!');
      setClaimingDonation(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to claim food', 'error');
    }
  };

  const handleStatusUpdate = async (donation, newStatus) => {
    if (!currentUser) {
      showToast('Please log in to manage food status.', 'error');
      setCurrentView('login');
      return;
    }
    try {
      await updateDonationStatus(donation.id, { status: newStatus });
      showToast(`Status updated to ${newStatus.replace('_', ' ')}!`);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        currentView={currentView}
        backendConnected={backendConnected}
      />

      {/* VIEW: LOGIN */}
      {currentView === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setCurrentView('register')}
        />
      )}

      {/* VIEW: REGISTER */}
      {currentView === 'register' && (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}

      {/* VIEW: DASHBOARD */}
      {currentView === 'dashboard' && currentUser && (
        <DashboardView
          currentUser={currentUser}
          stats={stats}
          donations={donations}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* VIEW: HOME / BROWSE FOOD */}
      {currentView === 'home' && (
        <>
          <HeroStats
            stats={stats}
            currentUser={currentUser}
            onNavigate={setCurrentView}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>Surplus Food Listings</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Real-time surplus food available from verified restaurants, hotels, and bakeries
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={loadData}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>

              {currentUser?.role === 'DONOR' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <PlusCircle size={15} />
                  <span>Donate Food</span>
                </button>
              )}
            </div>
          </div>

          <FilterBar
            city={city}
            setCity={setCity}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {donations.length === 0 ? (
            <div className="empty-state-card" style={{ padding: '4rem 2rem' }}>
              <h4>No Surplus Food Listings Right Now</h4>
              <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                {currentUser?.role === 'DONOR'
                  ? "You have not published any food donations yet. Click 'Donate Food' above to post your surplus meals."
                  : "No listings matched your criteria. Registered food providers can publish meals directly to the community."}
              </p>
              {!currentUser && (
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentView('register')}
                >
                  Register as Food Provider to Donate
                </button>
              )}
            </div>
          ) : (
            <div className="donations-grid">
              {donations.map((d) => (
                <DonationCard
                  key={d.id}
                  donation={d}
                  currentUser={currentUser}
                  onClaim={(item) => {
                    if (!currentUser) {
                      showToast('Please log in as an NGO / recipient to claim meals.', 'error');
                      setCurrentView('login');
                    } else if (currentUser.role !== 'NGO' && currentUser.role !== 'ADMIN') {
                      showToast('Only registered NGOs or relief organizations can claim donations.', 'error');
                    } else {
                      setClaimingDonation(item);
                    }
                  }}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDonation}
        currentUser={currentUser}
      />

      <ClaimModal
        isOpen={!!claimingDonation}
        onClose={() => setClaimingDonation(null)}
        donation={claimingDonation}
        currentUser={currentUser}
        onSubmit={handleClaimDonation}
      />

      {/* Footer */}
      <Footer
        onNavigate={setCurrentView}
        currentUser={currentUser}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div
            className="toast"
            style={{
              borderColor: toast.type === 'error' ? '#f43f5e' : '#10b981',
              borderLeftColor: toast.type === 'error' ? '#f43f5e' : '#10b981'
            }}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={18} style={{ color: '#f43f5e' }} />
            ) : (
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
