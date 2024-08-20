const updateOrderStatus = (orderNumber, name, currentStatus) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Order Status Update - Order Number: ${orderNumber}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">Order Status Update - Order Number: ${orderNumber}</h2>
        <p>Dear ${name},</p>
        <p>We would like to inform you that the status of your order with Order Number: ${orderNumber} has been updated.</p>
        
        <h3>Updated Order Status:</h3>
        <p><strong>Current Status:</strong> ${currentStatus}</p>
        
        <p>Please note that the status of your order may change as it progresses through the fulfillment process. We will keep you informed of any further updates.</p>
        
        <p>If you have any questions or need assistance regarding your order, please feel free to contact our customer support team at [Customer Support Email] or call us at [Customer Support Phone Number].</p>
        
        <p>Thank you for choosing Pak PrintWishes.</p>
        
        <p>Best regards,</p>
        <p>The Pak PrintWishes Team</p>
    </div>
</body>
</html>
`;
};

module.exports = updateOrderStatus;
