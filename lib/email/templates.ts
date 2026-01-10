export const getWelcomeEmailTemplate = (companyName: string) => {
    const primaryColor = '#2563eb'; // Professional Blue
    const textColor = '#171717';
    const mutedColor = '#737373';
    const bgColor = '#ffffff';
    const borderColor = '#e5e5e5';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FirstStep</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: ${bgColor}; 
                color: ${textColor}; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                padding: 40px; 
                border: 1px solid ${borderColor}; 
                border-radius: 8px;
            }
            .logo { 
                font-size: 24px; 
                font-weight: 800; 
                letter-spacing: -0.025em; 
                margin-bottom: 32px;
                color: ${textColor};
            }
            .logo-f {
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: ${primaryColor};
                color: white;
                text-align: center;
                line-height: 32px;
                border-radius: 4px;
                margin-right: 8px;
            }
            h1 { 
                font-size: 28px; 
                font-weight: 700; 
                letter-spacing: -0.025em; 
                margin-bottom: 16px; 
                color: ${textColor};
            }
            p { 
                font-size: 16px; 
                line-height: 1.6; 
                margin-bottom: 24px; 
                color: ${mutedColor};
            }
            .cta-button { 
                display: inline-block; 
                background-color: ${primaryColor}; 
                color: #ffffff !important; 
                padding: 12px 24px; 
                border-radius: 6px; 
                text-decoration: none; 
                font-weight: 500; 
                font-size: 16px;
            }
            .footer { 
                margin-top: 40px; 
                padding-top: 24px; 
                border-top: 1px solid ${borderColor}; 
                font-size: 14px; 
                color: ${mutedColor};
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo"><span class="logo-f">F</span>FirstStep</div>
            <h1>Welcome, ${companyName}!</h1>
            <p>Your business profile has been successfully created. You now have access to the FirstStep platform, where you can manage your operations with clarity and control.</p>
            <p>Ready to get started? Access your dashboard to configure your services and monitor your system status.</p>
            <a href="http://localhost:3000/dashboard" class="cta-button">Go to Dashboard</a>
            <div class="footer">
                &copy; 2025 FirstStep SaaS. All rights reserved.<br>
                Empowering businesses with authoritative systems.
            </div>
        </div>
    </body>
    </html>
  `;
};

export const getResetCodeTemplate = (code: string) => {
    const primaryColor = '#2563eb'; // Professional Blue
    const textColor = '#171717';
    const mutedColor = '#737373';
    const bgColor = '#ffffff';
    const borderColor = '#e5e5e5';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Code</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: ${bgColor}; 
                color: ${textColor}; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                padding: 40px; 
                border: 1px solid ${borderColor}; 
                border-radius: 8px;
            }
            .logo { 
                font-size: 24px; 
                font-weight: 800; 
                letter-spacing: -0.025em; 
                margin-bottom: 32px;
            }
            .logo-f {
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: ${primaryColor};
                color: white;
                text-align: center;
                line-height: 32px;
                border-radius: 4px;
                margin-right: 8px;
            }
            h1 { 
                font-size: 24px; 
                font-weight: 700; 
                letter-spacing: -0.025em; 
                margin-bottom: 16px; 
            }
            p { 
                font-size: 16px; 
                line-height: 1.6; 
                margin-bottom: 24px; 
                color: ${mutedColor};
            }
            .code-box {
                background-color: #f8fafc;
                border: 1px solid ${borderColor};
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                margin: 32px 0;
            }
            .code {
                font-size: 42px;
                font-weight: 800;
                letter-spacing: 0.25em;
                color: ${primaryColor};
                font-family: 'Courier New', Courier, monospace;
            }
            .expiry {
                font-size: 13px;
                color: #ef4444;
                margin-top: 8px;
            }
            .footer { 
                margin-top: 40px; 
                padding-top: 24px; 
                border-top: 1px solid ${borderColor}; 
                font-size: 14px; 
                color: ${mutedColor};
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo"><span class="logo-f">F</span>FirstStep</div>
            <h1>Reset your password</h1>
            <p>We received a request to reset the password for your FirstStep account. Use the verification code below to proceed:</p>
            
            <div class="code-box">
                <div class="code">${code}</div>
                <div class="expiry">This code expires in 15 minutes</div>
            </div>

            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <div class="footer">
                &copy; 2025 FirstStep SaaS. All rights reserved.<br>
                Secure operations for modern businesses.
            </div>
        </div>
    </body>
    </html>
  `;
};
