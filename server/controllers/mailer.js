import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

// https://ethereal.email/create


/** POST:  http://localhost:8080/api/registerMail
    @param: {
        "username": "group123",
        "userEmail": "abc123",
        "text": "",
        "subject": ""
    }
*/
export const registerMail = async (req, res) => {
    const { username, userEmail } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let emailBody =
        `<div style="width: 100%; box-sizing: border-box; padding: 20px; background-color: #c9dfeb; background: linear-gradient(102.87deg, rgba(86, 158, 194, 0.2) 28.76%, rgba(163, 196, 213, 0.2) 44.56%, rgba(198, 176, 191, 0.2) 64.19%, rgba(159, 109, 144, 0.2) 81.09%), #FFFFFF;">
        <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Lato&display=swap"rel="stylesheet">
        <div style="width: 95%; max-width: 700px; box-sizing: border-box; margin: 0 auto; border-radius: 10px; background-color: rgba(255,255,255,0.7);  padding: 40px;">
            <div style="width: 100%; margin: 0 auto; font-family: 'Comfortaa', cursive; font-size: 1.4rem;">
                <p style="text-align: center;">
                    <a href="${process.env.CLIENT_URL}" style="color: #7CB3CF; text-decoration: none;">
                        <img src="cid:logo" style="width: 100%; max-width: 300px; padding: 10px;" />
                    </a>
                </p>
            </div>
             <div style="width: 85%; margin: 10px auto; font-family: 'Lato', sans-serif; font-size: 1.15rem; color: #797979;">
                <h4 style="font-size: 1.5rem; text-align: center; color: #9F6D90; letter-spacing: 0.1rem;">Welcome to Expenses Sharing!</h4>
                <p style="font-weight: bold; color: #3D84A8;">Hi ${username},</p>
                <p>Thank you for signing up. We have already created the account for your group.</p> 
                <p>To get started, log in and add members and expenses to your account. Our app will then help you to settle debts.</p>
                <p style="margin: 50px auto; text-align: center;"><a href="${process.env.CLIENT_URL}" style="color: white; text-decoration: none; background-color:#7CB3CF; padding: 10px 20px; border-radius: 5px;">Login Now</a></p>
                <p>If you have any questions, you can reply this email.</p>
            </div>
        </div>
    </div>`;

    let message = {
        from: `Expenses Sharing <${process.env.EMAIL}>`,
        to: userEmail,
        subject: "Welcome to Expenses Sharing!",
        attachments: [{
            filename: 'logo_name.png',
            path: 'https://raw.githubusercontent.com/yukilun/expenses_sharing_app/master/client/src/assets/logo_name.png',
            cid: 'logo' 
        }],
        html: emailBody
    }

    // send email
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "An email has been sent to your email address." });
        })
        .catch(error => { console.log(error); res.status(500).send({ error: error.message }); });

}

export const OTPMail = async (req, res) => {
    const { username, userEmail, code } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let emailBody =
        `<div style="width: 100%; box-sizing: border-box; padding: 20px; background-color: #c9dfeb; background: linear-gradient(102.87deg, rgba(86, 158, 194, 0.2) 28.76%, rgba(163, 196, 213, 0.2) 44.56%, rgba(198, 176, 191, 0.2) 64.19%, rgba(159, 109, 144, 0.2) 81.09%), #FFFFFF;">
            <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Lato&display=swap"rel="stylesheet">
            <div style="width: 95%; max-width: 700px; box-sizing: border-box; margin: 0 auto; border-radius: 10px; background-color: rgba(255,255,255,0.7);  padding: 40px;">
                <div style="width: 100%; margin: 0 auto; font-family: 'Comfortaa', cursive; font-size: 1.4rem;">
                    <p style="text-align: center;">
                        <a href="${process.env.CLIENT_URL}" style="color: #7CB3CF; text-decoration: none;">
                            <img src="cid:logo" style="width: 100%; max-width: 300px; padding: 10px;" />
                        </a>
                    </p>
                </div>
                 <div style="width: 85%; margin: 10px auto; font-family: 'Lato', sans-serif; font-size: 1.15rem; color: #797979;">
                    <h4 style="font-size: 1.5rem; text-align: center; color: #9F6D90; letter-spacing: 0.1rem;">Account Recovery</h4>
                    <p style="font-weight: bold; color: #3D84A8;">Hi ${username},</p> 
                    <p>Please use the Account Recovery OTP below on Expense Sharing website:</p>
                    <p style="width: fit-content; margin:0 auto 30px; text-align: center; padding: 10px; background-color: #dfdfdf; color: #504f4f; font-size: 1.3rem; letter-spacing: 0.5rem; text-indent: 0.5rem; border-radius: 5px;">${code}</p>
                    <p>If you have any questions, you can reply this email.</p>
                </div>
            </div>
        </div>`;

    let message = {
        from: `Expenses Sharing <${process.env.EMAIL}>`,
        to: userEmail,
        subject: "OTP for Account Recovery",
        attachments: [{
            filename: 'logo_name.png',
            path: 'https://raw.githubusercontent.com/yukilun/expenses_sharing_app/master/client/src/assets/logo_name.png',
            cid: 'logo' 
        }],
        html: emailBody,
    }

    // send email
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "An email has been sent to your email address." });
        })
        .catch(error => res.status(500).send({ error: error.message }));

}