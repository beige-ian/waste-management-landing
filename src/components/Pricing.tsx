export const Pricing = () => {
  const scrollToSignup = () => {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const plans = [
    {
      name: '80L 키트',
      price: '7,500',
      unit: '/회',
      note: '야간수거 기준',
      caseTitle: '스타트업 A사 이용 사례',
      features: [
        { main: '10인 이내 사무실 또는 스타트업 추천', sub: null },
        { main: '월 예산 60,000원 가량', sub: null },
        { main: '주 2회(월/금) 수거', sub: '수거 수/키트 수 자율 조정 가능' },
      ],
      buttonText: '2주 무료체험 신청하기',
      highlighted: false,
      image: '/80L키트.png',
    },
    {
      name: '120L 키트',
      price: '12,000',
      unit: '/회',
      note: '야간수거 기준',
      caseTitle: '기업 B사 이용 사례',
      features: [
        { main: '20인 이내 사무실 또는 기업 추천', sub: null },
        { main: '월 예산 144,000원 가량', sub: null },
        { main: '주 3회(월/수/금) 수거', sub: '수거 수/키트 수 자율 조정 가능' },
      ],
      buttonText: '2주 무료체험 신청하기',
      highlighted: true,
      image: '/120L키트.png',
    },
    {
      name: '커스텀',
      price: '?',
      unit: '/회',
      note: '상담 시 견적 제공',
      caseTitle: '기업 C사 이용 사례',
      features: [
        { main: '30인 이상 사무실 또는 기업 추천', sub: null },
        { main: '감이 잡히지 않는 경우 추천', sub: null },
        { main: '수거 일 수 상담 후 조정', sub: '수거 수/키트 수 자율 조정 가능' },
      ],
      buttonText: '상담 신청하기',
      highlighted: false,
      image: '/커스텀키트.png',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xl font-bold text-[#69a5ff] mb-1">
            상황에 맞는 다양한 플랜
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            우리 사무실에 맞는 플랜은?
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl p-6 flex flex-col ${
                plan.highlighted
                  ? 'border-4 border-[#69a5ff]'
                  : 'border border-gray-200'
              }`}
            >
              {/* Product Image */}
              <div className="h-60 flex items-center justify-center mb-6 rounded-3xl bg-white">
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* Plan Name & Price */}
              <div className="text-center mb-6">
                <p className="text-xl font-bold text-[#70737c] mb-2">
                  {plan.name}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-bold text-[#46474c]">
                    {plan.price}원
                  </span>
                  <span className="text-base text-[#c2c4c8]">{plan.unit}</span>
                </div>
                <p className="text-sm text-[#70737c] mt-1">{plan.note}</p>
              </div>

              {/* Case Study */}
              <div className="flex-grow">
                <p className="text-sm font-bold text-[#3385ff] text-center mb-2">
                  {plan.caseTitle}
                </p>
                <div className="bg-[#eaf2fe] rounded-2xl p-3 space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex gap-2 items-start">
                      <svg
                        className="w-6 h-6 text-[#3385ff] flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-base font-bold text-[#46474c]">
                          {feature.main}
                        </p>
                        {feature.sub && (
                          <p className="text-sm text-[#70737c]">{feature.sub}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={scrollToSignup}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-base transition-colors ${
                  plan.highlighted
                    ? 'bg-[#3385ff] text-white hover:bg-blue-600'
                    : 'border border-[#69a5ff] text-[#3385ff] hover:bg-blue-50'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
