export const Comparison = () => {
  const features = [
    { name: '자동 입주민 교육', traditional: false, ours: true },
    { name: '실시간 모니터링', traditional: false, ours: true },
    { name: '자동 공지 발송', traditional: false, ours: true },
    { name: '민원 자동 처리', traditional: false, ours: true },
    { name: '분리수거율 분석', traditional: false, ours: true },
    { name: '비용 절감 리포트', traditional: false, ours: true },
    { name: '모바일 앱 제공', traditional: false, ours: true },
    { name: '24/7 고객 지원', traditional: false, ours: true },
    { name: '월 구독료', traditional: true, ours: true },
    { name: '초기 구축 비용', traditional: true, ours: false },
  ];

  const CheckIcon = () => (
    <svg
      className="w-6 h-6 text-emerald-600 inline"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );

  const XIcon = () => (
    <svg
      className="w-6 h-6 text-red-500 inline"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <section id="comparison" className="py-24 px-4 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden scroll-mt-20">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 opacity-5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="text-center mb-20 opacity-0 animate-slide-up">
          <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase inline-block mb-3">
            비교 분석
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mt-4 mb-6">
            기존 방식 vs 우리의 솔루션
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            같은 비용으로도 훨씬 더 많은 효과를 얻을 수 있습니다.
          </p>
        </div>

        {/* 비교 테이블 */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 to-slate-800">
                  <th className="px-8 py-6 text-left text-white font-bold text-lg">기능</th>
                  <th className="px-8 py-6 text-center text-white font-bold text-lg">
                    전통적 방식
                  </th>
                  <th className="px-8 py-6 text-center text-white font-bold text-lg bg-gradient-to-r from-emerald-600 to-emerald-700">
                    우리의 솔루션
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                    } hover:bg-emerald-50 transition duration-200 border-b border-slate-200`}
                  >
                    <td className="px-8 py-5 font-semibold text-slate-900">
                      {feature.name}
                    </td>
                    <td className="px-8 py-5 text-center">
                      {feature.traditional ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 text-sm font-bold">
                          ✓
                        </span>
                      ) : (
                        <XIcon />
                      )}
                    </td>
                    <td className="px-8 py-5 text-center bg-emerald-50 bg-opacity-50">
                      {feature.ours ? (
                        <CheckIcon />
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-400 text-sm font-bold">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 비용 절감 시각화 */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-xl opacity-0 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <img
            src="https://cdn.prod.website-files.com/651143d00678effa4a6803f1/685273595a5f8f8135406c73_Frame%209384%202.png"
            alt="비용 절감 시각화"
            className="w-full h-auto object-cover hover:scale-105 transition duration-500"
          />
        </div>

        {/* 결론 */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 text-white text-center opacity-0 animate-slide-up shadow-2xl"
          style={{ animationDelay: '0.4s' }}
        >
          <h3 className="text-4xl font-bold mb-6">왜 우리를 선택하세요?</h3>
          <p className="text-lg text-slate-100 max-w-3xl mx-auto leading-relaxed font-light">
            단순히 도구가 아니라, 원룸·투룸 건물주의 <span className="font-semibold text-emerald-400">완전한 분리수거 관리 파트너</span>입니다.<br />
            설치부터 운영까지 모든 것을 지원하며, 눈에 띄는 결과를 보장합니다.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 bg-opacity-20 rounded-full border border-emerald-500 border-opacity-50">
              <CheckIcon />
              <span className="text-sm font-medium">100% 자동화</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 bg-opacity-20 rounded-full border border-emerald-500 border-opacity-50">
              <CheckIcon />
              <span className="text-sm font-medium">즉시 도입 가능</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 bg-opacity-20 rounded-full border border-emerald-500 border-opacity-50">
              <CheckIcon />
              <span className="text-sm font-medium">30일 무료 체험</span>
            </div>
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
