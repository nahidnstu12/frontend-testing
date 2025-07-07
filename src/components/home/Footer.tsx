import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
} from 'lucide-react';

export default function FrontendFooter() {
  return (
   
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.05)_2px,transparent_2px)] bg-[length:60px_60px] opacity-50"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Company Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Aspiring Achievers
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg font-medium">
              Empowering students to achieve their dreams through educational opportunities and comprehensive support.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-2xl font-black mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Quick Links
          </h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Home</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">About Us</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Scholarships</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Resources</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Contact</a></li>
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h4 className="text-2xl font-black mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Programs
          </h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Undergraduate</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Graduate</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">International</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Merit-based</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Need-based</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-2xl font-black mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Support
          </h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Help Center</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">FAQs</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Terms of Service</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Contact Support</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-16 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-lg font-medium">© 2024 Aspiring Achievers Scholarship. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg font-medium">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg font-medium">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg font-medium">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
  )
}
