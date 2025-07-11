import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-20 bg-gray-800 text-white py-6 w-full mb-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          {/* Column 1: General Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Samarpan</h3>
            <p className="text-sm">
              © 2025 Samarpan. All rights reserved by Coding Age. |{' '}
              <a href="/terms" className="underline hover:text-gray-300">Terms of Service</a> |{' '}
              <a href="/privacy" className="underline hover:text-gray-300">Privacy Policy</a> |{' '}
              <a href="/support" className="underline hover:text-gray-300">Support</a>
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li><a href="/dashboard" className="underline hover:text-gray-300">Dashboard</a></li>
              <li><a href="/projects" className="underline hover:text-gray-300">Projects</a></li>
              <li><a href="/batches" className="underline hover:text-gray-300">Batches</a></li>
              <li><a href="/subjects" className="underline hover:text-gray-300">Subjects</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-sm">
              Email: <a href="mailto:support@samarpan.com" className="underline hover:text-gray-300">support@samarpan.com</a><br />
              Phone: <a href="tel:+1234567890" className="underline hover:text-gray-300">+1-234-567-890</a>
            </p>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <p className="text-sm space-y-1">
              <a href="https://facebook.com" className="underline hover:text-gray-300">Facebook</a><br />
              <a href="https://twitter.com" className="underline hover:text-gray-300">Twitter</a><br />
              <a href="https://linkedin.com" className="underline hover:text-gray-300">LinkedIn</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;