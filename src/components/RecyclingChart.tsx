import { useState, useEffect, useRef } from 'react';

interface DonutChartProps {
  label: string;
  value: number;
  color: string;
  source: string;
  isHighlight?: boolean;
}

const DonutChart = ({ label, value, color, source, isHighlight }: DonutChartProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 애니메이션 시작
          const startTime = Date.now();
          const duration = 2000; // 2초

          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            setAnimatedValue(Math.floor(progress * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  // 도넛 차트 계산
  const radius = 100;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div
      ref={chartRef}
      className={`flex flex-col items-center gap-6 p-8 rounded-3xl transition-all duration-300 ${
        isHighlight ? 'bg-blue-50 border-2 border-blue-200 transform hover:scale-105' : 'bg-slate-50'
      }`}
    >
      <div className="relative">
        {/* 글로우 효과 */}
        {isHighlight && (
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: color, animation: 'pulse 3s ease-in-out infinite' }}
          />
        )}

        <svg width="260" height="260" viewBox="0 0 260 260" className="relative">
          {/* 배경 링 */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={isHighlight ? '#dbeafe' : '#e5e7eb'}
            strokeWidth={strokeWidth}
          />

          {/* 진행률 링 - 애니메이션 */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.05s ease-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '130px 130px',
              filter: isHighlight ? `drop-shadow(0 0 20px ${color}40)` : 'none',
            }}
          />

          {/* 중앙 텍스트 배경 */}
          <circle
            cx="130"
            cy="130"
            r="70"
            fill="white"
            style={{
              boxShadow: isHighlight ? `inset 0 0 30px ${color}10` : 'none',
            }}
          />

          {/* 퍼센트 텍스트 */}
          <text
            x="130"
            y="140"
            textAnchor="middle"
            fontSize={isHighlight ? '52' : '44'}
            fontWeight="700"
            fill={color}
            style={{ transition: 'font-size 0.3s ease-out' }}
            dominantBaseline="middle"
          >
            {animatedValue}%
          </text>
          {value > animatedValue && (
            <text
              x="130"
              y="165"
              textAnchor="middle"
              fontSize="16"
              fontWeight="600"
              fill={color}
              opacity="0.7"
            >
              이상
            </text>
          )}
        </svg>
      </div>

      {/* 라벨 */}
      <div className="text-center">
        <div className={`font-bold mb-2 ${isHighlight ? 'text-lg text-slate-900' : 'text-base text-slate-700'}`}>
          {label}
        </div>
        <div className="text-sm text-slate-500">{source}</div>
      </div>
    </div>
  );
};

export const RecyclingChart = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="text-center mb-20 animate-fade-in-up">
          <p className="text-base font-semibold tracking-wider uppercase mb-4" style={{ color: '#1AA3FF' }}>
            재활용률의 현실
          </p>
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            국내 평균 27%<br />
            <span style={{ color: '#1AA3FF' }}>커버링은 90%</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            자동화된 관리 시스템만으로도<br />
            재활용률을 3배 이상 높일 수 있습니다
          </p>
        </div>

        {/* 차트 컨테이너 */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* 국내 평균 */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <DonutChart
              label="전국 평균"
              value={27}
              color="#9ca3af"
              source="출처: 그린피스(2023)"
              isHighlight={false}
            />
          </div>

          {/* 커버링 사용 시 */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <DonutChart
              label="커버링 이용시"
              value={90}
              color="#1AA3FF"
              source="출처: 커버링(2023)"
              isHighlight={true}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </section>
  );
};
