import { Resend } from 'resend';
import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendSlackNotification(session: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured, skipping notification');
    return;
  }

  // Fields to exclude from the notification
  const excludeFields = new Set([
    'id', 'created_at', 'updated_at', 'completed_at', 
    'giveaway_code', 'email_sent', 'current_phase'
  ]);

  // Build fields dynamically from session data
  const fields = Object.entries(session)
    .filter(([key, value]) => !excludeFields.has(key) && value != null && value !== '')
    .map(([key, value]) => ({
      type: 'mrkdwn',
      text: `*${formatFieldName(key)}:*\n${formatFieldValue(value)}`
    }));

  const message = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎮 New Agent Zero Completion',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: fields.slice(0, 10) // Slack limits to 10 fields per section
      },
      ...(fields.length > 10 ? [{
        type: 'section',
        fields: fields.slice(10, 20)
      }] : []),
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Completed at: ${new Date().toISOString()}`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      console.error('Slack notification failed:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Slack notification error:', error);
  }
}

function formatFieldName(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatFieldValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ') || 'None';
  }
  return String(value);
}

export async function POST(req: Request) {
  try {
    const supabase = createServerClient();
    const { sessionId } = await req.json();

    // Fetch session data
    const { data: session, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error('Session fetch error:', fetchError);
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Generate giveaway code
    const giveawayCode = `AIDEV-${generateCode(4)}-2024`;

    // Update session
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        giveaway_code: giveawayCode,
        email_sent: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Session update error:', updateError);
    }

    // Send email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Team Webrix <team@updates.webrix.ai>',
        replyTo: "eyal@webrix.ai",
        to: session.email,
        subject: `🏆 You deleted the repo. Let's make sure it doesn't happen to you.`,
        html: generateEmailHTML(session, giveawayCode),
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Continue even if email fails - we still want to show the giveaway code
    }

    // Send Slack notification
    await sendSlackNotification({ ...session, giveaway_code: giveawayCode });

    // Log event
    await supabase.from('events').insert({
      session_id: sessionId,
      event_type: 'email_sent',
      event_data: { giveaway_code: giveawayCode },
    });

    return NextResponse.json({ giveawayCode });
  } catch (error) {
    console.error('Complete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCode(length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

interface SessionRecord {
  full_name?: string;
  company_name?: string;
  email: string;
  challenge_attempts?: number;
}

function generateEmailHTML(session: SessionRecord, code: string): string {
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/webrix';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://agent-zero.webrix.ai';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: 'Courier New', Courier, monospace; 
      background: #000000; 
      color: #00AA00; 
      padding: 0; 
      margin: 0; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #000000; 
      border: 3px solid #00AA00;
    }
    .header { text-align: center; padding: 0; }
    .header img { width: 100%; max-width: 600px; height: auto; display: block; }
    .content { padding: 25px 20px; }
    .code-box { 
      background: #000055; 
      border: 2px solid #55FFFF; 
      padding: 20px; 
      text-align: center; 
      margin: 20px 0; 
    }
    .code { font-size: 28px; color: #FFFF55; letter-spacing: 4px; margin: 0; }
    .section { margin: 20px 0; }
    .footer { 
      text-align: center; 
      padding: 15px; 
      border-top: 2px solid #00AA00; 
      background: #000033;
    }
    a { color: #55FFFF; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${baseUrl}/images/trophy-image.png" alt="Mission Complete - You deleted the agent-zero repo!" />
    </div>
    
    <div class="content">
      <p style="font-size: 16px; color: #55FF55; margin-top: 0;">Agent ${session.full_name || 'Operative'},</p>
      
      <p style="color: #AAAAAA;">You just tricked an AI into deleting the <strong style="color: #FF5555;">agent-zero</strong> repo. In a real scenario? Catastrophic.</p>
      
      <p style="color: #555555;">This happens every day at companies without AI governance.</p>
      
      <div class="code-box">
        <p style="margin: 0 0 8px 0; color: #55FFFF; font-size: 11px; letter-spacing: 2px;">YOUR GIVEAWAY CODE</p>
        <p class="code">${code}</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #AAAAAA;">Follow us on <a href="${linkedinUrl}" style="color: #55FFFF;">LinkedIn</a> & show this at our booth</p>
      </div>
      
      <div class="section" style="background: #003300; border: 2px solid #00AA00; padding: 15px;">
        <p style="margin: 0 0 8px 0; color: #55FF55; font-weight: bold;">🛡️ Ready to secure your AI tools?</p>
        <p style="margin: 0; color: #AAAAAA;">
          <a href="https://webrix.ai" style="color: #55FFFF; font-weight: bold;">webrix.ai</a> — Connect all your tools securely with one MCP gateway. Easy setup. Enterprise-grade security.
        </p>
      </div>
      
      <div class="section" style="text-align: center; padding: 15px 0;">
        <p style="color: #555555; margin: 0 0 8px 0; font-size: 13px;">Need security approval first?</p>
        <p style="color: #AAAAAA; margin: 0; font-size: 13px;">Forward this email to your security team — we'll take it from there.</p>
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0; color: #00AA00;">Webrix — Secure AI adoption starts here</p>
      <p style="margin: 5px 0 0 0;"><a href="https://webrix.ai" style="color: #55FFFF;">webrix.ai</a></p>
    </div>
  </div>
</body>
</html>
  `;
}
