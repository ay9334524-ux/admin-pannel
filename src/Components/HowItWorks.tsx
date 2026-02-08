import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface Step {
  icon: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: '🔧',
    title: 'Choose your service',
    description: 'Select the type of repair or maintenance your vehicle needs.',
  },
  {
    icon: '📍',
    title: 'Get matched instantly',
    description: 'We connect you with verified mechanics near your location.',
  },
  {
    icon: '🗺️',
    title: 'Track live location',
    description: 'Watch your mechanic arrive in real-time on the map.',
  },
  {
    icon: '💳',
    title: 'Pay securely',
    description: 'Complete payment safely after the service is done.',
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 font-semibold text-sm uppercase tracking-wider"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900"
          >
            Get help in 4 simple steps
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
              className="relative bg-gray-50 rounded-2xl p-6 sm:p-8 hover:bg-gray-100 transition-colors group"
            >
              {/* Step Number */}
              <div className="absolute top-4 right-4 text-5xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{step.icon}</div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
