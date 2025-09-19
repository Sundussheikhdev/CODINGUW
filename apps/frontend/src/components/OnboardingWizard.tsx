"use client";

import { useState } from "react";
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Company, CreateCompanyData, KycData, FinancialsData } from "@/types";

interface OnboardingWizardProps {
  onComplete: (company: Company) => void;
}

const steps = [
  { id: 1, title: "Company Basics", description: "Tell us about your company" },
  { id: 2, title: "KYC Verification", description: "Verify your identity" },
  { id: 3, title: "Link Financials", description: "Connect your bank account" },
];

export default function OnboardingWizard({
  onComplete,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [companyData, setCompanyData] = useState<CreateCompanyData>({
    name: "",
    sector: "",
    targetRaise: 0,
    revenue: 0,
  });
  const [kycData, setKycData] = useState<KycData>({
    email: "demo@example.com",
  });
  const [financialsData, setFinancialsData] = useState<FinancialsData>({
    token: "",
  });

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    try {
      if (currentStep === 1) {
        // Create company
        await apiClient.createCompany(companyData);
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Verify KYC
        await apiClient.verifyKyc(kycData);
        setCurrentStep(3);
      } else if (currentStep === 3) {
        // Link financials
        const result = await apiClient.linkFinancials(financialsData);
        onComplete(result.company);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Onboarding error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          companyData.name &&
          companyData.sector &&
          companyData.targetRaise > 0 &&
          companyData.revenue >= 0
        );
      case 2:
        return kycData.email;
      case 3:
        return financialsData.token;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        {/* Progress indicator */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : currentStep === step.id ? (
                    <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {step.id}
                      </span>
                    </div>
                  ) : (
                    <Circle className="h-6 w-6 text-gray-500" />
                  )}
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-800">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Company Basics
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Sector
                  </label>
                  <select
                    value={companyData.sector}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, sector: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a sector</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Target Raise ($)
                    </label>
                    <input
                      type="number"
                      value={companyData.targetRaise}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          targetRaise: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Annual Revenue ($)
                    </label>
                    <input
                      type="number"
                      value={companyData.revenue}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          revenue: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                KYC Verification
              </h2>
              <p className="text-gray-600">
                We need to verify your identity to comply with regulations.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={kycData.email}
                  onChange={(e) =>
                    setKycData({ ...kycData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> This will automatically verify
                  your identity for testing purposes.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Link Financials
              </h2>
              <p className="text-gray-600">
                Connect your bank account to share financial data securely.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Bank Token
                </label>
                <input
                  type="text"
                  value={financialsData.token}
                  onChange={(e) =>
                    setFinancialsData({
                      ...financialsData,
                      token: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bank connection token"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> Enter any token to simulate bank
                  connection.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              {currentStep === 3 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
