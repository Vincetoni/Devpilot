import type { NextApiRequest, NextApiResponse } from 'next';

const SYSTEM_PROMPT = `You are DevPilot, an expert software project planner...`; // same as before

// Mock fallback
function getMockRoadmap(idea: string) {
  return {
    project_name: idea.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('').slice(0, 20),
    description: `A software project for ${idea}.`,
    estimated_weeks: 8,
    tracks: ['setup', 'core', 'features', 'polish'],
    milestones: [
      
    ]
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea, stack, weeks } = req.body;

  if (!idea || typeof idea !== 'string') {
    return res.status(400).json({ error: 'idea is required' });
  }

  let roadmap;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log('⚠️ No OPENAI_API_KEY — using mock data');
    roadmap = getMockRoadmap(idea);
  } else {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Generate a DevPilot roadmap for: "${idea}"\nTarget: ${weeks || 8} weeks\nStack: ${stack || 'any'}\n\nReturn only the JSON. No explanation.` }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });
      
     if (!response.ok) {
       const errorData = await response.json();
       console.error('OpenAI error:', errorData);
       throw new Error(`OpenAI ${response.status}: ${errorData.error?.message || 'Unknown'}`);
     }
      
      const data = await response.json();
      roadmap = JSON.parse(data.choices[0].message.content);

    } catch (error) {
      console.error('AI failed:', error);
      roadmap = getMockRoadmap(idea);
    }
  }

  res.status(200).json({
    success: true,
    source: apiKey ? 'ai' : 'mock',
    data: roadmap
  });
}