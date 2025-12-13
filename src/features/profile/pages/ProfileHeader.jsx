import React from 'react';
import { FaUser, FaIdCard } from 'react-icons/fa';

const ProfileHeader = ({ profile, getRoleColor, getStatusIcon, getStatusColor }) => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6 border border-neutral-100">
    <div className="bg-gradient-to-r from-primary to-primary/80 h-32" />
    <div className="px-6 pb-6 pt-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center">
            <FaUser className="text-4xl text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">{profile?.name || 'User'}</h1>
            <p className="text-sm text-neutral-600">{profile?.email || 'N/A'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile?.role)}`}>
            <FaIdCard className="mr-1.5" />
            {profile?.role || 'N/A'}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile?.status)}`}>
            {getStatusIcon(profile?.status)}
            <span className="ml-1.5 capitalize">{profile?.status || 'N/A'}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;