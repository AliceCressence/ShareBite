import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface DonationFormData {
  food_item: string;
  description: string;
  quantity: string;
  pickup_location_lat: number;
  pickup_location_lon: number;
  preferred_pickup_time: string;
  expiration_date: string;
  allergens: string;
  is_perishable: boolean;
}

export default function DonationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<DonationFormData>({
    food_item: '',
    description: '',
    quantity: '',
    pickup_location_lat: 0,
    pickup_location_lon: 0,
    preferred_pickup_time: '',
    expiration_date: '',
    allergens: '',
    is_perishable: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            pickup_location_lat: position.coords.latitude,
            pickup_location_lon: position.coords.longitude,
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          // Convert allergens string to array if provided
          allergens: formData.allergens ? formData.allergens.split(',').map(s => s.trim()).filter(s => s) : null,
          // Convert empty strings to null for optional datetime fields
          expiration_date: formData.expiration_date || null,
          preferred_pickup_time: formData.preferred_pickup_time || null,
          // Convert empty description to null
          description: formData.description || null,
        }),
      });

      if (response.ok) {
        router.push('/dashboard?success=donation-created');
      } else {
        const errorData = await response.json();
        let errorMessage = 'Failed to create donation';

        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((err: any) =>
            typeof err === 'string' ? err : err.msg || 'Validation error'
          ).join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        setError(errorMessage);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Food
            </h1>
            <p className="text-gray-600">
              Help reduce food waste by sharing surplus food with your community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Food Item */}
            <div>
              <label htmlFor="food_item" className="block text-sm font-medium text-gray-700 mb-2">
                Food Item *
              </label>
              <input
                type="text"
                id="food_item"
                name="food_item"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Fresh vegetables, Baked goods, Prepared meals"
                value={formData.food_item}
                onChange={handleInputChange}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe the food item, cooking method, ingredients, etc."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 2 servings, 1 large bag, 500g"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pickup_location_lat" className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  id="pickup_location_lat"
                  name="pickup_location_lat"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.pickup_location_lat}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="pickup_location_lon" className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  id="pickup_location_lon"
                  name="pickup_location_lon"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.pickup_location_lon}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                📍 Use Current Location
              </button>
            </div>

            {/* Pickup Time */}
            <div>
              <label htmlFor="preferred_pickup_time" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Pickup Time
              </label>
              <input
                type="text"
                id="preferred_pickup_time"
                name="preferred_pickup_time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Weekdays after 6 PM, Weekends anytime"
                value={formData.preferred_pickup_time}
                onChange={handleInputChange}
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="datetime-local"
                id="expiration_date"
                name="expiration_date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.expiration_date}
                onChange={handleInputChange}
              />
            </div>

            {/* Allergens */}
            <div>
              <label htmlFor="allergens" className="block text-sm font-medium text-gray-700 mb-2">
                Allergens
              </label>
              <input
                type="text"
                id="allergens"
                name="allergens"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Nuts, Dairy, Gluten (comma-separated)"
                value={formData.allergens}
                onChange={handleInputChange}
              />
            </div>

            {/* Perishable checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_perishable"
                name="is_perishable"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked={formData.is_perishable}
                onChange={handleInputChange}
              />
              <label htmlFor="is_perishable" className="ml-2 block text-sm text-gray-700">
                This is a perishable item
              </label>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Donation...' : 'Share Food'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
