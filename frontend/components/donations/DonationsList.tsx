import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { MapPin, Clock, Calendar, AlertTriangle, Users, Filter, Search, Heart, Star, Truck } from 'lucide-react';

interface Donation {
  id: number;
  food_item: string;
  description: string;
  quantity: string;
  pickup_location_lat: number;
  pickup_location_lon: number;
  preferred_pickup_time: string;
  expiration_date: string;
  allergens: string;
  is_perishable: boolean;
  status: string;
  created_at: string;
}

export default function DonationsList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [claimingIds, setClaimingIds] = useState<Set<number>>(new Set());
  const router = useRouter();

  const fetchDonations = useCallback(async () => {
    try {
      const response = await fetch('/api/donations', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load donations');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `${diffDays} days`;
    return date.toLocaleDateString();
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      available: {
        gradient: 'from-emerald-400 via-green-500 to-emerald-600',
        bg: 'bg-emerald-50 border-emerald-200',
        text: 'text-emerald-700',
        icon: '✨',
        label: 'Available',
        glow: 'shadow-emerald-200'
      },
      claimed: {
        gradient: 'from-amber-400 via-orange-500 to-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        text: 'text-amber-700',
        icon: '⏳',
        label: 'Claimed',
        glow: 'shadow-amber-200'
      },
      picked_up: {
        gradient: 'from-gray-400 via-slate-500 to-gray-600',
        bg: 'bg-gray-50 border-gray-200',
        text: 'text-gray-700',
        icon: '✓',
        label: 'Complete',
        glow: 'shadow-gray-200'
      }
    };
    return configs[status] || configs.available;
  };

  const getUrgencyLevel = (expiration: string, isPerishable: boolean) => {
    if (!expiration) return 'low';
    const days = Math.ceil((new Date(expiration).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (isPerishable && days <= 1) return 'critical';
    if (isPerishable && days <= 3) return 'high';
    if (days <= 7) return 'medium';
    return 'low';
  };

  const getUrgencyStyle = (level: string) => {
    const styles = {
      critical: 'animate-pulse bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white shadow-lg shadow-red-300',
      high: 'bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 text-white shadow-lg shadow-orange-300',
      medium: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 text-white shadow-lg shadow-yellow-300',
      low: 'bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 text-white shadow-lg shadow-blue-300'
    };
    return styles[level] || styles.low;
  };

  const handleClaim = async (id: number) => {
    setClaimingIds(prev => new Set(prev).add(id));
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/donations/${id}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setDonations(prev =>
          prev.map(d => d.id === id ? { ...d, status: 'claimed' } : d)
        );
      } else {
        setError('Failed to claim donation');
      }
    } catch {
      setError('Network error while claiming donation');
    } finally {
      setClaimingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.food_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || donation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-border"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-ping"></div>
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Loading donations...
            </h3>
            <p className="text-gray-600">Finding fresh food near you</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Fresh Food, Shared Love
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Discover amazing food donations from your community and help reduce waste while feeding families
            </p>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for food items..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="claimed">Claimed</option>
                    <option value="picked_up">Complete</option>
                  </select>
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {viewMode === 'grid' ? 'List' : 'Grid'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-6 shadow-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <div className="text-red-700 font-medium">{error}</div>
            </div>
          </div>
        )}

        {filteredDonations.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="text-8xl mb-6 animate-bounce">🍽️</div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-20 rounded-full blur-2xl"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
              {searchTerm || filterStatus !== 'all' ? 'No matching donations found' : 'No donations available'}
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to share food with your community!'
              }
            </p>
            <button
              onClick={() => router.push('/donate')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <Heart className="w-5 h-5 mr-2" />
              Share Food
            </button>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'grid-cols-1 gap-6'}`}>
            {filteredDonations.map((donation) => {
              const statusConfig = getStatusConfig(donation.status);
              const urgencyLevel = getUrgencyLevel(donation.expiration_date, donation.is_perishable);
              const isClaiming = claimingIds.has(donation.id);

              return (
                <div
                  key={donation.id}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-100 ${statusConfig.glow}`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${statusConfig.bg} ${statusConfig.text}`}>
                      <span className="mr-1">{statusConfig.icon}</span>
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Urgency Indicator */}
                  {donation.is_perishable && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getUrgencyStyle(urgencyLevel)}`}>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {urgencyLevel === 'critical' ? 'URGENT' : 'Perishable'}
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {donation.food_item}
                      </h3>
                      {donation.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">{donation.description}</p>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Quantity:</span>
                          <span className="ml-2 text-gray-700">{donation.quantity}</span>
                        </div>
                      </div>

                      {donation.expiration_date && (
                        <div className="flex items-center text-sm">
                          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                            <Calendar className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">Expires:</span>
                            <span className="ml-2 text-gray-700">{formatDate(donation.expiration_date)}</span>
                          </div>
                        </div>
                      )}

                      {donation.preferred_pickup_time && (
                        <div className="flex items-center text-sm">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mr-3">
                            <Clock className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">Pickup:</span>
                            <span className="ml-2 text-gray-700">{donation.preferred_pickup_time}</span>
                          </div>
                        </div>
                      )}

                      {donation.allergens && (
                        <div className="flex items-center text-sm">
                          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg mr-3">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">Allergens:</span>
                            <span className="ml-2 text-gray-700">{donation.allergens}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center text-sm">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Location:</span>
                          <span className="ml-2 text-gray-700">
                            {Math.abs(donation.pickup_location_lat).toFixed(2)}°, {Math.abs(donation.pickup_location_lon).toFixed(2)}°
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Posted {formatDate(donation.created_at)}
                      </p>

                      {donation.status === 'available' && (
                        <button
                          onClick={() => handleClaim(donation.id)}
                          disabled={isClaiming}
                          className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                            isClaiming
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                          }`}
                        >
                          {isClaiming ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4 mr-2" />
                              Claim Food
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
