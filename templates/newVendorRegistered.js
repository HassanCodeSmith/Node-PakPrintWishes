const vendorRegistered = (name, vendorName, email, phone) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>New Vendor Registered</title>
</head>
<body>
    <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
        <h1>New Vendor Register Request</h1>
    </div>
    <div style="margin: 20px;">
        <p>Hello ${name},</p>
        <p>A new vendor has registered on Pak Print Wishes & waiting for your approval. Here are the details:</p>
        <ul>
            <li><strong>Vendor Name:</strong> ${vendorName} </li>
            <li><strong>Email:</strong> ${email} </li>
            <li><strong>Phone Number:</strong> ${phone} </li>
        </ul>
        <p>Please review the vendor's information and take any necessary actions to onboard them into your system.</p>
        <p>Thank you for your attention!</p>
    </div>
    <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
        <p>&copy; 2023 Pak Printwishes. All rights reserved.</p>
    </div>
</body>
</html>


`;
};

module.exports = vendorRegistered;
