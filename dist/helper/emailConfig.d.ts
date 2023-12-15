/**
 * Initialize the email configuration.
 */
declare function initEmail(): void;
/**
 * Update the email configuration dynamically.
 * @param {Object} config - Email configuration object.
 */
declare function updateEmailConfig(config: any): {
    status: boolean;
    message: string;
};
/**
 * Send an email using the configured email settings.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} message - HTML content for the email message.
 * @returns {Promise<void>} A Promise that resolves when the email is sent successfully.
 */
declare function sendEmail(to: any, subject: string, message: any): Promise<void>;
export { initEmail, updateEmailConfig, sendEmail, };
