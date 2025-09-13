import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(201).json(data);
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
