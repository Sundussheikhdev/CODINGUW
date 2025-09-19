"use client";

import { Company } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

interface CompanyProfileProps {
  company: Company;
}

export default function CompanyProfile({ company }: CompanyProfileProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusText = (status: boolean) => {
    return status ? "Completed" : "Pending";
  };

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Company Profile</h2>
      </div>
      <div className="px-6 py-4 space-y-6">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {company.name}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Sector:</span>
              <span className="ml-2 font-medium">{company.sector}</span>
            </div>
            <div>
              <span className="text-gray-600">Target Raise:</span>
              <span className="ml-2 font-medium">
                {formatCurrency(company.targetRaise)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Annual Revenue:</span>
              <span className="ml-2 font-medium">
                {formatCurrency(company.revenue)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Documents:</span>
              <span className="ml-2 font-medium">
                {company.documents?.length || 0} files
              </span>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(company.kycVerified)}
                <span className="ml-2 text-sm text-gray-800">KYC Verified</span>
              </div>
              <span
                className={`text-sm font-medium ${getStatusColor(
                  company.kycVerified
                )}`}
              >
                {getStatusText(company.kycVerified)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(company.financialsLinked)}
                <span className="ml-2 text-sm text-gray-800">Financials Linked</span>
              </div>
              <span
                className={`text-sm font-medium ${getStatusColor(
                  company.financialsLinked
                )}`}
              >
                {getStatusText(company.financialsLinked)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon((company.documents?.length || 0) >= 3)}
                <span className="ml-2 text-sm text-gray-800">Docs Uploaded (3+)</span>
              </div>
              <span
                className={`text-sm font-medium ${getStatusColor(
                  (company.documents?.length || 0) >= 3
                )}`}
              >
                {getStatusText((company.documents?.length || 0) >= 3)}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        {company.documents && company.documents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Recent Documents
            </h4>
            <div className="space-y-2">
              {company.documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between text-sm text-gray-800"
                >
                  <span className="text-gray-600 truncate">{doc.name}</span>
                  <span className="text-gray-600">
                    {formatFileSize(doc.size)}
                  </span>
                </div>
              ))}
              {company.documents.length > 3 && (
                <div className="text-sm text-gray-600">
                  +{company.documents.length - 3} more files
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
