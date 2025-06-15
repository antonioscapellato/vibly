import { Button, Image, Link } from '@heroui/react';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaX, FaXTwitter } from 'react-icons/fa6';

export const Footer = () => {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            {/* Left side - Logo and Tagline */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 relative">
                <Image
                  src="/logo.png"
                  alt="Vibly Logo"
                  className="object-contain"
                  radius={"full"}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">vibly.</h3>
                <p className="text-sm text-default-400">Learn with AI Friends</p>
              </div>
            </div>

            {/* Right side - Social Media Icons */}
            <div className="flex">
              <Button 
                as={Link} 
                href="#" 
                className="bg-transparent text-default-400 hover:text-white transition-colors"
                startContent={
                  <FaXTwitter className="w-6 h-6" />
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
            <h1 className="text-9xl md:text-[20rem] text-default-900 font-bold">vibly.</h1>
          </div>
        </div>
      </div>
    </footer>
  );
}; 