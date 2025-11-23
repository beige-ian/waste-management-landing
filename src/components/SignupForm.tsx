import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { SuccessModal } from './SuccessModal';

const cities = [
  '서울시',
  '부산시',
  '대구시',
  '인천시',
  '광주시',
  '대전시',
  '울산시',
  '세종시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주도'
];

export const SignupForm = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
  };

  const sendSlackMessage = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${apiUrl}/api/send-slack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: selectedCity,
          phone,
          inquiry
        }),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (supabase) {
        const { error: supabaseError } = await supabase
          .from('signups')
          .insert([
            {
              city: selectedCity,
              phone: phone,
              message: inquiry || null,
              created_at: new Date().toISOString(),
            },
          ])
          .select();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
      }

      await sendSlackMessage();

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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '80px',
        maxWidth: '1032px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        {/* 왼쪽: 텍스트 섹션 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          width: '303px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '4px',
            width: '303px'
          }}>
            <span style={{
              fontFamily: 'Pretendard',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
              letterSpacing: '-0.005em',
              color: '#66C7FF'
            }}>
              문의 시 24시간 내 연락 예정
            </span>
            <h2 style={{
              fontFamily: 'Pretendard',
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '52px',
              letterSpacing: '-0.005em',
              color: '#171719',
              margin: 0
            }}>
              첫 달 무료체험 문의
            </h2>
          </div>
          <p style={{
            fontFamily: 'Pretendard',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '-0.005em',
            color: '#5A5C63',
            margin: 0,
            width: '282px'
          }}>
            서비스 도입과 관련하여 궁금하신 사항을 보내주시면 빠른 시일 내에 연락드리겠습니다.
          </p>
        </div>

        {/* 오른쪽: 폼 섹션 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '40px',
          gap: '24px',
          width: '480px',
          background: '#FFFFFF',
          borderRadius: '40px'
        }}>
          <h3 style={{
            fontFamily: 'Pretendard',
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '28px',
            letterSpacing: '-0.005em',
            color: '#46474C',
            margin: 0
          }}>
            커버링 빌딩 문의를 위한 정보를 입력해 주세요
          </h3>

          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#FFEBEE',
              border: '1px solid #FF6363',
              color: '#C62828',
              fontSize: '14px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              문제가 발생했습니다: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '16px',
            width: '400px'
          }}>
            {/* 지역 드롭다운 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
              width: '100%'
            }}>
              <label style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.005em',
                color: '#46474C'
              }}>
                지역
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '16px',
                    gap: '8px',
                    width: '100%',
                    height: '56px',
                    background: '#FFFFFF',
                    border: '1px solid #DBDCDF',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Pretendard',
                    fontSize: '16px',
                    textAlign: 'left'
                  }}
                >
                  <span style={{
                    flex: 1,
                    color: selectedCity ? '#171719' : '#C2C4C8'
                  }}>
                    {selectedCity || '서울시'}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#A3AEC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    zIndex: 10,
                    width: '100%',
                    marginTop: '4px',
                    background: '#FFFFFF',
                    border: '1px solid #DBDCDF',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    maxHeight: '240px',
                    overflowY: 'auto'
                  }}>
                    {cities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          textAlign: 'left',
                          border: 'none',
                          background: selectedCity === city ? '#F0F9FF' : '#FFFFFF',
                          color: selectedCity === city ? '#1AA3FF' : '#171719',
                          cursor: 'pointer',
                          fontFamily: 'Pretendard',
                          fontSize: '16px',
                          fontWeight: selectedCity === city ? 600 : 400
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCity !== city) {
                            e.currentTarget.style.background = '#F7F7F8';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCity !== city) {
                            e.currentTarget.style.background = '#FFFFFF';
                          }
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 담당자 번호 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
              width: '100%'
            }}>
              <label style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.005em',
                color: '#46474C'
              }}>
                담당자 번호
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                required
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '16px',
                  width: '100%',
                  height: '56px',
                  background: '#FFFFFF',
                  border: '1px solid #DBDCDF',
                  borderRadius: '8px',
                  fontFamily: 'Pretendard',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.005em',
                  color: '#171719'
                }}
              />
            </div>

            {/* 문의내용 (선택) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
              width: '100%'
            }}>
              <label style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.005em',
                color: '#46474C'
              }}>
                문의내용(선택)
              </label>
              <textarea
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder="문의할 내용이 있으면 편하게 적어주세요."
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '16px',
                  width: '100%',
                  height: '104px',
                  background: '#FFFFFF',
                  border: '1px solid #DBDCDF',
                  borderRadius: '8px',
                  fontFamily: 'Pretendard',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.005em',
                  color: '#171719',
                  resize: 'none'
                }}
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '14px 20px',
                width: '100%',
                height: '56px',
                background: loading ? '#94A3B8' : '#23AFFF',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '28px',
                textAlign: 'center',
                letterSpacing: '-0.005em',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#1A9EEB';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#23AFFF';
                }
              }}
            >
              {loading ? '처리 중...' : '첫 달 무료체험 문의하기'}
            </button>
          </form>
        </div>
      </div>
    </section>
    </>
  );
};
