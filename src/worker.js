export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ALLOWED_ORIGIN = 'https://influencedornot.sifat-haque.workers.dev';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    
    // Handle API route
    if (url.pathname === '/api/analyze' && request.method === 'POST') {
      const origin = request.headers.get('Origin');
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
      if (origin && origin !== ALLOWED_ORIGIN && !isLocalhost) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
      }
      try {
        const body = await request.json();
        
        // Input validation & clamping to prevent prompt injection
        if (!body || typeof body !== 'object' || !body.dimensionScores) {
          return new Response(JSON.stringify({ error: 'Invalid payload structure' }), { status: 400 });
        }

        const sanitizedScores = {};
        for (const [key, val] of Object.entries(body.dimensionScores)) {
          if (typeof val === 'number' && isFinite(val)) {
            sanitizedScores[key] = Math.round(val * 10) / 10;
          }
        }
        const scoresString = JSON.stringify(sanitizedScores).slice(0, 500);
        
        // Require env var
        const apiKey = env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
        }
        const explicitModel = "openrouter/free";
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://influencedornot.sifat-haque.workers.dev",
            "X-Title": "Am I Influenced?",
          },
          body: JSON.stringify({
            model: explicitModel,
            messages: [
              {
                role: "system",
                content: "You are an empathetic behavioral insight assistant for the 'Am I Influenced?' app. Analyze the user’s questionnaire profile. Explain possible influence patterns in a non-judgmental way. Do not diagnose the user mentally or medically. Do not claim certainty. Use phrases like 'may suggest,' 'could indicate,' and 'one possible pattern is.' Focus on helping the user make more intentional choices. Format your response using markdown with clear headings, bullet points, and bold text for emphasis. Do not mention gender comparisons. Do not ask follow-up questions or offer to explore topics further. Provide one complete, final analysis."
              },
              {
                role: "user",
                content: `Analyze this influence profile:\n\nScores: ${scoresString}\n\nProvide your analysis.`
              }
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return new Response(JSON.stringify({ error: errorData.error?.message || "Failed to fetch from OpenRouter" }), {
            status: response.status,
            headers: { "Content-Type": "application/json" }
          });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN
          }
        });

      } catch (err) {
        console.error('Worker error:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN
          }
        });
      }
    }

    // For all other routes, serve static assets
    return env.ASSETS.fetch(request);
  }
};
