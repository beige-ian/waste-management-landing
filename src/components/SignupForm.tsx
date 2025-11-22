import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    buildingCount: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendSlackMessage = async (data: typeof formData) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${apiUrl}/api/send-slack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Slack 메시지 전송 실패:', errorData);
      } else {
        console.log('Slack 메시지 전송 성공');
      }
    } catch (err) {
      console.error('Slack 메시지 전송 실패:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('signups')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || null,
            building_count: formData.buildingCount ? parseInt(formData.buildingCount) : null,
            message: formData.message || null,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      await sendSlackMessage(formData);

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        buildingCount: '',
        message: '',
      });

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '신청 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('신청 처리 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="signup" className="py-20 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center animate-fade-in-up">
          <p className="text-sm font-semibold mb-6" style={{ color: '#1AA3FF' }}>
            100만 유저가 검증한 업계 1위 서비스 커버링에게 맡기세요
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            지금 시작하세요
          </h2>
          <p className="text-lg text-slate-600 font-light mt-6">
            5분 안에 신청할 수 있습니다. 우리 팀이 24시간 내에 연락드립니다.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {submitted && (
            <div className="mb-6 p-4 rounded-lg text-sm" style={{ backgroundColor: '#E3F2FE', borderColor: '#1AA3FF', color: '#1565C0', borderWidth: '1px' }}>
              ✓ 신청이 완료되었습니다. 곧 연락드리겠습니다.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg text-sm">
              문제가 발생했습니다: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                이름 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': '#1AA3FF' } as any}
                placeholder="건물주 이름"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                이메일 *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': '#1AA3FF' } as any}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                연락처 *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': '#1AA3FF' } as any}
                placeholder="010-0000-0000"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  건물명/회사명
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ '--tw-ring-color': '#1AA3FF' } as any}
                  placeholder="예: 강남빌딩"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  관리 건물 수
                </label>
                <input
                  type="number"
                  name="buildingCount"
                  value={formData.buildingCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ '--tw-ring-color': '#1AA3FF' } as any}
                  placeholder="예: 5"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                추가 질문사항
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 text-sm h-20 resize-none"
                style={{ '--tw-ring-color': '#1AA3FF' } as any}
                placeholder="현재 겪고 있는 분리수거 문제가 있으면 작성해주세요"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-semibold text-base transition duration-300"
              style={{ backgroundColor: loading ? '#94A3B8' : '#1AA3FF' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1680CC')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1AA3FF')}
            >
              {loading ? '처리 중...' : '상담 신청하기'}
            </button>

            <p className="text-center text-slate-500 text-xs">
              개인정보는 안전하게 보호됩니다.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
