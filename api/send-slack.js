// Vercel Serverless Function
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slackWebhookUrl = process.env.VITE_SLACK_WEBHOOK_URL;

  if (!slackWebhookUrl) {
    return res.status(400).json({ error: 'Slack webhook URL not configured' });
  }

  try {
    const { city, phone, inquiry } = req.body;

    const slackMessage = {
      text: '🎉 새로운 무료체험 문의가 들어왔습니다!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎉 첫 달 무료체험 문의',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*📍 지역*\n${city}`,
            },
            {
              type: 'mrkdwn',
              text: `*📞 담당자 번호*\n${phone}`,
            },
            {
              type: 'mrkdwn',
              text: `*🕐 신청 시간*\n${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*💬 문의내용*\n${inquiry || '없음'}`,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '💡 _24시간 이내에 고객에게 연락 부탁드립니다!_',
            },
          ],
        },
      ],
    };

    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      console.error('Slack API error:', response.status, response.statusText);
      return res.status(response.status).json({
        error: `Slack API returned ${response.status}`,
      });
    }

    res.json({ success: true, message: 'Slack message sent successfully' });
  } catch (error) {
    console.error('Error sending Slack message:', error);
    res.status(500).json({ error: error.message });
  }
}
