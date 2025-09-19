"use client";

import { InvestabilityScore } from "@/types";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface InvestabilityScoreCardProps {
  score: InvestabilityScore | null;
}

export default function InvestabilityScoreCard({
  score,
}: InvestabilityScoreCardProps) {
  if (!score) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Investability Score
          </h2>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500">Loading score...</div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 60) return <TrendingUp className="h-6 w-6" />;
    return <TrendingDown className="h-6 w-6" />;
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Investability Score
        </h2>
      </div>
      <div className="px-6 py-6">
        {/* Score Display */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(
              score.score
            )} mb-4`}
          >
            <span
              className={`text-3xl font-bold ${getScoreColor(score.score)}`}
            >
              {score.score}
            </span>
          </div>
          <div className="flex items-center justify-center mb-2">
            {getScoreIcon(score.score)}
            <span className="ml-2 text-lg font-medium text-gray-900">
              out of 100
            </span>
          </div>
          <p className="text-sm text-gray-600">{score.recommendation}</p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Score Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">KYC Verification</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {score.breakdown.kyc}/30
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.breakdown.kyc / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Financials Linked</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {score.breakdown.financials}/20
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.breakdown.financials / 20) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Documentation</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {score.breakdown.documents}/25
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.breakdown.documents / 25) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {score.breakdown.revenue}/25
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.breakdown.revenue / 25) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Recommendations
          </h3>
          <div className="space-y-2">
            {score.reasons.map((reason, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 flex items-start"
              >
                <span className="text-gray-500 mr-2">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
