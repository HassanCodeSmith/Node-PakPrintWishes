const payAmount = (VendorName, payment, paymentDate) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Payment Received - ${VendorName}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">Payment Received - ${VendorName}</h2>
        <p>Dear ${VendorName},</p>
        <p>We are pleased to inform you that a payment has been successfully received for the products/services you provided. The payment details are as follows:</p>
        
        <h3>Payment Details:</h3>
        <p><strong>Payment Amount:</strong> ${payment}</p>
        <p><strong>Payment Date:</strong> ${paymentDate}</p>
        
        <p>We would like to express our gratitude for your excellent work and timely delivery. We appreciate your commitment to providing high-quality products/services to our customers.</p>
        
        <p>If you have any questions or concerns regarding the payment or any other matter, please feel free to contact our finance department at [Your Company Finance Email] or [Your Company Finance Phone Number].</p>
        
        <p>Thank you for your outstanding contribution to our business. We look forward to continuing our successful partnership.</p>
        
        <p>Best regards,</p>
        <p>The Pak PrintWishes Team</p>
    </div>
</body>
</html>
`;
};

module.exports = payAmount;
