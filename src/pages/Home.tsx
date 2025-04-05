import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiSearch, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight"
          >
            <span className="text-blue-600">AI-Powered</span> Sales Data Auditing
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Transform your financial integrity, fraud detection, and operational efficiency with intelligent auditing that goes beyond manual checks and rule-based validation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Request Demo
            </button>
            <button className="px-8 py-4 bg-white text-blue-600 border border-blue-600 rounded-lg text-lg font-medium hover:bg-blue-50 transition transform hover:-translate-y-1 shadow hover:shadow-md">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            The Critical Gaps in Traditional Sales Auditing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <div className="text-red-500 mb-4">
                <FiAlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Manual Limitations</h3>
              <p className="text-gray-600">
                Human-led audits miss sophisticated patterns, create bottlenecks, and lack the scale needed for modern sales operations.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <div className="text-yellow-500 mb-4">
                <FiSearch className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rule-Based Constraints</h3>
              <p className="text-gray-600">
                Static rule systems fail to adapt to new fraud patterns, complex sales environments, and evolving business models.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <div className="text-purple-500 mb-4">
                <FiShield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Financial Vulnerability</h3>
              <p className="text-gray-600">
                Without comprehensive auditing, businesses face revenue leakage, compliance risks, and damaging financial inaccuracies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            The Power of AI-Powered Sales Auditing
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Move beyond ineffective traditional methods with intelligent systems built for complex sales environments
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-green-500 text-5xl font-bold mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3">Financial Integrity</h3>
              <p className="text-gray-600">
                Ensure accurate financial reporting with comprehensive validation that identifies discrepancies human auditors would miss.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-blue-500 text-5xl font-bold mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">Advanced Fraud Detection</h3>
              <p className="text-gray-600">
                Detect sophisticated fraud patterns by analyzing behavioral indicators, transaction anomalies, and historical patterns.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-purple-500 text-5xl font-bold mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3">Operational Efficiency</h3>
              <p className="text-gray-600">
                Automate auditing workflows and reduce manual review time by 90% while improving accuracy and risk coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section - New */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Comprehensive Auditing Intelligence
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="text-blue-600 mt-1">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Pattern Recognition</h3>
                <p className="text-gray-600">
                  Identify subtle patterns across thousands of transactions that indicate potential risks or fraud attempts.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="text-blue-600 mt-1">
                <FiSearch className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Contextual Analysis</h3>
                <p className="text-gray-600">
                  Evaluate transactions within their full business context, not just against static rules and thresholds.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="text-blue-600 mt-1">
                <FiShield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Continuous Monitoring</h3>
                <p className="text-gray-600">
                  Move from quarterly audits to real-time protection with always-on monitoring of your sales operations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="text-blue-600 mt-1">
                <FiAlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Adaptive Intelligence</h3>
                <p className="text-gray-600">
                  Our system learns from each review, continuously improving its detection capabilities as your business evolves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Strengthen Your Financial Integrity Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join forward-thinking organizations that have transformed their auditing approach with AI-powered intelligence.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl">
            Schedule a Consultation
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;