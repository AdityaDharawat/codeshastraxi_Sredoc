// components/SalesAuditChatBot.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';

const SalesAuditChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([
    { text: "Hello! I'm your Sales Audit Assistant. How can I help with your anomaly detection needs today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commonQuestions = [
    "How does your anomaly detection work?",
    "What types of sales anomalies can you detect?",
    "How do you prioritize anomaly severity?",
    "Can I customize validation rules?",
    "How do you handle data privacy?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = { text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 800);
  };

  const generateBotResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('how') && (lowerQuestion.includes('work') || lowerQuestion.includes('detect'))) {
      return "Our system uses a multi-layered approach combining:\n1. Rule-based checks for known fraud patterns\n2. Statistical analysis for outliers\n3. Machine learning to detect emerging patterns\n4. RAG system for contextual explanations\nWe analyze 50+ sales metrics in real-time.";
    } 
    else if (lowerQuestion.includes('type') || lowerQuestion.includes('kind') || lowerQuestion.includes('detect')) {
      return "We detect:\n• Unauthorized discounts/price overrides\n• Tax calculation discrepancies\n• Duplicate transactions\n• Suspicious refund patterns\n• Employee collusion signals\n• Territory policy violations\n• Unusual payment method distributions";
    } 
    else if (lowerQuestion.includes('severity') || lowerQuestion.includes('prioritize') || lowerQuestion.includes('risk')) {
      return "Anomalies are ranked by:\n🔥 High: Direct financial impact >$10k\n⚠️ Medium: Policy violations, $1k-$10k impact\nℹ️ Low: Minor deviations, <$1k impact\nOur ML model considers financial impact, recurrence, and historical patterns.";
    } 
    else if (lowerQuestion.includes('custom') || lowerQuestion.includes('rule')) {
      return "Yes! You can:\n1. Add company-specific validation rules\n2. Adjust sensitivity thresholds\n3. Whitelist approved exceptions\n4. Create custom risk scoring rules\nAll through our intuitive rules engine interface.";
    } 
    else if (lowerQuestion.includes('privacy') || lowerQuestion.includes('data') || lowerQuestion.includes('security')) {
      return "We enforce:\n• SOC 2 Type II compliance\n• Field-level encryption\n• Role-based access controls\n• Audit trails for all data access\n• Automatic data masking\nYour sales data is never used beyond your contracted purposes.";
    } 
    else if (lowerQuestion.includes('implement') || lowerQuestion.includes('set up') || lowerQuestion.includes('integrate')) {
      return "Implementation involves:\n1. Secure data connection (API/SFTP)\n2. Historical data analysis (30-90 days)\n3. Threshold calibration\n4. Team training\n5. Phased rollout\nTypical onboarding takes 2-4 weeks depending on data complexity.";
    }
    else if (lowerQuestion.includes('report') || lowerQuestion.includes('dashboard')) {
      return "You'll receive:\n• Real-time anomaly alerts\n• Daily summary reports\n• Weekly executive dashboards\n• Monthly audit-ready PDFs\n• Custom KPI tracking\nAll reports are exportable to PDF/Excel and can be automated.";
    }
    else {
      return "I specialize in sales anomaly detection. Try asking about:\n• Our detection methodology\n• Types of fraud we identify\n• Severity classification\n• Customization options\n• Implementation process\nOr type your specific question about sales auditing.";
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-24 right-8 w-96 max-w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center">
              <FiBarChart2 className="w-5 h-5 mr-2" />
              <h3 className="font-semibold text-white">Sales Audit Assistant</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 whitespace-pre-line ${message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 pb-2">
            <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              <FiAlertTriangle className="mr-1" />
              COMMON AUDIT QUESTIONS
            </div>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full transition-colors"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about sales anomalies..."
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-r-lg transition-colors"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesAuditChatBot;