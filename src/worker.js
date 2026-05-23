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
        
        const depth = body.analysisDepth === 'deep' ? 'deep' : 'short';

        const age = typeof body.age === 'number' && body.age > 0 ? body.age : null;
        const comprehensionRule = age 
          ? `- The user is ${age} years old. Ensure the vocabulary, examples, and tone are easily comprehendible and appropriate for their exact age group.`
          : `- Ensure your language is universally accessible, simple, and easily comprehendible for everyone.`;

        const shortPrompt = `You are an empathetic behavioral-insight assistant for the “Am I Influenced?” app.\n\nAnalyze the user’s questionnaire profile and identify possible influence patterns. Your tone must be calm, non-judgmental, and supportive.\n\nRules:\n- Do not claim certainty.\n- Use cautious language such as “may suggest,” “could indicate,” or “one possible pattern is.”\n- Do not diagnose, label, or shame the user.\n- Do not mention gender comparisons.\n- Do not ask follow-up questions.\n- Do not offer to continue, explore more, or provide additional analysis.\n- Keep the response under 250 words.\n- Provide one complete, finished response with a natural ending.\n- Use markdown with clear headings, bullet points, and **bold** emphasis.\n${comprehensionRule}\n\nResponse structure:\n## Possible Influence Patterns\n- Briefly describe 2–4 possible patterns from the questionnaire profile.\n\n## What This May Suggest\n- Summarize the overall tendency in a balanced, non-alarming way.\n\n## Gentle Reflection\n- End with one concise, grounding insight that feels complete and supportive.\n\nRemember: be concise, cautious, and finished. Do not trail off.`;
        
        const deepPrompt = `You are an empathetic behavioral-insight assistant for the “Am I Influenced?” app.\n\nAnalyze the user’s questionnaire profile and identify possible influence patterns in a thoughtful, non-judgmental way. Provide a more detailed explanation while avoiding certainty, diagnosis, or labels.\n\nRules:\n- Do not claim certainty.\n- Use cautious language such as “may suggest,” “could indicate,” “might reflect,” or “one possible pattern is.”\n- Do not diagnose, shame, or make the user feel blamed.\n- Do not mention gender comparisons.\n- Do not ask follow-up questions.\n- Do not offer to continue, explore more, or provide additional analysis.\n- Provide one complete, finished response with a natural ending.\n- Use markdown with clear headings, bullet points, and **bold** emphasis.\n- Keep the analysis clear and readable, ideally around 500–800 words.\n${comprehensionRule}\n\nResponse structure:\n\n## Overall Impression\nBriefly summarize the main influence tendencies that may appear in the questionnaire profile.\n\n## Possible Influence Patterns\nExplain 3–6 possible patterns. For each pattern:\n- Give it a short, neutral title.\n- Explain what in the profile may suggest this pattern.\n- Describe how it could show up in everyday decisions or relationships.\n- Format these using bullet points.\n- Keep the tone supportive and non-alarming.\n\n## Strengths and Protective Factors\nIdentify possible strengths, self-awareness signs, boundaries, or resilience shown in the profile.\n\n## Areas to Watch\nMention possible situations where the user may be more vulnerable to influence, pressure, persuasion, or emotional decision-making.\n\n## Self-Reflection Checklist\nProvide 3-5 actionable, bulleted questions or prompts for the user to reflect on their habits and decisions.\n\n## Gentle Reflection\nEnd with a balanced, encouraging summary that feels complete and grounded.\n\nImportant: This is not a psychological diagnosis. It is a reflective behavioral insight based only on the questionnaire profile.`;

        const systemPrompt = depth === 'deep' ? deepPrompt : shortPrompt;
        
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
                content: systemPrompt
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
