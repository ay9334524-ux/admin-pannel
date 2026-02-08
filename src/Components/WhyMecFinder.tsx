import { motion } from 'framer-motion';

const features = [
  { icon: '✓', text: 'Verified mechanics with background checks' },
  { icon: '⚡', text: 'Fast response time under 15 minutes' },
  { icon: '💰', text: 'Transparent pricing with no hidden charges' },
  { icon: '🔒', text: 'Secure payments via multiple methods' },
  { icon: '🕐', text: '24/7 availability for emergencies' },
];

const WhyMecFinder = () => {
  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              The smarter way to get your vehicle fixed
            </h2>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              MecFinder connects you with trusted, skilled mechanics in your area. 
              No more waiting at garages or dealing with unreliable service providers.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started Now
            </motion.button>
          </motion.div>

          {/* Right Feature List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">
                  {feature.icon}
                </div>
                <p className="text-gray-700 font-medium pt-2">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyMecFinder;
