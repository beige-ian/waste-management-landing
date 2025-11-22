import { useState, useEffect, useRef } from 'react';
import { RecyclingChart } from './RecyclingChart';

export const ProblemSolution = () => {
  const [displayValues, setDisplayValues] = useState({ hours: 0, complaints: 0, cost: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateNumbers();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumbers = () => {
    const duration = 2000;
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);

      setDisplayValues({
        hours: Math.floor(10 * progress),
        complaints: Math.floor(80 * progress),
        cost: Math.floor(10 * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="mb-20 text-center animate-fade-in-up">
          <p className="text-sm font-semibold tracking-wider uppercase mb-4" style={{ color: '#1AA3FF' }}>
            건물주의 현실
          </p>
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            매주 1시간, 민원 전화,<br />청소비는 자꾸만 늘어나
          </h2>
          <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
            원룸·투룸을 관리하는 건물주분들이 정말로 겪고 있는 문제들입니다.<br />
            <span className="text-slate-500">혼자가 아닙니다. 우리도 다 겪었습니다.</span>
          </p>
        </div>

        {/* 실제 문제들 */}
        <div className="space-y-5 mb-24">
          {/* 문제 1 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-red-50 to-red-100 border-2 border-red-200 p-10 shadow-2xl transition-shadow duration-300 stagger-item hover:shadow-3xl">
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-red-200 to-red-100 rounded-3xl flex items-center justify-center ring-4 ring-red-300">
                <img src="/trash-bin.png" alt="쓰레기통" className="w-14 h-14 object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black text-slate-900">매주 직접 가서 청소</h3>
                  <span className="inline-block text-xs font-bold text-red-700 bg-red-200 px-4 py-2 rounded-full border border-red-300">반복 업무</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-base font-medium">
                  분리수거장을 관리하지 않으면 입주민들이 마구 써버려요.<br />
                  <span className="font-black text-red-600">매주 최소 1시간씩 낭비</span>되고, 시간이 쌓이면 <span className="font-black text-red-600">1달에 4시간 이상 낭비됩니다.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 문제 2 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-orange-50 to-orange-100 border-2 border-orange-200 p-10 shadow-2xl transition-shadow duration-300 stagger-item hover:shadow-3xl">
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-orange-200 to-orange-100 rounded-3xl flex items-center justify-center ring-4 ring-orange-300">
                <img src="/truck.png" alt="수거 트럭" className="w-14 h-14 object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black text-slate-900">수거업체가 안 가져간다</h3>
                  <span className="inline-block text-xs font-bold text-orange-700 bg-orange-200 px-4 py-2 rounded-full border border-orange-300">악순환</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-base font-medium">
                  수거장이 더럽고 관리가 안 되면 지자체 수거업체가 수거를 거부해요.<br />
                  <span className="font-black text-orange-600">쓰레기 더미가 자꾸만 쌓이고,</span> <span className="font-black text-orange-600">입주민 불만은 더 커집니다.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 문제 3 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-amber-50 to-amber-100 border-2 border-amber-200 p-10 shadow-2xl transition-shadow duration-300 stagger-item hover:shadow-3xl">
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-100 rounded-3xl flex items-center justify-center ring-4 ring-amber-300">
                <img src="/angry-face.png" alt="화난 표정" className="w-14 h-14 object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black text-slate-900">입주민 민원이 폭주</h3>
                  <span className="inline-block text-xs font-bold text-amber-700 bg-amber-200 px-4 py-2 rounded-full border border-amber-300">스트레스</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-base font-medium">
                  <span className="font-black text-amber-600">"냄새난다", "벌레가 많다", "왜 안 치우냐"</span> 등<br />
                  끊임없는 카톡, 전화가 와요. 관리자로서 <span className="font-black text-amber-600">정말 힘들고 스트레스가 많습니다.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 문제 4 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-rose-50 to-rose-100 border-2 border-rose-200 p-10 shadow-2xl transition-shadow duration-300 stagger-item hover:shadow-3xl">
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-rose-200 to-rose-100 rounded-3xl flex items-center justify-center ring-4 ring-rose-300">
                <img src="/영수증.png" alt="영수증" className="w-14 h-14 object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black text-slate-900">청소비 끝없이 증가</h3>
                  <span className="inline-block text-xs font-bold text-rose-700 bg-rose-200 px-4 py-2 rounded-full border border-rose-300">재정 부담</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-base font-medium">
                  청소비, 추가 수거 수수료, 혹은 직접 처리하면서 비용 부담이 늘어나요.<br />
                  <span className="font-black text-rose-600">매달 적립금에서 나가는 돈이 계속 증가</span>해서 <span className="font-black text-rose-600">입주민 불만도 함께 증가합니다.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 해결책 - 결과 */}
        <div ref={sectionRef} className="mb-24 animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              건물주님의 삶이 달라집니다
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              커버링을 도입한 건물주들이 체험한 실제 변화입니다. 더 이상 분리수거장 때문에 스트레스받지 마세요.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* 결과 1 */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-10 shadow-lg transition-shadow duration-300 stagger-item hover:shadow-2xl">
              <div className="relative z-10">
                <div className="text-6xl font-black mb-3 inline-block" style={{ color: '#1AA3FF' }}>
                  주
                </div>
                <div className="text-6xl font-black mb-3 inline-block ml-2" style={{ color: '#1AA3FF' }}>
                  {displayValues.hours}
                </div>
                <div className="text-3xl font-black mb-3 inline-block text-slate-400 ml-1">
                  시간
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-3">
                  시간 절감
                </div>
                <p className="text-slate-600 leading-relaxed">
                  분리수거장에 거의 안 가도 됩니다. 더 소중한 일에 시간을 쓸 수 있어요.
                </p>
              </div>
            </div>

            {/* 결과 2 */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-green-50 border border-green-100 p-10 shadow-lg transition-shadow duration-300 stagger-item hover:shadow-2xl">
              <div className="relative z-10">
                <div className="text-6xl font-black mb-3 inline-block" style={{ color: '#10B981' }}>
                  -{displayValues.complaints}
                </div>
                <div className="text-3xl font-black mb-3 inline-block text-slate-400 ml-1">
                  %
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-3">
                  민원 감소
                </div>
                <p className="text-slate-600 leading-relaxed">
                  입주민들의 불평, 민원 전화가 줄어듭니다. 더 이상 스트레스받지 않아도 돼요.
                </p>
              </div>
            </div>

            {/* 결과 3 */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-purple-50 border border-purple-100 p-10 shadow-lg transition-shadow duration-300 stagger-item hover:shadow-2xl">
              <div className="relative z-10">
                <div className="text-6xl font-black mb-3 inline-block" style={{ color: '#A855F7' }}>
                  월
                </div>
                <div className="text-6xl font-black mb-3 inline-block ml-2" style={{ color: '#A855F7' }}>
                  {displayValues.cost}
                </div>
                <div className="text-3xl font-black mb-3 inline-block text-slate-400 ml-1">
                  만원
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-3">
                  비용 절감
                </div>
                <p className="text-slate-600 leading-relaxed">
                  추가 청소비, 수거료를 줄일 수 있습니다. 자동화가 비용 효율을 만듭니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Figma 노드 5276-8625: 원스탑 서비스 */}
        <div className="mb-24 animate-fade-in-up">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '56px',
            gap: '80px',
            background: '#ffffff',
            border: '1px solid #f4f4f5',
            borderRadius: '40px',
            position: 'relative',
            width: '100%',
          }}>
            {/* 왼쪽: 텍스트 영역 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '50%' }}>
              {/* Chip */}
              <div style={{
                background: '#eaf2fe',
                padding: '6px 10px',
                borderRadius: '6px',
                display: 'inline-block',
                width: 'fit-content',
              }}>
                <p style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#3385ff',
                  margin: 0,
                }}>
                  원스탑 서비스
                </p>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '48px',
                color: '#46474c',
                margin: 0,
              }}>
                분리수거장 설치부터 쓰레기 수거까지 전부 다 해드려요!
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'Pretendard',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#5a5c63',
                margin: 0,
              }}>
                원하는 날짜에, 음식물 쓰레기든 혼합 폐기물이든 상관없이 깔끔하게 수거해드릴게요. 이제 쓰레기 때문에 머리 아프지 마세요.
              </p>
            </div>

            {/* 오른쪽: 트럭 이미지 */}
            <div style={{
              width: '474px',
              height: '268px',
              flexShrink: 0,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}>
              <img
                src="/truck.png"
                alt="수거 트럭"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>

        {/* Figma 노드 5276-8632: 비용 절감 */}
        <div className="mb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '56px',
            gap: '80px',
            background: '#ffffff',
            border: '1px solid #f4f4f5',
            borderRadius: '40px',
            position: 'relative',
            width: '100%',
            flexDirection: 'row-reverse',
          }}>
            {/* 오른쪽: 텍스트 영역 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '50%' }}>
              {/* Chip */}
              <div style={{
                background: '#eaf2fe',
                padding: '6px 10px',
                borderRadius: '6px',
                display: 'inline-block',
                width: 'fit-content',
              }}>
                <p style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#3385ff',
                  margin: 0,
                }}>
                  쓰레기 처리 비용 절감
                </p>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '48px',
                color: '#46474c',
                margin: 0,
              }}>
                몸은 편안해 지고<br />
                비용은 절약되는 마법
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'Pretendard',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#5a5c63',
                margin: 0,
              }}>
                커버링 빌딩과 함께라면<br />
                쓰레기 처리에 썼던 노동력, 각종 청소비<br />
                과징금 받을 걱정.. 싹 없어집니다.
              </p>
            </div>

            {/* 왼쪽: 영수증 이미지 */}
            <div style={{
              width: '576px',
              height: '632px',
              flexShrink: 0,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 8px 28px -6px rgba(24,39,75,0.12), 0 18px 88px -4px rgba(24,39,75,0.14)',
            }}>
              <img
                src="/영수증.png"
                alt="비용 절감 영수증"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>

        {/* 재활용률 차트 */}
        <RecyclingChart />
      </div>
    </section>
  );
};
