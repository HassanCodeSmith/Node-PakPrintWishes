const adminOrderPlaced = (
  name,
  orderNumber,
  address,
  orderDate,
  userEmail,
  userPhone
) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>New Order Notification - ${orderNumber}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">New Order Notification - ${orderNumber}</h2>
        <p>Hello${name},</p>
        <p>A new order has been placed by a customer. Here are the order details:</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong>${orderNumber}</p>
        <p><strong>Order Date:</strong> ${orderDate}</p>
        <p><strong>Shipping Address:</strong>${address}</p>

        <p>Please take the necessary steps to process and fulfill this order as soon as possible. You can contact the customer at ${userEmail} or ${userPhone} for any order-related inquiries.</p>
        
        <p>Thank you for your prompt attention to this matter.</p>
        
        <p>Best regards,</p>
        <p>The Pak PrintWishes Team</p>
    </div>
</body>
</html>

`;
};

module.exports = adminOrderPlaced;
