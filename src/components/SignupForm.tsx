import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { SuccessModal } from './SuccessModal';

const cities = [
  '서울시',
  '경기도',
  '인천시',
  '부산시',
  '대구시',
  '광주시',
  '대전시',
  '울산시',
  '세종시',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주도',
];

export const SignupForm = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendSlackMessage = async (data: { city: string; phone: string; inquiry: string }) => {
    const apiUrl = '/api/send-slack';

    try {
      const response = await fetch(apiUrl, {
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
      const { error: supabaseError } = await supabase
        .from('signups')
        .insert([
          {
            city: selectedCity,
            phone: phone,
            inquiry: inquiry || null,
            created_at: new Date().toISOString(),
          },
        ]);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      await sendSlackMessage({ city: selectedCity, phone, inquiry });

      setSubmitted(true);
      setSelectedCity('');
      setPhone('');
      setInquiry('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '신청 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('신청 처리 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {submitted && <SuccessModal onClose={() => setSubmitted(false)} />}

      <section id="signup" style={{
        padding: '120px 0',
        background: '#F7F7F8'
      }}>
        <div style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '48px',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: 'Pretendard',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
              letterSpacing: '-0.1px',
              color: '#69A5FF',
              margin: 0
            }}>
              100만 유저가 검증한 업계 1위 서비스 커버링에게 맡기세요
            </p>
            <h2 style={{
              fontFamily: 'Pretendard',
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '52px',
              letterSpacing: '-0.2px',
              color: '#171719',
              margin: 0
            }}>
              첫 달 무료체험 문의
            </h2>
            <p style={{
              fontFamily: 'Pretendard',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '-0.08px',
              color: '#46474C',
              margin: 0
            }}>
              커버링 빌딩 문의를 위한 정보를 입력해 주세요
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#FEE',
              border: '1px solid #E00',
              color: '#C00',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              문제가 발생했습니다: {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0px 2px 8px -6px rgba(24,39,75,0.12), 0px 8px 16px -6px rgba(24,39,75,0.08)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {/* City Select */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.07px',
                  color: '#46474C'
                }}>
                  지역 <span style={{ color: '#E00' }}>*</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                  style={{
                    fontFamily: 'Pretendard',
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.08px',
                    color: selectedCity ? '#171719' : '#9CA3AF',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L6 6.5L11 1.5\' stroke=\'%23171719\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    paddingRight: '40px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3385FF'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                >
                  <option value="" disabled>지역을 선택해주세요</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Phone Input */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.07px',
                  color: '#46474C'
                }}>
                  담당자 번호 <span style={{ color: '#E00' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="010-0000-0000"
                  style={{
                    fontFamily: 'Pretendard',
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.08px',
                    color: '#171719',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3385FF'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Inquiry Textarea */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.07px',
                  color: '#46474C'
                }}>
                  문의내용 (선택)
                </label>
                <textarea
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                  placeholder="문의하실 내용을 입력해주세요"
                  rows={4}
                  style={{
                    fontFamily: 'Pretendard',
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.08px',
                    color: '#171719',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3385FF'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.08px',
                  color: '#FFFFFF',
                  background: loading ? '#9CA3AF' : '#3385FF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#2874E6')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#3385FF')}
              >
                {loading ? '처리 중...' : '첫 달 무료체험 문의하기'}
              </button>

              {/* Privacy Notice */}
              <p style={{
                fontFamily: 'Pretendard',
                fontSize: '12px',
                lineHeight: '18px',
                letterSpacing: '-0.06px',
                color: '#9CA3AF',
                textAlign: 'center',
                margin: 0
              }}>
                개인정보는 안전하게 보호됩니다.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
