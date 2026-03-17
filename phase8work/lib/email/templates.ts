export function newsletterHtmlTemplate(input: { title: string; summary: string; body: string; siteUrl?: string }) {
  const paragraphs = input.body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;color:#2b2b2b;line-height:1.7;font-size:16px;">${paragraph.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`
    )
    .join('');

  return `
  <div style="background:#f6f1e7;padding:32px 16px;font-family:Georgia,serif;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:20px;padding:40px;border:1px solid rgba(0,0,0,0.08);">
      <p style="margin:0 0 10px;color:#7b1e2b;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:700;">Phi Delta Theta</p>
      <h1 style="margin:0 0 12px;color:#181818;font-size:34px;line-height:1.15;">${input.title}</h1>
      <p style="margin:0 0 24px;color:#5d5d5d;font-size:17px;line-height:1.7;">${input.summary}</p>
      ${paragraphs}
      ${input.siteUrl ? `<p style="margin-top:28px;font-family:Arial,sans-serif;"><a href="${input.siteUrl}" style="display:inline-block;background:#7b1e2b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600;">View on the website</a></p>` : ''}
    </div>
  </div>`;
}

export function newsletterTextTemplate(input: { title: string; summary: string; body: string; siteUrl?: string }) {
  return [input.title, '', input.summary, '', input.body, input.siteUrl ? `Read more: ${input.siteUrl}` : ''].join('\n');
}
