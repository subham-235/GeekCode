const welcomeEmailTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body{
                    font-family: Arial, sans-serif;
                    background:#f4f4f4;
                    padding:20px;
                }

                .container{
                    background:white;
                    padding:30px;
                    border-radius:10px;
                    max-width:600px;
                    margin:auto;
                }

                h1{
                    color:#4CAF50;
                }

                p{
                    font-size:16px;
                }

                .button{
                    display:inline-block;
                    padding:12px 20px;
                    background:#4CAF50;
                    color:white;
                    text-decoration:none;
                    border-radius:5px;
                }
            </style>
        </head>

        <body>

            <div class="container">

                <h1>Welcome ${name}! 🎉</h1>

                <p>
                    Thank you for registering on our website.
                </p>

                <p>
                    We're excited to have you as a member.
                </p>

                <a href="https://yourwebsite.com" class="button">
                    Visit Website
                </a>

                <hr>

                <p>
                    Regards,<br>
                    Team Your Website
                </p>

            </div>

        </body>
    </html>
    `;
};

module.exports = welcomeEmailTemplate;