import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, memberId, district, constituency } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'UKD Digital Portal <onboarding@resend.dev>',
      to: [email],
      subject: `Welcome to Uttarakhand Kranti Dal - Member ID: ${memberId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">Welcome to Uttarakhand Kranti Dal!</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for joining the movement. Your registration has been successfully processed.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Member ID:</strong> ${memberId}</p>
            <p style="margin: 5px 0;"><strong>District:</strong> ${district}</p>
            <p style="margin: 5px 0;"><strong>Constituency:</strong> ${constituency}</p>
          </div>

          <p>Your digital membership registration is complete.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">Uttarakhand Kranti Dal | Official Digital Command Portal</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: error.message });
  }
}