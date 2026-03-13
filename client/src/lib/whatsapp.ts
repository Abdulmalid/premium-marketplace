/**
 * WhatsApp Integration Utilities
 * Handles WhatsApp messaging and deep links for customer inquiries
 */

export interface WhatsAppMessage {
  phoneNumber: string;
  message: string;
  listingTitle?: string;
  listingPrice?: number;
}

/**
 * Format phone number to WhatsApp format (remove special characters, add country code)
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Add country code if not present (assuming Nigeria +234)
  if (cleaned.length === 10 && cleaned.startsWith("0")) {
    return `234${cleaned.slice(1)}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return `234${cleaned.slice(1)}`;
  }

  // If already has country code
  if (cleaned.startsWith("234")) {
    return cleaned;
  }

  // Return as-is if already formatted
  return cleaned;
};

/**
 * Generate WhatsApp message for inquiry
 */
export const generateInquiryMessage = (data: {
  customerName: string;
  listingTitle: string;
  listingPrice?: number;
  message?: string;
}): string => {
  let msg = `Hello! I'm interested in the following listing:\n\n`;
  msg += `*${data.listingTitle}*\n`;

  if (data.listingPrice) {
    const formattedPrice = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(data.listingPrice);
    msg += `Price: ${formattedPrice}\n`;
  }

  msg += `\nCustomer: ${data.customerName}\n`;

  if (data.message) {
    msg += `Message: ${data.message}\n`;
  }

  msg += `\nPlease provide more details. Thank you!`;

  return msg;
};

/**
 * Generate WhatsApp deep link for sending message
 */
export const generateWhatsAppLink = (
  phoneNumber: string,
  message: string
): string => {
  const formatted = formatPhoneNumber(phoneNumber);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${formatted}?text=${encoded}`;
};

/**
 * Send WhatsApp message via deep link (opens WhatsApp)
 */
export const sendWhatsAppMessage = (
  phoneNumber: string,
  message: string
): void => {
  const link = generateWhatsAppLink(phoneNumber, message);
  window.open(link, "_blank");
};

/**
 * Send inquiry via WhatsApp
 */
export const sendInquiryViaWhatsApp = (inquiry: {
  phoneNumber: string;
  customerName: string;
  listingTitle: string;
  listingPrice?: number;
  message?: string;
}): void => {
  const message = generateInquiryMessage({
    customerName: inquiry.customerName,
    listingTitle: inquiry.listingTitle,
    listingPrice: inquiry.listingPrice,
    message: inquiry.message,
  });

  sendWhatsAppMessage(inquiry.phoneNumber, message);
};

/**
 * Validate WhatsApp phone number
 */
export const isValidWhatsAppNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");

  // Must be at least 10 digits (Nigeria format)
  if (cleaned.length < 10) return false;

  // Must be at most 15 digits (international standard)
  if (cleaned.length > 15) return false;

  return true;
};

/**
 * Format WhatsApp number for display
 */
export const formatWhatsAppNumberForDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  // Nigeria format: +234 (0) XXX XXX XXXX
  if (cleaned.startsWith("234")) {
    const rest = cleaned.slice(3);
    return `+234 (0) ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }

  // Generic format
  if (cleaned.length === 10) {
    return `+234 (0) ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Create WhatsApp group invitation link
 */
export const createWhatsAppGroupLink = (groupName: string): string => {
  // This would typically be handled by WhatsApp Business API
  // For now, return a placeholder
  return `https://chat.whatsapp.com/group/${groupName}`;
};

/**
 * Schedule WhatsApp message (requires WhatsApp Business API)
 */
export const scheduleWhatsAppMessage = async (
  phoneNumber: string,
  message: string,
  scheduledTime: Date
): Promise<void> => {
  // This would require backend integration with WhatsApp Business API
  // For now, this is a placeholder
  console.log(
    `Scheduled message to ${phoneNumber} at ${scheduledTime.toISOString()}`
  );
};

/**
 * Send WhatsApp notification to admin about new inquiry
 */
export const notifyAdminViaWhatsApp = (
  adminPhone: string,
  inquiry: {
    customerName: string;
    customerPhone: string;
    listingTitle: string;
    listingPrice?: number;
  }
): void => {
  const message = `🔔 *New Inquiry Received*\n\n` +
    `Customer: ${inquiry.customerName}\n` +
    `Phone: ${inquiry.customerPhone}\n` +
    `Listing: ${inquiry.listingTitle}\n` +
    `${inquiry.listingPrice ? `Price: ₦${inquiry.listingPrice.toLocaleString()}` : ""}\n\n` +
    `Please follow up with the customer.`;

  sendWhatsAppMessage(adminPhone, message);
};
