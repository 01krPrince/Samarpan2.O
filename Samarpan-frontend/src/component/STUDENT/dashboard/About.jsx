import {
  MapPin,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  Youtube
} from 'lucide-react';
import codingAgeLogo from '../../../assets/codingAge.png';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-16 text-gray-800 px-4 py-8">

      {/* Page Heading */}
      <h1 className="text-lg -mt-5 md:text-2xl font-semibold text-gray-800 mb-4">
        About
      </h1>

      <div className="max-w-4xl mx-auto text-center mb-10">
        <p className="text-sm md:text-md text-gray-600">
          Empowering students through real-world projects, guided mentorship, and hands-on learning experiences.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Who We Are */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5">
            <h2 className="text-2xl font-semibold text-gray-800">Who We Are</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Coding Age is a fast-growing tech startup and training institute dedicated to building
              the next generation of developers. We specialize in Full Stack Development, helping
              students become industry-ready through structured learning paths, practical projects,
              and personalized mentorship.
            </p>

            <div className="text-sm flex items-center gap-2 text-gray-700">
              <Phone size={16} />
              <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
            </div>

            <div className="text-sm flex items-center gap-2 text-gray-700">
              <Mail size={16} />
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@codingage.biz&su=Student%20Enquiry%20from%20Samarpan&body=Hello%20Coding%20Age%20Team,%0A%0AI%20am%20interested%20in%20learning%20more%20about%20your%20courses.%20Please%20share%20the%20details.%0A%0AThank%20you!"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                info@codingage.biz
              </a>
            </div>

            <div className="text-sm flex items-center gap-2 text-gray-700">
              <Globe size={16} />
              <a href="https://www.codingage.app" target="_blank" rel="noopener noreferrer" className="hover:underline">
                www.codingage.app
              </a>
            </div>

            <div className="text-sm flex items-center gap-2 text-gray-700">
              <MessageCircle size={16} />
              <a
                href="https://wa.me/919693243217?text=Hello%20Coding%20Age%20Team%2C%20I%20am%20interested%20in%20your%20courses.%20Please%20provide%20me%20with%20more%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                WhatsApp: +91 96932 43217
              </a>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5 items-center justify-between h-full">
            <h2 className="text-2xl font-semibold text-gray-800">Connect With Us</h2>

            <p className="text-sm text-indigo-700 text-center font-medium">
              Driven by innovation. Built as a modern startup.
            </p>

            <div className="flex gap-6">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-600"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-600"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCMDcMvOTf-mSFaqSV5Kw_tA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-red-600"
              >
                <Youtube size={24} />
              </a>
            </div>

            <p className="text-sm text-gray-600 text-center">
              <span className="font-semibold">Powered by Coding Age</span><br />
              A platform designed for skill-building, growth, and innovation.
            </p>

            <a
              href="https://www.codingage.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <img
                src={codingAgeLogo}
                alt="Coding Age Logo"
                className="w-40 h-40 rounded-full mt-4"
              />
            </a>
          </div>


        </div>

        {/* Bottom Row: Location Full Width */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-gray-800">Our Location</h2>
          <div className="flex gap-3 text-gray-700 text-sm">
            <MapPin className="mt-1 text-gray-700" />
            <p>
              Coding Age, 2nd Floor, XYZ Tower,<br />
              Kankarbagh, Patna, Bihar - 800020<br />
              India
            </p>
          </div>
          <iframe
            title="Coding Age Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387.09830297899754!2d85.15143073977775!3d25.59826130454944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5923d9f293b3%3A0x23c18082d351e271!2sCoding%20Age!5e0!3m2!1sen!2sin!4v1752220186398!5m2!1sen!2sin"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: '10px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="text-end text-sm text-gray-600 mt-4 mb-14 mr-8">
          ❤️ from <span className="font-semibold text-gray-800">Coding Age </span>// 🧑‍💻👩‍💻
        </div>

      </div>

    </div>
  );
};

export default About;
