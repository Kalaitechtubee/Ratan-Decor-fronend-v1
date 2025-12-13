import React from 'react';

const TabNavigation = ({ tabs, activeTab, handleTabChange }) => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
    <nav className="flex border-b border-neutral-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-neutral-50 ${
            activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-neutral-600'
          }`}
          onClick={() => handleTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleTabChange(tab.id)}
        >
          <tab.icon className="text-base" />
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default TabNavigation;