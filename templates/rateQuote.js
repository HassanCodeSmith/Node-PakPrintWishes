const rateQuote = (quote) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <title>Quote Rate - ${quote.name}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">Quote Rate - ${quote.name}</h2>
        <p>Dear ${quote.name},</p>
        <p>We are pleased to provide you with a rate for the requested quote. Here are the details:</p>
        
        <h3>Quote Details:</h3>
        <p><strong>Color Option:</strong> ${quote.colorOption}</p>
        <p><strong>Comment:</strong> ${quote.comment}</p>
        <p><strong>Height:</strong> ${quote.height}</p>
        <p><strong>Width:</strong> ${quote.width}</p>
        <p><strong>Length:</strong> ${quote.length}</p>
        <p><strong>Printing Type:</strong> ${quote.printingType}</p>
        <p><strong>Quantity 1:</strong> ${quote.quantity_1}</p>
        <p><strong>Quantity 2:</strong> ${quote.quantity_2}</p>
        <p><strong>Quantity 3:</strong> ${quote.quantity_3}</p>
        <p><strong>Box Type:</strong> ${quote.boxType}</p>
        <p><strong>Type of Card:</strong> ${quote.typeCard}</p>
        <p><strong>Status:</strong> ${quote.status}</p>
    
        <p><strong>Rate:</strong> ${quote.rate}</p>
        
        <p>If you have any further questions or need to discuss the quote details, please feel free to contact us at [Your Company Email] or [Your Company Phone]. We look forward to serving you!</p>
        
        <p>Thank you for considering our services.</p>
        
        <p>Best regards,</p>
        <p>The Pak PrintWishes Team</p>
    </div>
</body>
</html>
`;
};

module.exports = rateQuote;
