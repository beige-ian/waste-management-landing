export const Pricing = () => {
  const features = [
    '재활용 분리수거 교육',
    '정기 수거 서비스',
    '실시간 수거 현황 리포트',
    '전담 매니저 배정',
    '민원 발생 시 즉시 대응',
    '환경부 신고 대행',
  ];

  const scrollToSignup = () => {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            PRICING
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            합리적인 가격으로 시작하세요
          </h2>
          <p className="text-gray-600">
            모든 서비스가 포함된 단일 요금제
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
            <p className="text-sm font-medium opacity-90 mb-2">월 정기 구독</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold">15</span>
              <span className="text-2xl font-medium">만원</span>
            </div>
            <p className="text-sm opacity-75 mt-2">VAT 별도</p>
          </div>

          <div className="p-8">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              포함된 서비스
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={scrollToSignup}
              className="w-full mt-8 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-blue-600/25"
            >
              무료 견적 문의하기
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              계약 전 무료 컨설팅 제공
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
