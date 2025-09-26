import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendtwofactoremail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two Factor Verification",
    html: `<p>Your Two Factor verification Code: ${token} </p>`,
  });
};

export const sendverificationmail = async (email: string, token: string) => {
  const confirmationlink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirmation email!",
    html: `<p>click <a href="${confirmationlink}">here</a> to confirm email!</p>`,
  });
};

export const sendpasswordresetmail = async (email: string, token: string) => {
  const resetlink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset password",
    html: `<p>click <a href="${resetlink}">here</a> to reset password</p>`,
  });
};
