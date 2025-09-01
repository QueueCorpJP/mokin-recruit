import React from 'react';
import SearchClient from './SearchClient';
import SearchClientTest from './SearchClientTest';
import SearchClientSimple from './SearchClientSimple';
import SearchClientDebug from './SearchClientDebug';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default function SearchPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
      
        {/* <SearchClientSimple /> */}
        {/* <SearchClientTest /> */}
        <SearchClient />
        {/* <SearchClientDebug /> */}
      </div>
    </>
  );
}
