export const FinalCTA = () => {
  const scrollToSignup = () => {
    const signupSection = document.getElementById('signup');
    signupSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const RocketIcon = () => (
    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  const GraduationIcon = () => (
    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.001m20 0C22 10.998 17.5 6.25 12 6.253" />
    </svg>
  );

  const ChartIcon = () => (
    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600 opacity-8 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto text-center text-white">
        {/* 메인 메시지 */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight opacity-0 animate-slide-up">
          이제 시작하세요
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl text-emerald-100 mb-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          분리수거 관리의 스트레스에서 해방되세요
        </p>

        <p className="text-base sm:text-lg text-slate-200 mb-12 max-w-2xl mx-auto font-light opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          오늘 신청하면 <span className="font-semibold text-emerald-300">무료 컨설팅과 30일 무료 체험</span>을 받으실 수 있습니다.<br className="hidden sm:block" />
          신용카드 정보나 약정 없이 바로 시작할 수 있습니다.
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 opacity-0 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={scrollToSignup}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
          >
            무료 데모 신청하기
          </button>
          <a
            href="tel:02-1234-5678"
            className="bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl border-2 border-emerald-400 transition duration-300"
          >
            전화 상담 신청
          </a>
        </div>

        {/* 보증 */}
        <div className="inline-block bg-white bg-opacity-5 backdrop-blur-sm border border-emerald-400 border-opacity-50 rounded-xl px-6 sm:px-8 py-4 mb-16 opacity-0 animate-slide-up text-sm sm:text-base" style={{ animationDelay: '0.4s' }}>
          <p className="text-slate-100 space-y-2 sm:space-y-0">
            <span className="block sm:inline">✓ 1주 내 구축 완료</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">✓ 30일 무료 체험</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">✓ 100% 환불 보장</span>
          </p>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-12 border-t border-white border-opacity-20">
          <div className="text-white p-6 rounded-2xl hover:bg-white hover:bg-opacity-5 transition duration-300 opacity-0 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-emerald-400 mb-4">
              <RocketIcon />
            </div>
            <h4 className="font-bold mb-3 text-lg">빠른 시작</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              신청 후 1주일 내에 모든 시스템이 구축되어 바로 사용 가능합니다.
            </p>
          </div>
          <div className="text-white p-6 rounded-2xl hover:bg-white hover:bg-opacity-5 transition duration-300 opacity-0 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-emerald-400 mb-4">
              <GraduationIcon />
            </div>
            <h4 className="font-bold mb-3 text-lg">완벽한 지원</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              입주민 교육부터 운영까지 모든 과정에서 전담 컨설턴트가 지원합니다.
            </p>
          </div>
          <div className="text-white p-6 rounded-2xl hover:bg-white hover:bg-opacity-5 transition duration-300 opacity-0 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="text-emerald-400 mb-4">
              <ChartIcon />
            </div>
            <h4 className="font-bold mb-3 text-lg">확실한 ROI</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              평균적으로 2-3개월 내에 투자비를 회수하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};
