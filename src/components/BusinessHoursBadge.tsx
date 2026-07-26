/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Blousia® Business Hours status tracker based on India Standard Time (IST).
 */

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export interface BusinessStatus {
  isOpen: boolean;
  isClosingSoon: boolean;
  statusText: string;
  badgeColor: string;
  currentIstTimeString: string;
}

export function getIstBusinessStatus(): BusinessStatus {
  // Get current date/time
  const now = new Date();
  
  // Calculate IST (UTC + 5:30)
  // getTimezoneOffset() returns difference in minutes between local time and UTC.
  // Converting local time to UTC then adding 5 hours 30 mins.
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(utcTime + istOffset);
  
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  
  // Total minutes from midnight
  const currentMinutes = hours * 60 + minutes;
  
  // 10:30 AM = 10 * 60 + 30 = 630
  const openMinutes = 10 * 60 + 30;
  
  // 8:00 PM = 20 * 60 = 1200
  const closeMinutes = 20 * 60;
  
  let isOpen = false;
  let isClosingSoon = false;
  let statusText = "Closed";
  let badgeColor = "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400";
  
  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    isOpen = true;
    const minutesLeft = closeMinutes - currentMinutes;
    if (minutesLeft <= 30) {
      isClosingSoon = true;
      statusText = `Closing Soon (${minutesLeft} mins left)`;
      badgeColor = "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse";
    } else {
      statusText = "Open Now";
      badgeColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
    }
  } else {
    // Determine when it opens next
    statusText = "Closed (Opens at 10:30 AM IST)";
    badgeColor = "bg-gray-100 text-gray-800 dark:bg-slate-900 dark:text-gray-400";
  }
  
  // Format IST time for display support
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  const currentIstTimeString = `${displayHours}:${displayMinutes} ${ampm} IST`;
  
  return {
    isOpen,
    isClosingSoon,
    statusText,
    badgeColor,
    currentIstTimeString
  };
}

export const BusinessHoursBadge: React.FC<{ showTime?: boolean; className?: string }> = ({ 
  showTime = true,
  className = "" 
}) => {
  const [status, setStatus] = useState<BusinessStatus>(getIstBusinessStatus());

  useEffect(() => {
    // Refresh status every 30 seconds
    const interval = setInterval(() => {
      setStatus(getIstBusinessStatus());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${status.badgeColor}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${
          status.isOpen 
            ? status.isClosingSoon 
              ? "bg-amber-500" 
              : "bg-emerald-500" 
            : "bg-rose-500"
        }`} />
        {status.statusText}
      </span>
      {showTime && (
        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 font-mono font-bold">
          <Clock size={11} /> {status.currentIstTimeString}
        </span>
      )}
    </div>
  );
};
