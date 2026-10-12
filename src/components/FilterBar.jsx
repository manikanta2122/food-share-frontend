import React from 'react';
import { Search, Filter, MapPin } from 'lucide-react';

export default function FilterBar({
  city,
  setCity,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus
}) {
  const foodTypes = [
    { label: 'All Foods', val: '' },
    { label: 'Vegetarian', val: 'VEG' },
    { label: 'Non-Vegetarian', val: 'NON_VEG' },
    { label: 'Bakery', val: 'BAKERY' },
    { label: 'Vegan', val: 'VEGAN' }
  ];

  const statuses = [
    { label: 'All Statuses', val: '' },
    { label: 'Available Now', val: 'AVAILABLE' },
    { label: 'Claimed', val: 'CLAIMED' },
    { label: 'Delivered', val: 'DELIVERED' }
  ];

  return (
    <div className="controls-card">
      <div className="search-input-group">
        <MapPin size={18} style={{ color: 'var(--primary-orange)' }} />
        <input
          type="text"
          id="input-city-search"
          placeholder="Filter by City (e.g. Bengaluru, Hyderabad)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="filter-pills">
        {foodTypes.map((t) => (
          <button
            key={t.val}
            className={`pill-btn ${selectedType === t.val ? 'active' : ''}`}
            onClick={() => setSelectedType(t.val)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="filter-pills">
        {statuses.map((s) => (
          <button
            key={s.val}
            className={`pill-btn ${selectedStatus === s.val ? 'active' : ''}`}
            onClick={() => setSelectedStatus(s.val)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
