import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface Service {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const services: Service[] = [
  {
    icon: '🏍️',
    title: 'Bike Repair',
    description: 'Quick fixes and maintenance for all types of motorcycles and scooters.',
    gradient: 'from-rose-500 to-orange-500',
  },
  {
    icon: '🚗',
    title: 'Car Repair',
    description: 'Comprehensive car servicing from engine to electrical systems.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🛺',
    title: 'Auto / Tempo Repair',
    description: 'Specialized service for three-wheelers and commercial vehicles.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: '🚨',
    title: 'Emergency Roadside',
    description: "24/7 emergency assistance when you're stranded on the road.",
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const Services = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section id="services" className="py-24 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 font-semibold text-sm uppercase tracking-wider rounded-full"
          >
            Our Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900"
          >
            Services we <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">offer</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            From quick fixes to complete overhauls, our verified mechanics handle it all with expertise.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -8 }}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer border border-gray-100 group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>

              {/* Link */}
              <div className="text-blue-600 font-semibold text-sm flex items-center group-hover:text-indigo-600 transition-colors">
                Learn more
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
