// No icon imports needed - we'll use string identifiers
export const dashboardData = {
  stats: [
    { 
      id: 'messages', 
      value: '12,450', 
      change: '+24%', 
      trend: 'up',
      icon: 'MessageSquare',
      color: 'blue'
    },
    { 
      id: 'sales', 
      value: '$4,290', 
      change: '+18%', 
      trend: 'up',
      icon: 'TrendingUp',
      color: 'green'
    },
    { 
      id: 'csat', 
      value: '4.8/5', 
      change: '+0.2', 
      trend: 'up',
      icon: 'CheckCircle2',
      color: 'purple'
    },
    { 
      id: 'saved', 
      value: '142h', 
      change: '+12h', 
      trend: 'up',
      icon: 'Clock',
      color: 'orange'
    },
  ],

  platforms: [
    { name: 'WhatsApp', icon: 'Phone', messages: 5230, growth: 24, color: '#25D366', bg: 'bg-green-50' },
    { name: 'Website', icon: 'Globe', messages: 3450, growth: 15, color: '#3b82f6', bg: 'bg-blue-50' },
    { name: 'Telegram', icon: 'Send', messages: 2100, growth: 8, color: '#0088cc', bg: 'bg-sky-50' },
    { name: 'Instagram', icon: 'Instagram', messages: 1670, growth: 32, color: '#E4405F', bg: 'bg-pink-50' },
  ],

  agents: [
    { id: '1', name: 'Sales Bot Alpha', role: 'Lead Gen', status: 'active', conversations: 1240, conversion: '18%' },
    { id: '2', name: 'Support Helper', role: 'Customer Service', status: 'active', conversations: 2100, conversion: 'N/A' },
    { id: '3', name: 'Real Estate Pro', role: 'Property Info', status: 'training', conversations: 45, conversion: '5%' },
    { id: '4', name: 'Booking Agent', role: 'Scheduling', status: 'paused', conversations: 890, conversion: '12%' },
  ],

  bookings: [
    { time: '14:00', customer: 'Sarah Connor', type: 'Demo Call', status: 'confirmed' },
    { time: '15:30', customer: 'John Smith', type: 'Support', status: 'pending' },
    { time: '16:45', customer: 'Mike Ross', type: 'Sales', status: 'confirmed' },
  ],

  activity: [
    { type: 'lead', text: 'New qualified lead from WhatsApp', time: '2m ago', icon: 'Users', color: 'text-green-600', bg: 'bg-green-100' },
    { type: 'invoice', text: 'Invoice #INV-2024 generated', time: '15m ago', icon: 'FileText', color: 'text-blue-600', bg: 'bg-blue-100' },
    { type: 'booking', text: 'Demo scheduled with John Doe', time: '1h ago', icon: 'Calendar', color: 'text-purple-600', bg: 'bg-purple-100' },
    { type: 'alert', text: 'High volume on Website Widget', time: '2h ago', icon: 'Zap', color: 'text-orange-600', bg: 'bg-orange-100' },
  ],

  chartData: {
    '7d': [
      { name: 'Mon', messages: 2400, automated: 1800 },
      { name: 'Tue', messages: 1398, automated: 1100 },
      { name: 'Wed', messages: 9800, automated: 8500 },
      { name: 'Thu', messages: 3908, automated: 3200 },
      { name: 'Fri', messages: 4800, automated: 4100 },
      { name: 'Sat', messages: 3800, automated: 3400 },
      { name: 'Sun', messages: 4300, automated: 3900 },
    ],
    '30d': [
      { name: 'Week 1', messages: 12400, automated: 9800 },
      { name: 'Week 2', messages: 15398, automated: 12100 },
      { name: 'Week 3', messages: 18800, automated: 15500 },
      { name: 'Week 4', messages: 22908, automated: 19200 },
    ],
    'year': [
      { name: 'Jan', messages: 45000, automated: 35000 },
      { name: 'Feb', messages: 52000, automated: 42000 },
      { name: 'Mar', messages: 48000, automated: 38000 },
      { name: 'Apr', messages: 61000, automated: 51000 },
      { name: 'May', messages: 55000, automated: 45000 },
      { name: 'Jun', messages: 67000, automated: 57000 },
    ]
  }
};

export const agentsList = [
  {
    id: '1',
    name: 'Support Bot',
    role: 'Customer Support',
    status: 'active' as const,
    stats: { conversations: 1250, users: 850, satisfaction: 98 }
  },
  {
    id: '2',
    name: 'Sales Assistant',
    role: 'Sales',
    status: 'active' as const,
    stats: { conversations: 850, users: 420, satisfaction: 95 }
  },
  {
    id: '3',
    name: 'Onboarding Helper',
    role: 'Assistant',
    status: 'training' as const,
    stats: { conversations: 120, users: 45, satisfaction: 88 }
  }
];
