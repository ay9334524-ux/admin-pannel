import { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy | MecFinder';
  }, []);

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `Welcome to MecFinder. This Privacy Policy explains how MecFinder ("we," "us," or "our") collects, uses, discloses, and protects your personal information when you use our mobile applications (MecFinder and MecFinder Mechanic) and related services (collectively, the "Services"). MecFinder is a platform that helps users find nearby mechanics and automotive service providers for vehicle repair and maintenance needs. By using our Services, you agree to the collection and use of information in accordance with this policy.`,
    },
    {
      id: 'information-we-collect',
      title: '2. Information We Collect',
      content: null,
      subsections: [
        {
          title: '2.1 Information You Provide',
          items: [
            'Phone number (required for account registration and verification)',
            'Full name',
            'Email address (optional)',
            'Gender (optional)',
            'Profile photo (optional)',
            'Vehicle type preferences',
          ],
        },
        {
          title: '2.2 Information for Mechanic Partners',
          items: [
            'Full name and phone number',
            'Business address (street, city, state, pincode)',
            'Services offered and vehicle types serviced',
            'Bank account details (account holder name, account number, IFSC code, bank name, UPI ID) for receiving payments',
          ],
        },
        {
          title: '2.3 Information Collected Automatically',
          items: [
            'Device information (device type, operating system)',
            'IP address at the time of login',
            'Location data (precise and approximate, see Section 3)',
            'Firebase Cloud Messaging (FCM) token for push notifications',
            'Service usage data (bookings, reviews, complaints)',
          ],
        },
      ],
    },
    {
      id: 'location-data',
      title: '3. Location Data',
      content: `MecFinder requires access to your device's location to provide its core functionality of connecting you with nearby mechanics. We collect and use location data as follows:`,
      subsections: [
        {
          title: '3.1 Types of Location Access',
          items: [
            'Precise Location (GPS): Used to accurately determine your position and find mechanics nearest to you.',
            'Approximate Location (Network-based): Used as a fallback when GPS is unavailable.',
            'Background Location (Mechanic app only): Allows mechanic partners to receive job requests while the app is not actively in use.',
          ],
        },
        {
          title: '3.2 How Location Data is Used',
          items: [
            'Finding and displaying nearby available mechanics on a map',
            'Calculating distance between users and mechanic partners',
            'Enabling real-time tracking during active service bookings',
            'Providing address information for service requests via reverse geocoding',
            'Geo-spatial matching to assign the nearest available mechanic to your request',
          ],
        },
        {
          title: '3.3 Location Data Storage',
          items: [
            'Your last known location is stored on our servers to facilitate quick service matching.',
            'Mechanic partner locations are stored as GeoJSON coordinates for spatial queries.',
            'You may disable location access through your device settings, but this will prevent core app functionality.',
          ],
        },
      ],
    },
    {
      id: 'how-we-use-information',
      title: '4. How We Use Information',
      content: 'We use the information we collect for the following purposes:',
      subsections: [
        {
          title: '',
          items: [
            'To create and manage your account',
            'To verify your identity via phone number (OTP through Firebase Authentication)',
            'To connect you with nearby mechanics and automotive service providers',
            'To process and manage service bookings',
            'To facilitate payments through Razorpay payment gateway',
            'To send push notifications about booking status, offers, and updates',
            'To provide real-time tracking during active bookings via WebSocket connections',
            'To maintain mechanic ratings, reviews, and service quality',
            'To process mechanic payouts and manage wallet transactions',
            'To handle support queries and service complaints',
            'To manage referral and rewards programs',
            'To apply promotional coupons and discounts',
            'To enforce platform rules and prevent abuse (ban system)',
            'To improve our services and user experience',
          ],
        },
      ],
    },
    {
      id: 'data-sharing',
      title: '5. Data Sharing',
      content: 'We do not sell your personal information. We may share your data with:',
      subsections: [
        {
          title: '5.1 Service Providers',
          items: [
            'Firebase (Google) — for phone authentication and push notifications',
            'Google Maps — for location services and map display',
            'Razorpay — for payment processing',
            'Cloudinary — for profile image storage',
          ],
        },
        {
          title: '5.2 Between Users and Mechanics',
          items: [
            'When you book a service, your name, location, and booking details are shared with the assigned mechanic.',
            'Mechanic name, rating, and real-time location are shared with users during active bookings.',
          ],
        },
        {
          title: '5.3 Legal Requirements',
          items: [
            'We may disclose information if required by law, court order, or government regulation.',
            'We may share data to protect the rights, safety, or property of MecFinder, our users, or the public.',
          ],
        },
      ],
    },
    {
      id: 'data-retention',
      title: '6. Data Retention',
      content: `We retain your personal information for as long as your account is active or as needed to provide you services. Specifically:`,
      subsections: [
        {
          title: '',
          items: [
            'Account data is retained until you request deletion or your account is permanently removed.',
            'Booking history and transaction records are retained for financial and legal compliance purposes.',
            'Location data is updated with each session and only the most recent location is stored.',
            'Mechanic bank details are retained as long as the mechanic partner account is active for payout processing.',
            'Audit logs and support queries are retained for up to 3 years for dispute resolution.',
          ],
        },
      ],
    },
    {
      id: 'security',
      title: '7. Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal data:',
      subsections: [
        {
          title: '',
          items: [
            'JWT-based authentication with access and refresh token mechanism',
            'Secure token storage using encrypted device storage (Flutter Secure Storage)',
            'HTTPS encryption for all API communications in production',
            'Rate limiting on authentication endpoints to prevent brute force attacks',
            'Password hashing using bcrypt for admin accounts',
            'Helmet.js security headers on all API responses',
            'Input validation using Joi schemas on all API endpoints',
            'Redis-backed session management',
          ],
        },
      ],
    },
    {
      id: 'user-rights',
      title: '8. Your Rights',
      content: 'You have the following rights regarding your personal data:',
      subsections: [
        {
          title: '',
          items: [
            'Access: You can view your profile information within the app at any time.',
            'Correction: You can update your profile details (name, email, gender, profile photo) through the app.',
            'Deletion: You may request deletion of your account by contacting our support team.',
            'Location Control: You can revoke location permissions through your device settings at any time.',
            'Notification Control: You can disable push notifications through your device settings.',
            'Data Portability: You may request a copy of your personal data by contacting us.',
          ],
        },
      ],
    },
    {
      id: 'third-party-services',
      title: '9. Third-Party Services',
      content: 'Our application integrates with the following third-party services, each governed by their own privacy policies:',
      subsections: [
        {
          title: '',
          items: [
            'Firebase by Google (Authentication and Cloud Messaging) — https://firebase.google.com/support/privacy',
            'Google Maps Platform (Maps and Geocoding) — https://policies.google.com/privacy',
            'Razorpay (Payment Processing) — https://razorpay.com/privacy/',
            'Cloudinary (Image Storage and Delivery) — https://cloudinary.com/privacy',
          ],
        },
      ],
    },
    {
      id: 'childrens-privacy',
      title: "10. Children's Privacy",
      content: `Our Services are not intended for use by children under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal data from a child under 18, we will take steps to delete that information promptly. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`,
    },
    {
      id: 'changes-to-policy',
      title: '11. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy within the app and updating the "Last Updated" date. Your continued use of our Services after any changes constitutes your acceptance of the revised policy. We encourage you to review this page periodically.`,
    },
    {
      id: 'contact-information',
      title: '12. Contact Information',
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Home</span>
          </a>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">MecFinder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4">Privacy Policy</h1>
          <p className="mt-3 text-gray-300 text-sm sm:text-base">
            Last Updated: June 9, 2025
          </p>
        </div>
      </header>

      {/* Table of Contents - Mobile */}
      <nav className="lg:hidden bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 flex items-center justify-between">
              Table of Contents
              <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <ul className="mt-3 space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex gap-12">
          {/* Sidebar TOC - Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">On this page</p>
              <ul className="space-y-2 border-l-2 border-gray-200 pl-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-xs text-gray-500 hover:text-blue-600 transition-colors leading-tight block py-0.5"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-slate max-w-none">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="mb-10 scroll-mt-24">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                    {section.title}
                  </h2>

                  {section.content && (
                    <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                      {section.content}
                    </p>
                  )}

                  {section.id === 'contact-information' && (
                    <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-100">
                      <div className="space-y-2 text-sm sm:text-base text-gray-600">
                        <p><span className="font-semibold text-gray-800">Company:</span> MecFinder</p>
                        <p><span className="font-semibold text-gray-800">Email:</span>{' '}
                          <a href="mailto:support@mecfinders.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                            support@mecfinders.com
                          </a>
                        </p>
                        <p><span className="font-semibold text-gray-800">Website:</span>{' '}
                          <a href="https://mecfinders.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                            mecfinders.com
                          </a>
                        </p>
                      </div>
                    </div>
                  )}

                  {section.subsections?.map((sub, idx) => (
                    <div key={idx} className="mb-5">
                      {sub.title && (
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                          {sub.title}
                        </h3>
                      )}
                      <ul className="space-y-2">
                        {sub.items.map((item, i) => (
                          <li key={i} className="flex items-start text-sm sm:text-base text-gray-600">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              ))}
            </div>

            {/* Google Play Compliance Note */}
            <div className="mt-12 p-5 sm:p-6 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 leading-relaxed">
                This privacy policy is provided in compliance with Google Play Store requirements,
                Apple App Store guidelines, and applicable data protection regulations. If you have
                downloaded our app from the Google Play Store or Apple App Store, this policy governs
                how your data is handled within the application.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="text-sm font-semibold text-white">MecFinder</span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} MecFinder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
