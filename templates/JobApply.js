const applyJob = (
  jobTitle,
  name,
  applicantName,
  applicantEmail,
  applicantPhone
) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <title>New Job Application - ${jobTitle}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">New Job Application - ${jobTitle}</h2>
        <p>Dear ${name},</p>
        <p>A new job application has been submitted for the position of ${jobTitle}. Here are the details:</p>
        
        <h3>Applicant Details:</h3>
        <p><strong>Name:</strong> ${applicantName}</p>
        <p><strong>Email:</strong> ${applicantEmail}</p>
        <p><strong>Phone:</strong> ${applicantPhone}</p>
        
        <p>Please review the application and take appropriate action. You can contact the applicant at [Applicant Email] or [Applicant Phone] for further communication or to schedule an interview.</p>
        
        <p>Thank you for your attention to this matter.</p>
        
        <p>Best regards,</p>
        <p>The Pak PrintWishes Team</p>
    </div>
</body>
</html>
`;
};

module.exports = applyJob;
