import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "수거가 안 되는 쓰레기가 있나요?",
    answer: "대량 폐기물을 제외한 모든 폐기물 처리가 가능합니다."
  },
  {
    question: "이용 금액은 어떻게 되나요?",
    answer: "월 정액제로 진행이 되며 방문 내 세대 수에 맞춰 금액이 산정됩니다. 정확한 가격은 현장 실사 후 전달드릴 수 있습니다."
  },
  {
    question: "정산은 어떻게 진행되나요?",
    answer: "매월 말 정산 요청을 드리고 있으며, 계좌 이체 요청 후 세금계산서 발급을 해드리고 있습니다."
  },
  {
    question: "수거 빈도는 어떻게 되나요?",
    answer: "건물 상황에 맞춰 주 1회 부터 주 7회까지 맞춤형 진행하여 진행할 수 있습니다."
  },
  {
    question: "수거 시간은 어떻게 되나요?",
    answer: "주간 시간대(10시~18시)와 야간 시간대(22시~06시) 중 선택하여 진행합니다. 주말의 경우 야간 시간대만 가능합니다."
  },
  {
    question: "분리수거함은 제공이 되나요?",
    answer: "분리수거함이 있으신 경우 그대로 사용하실 수 있습니다. 커버링의 새로운 분리수거함으로 무료 교체 가능합니다."
  },
  {
    question: "서비스 지역이 어떻게 되나요?",
    answer: "현재 서울 지역 내에서만 서비스를 제공하고 있습니다"
  }
];

const FAQAccordion = ({
  item,
  isOpen,
  onToggle,
  index
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => {
  return (
    <div
      className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'forwards'
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-6 flex justify-between items-center text-left transition-all duration-300 group hover:bg-slate-50"
      >
        <span className="text-slate-900 font-semibold text-lg pr-4 group-hover:text-blue-600 transition-colors duration-300">
          {item.question}
        </span>
        <div className="relative flex-shrink-0">
          <div className={`absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${isOpen ? 'opacity-10' : ''}`}></div>
          <svg
            className={`w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-all duration-300 relative ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2">
          <div className="text-slate-600 text-base leading-relaxed space-y-2 pl-1 animate-slide-in">
            {item.answer.split('\n').map((line, idx) => (
              <p
                key={idx}
                className="opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: 'forwards'
                }}
              >
                {line.startsWith('•') ? line : `• ${line}`}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 px-4 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden scroll-mt-20"
    >
      {/* 배경 애니메이션 - 강화 */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-400 to-indigo-400 opacity-10 rounded-full blur-3xl -z-10 animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-300 to-cyan-300 opacity-5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

      <div className="max-w-4xl mx-auto">
        {/* 섹션 타이틀 - 애니메이션 강화 */}
        <div className="text-center mb-16 opacity-0 animate-fade-in-down" style={{ animationFillMode: 'forwards' }}>
          <span
            className="font-bold text-sm tracking-widest uppercase inline-block mb-4 px-4 py-2 rounded-full bg-blue-100 animate-pulse-subtle"
            style={{ color: '#1AA3FF' }}
          >
            FAQ
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-5 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            자주 묻는 질문
          </h2>
          <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            커버링 빌딩에 대해 건물주분들이 궁금해 한 질문들을 모아보았어요.
          </p>
        </div>

        {/* FAQ 아코디언 */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQAccordion
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
              index={index}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(1.1);
          }
          66% {
            transform: translate(20px, -20px) scale(0.9);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.05;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.08;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slide-up {
          animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
