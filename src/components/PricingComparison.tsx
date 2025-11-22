export const PricingComparison = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* 가격 비교 카드 */}
        <div className="mb-24">
          <div className="flex justify-center mb-12">
            {/* 커버링 이용 */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-cyan-300 p-10 shadow-lg animate-fade-in-up text-white max-w-md" style={{ animationDelay: '0.2s' }}>
              <div className="absolute top-4 right-4 text-6xl font-black opacity-20">
                2
              </div>
              <div className="absolute top-4 left-4 px-4 py-2 bg-white bg-opacity-20 rounded-full text-xs font-bold text-white">
                추천
              </div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl">♻️</span>
                  </div>
                  <h3 className="text-2xl font-black">커버링 이용</h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center pb-3 border-b border-white border-opacity-30">
                    <span className="text-white text-sm font-medium">커버링 빌딩 이용료</span>
                    <span className="font-bold">150,000원</span>
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center border border-white border-opacity-30">
                  <div className="text-sm mb-2 text-white text-opacity-90">월 평균 비용</div>
                  <div className="text-4xl font-black">150,000원</div>
                </div>

                <div className="mt-8 text-center">
                  <div className="text-sm text-white text-opacity-90 mb-1">절약액</div>
                  <div className="text-3xl font-black text-white">570,000원</div>
                  <div className="text-xs text-white text-opacity-80 mt-2">매월 절약 가능!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
