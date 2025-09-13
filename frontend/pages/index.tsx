import Link from "next/link";
import {
  Heart,
  MapPin,
  Clock,
  Users,
  Leaf,
  ChefHat,
  ArrowRight,
  Shield,
  Globe,
  Recycle,
  User
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ShearBite</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Browse Food
              </Link>
              <Link href="/donate" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Share Food
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                How it Works
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm hidden sm:block">{user?.email}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative bg-gradient-to-br from-green-50 to-blue-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {isAuthenticated ? (
                <>
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Welcome back, <span className="text-green-600">{user?.email?.split('@')[0]}</span>!
                  </h1>
                  <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Ready to make a difference today? Share surplus food or discover fresh donations from your community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/donate"
                      className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      Share Food
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="/browse"
                      className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-200 inline-flex items-center justify-center"
                    >
                      Browse Food
                      <MapPin className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      Dashboard
                      <User className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Reduce Food Waste.{" "}
                    <span className="text-green-600">Feed Communities.</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Connect with neighbors to share surplus food and build a more sustainable community.
                    Every meal shared is a step towards reducing waste and helping those in need.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/register"
                      className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      Start Sharing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="/browse"
                      className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-200 inline-flex items-center justify-center"
                    >
                      Browse Food
                      <MapPin className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Building Sustainable Communities
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              ShearBite connects neighbors to share surplus food, reduce waste, and strengthen community bonds.
              Our platform makes it simple and safe to give and receive food donations in your local area.
            </p>
          </div>
        </div>
        {/* How It Works */}
        <div id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">Simple steps to start sharing food in your community</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Food</h3>
                <p className="text-gray-600">
                  Post details about surplus food you'd like to share. Include photos, description, and pickup location.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect Locally</h3>
                <p className="text-gray-600">
                  Neighbors can claim your food and arrange pickup times. All communication happens through our platform.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Make Impact</h3>
                <p className="text-gray-600">
                  Reduce waste, help your community, and build meaningful connections with your neighbors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ShearBite?</h2>
              <p className="text-xl text-gray-600">Built for safe, convenient, and impactful food sharing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Hyperlocal Network</h3>
                <p className="text-gray-600">
                  Connect with neighbors within walking distance for easy, convenient food sharing.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Safe & Secure</h3>
                <p className="text-gray-600">
                  User verification and community guidelines ensure safe and trustworthy interactions.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Updates</h3>
                <p className="text-gray-600">
                  Get instant notifications about new donations and pickup arrangements.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Recycle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Waste Reduction</h3>
                <p className="text-gray-600">
                  Track your environmental impact and contribute to a more sustainable future.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Building</h3>
                <p className="text-gray-600">
                  Foster stronger neighborhood connections through acts of kindness and sharing.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Impact</h3>
                <p className="text-gray-600">
                  Be part of a worldwide movement to reduce food waste and support communities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join our community of neighbors helping neighbors. Start sharing food today.
            </p>
            <Link
              href="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center shadow-lg"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ShearBite</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting communities through food sharing. Reducing waste, one meal at a time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/browse" className="hover:text-white transition-colors">Browse Food</Link></li>
                <li><Link href="/donate" className="hover:text-white transition-colors">Share Food</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><span className="text-gray-500">Safety Guidelines</span></li>
                <li><span className="text-gray-500">Contact Us</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ShearBite. Building sustainable communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
