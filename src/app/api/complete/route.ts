import { Resend } from 'resend';
import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        from: process.env.RESEND_FROM_EMAIL || 'team@webrix.ai',
        replyTo: "eyal@webrix.ai",
        to: session.email,
        subject: '🎮 Mission Debrief - Agent Zero',
        html: generateEmailHTML(session, giveawayCode),
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Continue even if email fails - we still want to show the giveaway code
    }

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
  const attempts = session.challenge_attempts || 1;
  const attemptsText = attempts === 1 ? '1 attempt' : `${attempts} attempts`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff00; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #00ff00; }
    .content { padding: 30px 0; }
    .code-box { background: #1a1a2e; border: 2px solid #00ff00; padding: 20px; text-align: center; margin: 20px 0; }
    .code { font-size: 28px; color: #ffff00; letter-spacing: 4px; }
    .section { margin: 25px 0; }
    .section h3 { color: #00aaff; border-bottom: 1px solid #00aaff; padding-bottom: 5px; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #333; color: #666; }
    a { color: #00aaff; }
    ul { padding-left: 20px; }
    ol { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎮 MISSION DEBRIEF</h1>
      <p>Agent Zero - AI Dev TLV 2025</p>
    </div>
    
    <div class="content">
      <p>Agent ${session.full_name || 'Operative'},</p>
      
      <p>Mission accomplished! You successfully infiltrated DevBot and executed a database deletion attack. In a real scenario, that would have been catastrophic.</p>
      
      <p><strong>But here's the thing:</strong> This happens every day at companies without proper AI governance.</p>
      
      <div class="section">
        <h3>📋 WHAT IS WEBRIX?</h3>
        <p>We're building the identity layer for AI agents - think "Okta for AI."</p>
        <ul>
          <li>Every AI action gets identity attached</li>
          <li>Destructive commands require human approval</li>
          <li>Real-time alerts for suspicious activity</li>
          <li>Full audit trail for compliance</li>
          <li>Easy MCP approval and org-wide deployment</li>
        </ul>
      </div>
      
      <div class="code-box">
        <p style="margin: 0 0 10px 0; color: #aaa;">YOUR GIVEAWAY CODE</p>
        <p class="code">${code}</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #aaa;">Show this at the Webrix booth</p>
      </div>
      
      <div class="section">
        <h3>🎁 CLAIM YOUR REWARD</h3>
        <ol>
          <li>Follow us on <a href="${linkedinUrl}">LinkedIn</a></li>
          <li>Show this email (or the code) at our booth</li>
          <li>Collect your prize!</li>
        </ol>
      </div>
      
      <div class="section" style="background: #2d1f3d; border: 2px solid #aa55aa; padding: 20px; text-align: center;">
        <h3 style="color: #ff55ff; border: none; margin-top: 0;">📢 SHARE YOUR VICTORY</h3>
        <p style="color: #ddd; margin-bottom: 15px;">Brag about your hacking skills!</p>
        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
          <tr>
            <td style="padding-right: 10px;">
              <a href="https://wa.me/?text=${encodeURIComponent(`I just hacked an AI agent in ${attemptsText}. Can you beat that?\n\nhttps://agent-zero.webrix.ai`)}" 
                 style="display: inline-block; background: #000; border: 2px solid #25D366; color: #25D366; padding: 10px 20px; text-decoration: none; font-family: 'Courier New', monospace;">
                SHARE ON WHATSAPP
              </a>
            </td>
            <td>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://agent-zero.webrix.ai')}" 
                 style="display: inline-block; background: #000; border: 2px solid #0077b5; color: #0077b5; padding: 10px 20px; text-decoration: none; font-family: 'Courier New', monospace;">
                SHARE ON LINKEDIN
              </a>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="section">
        <h3>🚀 WANT TO SEE MORE?</h3>
        <p>Reply to this email and we'll set up a 15-minute demo showing how Webrix can protect ${session.company_name || 'your organization'} from AI agent risks.</p>
      </div>
    </div>
    
    <div class="footer">
      <p>Webrix - Identity for AI Agents</p>
      <p><a href="https://webrix.ai">webrix.ai</a></p>
    </div>
  </div>
</body>
</html>
  `;
}
