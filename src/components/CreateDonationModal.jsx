import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function CreateDonationModal({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: 'VEG',
    quantity: 25,
    unit: 'meals',
    hoursUntilExpiry: 6,
    address: currentUser?.address || '',
    city: currentUser?.city || 'Bengaluru',
    contactPhone: currentUser?.phone || '',
    specialInstructions: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + Number(formData.hoursUntilExpiry));

    // Format as local ISO yyyy-MM-ddTHH:mm:ss for backend LocalDateTime parsing
    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${expiryDate.getFullYear()}-${pad(expiryDate.getMonth() + 1)}-${pad(expiryDate.getDate())}T${pad(expiryDate.getHours())}:${pad(expiryDate.getMinutes())}:${pad(expiryDate.getSeconds())}`;

    const payload = {
      title: formData.title,
      description: formData.description,
      foodType: formData.foodType,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      expiryTime: localIso,
      address: formData.address,
      city: formData.city,
      contactPhone: formData.contactPhone,
      specialInstructions: formData.specialInstructions
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FFF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-orange)' }}>
              <Sparkles size={18} />
            </div>
            <h3 className="modal-title">Donate Surplus Food</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Food Title / Item Summary *</label>
            <input
              type="text"
              id="input-donation-title"
              className="form-input"
              required
              placeholder="e.g. 40 Fresh Veg Biryani Bento Boxes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Ingredients</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe the dishes, dietary details, packaging state..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Food Category *</label>
              <select
                className="form-select"
                value={formData.foodType}
                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
              >
                <option value="VEG">Vegetarian</option>
                <option value="NON_VEG">Non-Vegetarian</option>
                <option value="BAKERY">Bakery / Bread</option>
                <option value="VEGAN">Vegan</option>
                <option value="PACKAGED">Packaged Dry Goods</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity & Unit *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  id="input-donation-quantity"
                  className="form-input"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
                <select
                  className="form-select"
                  style={{ width: '130px' }}
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="meals">meals</option>
                  <option value="kg">kg</option>
                  <option value="packets">packets</option>
                  <option value="servings">servings</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Shelf Life / Expiry Window *</label>
              <select
                className="form-select"
                value={formData.hoursUntilExpiry}
                onChange={(e) => setFormData({ ...formData, hoursUntilExpiry: e.target.value })}
              >
                <option value="2">Expires in 2 hours</option>
                <option value="4">Expires in 4 hours</option>
                <option value="6">Expires in 6 hours</option>
                <option value="12">Expires in 12 hours</option>
                <option value="24">Expires in 24 hours</option>
                <option value="48">Expires in 48 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Address *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. 124 Indiranagar 100ft Road"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 9876543210"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Instructions</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bring thermal carrier, collect from dispatch gate"
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" id="btn-submit-donation" className="btn btn-primary">
              Publish Food Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
