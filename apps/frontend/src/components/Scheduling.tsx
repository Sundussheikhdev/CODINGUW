"use client";

import { Calendar, ExternalLink } from "lucide-react";

export default function Scheduling() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Book a Call</h2>
        <p className="text-sm text-gray-600">
          Schedule a meeting with our investment team
        </p>
      </div>

      <div className="px-6 py-8">
        <div className="text-center">
          <Calendar className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to discuss your investment?
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Book a call with our investment team to discuss your company&apos;s
            potential and next steps.
          </p>

          {/* Cal.com Integration */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Schedule Your Call
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Choose a time that works for you. We&apos;ll send you a calendar
              invite with meeting details.
            </p>

            {/* Cal.com Widget Placeholder */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
              <Calendar className="mx-auto h-8 w-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-500 mb-4">
                Cal.com scheduling widget would be embedded here
              </p>
              <a
                href="https://cal.com/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Cal.com
              </a>
            </div>
          </div>

          {/* Meeting Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900">Duration</div>
              <div className="text-gray-600">30-45 minutes</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">Format</div>
              <div className="text-gray-600">Video call</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">Preparation</div>
              <div className="text-gray-600">Review your pitch deck</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
