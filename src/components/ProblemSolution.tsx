import { useState, useEffect, useRef } from 'react';
import { RecyclingChart } from './RecyclingChart';

// 숫자 카운트업 컴포넌트
const CountUp = ({ end, duration, delay }: { end: number; duration: number; delay: number }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    const start = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(end * progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [started, end, duration]);

  return <>{count}</>;
};

export const ProblemSolution = () => {
  const [displayValues, setDisplayValues] = useState({ hours: 0, complaints: 0, cost: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // 카드 애니메이션용
  const [timeCardAnimated, setTimeCardAnimated] = useState(false);
  const timeCardRef = useRef<HTMLDivElement>(null);

  const [cycleCardAnimated, setCycleCardAnimated] = useState(false);
  const cycleCardRef = useRef<HTMLDivElement>(null);

  const [stressCardAnimated, setStressCardAnimated] = useState(false);
  const stressCardRef = useRef<HTMLDivElement>(null);

  const [costCardAnimated, setCostCardAnimated] = useState(false);
  const costCardRef = useRef<HTMLDivElement>(null);

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

  // 시간 카드 애니메이션
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !timeCardAnimated) {
          setTimeCardAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (timeCardRef.current) {
      observer.observe(timeCardRef.current);
    }

    return () => observer.disconnect();
  }, [timeCardAnimated]);

  // 악순환 카드
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !cycleCardAnimated) {
          setCycleCardAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cycleCardRef.current) {
      observer.observe(cycleCardRef.current);
    }

    return () => observer.disconnect();
  }, [cycleCardAnimated]);

  // 스트레스 카드
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !stressCardAnimated) {
          setStressCardAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (stressCardRef.current) {
      observer.observe(stressCardRef.current);
    }

    return () => observer.disconnect();
  }, [stressCardAnimated]);

  // 비용 카드
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !costCardAnimated) {
          setCostCardAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (costCardRef.current) {
      observer.observe(costCardRef.current);
    }

    return () => observer.disconnect();
  }, [costCardAnimated]);

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
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* 배경 장식 - B2B 스타일 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-transparent opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* 섹션 타이틀 - B2B 프로페셔널 스타일 */}
        <div className="mb-20 text-center animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            주말도 없고, <span className="text-slate-700">지겨운 민원전화</span>
          </h2>
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-xl sm:text-2xl text-slate-600 font-normal leading-relaxed mb-4">
              "내가 왜 이걸 해야 하나" 자괴감 들 때 있으시죠?
            </p>
          </div>
        </div>

        {/* 실제 문제들 - 2x2 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {/* 문제 1 - 시간 시각화 */}
          <div ref={timeCardRef} className="bg-slate-50 border border-slate-200 rounded-2xl p-10 hover:shadow-lg transition-all duration-300 flex flex-col">
            <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
              매주 3시간씩 소모되는 문제
            </h3>

            <p className="text-slate-600 text-base mb-8 leading-relaxed">
              매주 토요일 아침, 분리수거장 가서 2-3시간 청소하고 정리하고...<br />
              안 하면 입주민들이 마구 버려서 난장판 됩니다.
            </p>

            {/* 시간 시각화 */}
            <div className="mt-auto pt-6 border-t border-slate-200">
              {/* 주간 시간 블록 */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-slate-500 mb-3">52주간 손실 시간</div>
                <div className="flex gap-1">
                  {[...Array(52)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 flex-1 rounded transition-all duration-500 ${timeCardAnimated ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
                      style={{
                        backgroundColor: i % 4 === 0 ? '#1AA3FF' : '#E8F4FF',
                        opacity: timeCardAnimated ? (i % 4 === 0 ? 1 : 0.3) : 0,
                        transitionDelay: `${i * 12}ms`,
                        transformOrigin: 'bottom'
                      }}
                    ></div>
                  ))}
                </div>
                <div className={`flex justify-between text-xs text-slate-400 mt-2 transition-opacity duration-700 ${timeCardAnimated ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '700ms' }}>
                  <span>1주차</span>
                  <span>52주차</span>
                </div>
              </div>

              {/* 결과 */}
              <div className={`bg-white border border-slate-200 p-5 rounded-xl transition-all duration-700 ${timeCardAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '900ms' }}>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">연간 총 손실</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black" style={{ color: '#1AA3FF' }}>
                        {timeCardAnimated ? <CountUp end={156} duration={1500} delay={1100} /> : 0}
                      </span>
                      <span className="text-xl font-bold text-slate-600">시간</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-slate-400 mb-1">= 근무일</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black" style={{ color: '#1AA3FF' }}>
                        {timeCardAnimated ? <CountUp end={19} duration={1500} delay={1100} /> : 0}
                      </span>
                      <span className="text-xl font-bold text-slate-600">일</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 문제 2 - 플로우 형태 */}
          <div ref={cycleCardRef} className="bg-white border border-slate-200 rounded-2xl p-10 hover:shadow-lg transition-all duration-300 flex flex-col">
            <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
              지자체 수거 거부 문제
            </h3>

            <p className="text-slate-600 text-base mb-8 leading-relaxed">
              한번 꼬이면 계속 돈 들어가는 구조입니다
            </p>

            {/* 플로우 체인 - 애니메이션 */}
            <div className="mt-auto pt-6 border-t border-slate-200">
              {/* Step 1 */}
              <div className={`flex items-center gap-4 mb-3 transition-all duration-600 ${cycleCardAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '100ms' }}>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 flex-shrink-0">1</div>
                <div className="text-base text-slate-900 font-semibold">관리 안 함</div>
              </div>

              {/* Arrow */}
              <div className={`flex items-center gap-2 ml-5 mb-3 transition-all duration-400 ${cycleCardAnimated ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                <div className="w-0.5 h-8 bg-slate-200"></div>
                <div className="text-slate-300 text-base">↓</div>
              </div>

              {/* Step 2 */}
              <div className={`flex items-center gap-4 mb-3 transition-all duration-600 ${cycleCardAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '400ms' }}>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 flex-shrink-0">2</div>
                <div className="text-base text-slate-900 font-semibold">지자체 수거 거부</div>
              </div>

              {/* Arrow */}
              <div className={`flex items-center gap-2 ml-5 mb-3 transition-all duration-400 ${cycleCardAnimated ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '600ms' }}>
                <div className="w-0.5 h-8 bg-slate-200"></div>
                <div className="text-slate-300 text-base">↓</div>
              </div>

              {/* Step 3 */}
              <div className={`flex items-center gap-4 mb-3 transition-all duration-600 ${cycleCardAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '700ms' }}>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 flex-shrink-0">3</div>
                <div className="text-base text-slate-900 font-semibold">사설업체 의뢰</div>
              </div>

              {/* Arrow */}
              <div className={`flex items-center gap-2 ml-5 mb-4 transition-all duration-400 ${cycleCardAnimated ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '900ms' }}>
                <div className="w-0.5 h-8" style={{ background: 'linear-gradient(to bottom, #e2e8f0, #1AA3FF)' }}></div>
                <div style={{ color: '#1AA3FF' }} className="text-base font-bold">↓</div>
              </div>

              {/* Result */}
              <div className={`bg-blue-50 border-2 rounded-xl p-5 transition-all duration-700 ${cycleCardAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`} style={{ borderColor: '#1AA3FF', transitionDelay: '1000ms' }}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black" style={{ color: '#1AA3FF' }}>3-5</span>
                  <span className="text-2xl font-bold" style={{ color: '#1AA3FF' }}>배</span>
                </div>
                <div className="text-sm font-medium text-slate-600">비용 폭탄 (월 100만원 이상 가능)</div>
              </div>
            </div>
          </div>

          {/* 문제 3 - 스트레스 시각화 */}
          <div ref={stressCardRef} className="bg-white border border-slate-200 rounded-2xl p-10 hover:shadow-lg transition-all duration-300 flex flex-col">
            <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
              전화벨만 울리면<br />심장이 철렁
            </h3>

            <p className="text-slate-600 text-base mb-8 leading-relaxed">
              토요일 오후 9시, 일요일 아침 7시...<br />
              "냄새난다", "벌레 많다", "왜 안 치우냐"
            </p>

            {/* 민원 전화 시각화 */}
            <div className="mt-auto pt-6 border-t border-slate-200">
              <div className="text-sm font-semibold text-slate-500 mb-4">주간 민원 패턴</div>

              {/* 전화 아이콘 반복 */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="text-xs font-medium text-slate-400">
                      {['월', '화', '수', '목', '금', '토', '일'][i]}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[...Array(i === 5 || i === 6 ? 2 : 1)].map((_, j) => (
                        <div
                          key={j}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                            stressCardAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                          }`}
                          style={{
                            backgroundColor: i === 5 || i === 6 ? '#1AA3FF' : '#E8F4FF',
                            transitionDelay: `${(i * 2 + j) * 90}ms`
                          }}
                        >
                          <span className="text-sm">📞</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 결과 */}
              <div className={`bg-slate-50 border border-slate-200 p-5 rounded-xl transition-all duration-700 ${stressCardAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '900ms' }}>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">평균 민원</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black" style={{ color: '#1AA3FF' }}>
                        {stressCardAnimated ? <CountUp end={7} duration={1000} delay={1000} /> : 0}
                      </span>
                      <span className="text-xl font-bold text-slate-600">회/주</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-slate-400">특히</div>
                    <div className="text-base font-bold text-slate-600">주말 집중</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 문제 4 - 비용 증가 시각화 */}
          <div ref={costCardRef} className="bg-slate-50 border border-slate-200 rounded-2xl p-10 hover:shadow-lg transition-all duration-300 flex flex-col">
            <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
              다음 달엔 또 얼마나 나올까
            </h3>

            <p className="text-slate-600 text-base mb-8 leading-relaxed">
              예측 불가능한 비용에 재정 불안이 커집니다
            </p>

            {/* 비용 증가 바 - 애니메이션 */}
            <div className="mt-auto pt-6 border-t border-slate-200">
              <div className="text-sm font-semibold text-slate-500 mb-4">월별 비용 증가</div>
              <div className="space-y-4 mb-6">
                {/* 1월 */}
                <div className={`flex items-center gap-4 transition-all duration-600 ${costCardAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '100ms' }}>
                  <div className="text-sm font-semibold text-slate-500 w-12">1월</div>
                  <div className="flex-1 h-12 bg-white border border-slate-200 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-900 ease-out ${costCardAnimated ? 'w-[40%]' : 'w-0'}`}
                      style={{ backgroundColor: '#E8F4FF', transitionDelay: '200ms' }}
                    ></div>
                  </div>
                  <div className={`text-base font-bold text-slate-700 w-16 text-right transition-opacity duration-500 ${costCardAnimated ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1100ms' }}>20만</div>
                </div>

                {/* 2월 */}
                <div className={`flex items-center gap-4 transition-all duration-600 ${costCardAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '300ms' }}>
                  <div className="text-sm font-semibold text-slate-500 w-12">2월</div>
                  <div className="flex-1 h-12 bg-white border border-slate-200 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-900 ease-out ${costCardAnimated ? 'w-[65%]' : 'w-0'}`}
                      style={{ backgroundColor: '#7FC8FF', transitionDelay: '400ms' }}
                    ></div>
                  </div>
                  <div className={`text-base font-bold text-slate-700 w-16 text-right transition-opacity duration-500 ${costCardAnimated ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1300ms' }}>35만</div>
                </div>

                {/* 3월 */}
                <div className={`flex items-center gap-4 transition-all duration-600 ${costCardAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '500ms' }}>
                  <div className="text-sm font-semibold text-slate-500 w-12">3월</div>
                  <div className="flex-1 h-12 bg-white border-2 rounded-lg overflow-hidden relative" style={{ borderColor: '#1AA3FF' }}>
                    <div
                      className={`h-full transition-all duration-900 ease-out ${costCardAnimated ? 'w-full' : 'w-0'}`}
                      style={{ backgroundColor: '#1AA3FF', transitionDelay: '600ms' }}
                    ></div>
                  </div>
                  <div className={`text-base font-black w-16 text-right transition-opacity duration-500 ${costCardAnimated ? 'opacity-100' : 'opacity-0'}`} style={{ color: '#1AA3FF', transitionDelay: '1500ms' }}>50만+</div>
                </div>
              </div>

              {/* 증가율 표시 */}
              <div className={`bg-white border border-slate-200 p-5 rounded-xl transition-all duration-700 ${costCardAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '1600ms' }}>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black" style={{ color: '#1AA3FF' }}>+150</span>
                  <span className="text-2xl font-bold" style={{ color: '#1AA3FF' }}>%</span>
                </div>
                <div className="text-sm font-medium text-slate-600 mt-1">3개월간 증가율</div>
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

        {/* 커버링 빌딩과 함께라면? 섹션 타이틀 */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 style={{
            fontSize: '48px',
            letterSpacing: '-0.2px',
            lineHeight: '62px',
            fontWeight: 700,
            fontFamily: 'Pretendard',
            textAlign: 'center',
            color: '#46474c',
          }}>
            커버링 빌딩과 함께라면?
          </h2>
        </div>

        {/* Figma 노드 5276-8625: 원스탑 서비스 */}
        <div className="mb-24 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start p-6 sm:p-10 md:p-14 gap-8 md:gap-12 lg:gap-20 bg-white border border-slate-100 rounded-3xl md:rounded-[40px] w-full">
            {/* 왼쪽: 텍스트 영역 */}
            <div className="flex flex-col gap-4 w-full md:max-w-[50%]">
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
            <div className="w-full md:w-[474px] h-64 md:h-[268px] flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
              <img
                src="/truck.png"
                alt="수거 트럭"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Figma 노드 5276-8632: 비용 절감 */}
        <div className="mb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col md:flex-row-reverse justify-between items-start p-6 sm:p-10 md:p-14 gap-8 md:gap-12 lg:gap-20 bg-white border border-slate-100 rounded-3xl md:rounded-[40px] w-full">
            {/* 오른쪽: 텍스트 영역 */}
            <div className="flex flex-col gap-4 w-full md:max-w-[50%]">
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
            <div className="w-full md:w-[576px] h-80 md:h-[632px] flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/영수증.png"
                alt="비용 절감 영수증"
                className="w-full h-full object-cover"
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
