const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: ['How it Works', 'Services', 'Pricing', 'FAQ'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Blog', 'Press'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Refund Policy'],
    },
  ];

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-white">MecFinder</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Instant mechanic booking platform. Find verified mechanics near you in minutes.
            </p>
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Contact Us</p>
              <a href="mailto:hello@mecfinder.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                hello@mecfinder.com
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-bold mb-5">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500">
            © {currentYear} MecFinder. All rights reserved.
          </p>
          <div className="flex items-center space-x-3">
            {/* Social Icons */}
            {[
              { name: 'Twitter', icon: '🐦' },
              { name: 'LinkedIn', icon: '💼' },
              { name: 'Instagram', icon: '📷' },
            ].map((social) => (
              <a
                key={social.name}
                href="#"
                className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors group"
              >
                <span className="text-lg">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
