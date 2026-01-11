// Netlify Function: accept feedback form submissions and forward via SendGrid
// Environment variables used:
// SENDGRID_API_KEY - (required) SendGrid API key
// SENDGRID_FROM - email address to use as 'from' (e.g., no-reply@hottea.in)
// FEEDBACK_TO - recipient address (defaults to vishwakarmasuraj089504@gmail.com)

let fetchFn = null;
async function getFetch(){
  if(fetchFn) return fetchFn;
  if (typeof fetch !== 'undefined') { fetchFn = fetch; return fetchFn; }
  const { default: nodeFetch } = await import('node-fetch');
  fetchFn = nodeFetch; return fetchFn;
}

function validatePayload(p){
  if(!p) return 'Missing payload';
  if(!p.message || p.message.trim().length < 5) return 'Please provide a message.';
  if(!p.name || p.name.trim().length < 1) return 'Please provide your name.';
  if(p.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) return 'Please provide a valid email.';
  return null;
}

exports.handler = async function(event){
  if(event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  try{
    const body = event.body ? JSON.parse(event.body) : {};
    const err = validatePayload(body);
    if(err) return { statusCode: 400, body: JSON.stringify({ error: err }) };

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const SENDGRID_FROM = process.env.SENDGRID_FROM || 'no-reply@hottea.in';
    const FEEDBACK_TO = process.env.FEEDBACK_TO || 'vishwakarmasuraj089504@gmail.com';

    if(!SENDGRID_API_KEY){
      return { statusCode: 500, body: JSON.stringify({ error: 'SendGrid is not configured. Please set SENDGRID_API_KEY in your site settings.' }) };
    }

    // Build email content
    const subject = `New feedback from ${body.name || 'Guest'} — Hot Tea`;
    const userAgent = event.headers['user-agent'] || '';
    const ip = event.headers['x-forwarded-for'] || event.headers['x-nf-client-connection-ip'] || 'unknown';
    const text = `You received new feedback from Hot Tea website.\n\nName: ${body.name || ''}\nEmail: ${body.email || ''}\nPhone: ${body.phone || ''}\nRating: ${body.rating || ''}\nMessage:\n${body.message || ''}\n\nIP: ${ip}\nUser-Agent: ${userAgent}\n`;

    const payload = {
      personalizations: [{ to: [{ email: FEEDBACK_TO }] }],
      from: { email: SENDGRID_FROM },
      subject,
      content: [{ type: 'text/plain', value: text }]
    };

    const fetch = await getFetch();
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if(!res.ok){
      const errText = await res.text().catch(()=>null);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email', detail: errText }) };
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Thanks — your feedback was sent.' }) };

  } catch(err){
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};