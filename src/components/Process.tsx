export const Process = () => {
  const steps = [
    {
      title: '설치 및 준비',
      description: '분리수거 컨테이너 설치 및 시스템 구축',
      image: 'https://cdn.prod.website-files.com/651143d00678effa4a6803f1/6763a7c06a8cc534bcf50526_%E1%84%89%E1%85%AE%E1%84%80%E1%85%A5%E1%84%92%E1%85%A8%E1%84%80%E1%85%B5%E1%84%92%E1%85%A1%E1%86%B7%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5.png',
    },
    {
      title: '자동 교육',
      description: '입주민에게 분리수거 규칙 자동 안내',
      image: 'https://cdn.prod.website-files.com/651143d00678effa4a6803f1/68527331e3b9acca52ed7366_Image%20480.png',
    },
    {
      title: '실시간 모니터링',
      description: 'AI가 수거장을 자동으로 모니터링',
      image: 'https://cdn.prod.website-files.com/651143d00678effa4a6803f1/68527345633a63f5f474fb6a_Image%20481.png',
    },
  ];

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 opacity-5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="text-center mb-20 opacity-0 animate-slide-up">
          <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase inline-block mb-3">
            작동 방식
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mt-4 mb-6">
            3단계로 끝나는 분리수거 자동화
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            복잡한 분리수거 관리를 3단계로 간단하게 자동화합니다.
          </p>
        </div>

        {/* 프로세스 스텝 */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="opacity-0 hover:scale-105 transition duration-300"
              style={{
                animation: `slideUp 0.8s ease-out ${0.2 + idx * 0.15}s forwards`,
              }}
            >
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-2xl transition duration-300">
                {/* 이미지 */}
                <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                  {/* 스텝 번호 */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {idx + 1}
                  </div>
                </div>

                {/* 텍스트 */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 font-light text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 추가 정보 */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 opacity-0 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200">
            <div className="text-3xl font-bold text-emerald-600 mb-2">1주</div>
            <div className="text-slate-700 font-medium">설치 및 구축</div>
            <p className="text-sm text-slate-600 mt-2">신청 후 1주일 내에 완벽한 설치</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-8 border border-cyan-200">
            <div className="text-3xl font-bold text-cyan-600 mb-2">24/7</div>
            <div className="text-slate-700 font-medium">자동 모니터링</div>
            <p className="text-sm text-slate-600 mt-2">AI가 항상 수거장을 감시</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
            <div className="text-slate-700 font-medium">시간 단축</div>
            <p className="text-sm text-slate-600 mt-2">건물주의 관리 시간 대폭 감소</p>
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
