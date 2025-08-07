import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validations/contact';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = contactFormSchema.parse(json);

    // Save to database
    const contactSubmission = await prisma.contactForm.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
      },
    });

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${body.name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: body.email,
      subject: `New Contact Form Submission: ${body.subject}`,
      html: `<p>You have a new contact form submission from:</p>
             <p><strong>Name:</strong> ${body.name}</p>
             <p><strong>Email:</strong> ${body.email}</p>
             <p><strong>Subject:</strong> ${body.subject}</p>
             <p><strong>Message:</strong></p>
             <p>${body.message.replace(/\n/g, '<br>')}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(contactSubmission, { status: 201 });
  } catch (error) {
    if (error instanceof require('zod').ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    console.error(error);
    return new NextResponse('An internal server error occurred.', { status: 500 });
  }
}
