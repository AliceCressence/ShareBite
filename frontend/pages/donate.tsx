import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  MapPin,
  Clock,
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

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

interface UserInfo {
  id: number;
  email: string;
  created_at: string;
}

export default function DonatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout, isLoading: authLoading } = useAuth();
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Share Your Food 🍽️
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help reduce food waste by sharing surplus food with your community. Every meal shared makes a difference!
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Food Details Section */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Food Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="food_item" className="block text-sm font-medium text-gray-700 mb-2">
                    Food Item *
                  </label>
                  <input
                    type="text"
                    id="food_item"
                    name="food_item"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Fresh vegetables, Baked goods, Prepared meals"
                    value={formData.food_item}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe the food item, cooking method, ingredients, etc."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 2 servings, 1 large bag, 500g"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="allergens" className="block text-sm font-medium text-gray-700 mb-2">
                    Allergens
                  </label>
                  <input
                    type="text"
                    id="allergens"
                    name="allergens"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Nuts, Dairy, Gluten (comma-separated)"
                    value={formData.allergens}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_perishable"
                      name="is_perishable"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      checked={formData.is_perishable}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="is_perishable" className="ml-3 flex items-center text-sm text-gray-700">
                      <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
                      This is a perishable item (requires quick pickup)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Timing Section */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Location & Pickup</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.0000"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.0000"
                    value={formData.pickup_location_lon}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current Location
                  </button>
                </div>

                <div>
                  <label htmlFor="preferred_pickup_time" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pickup Time
                  </label>
                  <input
                    type="text"
                    id="preferred_pickup_time"
                    name="preferred_pickup_time"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Weekdays after 6 PM, Weekends anytime"
                    value={formData.preferred_pickup_time}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Best Before
                  </label>
                  <input
                    type="datetime-local"
                    id="expiration_date"
                    name="expiration_date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.expiration_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Safety Tips</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Only share food that you would eat yourself</li>
                    <li>• Include clear allergen information to keep everyone safe</li>
                    <li>• Be responsive to pickup requests and communicate clearly</li>
                    <li>• Trust your judgment - if something doesn't feel right, it's okay to decline</li>
                  </ul>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Donation...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Share Food with Community
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
