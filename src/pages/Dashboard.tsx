import { useState, useEffect } from 'react';
import { Card, Dropdown, Button } from '../components/ui';
import { FiUsers, FiActivity, FiDownload, FiFilter, FiSettings, FiBarChart2 } from 'react-icons/fi';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  interface DashboardData {
    users: {
      total: number;
      newThisWeek: number;
      active: number;
      retentionRate: number;
    };
    activity: {
      detections: number;
      audioGenerations: number;
      feedbackSubmissions: number;
      dailyActivity: { date: string; detections: number; generations: number }[];
    };
    recentUsers: { id: number; name: string; lastActivity: string; status: string }[];
    systemStatus: {
      apiLatency: number;
      uptime: number;
      storage: number;
    };
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await controls.start({
        opacity: 0,
        transition: { duration: 0.2 }
      });

      try {
        // Simulate API call with loading animation
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data
        const data = {
          users: {
            total: 1243,
            newThisWeek: 87,
            active: 542,
            retentionRate: 0.72,
          },
          activity: {
            detections: 3421,
            audioGenerations: 1287,
            feedbackSubmissions: 423,
            dailyActivity: Array(7).fill(0).map((_, i) => ({
              date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              detections: Math.floor(Math.random() * 100) + 50,
              generations: Math.floor(Math.random() * 70) + 30,
            })),
          },
          recentUsers: [
            { id: 1, name: 'Alex Johnson', lastActivity: '2 hours ago', status: 'active' },
            { id: 2, name: 'Maria Garcia', lastActivity: '5 hours ago', status: 'active' },
            { id: 3, name: 'James Wilson', lastActivity: '1 day ago', status: 'inactive' },
            { id: 4, name: 'Sarah Lee', lastActivity: '2 days ago', status: 'active' },
            { id: 5, name: 'David Kim', lastActivity: '3 days ago', status: 'inactive' },
          ],
          systemStatus: {
            apiLatency: 142,
            uptime: 99.92,
            storage: 76,
          }
        };

        setDashboardData(data);
        await controls.start({
          opacity: 1,
          transition: { duration: 0.4 }
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, controls]);

  const exportData = (format: 'csv' | 'json') => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 }
    });
    console.log(`Exporting data as ${format}`);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >

        <motion.div 
          className="flex items-center space-x-4 mt-4 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Dropdown 
            options={[
              { value: '24h', label: 'Last 24 hours' },
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
            ]}
            value={timeRange}
            onChange={setTimeRange}
            icon={<FiFilter className="text-gray-400" />}
          />
          
          <Button 
            variant="outline"
            onClick={() => exportData('csv')}
            icon={<FiDownload />}
            size="md"
          >
            Export Data
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex border-b border-gray-200 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {['overview', 'users', 'activity', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm relative flex items-center ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'overview' && <FiBarChart2 className="mr-2" />}
            {tab === 'users' && <FiUsers className="mr-2" />}
            {tab === 'activity' && <FiActivity className="mr-2" />}
            {tab === 'settings' && <FiSettings className="mr-2" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                layoutId="underline"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {isLoading && (
        <motion.div 
          className="flex justify-center items-center h-96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
              transition: { 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear" 
              }
            }}
            className="relative h-16 w-16"
          >
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-blue-300 border-b-transparent rounded-full animate-spin-reverse"></div>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!isLoading && dashboardData && (
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="space-y-8"
          >
            {activeTab === 'overview' && (
              <>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {[
                    {
                      icon: <FiUsers size={24} />,
                      title: 'Total Users',
                      value: dashboardData.users.total.toLocaleString(),
                      color: 'bg-blue-100 text-blue-600'
                    },
                    {
                      icon: <FiActivity size={24} />,
                      title: 'Active Users',
                      value: dashboardData.users.active.toLocaleString(),
                      color: 'bg-green-100 text-green-600'
                    },
                    {
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ),
                      title: 'Retention Rate',
                      value: `${(dashboardData.users.retentionRate * 100).toFixed(1)}%`,
                      color: 'bg-purple-100 text-purple-600'
                    },
                    {
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      ),
                      title: 'Detections',
                      value: dashboardData.activity.detections.toLocaleString(),
                      color: 'bg-yellow-100 text-yellow-600'
                    }
                  ].map((metric, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                      }}
                      whileHover={{ y: -5 }}
                    >
                        <Card>
                          <div className="hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center p-5">
                          <div className={`p-3 rounded-full ${metric.color} mr-4`}>
                          {metric.icon}
                          </div>
                          <div>
                          <p className="text-sm text-gray-500">{metric.title}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                          </div>
                          </div>
                          </div>
                        </Card>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <h3 className="text-lg font-semibold mb-4 px-5 pt-5">Activity Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dashboardData.activity.dailyActivity}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="detections" stroke="#3B82F6" />
                        <Line type="monotone" dataKey="generations" stroke="#10B981" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card>
                    <h3 className="text-lg font-semibold mb-4 px-5 pt-5">Activity Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Detections', value: dashboardData.activity.detections },
                            { name: 'Authentication Checks', value: dashboardData.activity.audioGenerations },
                            { name: 'Feedback', value: dashboardData.activity.feedbackSubmissions },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>
              </>
            )}

            {activeTab === 'users' && (
              <motion.div>
                <Card>
                  <h3 className="text-lg font-semibold mb-4 p-5">User Growth</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={[
                      { month: 'Jan', users: 120 },
                      { month: 'Feb', users: 210 },
                      { month: 'Mar', users: 350 },
                      { month: 'Apr', users: 420 },
                      { month: 'May', users: 580 },
                      { month: 'Jun', users: 720 },
                    ]}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold mb-4 p-5">Detection Activity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.activity.dailyActivity}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="detections" stroke="#3B82F6" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-4 p-5">Audio Generations</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.activity.dailyActivity}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="generations" stroke="#10B981" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div>
                <Card>
                  <h3 className="text-lg font-semibold mb-6 p-5 border-b border-gray-100">System Settings</h3>
                  
                  <div className="space-y-6 p-5">
                    {[
                      {
                        title: 'API Latency',
                        description: 'Average response time',
                        value: `${dashboardData.systemStatus.apiLatency}ms`,
                        progress: null
                      },
                      {
                        title: 'System Uptime',
                        description: 'Last 30 days',
                        value: `${dashboardData.systemStatus.uptime}%`,
                        progress: null
                      },
                      {
                        title: 'Storage Usage',
                        description: 'Audio files storage',
                        value: `${dashboardData.systemStatus.storage}% used`,
                        progress: dashboardData.systemStatus.storage
                      }
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        className="flex items-center justify-between"
                        whileHover={{ x: 5 }}
                      >
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        {item.progress ? (
                          <div className="w-48">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-500" 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                              />
                            </div>
                            <div className="text-right text-sm mt-1">
                              {item.value}
                            </div>
                          </div>
                        ) : (
                          <span className="font-mono">{item.value}</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;