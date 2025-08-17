'use client';

import { useState } from 'react';
import UserManagement from './UserManagement';
import MessagingSystem from './MessagingSystem';
import NewsManagement from './NewsManagement';
import PaymentHistory from './PaymentHistory';
import UserLevels from './UserLevels';
import PhrasesManagement from './PhrasesManagement';
import CorrectionsManagement from './CorrectionsManagement';

type AdminTab = 'users' | 'messaging' | 'news' | 'payments' | 'levels' | 'phrases' | 'corrections';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const tabs = [
    { id: 'users', name: 'User Management', icon: '👥', shortName: 'Users' },
    { id: 'messaging', name: 'Messaging', icon: '💬', shortName: 'Chat' },
    { id: 'news', name: 'News Management', icon: '📰', shortName: 'News' },
    { id: 'payments', name: 'Payment History', icon: '💰', shortName: 'Payments' },
    { id: 'levels', name: 'User Levels', icon: '⭐', shortName: 'Levels' },
    { id: 'phrases', name: 'Daily Phrases', icon: '💭', shortName: 'Phrases' },
    { id: 'corrections', name: 'Corrections', icon: '⚠️', shortName: 'Corrections' },
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
      case 'phrases':
        return <PhrasesManagement />;
      case 'corrections':
        return <CorrectionsManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Mobile Tab Navigation - Scrollable */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex px-4 sm:px-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`
                py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden text-xs font-medium">{tab.shortName}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
