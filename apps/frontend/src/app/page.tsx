'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Company, InvestabilityScore } from '@/types';
import OnboardingWizard from '@/components/OnboardingWizard';
import Dashboard from '@/components/Dashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [company, setCompany] = useState<Company | null>(null);
  const [score, setScore] = useState<InvestabilityScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [companyData, scoreData] = await Promise.all([
        apiClient.getCompany().catch(() => null),
        apiClient.getScore().catch(() => null),
      ]);
      
      setCompany(companyData);
      setScore(scoreData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompany(updatedCompany);
    loadData(); // Reload score after company update
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show onboarding if no company exists
  if (!company) {
    return <OnboardingWizard onComplete={handleCompanyUpdate} />;
  }

  // Show dashboard if company exists
  return (
    <Dashboard 
      company={company} 
      score={score}
      onDataUpdate={loadData}
    />
  );
}