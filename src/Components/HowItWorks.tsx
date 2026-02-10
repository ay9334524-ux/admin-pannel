import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRef } from 'react';

interface Step {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    icon: '🔧',
    title: 'Choose your service',
    description: 'Select the type of repair or maintenance your vehicle needs.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '📍',
    title: 'Get matched instantly',
    description: 'We connect you with verified mechanics near your location.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🗺️',
    title: 'Track live location',
    description: 'Watch your mechanic arrive in real-time on the map.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: '💳',
    title: 'Pay securely',
    description: 'Complete payment safely after the service is done.',
    color: 'from-green-500 to-emerald-500',
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 font-semibold text-sm uppercase tracking-wider rounded-full"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900"
          >
            Get help in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">4 simple steps</span>
          </motion.h2>
        </div>

        {/* Steps Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
            >
              {/* Step Number */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-400 group-hover:text-blue-500 transition-colors">{index + 1}</span>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
