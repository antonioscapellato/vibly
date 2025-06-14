import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-4">

        <div className="flex justify-between items-center mb-16">

          {/* Left side - Logo and Tagline */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">V</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Vibly</h3>
              <p className="text-default-400">Learn with AI Friends</p>
            </div>
          </div>

          {/* Right side - Social Media Icons */}
          <div className="flex space-x-6">
            <a href="#" className="text-default-400 hover:text-white transition-colors">
              <FaTwitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-default-400 hover:text-white transition-colors">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-default-400 hover:text-white transition-colors">
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Bottom - Large VIBLY text */}
        <div className="text-center">
          <h1 className="text-9xl font-bold text-fuchsia-500">VIBLY</h1>
        </div>
      </div>
    </footer>
  );
}; 