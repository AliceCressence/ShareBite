import React from 'react';
import { useRouter } from 'next/router';
import {
  Plus,
  Search,
  BarChart3,
  Heart,
  MapPin,
  Clock,
  Users,
  Leaf,
  ArrowRight,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Ready to make a difference? Share food, browse donations, or track your impact.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => router.push('/donate')}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl hover:shadow-xl transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Food</h3>
            <p className="text-green-100">Post surplus food for your community</p>
          </button>

          <button
            onClick={() => router.push('/browse')}
            className="bg-white border border-gray-200 p-8 rounded-xl hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Food</h3>
            <p className="text-gray-600">Browse available donations nearby</p>
          </button>

          <div className="bg-white border border-gray-200 p-8 rounded-xl hover:shadow-lg transition-all duration-200 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Impact</h3>
            <p className="text-gray-600">Track your environmental contribution</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-3">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Recent Activity & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Community Impact */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Community Impact</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Food waste reduced</span>
                </div>
                <span className="font-semibold text-green-600">Coming soon</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Neighbors helped</span>
                </div>
                <span className="font-semibold text-blue-600">Coming soon</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-700">Sustainability score</span>
                </div>
                <span className="font-semibold text-purple-600">Coming soon</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Tips for Success</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📸 Add Clear Photos</h4>
                <p className="text-sm text-gray-600">High-quality photos increase pickup rates by 70%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">⏰ Set Realistic Times</h4>
                <p className="text-sm text-gray-600">Allow flexible pickup windows for better connections</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🏷️ Include Allergen Info</h4>
                <p className="text-sm text-gray-600">Help keep everyone safe with detailed descriptions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h4>
            <p className="text-gray-600 mb-6">Start sharing or browsing food to see your activity here</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/donate')}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Share Food
              </button>
              <button
                onClick={() => router.push('/browse')}
                className="bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Browse Food
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {router.query.success === 'donation-created' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-green-800 mb-1">Food shared successfully! 🎉</h4>
                <p className="text-green-700">Your donation has been posted and neighbors can now find and claim it.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
