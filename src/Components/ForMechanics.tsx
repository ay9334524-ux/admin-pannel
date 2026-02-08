import { motion } from 'framer-motion';

const benefits = [
  {
    icon: '👥',
    title: 'Get more customers',
    description: 'Access thousands of vehicle owners looking for reliable mechanics.',
  },
  {
    icon: '📅',
    title: 'Work on your schedule',
    description: 'Accept jobs when you want. Full control over your availability.',
  },
  {
    icon: '💵',
    title: 'Easy earnings',
    description: 'Get paid directly to your account. Weekly payouts guaranteed.',
  },
];

const ForMechanics = () => {
  return (
    <section id="for-mechanics" className="py-20 sm:py-28 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-400 font-semibold text-sm uppercase tracking-wider"
          >
            For Mechanics
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-3xl sm:text-4xl font-bold text-white"
          >
            Grow your business with MecFinder
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-xl mx-auto"
          >
            Join our network of trusted mechanics and start earning more today.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center p-6"
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Register as Mechanic
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ForMechanics;
