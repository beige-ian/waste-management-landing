export const Pricing = () => {
  const scrollToSignup = () => {
    const signupSection = document.getElementById('signup');
    signupSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <p className="font-bold text-lg md:text-xl leading-7 tracking-tight mb-2" style={{ color: '#23AFFF' }}>
            합리적인 가격
          </p>
          <h2 className="font-bold text-3xl md:text-5xl leading-tight tracking-tight text-[#171719] mb-4">
            월 15만원으로 시작하세요
          </h2>
          <p className="text-lg text-[#5A5C63]">
            분리수거장 관리의 모든 것을 한 번에 해결합니다
          </p>
        </div>

        {/* 가격 카드 */}
        <div className="bg-gradient-to-br from-[#F0F9FF] to-white border-2 border-[#23AFFF] rounded-[40px] p-8 md:p-12 shadow-lg">
          {/* 가격 */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-lg text-[#5A5C63]">월</span>
              <span className="text-6xl md:text-7xl font-bold" style={{ color: '#23AFFF' }}>15</span>
              <span className="text-2xl md:text-3xl font-bold" style={{ color: '#23AFFF' }}>만원</span>
              <span className="text-lg text-[#5A5C63]">부터</span>
            </div>
            <p className="text-sm text-[#9CA3AF]">VAT 별도 · 건물 규모에 따라 상이</p>
          </div>

          {/* 포함 항목 */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              '분리수거함 무료 설치',
              '주 2회 정기 수거',
              '혼합폐기물 처리 포함',
              '24시간 카카오톡 문의',
              '수거 후 사진 리포트',
              '민원 대응 지원',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#23AFFF] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-base md:text-lg text-[#46474C] font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA 버튼 */}
          <div className="text-center">
            <button
              onClick={scrollToSignup}
              className="w-full md:w-auto px-12 py-4 rounded-xl font-bold text-lg md:text-xl text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#23AFFF' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A9EEB')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#23AFFF')}
            >
              무료 견적 받기
            </button>
          </div>
        </div>

        {/* 추가 안내 */}
        <p className="text-center text-sm text-[#9CA3AF] mt-6">
          * 정확한 견적은 건물 현황 파악 후 안내드립니다
        </p>
      </div>
    </section>
  );
};
