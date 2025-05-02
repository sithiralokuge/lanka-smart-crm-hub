export const generateDataDeletionEmail = (customerId: string, deletionToken: string) => {
  const deletionLink = `${window.location.origin}/data-deletion/${customerId}?token=${deletionToken}`;
  
  return {
    subject: "Your Data Deletion Request",
    body: `
      Dear Customer,

      You have requested to delete your data from our system. 
      To confirm this request and permanently delete your data, please click the link below:

      ${deletionLink}

      This link will expire in 24 hours for security purposes.
      If you did not request this deletion, please ignore this email.

      Best regards,
      Your Company Name
    `
  };
};