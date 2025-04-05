import React from 'react';
import { FiShield, FiActivity, FiLock, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: delay * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const iconVariants = {
    hidden: { 
      rotate: -15,
      scale: 0.8
    },
    visible: {
      rotate: 0,
      scale: 1,
      transition: {
        delay: delay * 0.1 + 0.2,
        type: 'spring',
        stiffness: 200,
        damping: 10
      }
    }
  };

  const hoverEffect = {
    scale: 1.03,
    y: -5,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={hoverEffect}
      className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
    >
      {/* Gradient background effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-blue-50/30 group-hover:to-purple-50/20 dark:group-hover:from-blue-900/10 dark:group-hover:to-purple-900/10 transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-md" />
      </div>

      <div className="relative z-10 flex items-start space-x-4">
        <motion.div
          variants={iconVariants}
          className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md flex-shrink-0"
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Animated border bottom */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{
          delay: delay * 0.1 + 0.4,
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
      />
    </motion.div>
  );
};

// Example usage with staggered animations
export const FeaturesSection = () => {
  const features = [
    {
      icon: FiShield,
      title: "Real-time Analysis",
      description: "Instant detection of synthetic voice patterns with 99.8% accuracy"
    },
    {
      icon: FiActivity,
      title: "Blockchain Verification",
      description: "Immutable verification records stored on decentralized ledger"
    },
    {
      icon: FiLock,
      title: "Enterprise Security",
      description: "Military-grade encryption with zero-knowledge proofs"
    },
    {
      icon: FiBarChart2,
      title: "Detailed Analytics",
      description: "Comprehensive risk reports with actionable insights"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          delay={index}
        />
      ))}
    </div>
  );
};

export default FeatureCard;