const orderPlaced = (name, orderNumber, address) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation - Your Purchase is Complete!</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">Order Confirmation - Your Purchase is Complete!</h2>
        <p>Dear ${name},</p>
        <p>We are thrilled to inform you that your order has been successfully placed and is now being processed. Thank you for choosing PakPrint Wishes as your preferred shopping destination. We appreciate your business and look forward to delivering an exceptional shopping experience.</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong> ${orderNumber}</p
        <p><strong>Shipping Address:</strong> ${address}</p>

        <p>If you have any questions or need further assistance, please feel free to contact our customer support team at info.pak.printwishes@gmail.com or call us at +92 300 7605006.</p>
        
        <p>Thank you for shopping with us!</p>
        
        <p>Sincerely,</p>
        <p>The Pak PrintWishes Team</p>
    </div>
</body>
</html>`;
};

module.exports = orderPlaced;
