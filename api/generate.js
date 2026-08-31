export default async function handler(req, res) {
    // التأكد من أن الطلب هو POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const userData = req.body;
        
        // هندسة الأوامر (Prompt Engineering)
        const systemPrompt = `
        You are an elite SEO Expert and Freelance Profile Copywriter.
        User Data: ${JSON.stringify(userData)}
        Generate optimized profiles for Upwork, LinkedIn, and Fiverr in JSON format ONLY.
        `;

        // الاتصال بـ OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt }
                ],
                response_format: { type: "json_object" } 
            })
        });

        const data = await response.json();
        const generatedProfiles = JSON.parse(data.choices[0].message.content);

        // إرسال النتيجة للواجهة
        return res.status(200).json(generatedProfiles);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'حدث خطأ أثناء توليد البروفايل' });
    }
}

