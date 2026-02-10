import { motion } from 'framer-motion';

const benefits = [
  {
    icon: '👥',
    title: 'Get more customers',
    description: 'Access thousands of vehicle owners looking for reliable mechanics.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '📅',
    title: 'Work on your schedule',
    description: 'Accept jobs when you want. Full control over your availability.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '💵',
    title: 'Easy earnings',
    description: 'Get paid directly to your account. Weekly payouts guaranteed.',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const ForMechanics = () => {
  return (
    <section id="for-mechanics" className="py-24 sm:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 font-semibold text-sm uppercase tracking-wider rounded-full border border-blue-500/30"
          >
            For Mechanics
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white"
          >
            Grow your business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">MecFinder</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-blue-200/80 max-w-2xl mx-auto"
          >
            Join our network of trusted mechanics and start earning more today.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl`}>
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-blue-200/70 leading-relaxed">{benefit.description}</p>
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
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all"
          >
            Register as Mechanic
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ForMechanics;
