'use client';

import { useState } from 'react';
import GlassCard from '@/components/common/glass-card';
import ASTListCard from './ast-list-card';
import ProfileCard from '../card/profile-card';
import { List, User } from 'lucide-react';

interface TabbedSidebarProps {
  headings?: { level: number; text: string }[];
}

export default function TabbedSidebar({ headings = [] }: TabbedSidebarProps) {
  const [activeTab, setActiveTab] = useState<'toc' | 'profile'>(headings.length > 0 ? 'toc' : 'profile');

  return (
    <GlassCard>
      {/* Tab Header */}
      <div className="flex border-b-2 border-slate-300 mb-4">
        {headings.length > 0 && (
          <button
            className={`flex items-center gap-2 px-4 py-2 -mb-[2px] ${
              activeTab === 'toc'
                ? 'text-green-700 border-b-2 border-green-700'
                : 'text-gray-500 hover:text-green-700'
            }`}
            onClick={() => setActiveTab('toc')}
          >
            <List className="w-4 h-4" />
            <span>目录</span>
          </button>
        )}
        <button
          className={`flex items-center gap-2 px-4 py-2 -mb-[2px] ${
            activeTab === 'profile'
              ? 'text-green-700 border-b-2 border-green-700'
              : 'text-gray-500 hover:text-green-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="w-4 h-4" />
          <span>关于</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'toc' && headings.length > 0 ? (
          <ASTListCard headings={headings} />
        ) : (
          <ProfileCard />
        )}
      </div>
    </GlassCard>
  );
}
