const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api';

function getAuthHeader() {
  const token = localStorage.getItem('foodshare_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Authentication Endpoints
export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/v1/auth/me`, {
    headers: {
      ...getAuthHeader()
    }
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function logoutUser() {
  try {
    await fetch(`${API_BASE}/v1/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
  } catch (err) {
    console.error('Logout error', err);
  } finally {
    localStorage.removeItem('foodshare_token');
  }
}

// Dashboard Statistics (Public or Role-scoped based on auth)
export async function fetchStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`, {
    headers: {
      ...getAuthHeader()
    }
  });
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}

// Food Donations
export async function fetchDonations(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.city) params.append('city', filters.city);
  if (filters.foodType) params.append('foodType', filters.foodType);

  const url = `${API_BASE}/donations${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url, {
    headers: {
      ...getAuthHeader()
    }
  });
  if (!res.ok) throw new Error('Failed to fetch food donations');
  return res.json();
}

export async function createDonation(donationData) {
  const res = await fetch(`${API_BASE}/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(donationData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create donation');
  }
  return data;
}

export async function claimDonation(id, claimData) {
  const res = await fetch(`${API_BASE}/donations/${id}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(claimData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to claim donation');
  }
  return data;
}

export async function updateDonationStatus(id, statusData) {
  const res = await fetch(`${API_BASE}/donations/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(statusData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update donation status');
  }
  return data;
}
