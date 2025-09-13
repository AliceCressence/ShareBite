import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://backend:8000'}/donations/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || '',
      },
    });

    const data = await response.json();

    if (response.ok) {
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

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://backend:8000'}/donations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || '',
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
