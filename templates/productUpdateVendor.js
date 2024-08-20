const productUpdateVendor = (name, vname, productName) => {
  return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Update Notification</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Product Update Notification</h2>
        <p>Hello ${name},</p>
        
        <p>We wanted to inform you that a vendor ${vname} has updated a product: ${productName}. </p>

        <p>Check It Out For Approval.</p>

        <p>Thank you for your cooperation.</p>

        <p>Best regards,<br>
        Team Pak PrintWishes</p>
    </div>
</body>
</html>

`;
};

module.exports = productUpdateVendor;
