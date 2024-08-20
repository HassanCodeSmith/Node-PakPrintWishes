const requestQuote = (
  adminName,
  customerName,
  email,
  phone,
  colorOption,
  comment,
  height,
  width,
  length,
  printingType,
  q1,
  q2,
  q3,
  boxType,
  typeCard
) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Quote Request - ${customerName}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">Quote Request - ${customerName}</h2>
        <p>Dear ${adminName},</p>
        <p>A quote has been requested by ${customerName}. Please find the quote details below:</p>
        
        <h3>Customer Details:</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
        <h3>Quote Details:</h3>
        <p><strong>Color Option:</strong> ${colorOption}</p>
        <p><strong>Comment:</strong> ${comment}</p>
        <p><strong>Height:</strong> ${height}</p>
        <p><strong>Width:</strong> ${width}</p>
        <p><strong>Length:</strong> ${length}</p>
        <p><strong>Printing Type:</strong> ${printingType}</p>
        <p><strong>Quantity 1:</strong>${q1}</p>
        <p><strong>Quantity 2:</strong>${q2}</p>
        <p><strong>Quantity 3:</strong>${q3}</p>
        <p><strong>Box Type:</strong>${boxType}</p>
        <p><strong>Type of Card:</strong>${typeCard}</p>
        
        <p>Please contact the customer at ${email} or ${phone} to provide the quote and discuss further details.</p>
        
        <p>Thank you for your attention to this request.</p>
        
        <p>Best regards,</p>
        <p>The Pak PrintWishes Team</p>
    </div>
</body>
</html>
`;
};

module.exports = requestQuote;
