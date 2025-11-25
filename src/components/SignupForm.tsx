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

      <section id="signup" className="py-16 md:py-[120px] bg-[#F7F7F8] px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-20 max-w-[1032px] mx-auto">
        {/* 왼쪽: 텍스트 섹션 */}
        <div className="flex flex-col items-start gap-3 w-full md:w-[303px]">
          <div className="flex flex-col items-start gap-1 w-full">
            <span className="font-bold text-lg md:text-xl leading-7 tracking-tight text-[#66C7FF]">
              문의 시 24시간 내 연락 예정
            </span>
            <h2 className="font-bold text-3xl md:text-[40px] leading-tight md:leading-[52px] tracking-tight text-[#171719] m-0">
              무료 견적 문의하기
            </h2>
          </div>
          <p className="font-bold text-xl md:text-2xl leading-8 tracking-tight m-0 w-full" style={{ color: '#FF6B35' }}>
            12월 내 계약 시 즉시 25만원 할인해드려요!
          </p>
        </div>

        {/* 오른쪽: 폼 섹션 */}
        <div className="flex flex-col items-start p-6 md:p-10 gap-6 w-full md:w-[480px] bg-white rounded-[40px]">
          <h3 className="font-bold text-lg md:text-xl leading-7 tracking-tight text-[#46474C] m-0">
            커버링 빌딩 문의를 위한 정보를 입력해 주세요
          </h3>

          {error && (
            <div className="p-3 md:p-4 rounded-lg bg-[#FFEBEE] border border-[#FF6363] text-[#C62828] text-sm w-full">
              문제가 발생했습니다: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4 w-full">
            {/* 지역 드롭다운 */}
            <div className="flex flex-col items-start gap-1.5 w-full">
              <label className="font-bold text-sm leading-5 tracking-tight text-[#46474C]">
                지역
              </label>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="box-border flex flex-row items-center p-4 gap-2 w-full h-14 bg-white border border-[#DBDCDF] rounded-lg cursor-pointer font-['Pretendard'] text-base text-left"
                >
                  <span className={`flex-1 ${selectedCity ? 'text-[#171719]' : 'text-[#C2C4C8]'}`}>
                    {selectedCity || '서울시'}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  >
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#A3AEC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#DBDCDF] rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.1)] max-h-60 overflow-y-auto">
                    {cities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className={`w-full p-3 md:px-4 text-left border-none cursor-pointer font-['Pretendard'] text-base transition-colors ${
                          selectedCity === city
                            ? 'bg-[#F0F9FF] text-[#1AA3FF] font-semibold'
                            : 'bg-white text-[#171719] font-normal hover:bg-[#F7F7F8]'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 담당자 번호 */}
            <div className="flex flex-col items-start gap-1.5 w-full">
              <label className="font-bold text-sm leading-5 tracking-tight text-[#46474C]">
                담당자 번호
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                required
                className="box-border flex flex-row items-center p-4 w-full h-14 bg-white border border-[#DBDCDF] rounded-lg font-['Pretendard'] text-base leading-6 tracking-tight text-[#171719]"
              />
            </div>

            {/* 문의내용 (선택) */}
            <div className="flex flex-col items-start gap-1.5 w-full">
              <label className="font-bold text-sm leading-5 tracking-tight text-[#46474C]">
                문의내용(선택)
              </label>
              <textarea
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder="문의할 내용이 있으면 편하게 적어주세요."
                className="box-border p-4 w-full h-26 bg-white border border-[#DBDCDF] rounded-lg font-['Pretendard'] text-base leading-6 tracking-tight text-[#171719] resize-none"
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className={`flex flex-row justify-center items-center px-5 py-3.5 w-full h-14 rounded-lg border-none font-['Pretendard'] font-bold text-lg md:text-xl leading-7 text-center tracking-tight text-white transition-colors ${
                loading
                  ? 'bg-[#94A3B8] cursor-not-allowed'
                  : 'bg-[#23AFFF] cursor-pointer hover:bg-[#1A9EEB]'
              }`}
            >
              {loading ? '처리 중...' : '무료 견적 문의하기'}
            </button>
          </form>
        </div>
      </div>
    </section>
    </>
  );
};
