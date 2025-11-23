import { useState, useEffect, useRef } from 'react';

export const Hero = () => {
  // Hero section with counters and fade-in animations
  const [counts, setCounts] = useState({ users: 0, buildings: 0, waste: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);

      setCounts({
        users: Math.floor(100 * progress),
        buildings: Math.floor(700 * progress),
        waste: Math.floor(500 * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const scrollToSignup = () => {
    const signupSection = document.getElementById('signup');
    signupSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="text-white pt-32 pb-32 px-4 relative overflow-hidden mt-16 sm:mt-20" ref={sectionRef} style={{
      backgroundImage: 'url(/분리수거함_hero.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* 배경 오버레이 - 텍스트 가독성 확보 */}
      <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>

      {/* 프라이머리 블루 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-40 -z-10"></div>

      <div className="max-w-6xl mx-auto flex items-center justify-between gap-12 relative z-10">
        {/* 왼쪽 텍스트 */}
        <div className="flex-1">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ animationDelay: '0.2s' }}>
          {'건물주님 이제 분리수거장 관리는'.split('').map((char, i) => (
            <span key={i} className="char" style={{ animationDelay: `${0.2 + i * 0.08}s`, whiteSpace: 'pre' }}>
              {char}
            </span>
          ))}
          <br />
          <span style={{ color: '#1AA3FF' }}>
            {'저희에게 맡기세요'.split('').map((char, i) => (
              <span key={`second-${i}`} className="char" style={{ animationDelay: `${1.2 + i * 0.08}s`, whiteSpace: 'pre' }}>
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* 문제 설정 */}
        <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          100만 유저가 검증한 업계 1위 서비스 커버링에게 맡기세요
        </p>

        {/* CTA */}
        <button
          onClick={scrollToSignup}
          className="text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition duration-300 transform hover:scale-105 shadow-lg inline-block animate-fade-in-up"
          style={{ backgroundColor: '#1AA3FF', animationDelay: '0.6s' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1680CC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1AA3FF')}
        >
          상담 신청하기
        </button>

          {/* 신뢰도 */}
          <div className="mt-20 pt-16 border-t border-slate-700">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ color: '#1AA3FF' }}>
                    {counts.users}
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-semibold" style={{ color: '#FFFFFF' }}>만명+</div>
                </div>
                <div className="text-sm sm:text-base md:text-lg text-white font-medium">누적 사용자</div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ color: '#1AA3FF' }}>
                    {counts.buildings}
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-semibold" style={{ color: '#FFFFFF' }}>+</div>
                </div>
                <div className="text-sm sm:text-base md:text-lg text-white font-medium">관리 중인 건물</div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 leading-tight" style={{ color: '#1AA3FF' }}>
                  수도권 전체
                </div>
                <div className="text-xs sm:text-sm md:text-base text-white font-medium">운영 지역</div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ color: '#1AA3FF' }}>
                    {counts.waste}
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-semibold" style={{ color: '#FFFFFF' }}>만톤+</div>
                </div>
                <div className="text-sm sm:text-base md:text-lg text-white font-medium">누적 처리량</div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 이미지 */}
        <div className="flex-1 hidden lg:block animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
          <img
            src="/분리수거함_hero.png"
            alt="분리수거함"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};
