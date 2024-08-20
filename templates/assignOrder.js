const assignOrder = (orderNumber, vendorName, adminEmail) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>New Order Assign - Order Number: ${orderNumber}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">New Order Assignment - Order Number: ${orderNumber}</h2>
        <p>Hello ${vendorName},</p>
        <p>The admin has assigned the complete order with Order Number: ${orderNumber} to your vendor account. Please find the order details below:</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong> ${orderNumber}</p>


        
        <p>Please take immediate action to process and fulfill the assigned order. If you have any questions or require further information, please contact the admin at ${adminEmail}.</p>
        
        <p>Thank you for your prompt attention to this matter.</p>
        
        <p>Best regards,</p>
        <p>The Pak PrintWishes Team</p>
    </div>
</body>
</html>
`;
};

module.exports = assignOrder;
