export const SolutionShowcase = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Frame 9247 - 첫 번째 솔루션 */}
        <div className="hidden lg:flex justify-between items-start p-14 gap-20 w-full h-96 bg-white border border-slate-100 rounded-3xl shadow-sm animate-fade-in-up">
          {/* 좌측 텍스트 컨테이너 */}
          <div className="flex flex-col gap-4 w-80 flex-shrink-0">
            {/* Chip */}
            <div className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 rounded text-xs font-bold" style={{ color: '#23AFFF', width: 'fit-content' }}>
              아이템
            </div>

            {/* 제목 */}
            <h3 className="text-4xl font-bold text-slate-900 leading-tight">
              분리수거장 설치부터 쓰레기 수거까지 전부 다 해드려요!
            </h3>

            {/* 설명 */}
            <p className="text-base text-slate-600 leading-relaxed">
              원하는 날짜에, 음식물 쓰레기든 혼합 폐기물이든 상관없이 깔끔하게 수거해드릴게요. 이제 쓰레기 때문에 머리 아프지 마세요.
            </p>
          </div>

          {/* 우측 이미지 */}
          <div className="flex-1">
            <img
              src="/수거과정.png"
              alt="수거 서비스"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
