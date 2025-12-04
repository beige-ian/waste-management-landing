import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 프로젝트 루트의 .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '../.env.local') });

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
    const { city, phone, inquiry } = req.body;

    const slackMessage = {
      text: '🎉 새로운 상담 문의가 들어왔습니다!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎉 상담 문의',
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
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📞 Slack webhook endpoint: POST http://localhost:${PORT}/api/send-slack`);
});
