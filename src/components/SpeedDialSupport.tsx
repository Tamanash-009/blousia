/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";

export const SpeedDialSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { requireAuth } = useApp();

  const supportOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      colorClass: "bg-[#00E676] text-white hover:bg-[#00c853]",
      href: "https://wa.me/918509112927?text=Hello%20Blousia%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20your%20designer%20blouses.",
      target: "_blank",
    },
    {
      id: "call",
      label: "Call Now",
      icon: Phone,
      colorClass: "bg-[#1976D2] text-white hover:bg-[#1565C0]",
      href: "tel:+918509112927",
      target: "_self",
    },
    {
      id: "email",
      label: "Email Support",
      icon: Mail,
      colorClass: "bg-[#FF9100] text-white hover:bg-[#FF8000]",
      href: "mailto:nilanjanahatuya@gmail.com?subject=Blousia%20Support%20Inquiry",
      target: "_self",
    },
    {
      id: "maps",
      label: "Find Us",
      icon: MapPin,
      colorClass: "bg-[#E91E63] text-white hover:bg-[#D81B60]",
      href: "https://maps.app.goo.gl/xpeScaZd2C2M8NNR8",
      target: "_blank",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4">
      {/* Speed Dial Stack */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end space-y-3.5 mb-2">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 15, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.85 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: (supportOptions.length - 1 - index) * 0.05,
                  }}
                  className="flex items-center space-x-3 group"
                >
                  {/* Option Label / Pill Badge */}
                  <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-xl px-3 py-1.5 transition-all group-hover:shadow-md cursor-pointer">
                    <a
                      href={option.href}
                      target={option.target}
                      rel="noreferrer"
                      className="text-[11px] font-bold tracking-wide text-gray-800 dark:text-gray-200 block"
                    >
                      {option.label}
                    </a>
                  </div>

                  {/* Option Button / Circle */}
                  <button
                    onClick={() => {
                      requireAuth(() => {
                        window.open(option.href, option.target);
                      });
                    }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer ${option.colorClass}`}
                  >
                    <Icon size={18} className="stroke-[2.5]" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="speed-dial-trigger"
        aria-label="Support speed dial menu"
        className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
          isOpen
            ? "bg-white border border-gray-150 text-gray-800 hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200"
            : "bg-gradient-to-tr from-blue-600 to-sky-400 text-white hover:from-blue-700 hover:to-sky-500 shadow-blue-500/25"
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex items-center justify-center"
        >
          {isOpen ? <X size={24} className="stroke-[2.5]" /> : <Plus size={28} className="stroke-[2.5]" />}
        </motion.div>
      </button>
    </div>
  );
};
