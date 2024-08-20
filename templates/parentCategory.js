const parentCatagoryMail = (name, vendorName, email, category) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>New Parent Category Created</title>
</head>
<body>
    <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
        <h1>New Parent Category Created</h1>
    </div>
    <div style="margin: 20px;">
        <p>Hello ${name},</p>
        <p>A new vendor has created a new parent category. Here are the details:</p>
        <ul>
            <li><strong>Vendor Name:</strong> ${vendorName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Parent Category Name:</strong> ${category}</li>
        </ul>
        <p>Please review the new category and ensure it aligns with your platform's guidelines and requirements.</p>
        <p>Thank you for your attention!</p>
    </div>
    <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
        <p>&copy; 2023 Pak Printwishes. All rights reserved.</p>
    </div>
</body>
</html>



`;
};

module.exports = parentCatagoryMail;
