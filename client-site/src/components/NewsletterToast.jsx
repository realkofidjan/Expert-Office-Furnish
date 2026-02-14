import React, { useState, useEffect } from "react";
import { CheckCircle, X, Mail, Gift } from "lucide-react";

export default function NewsletterToast({
  message,
  type = "success",
  onClose,
  autoClose = 5000,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "discount":
        return <Gift className="w-6 h-6 text-yellow-600" />;
      default:
        return <Mail className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "from-green-50 to-green-100 border-green-200";
      case "discount":
        return "from-yellow-50 to-yellow-100 border-yellow-200";
      default:
        return "from-blue-50 to-blue-100 border-blue-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-gradient-to-br ${getBackgroundColor()} border-2 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{getIcon()}</div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {type === "discount"
                ? "Discount Code Received!"
                : "Subscription Confirmed!"}
            </h3>
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              type === "discount"
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
