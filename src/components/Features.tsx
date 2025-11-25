export const Features = () => {
  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="flex flex-col items-center gap-1 mb-12 text-center animate-fade-in-up">
          <p className="font-bold text-xl text-center tracking-tight" style={{ color: '#23AFFF' }}>
            커버링 빌딩의 수거 과정
          </p>
          <h2 className="text-5xl font-bold text-center tracking-tight" style={{ color: '#171719' }}>
            간단한 수거로 더 편리하게
          </h2>
        </div>

        {/* 3단계 프로세스 */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2 bg-slate-50 border border-slate-200 rounded-[40px] p-4 md:p-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Step 1: 수거함 설치 */}
          <div className="flex flex-col items-center py-6 md:py-8 px-4 gap-6 md:gap-10 flex-1 rounded-[40px] w-full md:w-auto">
            {/* 이미지 */}
            <div className="w-full max-w-[208px] h-44 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex items-center justify-center">
              <img src="/수거함.png" alt="수거함 설치" className="w-full h-full object-cover" />
            </div>

            {/* 텍스트 */}
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Chip */}
              <div className="flex items-center justify-center px-3 py-2 bg-white border rounded-full" style={{ borderColor: '#66C7FF', minWidth: '40px', height: '40px' }}>
                <span className="font-bold text-base text-center tracking-tight" style={{ color: '#23AFFF' }}>
                  1
                </span>
              </div>

              {/* 제목 */}
              <h3 className="font-bold text-2xl text-center tracking-tight" style={{ color: '#5A5C63' }}>
                수거함 설치
              </h3>

              {/* 설명 */}
              <p className="font-normal text-base text-center tracking-tight leading-6" style={{ color: '#5A5C63' }}>
                원하는 위치를 지정해 주시면 분리수거함을 설치해 드려요.
              </p>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="w-8 h-8 flex items-center justify-center md:block hidden">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="#66C7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Mobile down arrow */}
          <div className="w-8 h-8 flex items-center justify-center md:hidden">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#66C7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 2: 수거함에 버리기 */}
          <div className="flex flex-col items-center py-6 md:py-8 px-4 gap-6 md:gap-10 flex-1 rounded-[40px] w-full md:w-auto">
            {/* 이미지 */}
            <div className="w-full max-w-[208px] h-44 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex items-center justify-center">
              <img src="/수거함 2.png" alt="수거함에 버리기" className="w-full h-full object-cover" />
            </div>

            {/* 텍스트 */}
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Chip */}
              <div className="flex items-center justify-center px-3 py-2 bg-white border rounded-full" style={{ borderColor: '#66C7FF', minWidth: '40px', height: '40px' }}>
                <span className="font-bold text-base text-center tracking-tight" style={{ color: '#23AFFF' }}>
                  2
                </span>
              </div>

              {/* 제목 */}
              <h3 className="font-bold text-2xl text-center tracking-tight" style={{ color: '#5A5C63' }}>
                수거함에 버리기
              </h3>

              {/* 설명 */}
              <p className="font-normal text-base text-center tracking-tight leading-6" style={{ color: '#5A5C63' }}>
                혼합 폐기물이 있어도 신경 안 써도 돼요. 전부 다 처리 가능합니다.
              </p>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="w-8 h-8 flex items-center justify-center md:block hidden">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="#66C7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Mobile down arrow */}
          <div className="w-8 h-8 flex items-center justify-center md:hidden">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#66C7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 3: 주/야간 정기 수거 */}
          <div className="flex flex-col items-center py-6 md:py-8 px-4 gap-6 md:gap-10 flex-1 rounded-[40px] w-full md:w-auto">
            {/* 이미지 */}
            <div className="w-full max-w-[208px] h-44 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex items-center justify-center">
              <img src="/커버링트럭.png" alt="정기 수거" className="w-full h-full object-cover" />
            </div>

            {/* 텍스트 */}
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Chip */}
              <div className="flex items-center justify-center px-3 py-2 bg-white border rounded-full" style={{ borderColor: '#66C7FF', minWidth: '40px', height: '40px' }}>
                <span className="font-bold text-base text-center tracking-tight" style={{ color: '#23AFFF' }}>
                  3
                </span>
              </div>

              {/* 제목 */}
              <h3 className="font-bold text-2xl text-center tracking-tight" style={{ color: '#5A5C63' }}>
                주/야간 정기 수거
              </h3>

              {/* 설명 */}
              <p className="font-normal text-base text-center tracking-tight leading-6" style={{ color: '#5A5C63' }}>
                원하는 시간대에 맞춰 쓰레기 수거 후 새 봉투로 교체해 드려요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
