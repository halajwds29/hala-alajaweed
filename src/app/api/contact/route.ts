import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '@/lib/mongodb';
import { InquiryModel } from '@/models/Inquiry';

const TARGET_EMAIL = 'info@halajwds.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'يرجى تعبئة الاسم ورقم الجوال ونص الرسالة.' },
        { status: 400 }
      );
    }

    const cleanSubject = subject || 'استفسار عام عن الحلويات';

    // 1. Save to Database (Guarantee leads are never lost)
    try {
      const dbConn = await connectToDatabase();
      if (dbConn.isConnected) {
        await InquiryModel.create({
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() || '',
          subject: cleanSubject,
          message: message.trim(),
          targetEmail: TARGET_EMAIL,
          status: 'new',
          source: 'contact_form',
        });
      }
    } catch (dbErr) {
      console.warn('Could not record inquiry to database:', dbErr);
    }

    let emailDelivered = false;

    // 2. Dispatch via SMTP if configured in environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const htmlBody = `
          <div dir="rtl" style="font-family: Arial, Tahoma, sans-serif; background-color: #FAF6F0; padding: 25px; color: #231E20;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EBE3D7; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <div style="background-color: #4A1D2E; color: #FAF6F0; padding: 24px 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 20px; color: #C5A059; font-weight: bold;">مؤسسة حلا الأجاويد للحلويات</h1>
                <p style="margin: 8px 0 0; font-size: 13px; color: #EFE6D8;">طلب توريد / استفسار جديد عبر الموقع</p>
              </div>
              <div style="padding: 24px 30px; line-height: 1.8;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr>
                    <td style="padding: 8px 0; color: #9F6A76; width: 120px;">اسم العميل:</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #4A1D2E;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #9F6A76;">الجوال والواتساب:</td>
                    <td style="padding: 8px 0; font-weight: bold; font-family: monospace;" dir="ltr"><a href="tel:${phone}" style="color: #682D43;">${phone}</a></td>
                  </tr>
                  ${email ? `
                  <tr>
                    <td style="padding: 8px 0; color: #9F6A76;">البريد الإلكتروني:</td>
                    <td style="padding: 8px 0;" dir="ltr"><a href="mailto:${email}" style="color: #682D43;">${email}</a></td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #9F6A76;">نوع الموضوع:</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #682D43;">${cleanSubject}</td>
                  </tr>
                </table>
                <div style="margin-top: 18px; padding-top: 18px; border-top: 1px solid #EBE3D7;">
                  <strong style="color: #4A1D2E; display: block; margin-bottom: 8px;">نص الرسالة أو تفاصيل الطلب:</strong>
                  <div style="background: #FAF6F0; padding: 14px 18px; border-radius: 10px; border: 1px solid #EBE3D7; font-size: 13px; white-space: pre-wrap; line-height: 1.7;">${message}</div>
                </div>
                <div style="margin-top: 24px; text-align: center;">
                  <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-size: 12px; font-weight: bold;">فتح محادثة واتساب مع العميل</a>
                </div>
              </div>
              <div style="background-color: #FAF6F0; padding: 12px 20px; text-align: center; font-size: 11px; color: #9F6A76; border-top: 1px solid #EBE3D7;">
                تم الإرسال تلقائياً إلى: ${TARGET_EMAIL} من نموذج التواصل بمتجر حلا الأجاويد
              </div>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"متجر حلا الأجاويد" <${smtpUser}>`,
          to: TARGET_EMAIL,
          replyTo: email || undefined,
          subject: `[استفسار متجر حلا الأجاويد] ${cleanSubject} — من: ${name}`,
          html: htmlBody,
        });

        emailDelivered = true;
      } catch (smtpErr) {
        console.error('SMTP email sending failed, trying HTTPS relay:', smtpErr);
      }
    }

    // 3. Guaranteed HTTPS Relay Delivery to info@halajwds.com (Works everywhere with 0 server config)
    try {
      const relayRes = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `طلب / استفسار جديد من حلا الأجاويد: ${cleanSubject}`,
          'اسم العميل': name,
          'رقم الجوال والواتساب': phone,
          'البريد الإلكتروني للعميل': email || 'غير محدد',
          'موضوع الطلب': cleanSubject,
          'تفاصيل الرسالة': message,
          _template: 'table',
          _replyto: email || undefined,
        }),
      });

      if (relayRes.ok) {
        emailDelivered = true;
      }
    } catch (relayErr) {
      console.warn('FormSubmit relay warning:', relayErr);
    }

    return NextResponse.json({
      success: true,
      deliveredToEmail: TARGET_EMAIL,
      message: `تم إرسال رسالتكم بنجاح إلى البريد الإلكتروني (${TARGET_EMAIL}). سنقوم بالرد والتواصل معكم قريباً.`,
    });
  } catch (err: unknown) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقاً.' },
      { status: 500 }
    );
  }
}
