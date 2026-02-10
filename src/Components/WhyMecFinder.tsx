import { motion } from 'framer-motion';

const features = [
  { icon: '✓', text: 'Verified mechanics with background checks', color: 'from-green-500 to-emerald-500' },
  { icon: '⚡', text: 'Fast response time under 15 minutes', color: 'from-yellow-500 to-orange-500' },
  { icon: '💰', text: 'Transparent pricing with no hidden charges', color: 'from-blue-500 to-cyan-500' },
  { icon: '🔒', text: 'Secure payments via multiple methods', color: 'from-purple-500 to-pink-500' },
  { icon: '🕰', text: '24/7 availability for emergencies', color: 'from-red-500 to-rose-500' },
];

const WhyMecFinder = () => {
  return (
    <section className="py-24 sm:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 font-semibold text-sm uppercase tracking-wider rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              The smarter way to get your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> vehicle fixed</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              MecFinder connects you with trusted, skilled mechanics in your area. 
              No more waiting at garages or dealing with unreliable service providers.
            </p>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all"
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
                whileHover={{ x: 8, scale: 1.01 }}
                className="flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0`}>
                  {feature.icon}
                </div>
                <p className="text-gray-800 font-semibold">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyMecFinder;
