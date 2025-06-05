export const passwordResetTemplate = (resetLink: string, companyName: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4a6fa5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4a6fa5;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Password Reset Request</h2>
    </div>
    <div class="content">
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <p>
            <a href="${resetLink}" class="button">Reset Password</a>
        </p>
        <p>If you didn't request this, please ignore this email or contact support if you have questions.</p>
        <p>This link will expire in 1 hour for security reasons.</p>
    </div>
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
    </div>
</body>
</html>
`;
}
export const passwordResetText = (resetLink: string) => {
    return `To reset your password, please visit the following link:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.`;
}