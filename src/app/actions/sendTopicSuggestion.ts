'use server';

import { Resend } from 'resend';

export async function sendTopicSuggestion(params: {
  selectedTopics: string[];
  otherText: string;
  submittedByEmail: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const { selectedTopics, otherText, submittedByEmail } = params;
  const timestamp = new Date().toISOString();
  const submittedBy = submittedByEmail ?? 'Not logged in';

  const topicsHtml =
    selectedTopics.length > 0
      ? `<ul style="margin: 0.5em 0; padding-left: 1.5em;">${selectedTopics.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
      : '<p style="margin: 0.5em 0;">(none selected)</p>';

  const otherSection =
    selectedTopics.includes('Other') && otherText.trim()
      ? `<p style="margin: 0.5em 0;"><strong>Other:</strong> ${escapeHtml(otherText.trim())}</p>`
      : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1e293b;">
  <h2 style="margin-top: 0;">New SAB Topic Suggestion</h2>
  <p><strong>Selected topics:</strong></p>
  ${topicsHtml}
  ${otherSection}
  <p style="margin-top: 1em;"><strong>Submitted by:</strong> ${escapeHtml(submittedBy)}</p>
  <p><strong>Submitted at:</strong> ${escapeHtml(timestamp)}</p>
</body>
</html>
`.trim();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'Nok SAB <onboarding@resend.dev>',
      to: ['carson.moore@nokrecommerce.com'],
      subject: 'New SAB Topic Suggestion',
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email';
    return { success: false, error: message };
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
}
