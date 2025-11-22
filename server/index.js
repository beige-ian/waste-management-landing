import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Slack webhook endpoint
app.post('/api/send-slack', async (req, res) => {
  const slackWebhookUrl = process.env.VITE_SLACK_WEBHOOK_URL;

  if (!slackWebhookUrl) {
    return res.status(400).json({ error: 'Slack webhook URL not configured' });
  }

  try {
    const { name, email, phone, company, buildingCount, message } = req.body;

    const slackMessage = {
      text: '새로운 신청이 들어왔습니다!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '새로운 신청',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*이름*\n${name}`,
            },
            {
              type: 'mrkdwn',
              text: `*이메일*\n${email}`,
            },
            {
              type: 'mrkdwn',
              text: `*연락처*\n${phone}`,
            },
            {
              type: 'mrkdwn',
              text: `*회사명*\n${company || '-'}`,
            },
            {
              type: 'mrkdwn',
              text: `*관리 건물 수*\n${buildingCount || '-'}`,
            },
            {
              type: 'mrkdwn',
              text: `*신청 시간*\n${new Date().toLocaleString('ko-KR')}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*추가 메시지*\n${message || '없음'}`,
          },
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
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📞 Slack webhook endpoint: POST http://localhost:${PORT}/api/send-slack`);
});
