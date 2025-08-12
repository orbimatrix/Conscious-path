'use client';

import { useState } from 'react';
import UserManagement from './UserManagement';
import MessagingSystem from './MessagingSystem';
import NewsManagement from './NewsManagement';
import PaymentHistory from './PaymentHistory';
import UserLevels from './UserLevels';


type AdminTab = 'users' | 'messaging' | 'news' | 'payments' | 'levels';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const tabs = [
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'messaging', name: 'Messaging', icon: '💬' },
    { id: 'news', name: 'News Management', icon: '📰' },
    { id: 'payments', name: 'Payment History', icon: '💰' },
    { id: 'levels', name: 'User Levels', icon: '⭐' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'messaging':
        return <MessagingSystem />;
      case 'news':
        return <NewsManagement />;
      case 'payments':
        return <PaymentHistory />;
      case 'levels':
        return <UserLevels />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
