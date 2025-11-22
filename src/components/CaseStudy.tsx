export const CaseStudy = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden scroll-mt-20">
      {/* 배경 애니메이션 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 opacity-5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="font-semibold text-sm tracking-wider uppercase inline-block mb-3" style={{ color: '#1AA3FF' }}>
            실제 결과
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            실제 건물주들의 변화
          </h2>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            100만 명 이상이 이미 경험하고 있는 변화입니다.
          </p>
        </div>

        {/* 고객사례 이미지 - 큰 강임팩트 */}
        <div className="mb-20 animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            {/* 이미지 배경 효과 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-20 -z-10 animate-glow"></div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 hover:shadow-2xl transition-shadow duration-500">
              <img
                src="/고객사례.png"
                alt="고객 사례"
                className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(26, 163, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(26, 163, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(26, 163, 255, 0);
          }
        }

        .pulse-ring {
          animation: pulse-ring 2s infinite;
        }
      `}</style>
    </section>
  );
};
