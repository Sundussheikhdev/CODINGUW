"use client";

import { useState, useEffect } from "react";
import { Company, InvestabilityScore, Document, Notification } from "@/types";
import { apiClient } from "@/lib/api";
import CompanyProfile from "./CompanyProfile";
import InvestabilityScoreCard from "./InvestabilityScoreCard";
import DataRoom from "./DataRoom";
import Notifications from "./Notifications";
import Scheduling from "./Scheduling";

interface DashboardProps {
  company: Company;
  score: InvestabilityScore | null;
  onDataUpdate: () => void;
}

export default function Dashboard({ company, score, onDataUpdate }: DashboardProps) {
  const [documents, setDocuments] = useState<Document[]>(
    company.documents || []
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await apiClient.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const newDocument = await apiClient.uploadFile(file, company.id);
      setDocuments([...documents, newDocument]);
      await loadNotifications(); // Reload notifications
      onDataUpdate(); // Refresh score and company data
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationRead = async (id: string) => {
    try {
      await apiClient.markNotificationAsRead(id);
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "documents", name: "Data Room", icon: "📁" },
    { id: "schedule", name: "Book Call", icon: "📅" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {company.name}</p>
        </div>
        <Notifications
          notifications={notifications}
          onMarkAsRead={handleNotificationRead}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompanyProfile company={company} />
          <InvestabilityScoreCard score={score} />
        </div>
      )}

      {activeTab === "documents" && (
        <DataRoom
          documents={documents}
          onFileUpload={handleFileUpload}
          loading={loading}
        />
      )}

      {activeTab === "schedule" && <Scheduling />}
    </div>
  );
}
