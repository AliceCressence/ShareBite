import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward cookies to backend for refresh
    const response = await fetch(`${process.env.BACKEND_URL || 'http://backend:8000'}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || '',
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Forward any new cookies from the backend
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        res.setHeader('Set-Cookie', setCookieHeader);
      }
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (_error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
}
