import { Button, Link } from '@heroui/react';
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
              <h3 className="text-3xl font-bold">vibly.</h3>
              <p className="text-xl text-default-400">Learn with AI Friends</p>
            </div>
          </div>

          {/* Right side - Social Media Icons */}
          <div className="flex">
            <Button 
              as={Link} 
              href="#" 
              className="bg-transparent text-default-400 hover:text-white transition-colors"
              startContent={
                <FaTwitter className="w-6 h-6" />
              }
              isIconOnly
            />
            <Button 
              as={Link} 
              href="#" 
              className="bg-transparent text-default-400 hover:text-white transition-colors"
              startContent={
                <FaInstagram className="w-6 h-6" />
              }
              isIconOnly
            />
          </div>
        </div>

        {/* Bottom - Large VIBLY text */}
        <div className="text-center">
          <h1 className="text-[12rem] font-bold">vibly.</h1>
        </div>
      </div>
    </footer>
  );
}; 