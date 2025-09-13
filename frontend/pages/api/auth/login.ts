import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://backend:8000'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (response.ok) {
      // Forward all cookies from the backend (access_token and refresh_token)
      // Get all Set-Cookie headers
      const setCookieHeaders: string[] = [];
      response.headers.forEach((value, name) => {
        if (name.toLowerCase() === 'set-cookie') {
          setCookieHeaders.push(value);
        }
      });

      if (setCookieHeaders.length > 0) {
        res.setHeader('Set-Cookie', setCookieHeaders);
      }
      res.status(200).json(data);
    } else {
      // Handle FastAPI validation errors
      if (data.detail && Array.isArray(data.detail)) {
        const errorMessage = data.detail.map((err: any) => err.msg).join(', ');
        res.status(response.status).json({ detail: errorMessage });
      } else {
        res.status(response.status).json(data);
      }
    }
  } catch (_error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
}
