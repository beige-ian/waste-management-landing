import { useState } from 'react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '어떤 건물에 쓸 수 있나요?',
      answer:
        '원룸, 투룸, 다가구 등 모든 소규모 건물에 사용 가능합니다. 건물 규모에 맞게 설정만 하면 되니까 복잡하지 않습니다.',
    },
    {
      question: '입주민들이 앱을 잘 쓸까요?',
      answer:
        '그래요. 앱이 워낙 쉬워서 나이 많으신 분들도 잘 써요. 앱에 분리수거 규칙이 다 들어있으니까 입주민들이 헷갈릴 필요도 없습니다.',
    },
    {
      question: '도입하는데 얼마나 걸려요?',
      answer:
        '신청 후 1-2주 정도면 다 설치됩니다. 우리팀이 와서 센서 달고, 입주민들한테도 사용법 알려주니까 별도로 할 게 없어요.',
    },
    {
      question: '비용이 정확히 얼마인가요?',
      answer:
        '건물 크기나 필요한 기능에 따라 다릅니다. 신청하실 때 건물 정보만 알려주시면 정확한 견적을 내려드릴게요.',
    },
    {
      question: '기존 관리사무소 시스템과도 연동돼요?',
      answer:
        '대부분의 관리 시스템과 연동이 됩니다. 신청하실 때 어떤 시스템 쓰세요 말씀해주시면, 저희가 맞춰서 해드릴게요.',
    },
    {
      question: '문제가 생기면 뭐 해요?',
      answer:
        '저희팀이 24시간 지원합니다. 뭔가 문제 생기면 톡이나 전화 주시면 바로 해결해드려요. 담당자가 계속 같은 사람이에요.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 bg-gradient-to-b from-white to-slate-50 scroll-mt-20 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 opacity-5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20 animate-fade-in-up">
          <span className="font-semibold text-sm tracking-wider uppercase inline-block mb-3" style={{ color: '#1AA3FF' }}>
            궁금한 점
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">자주 묻는 질문</h2>
          <p className="text-xl text-slate-600 font-light">
            궁금하신 모든 것을 여기서 확인하세요.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 overflow-hidden transition duration-300 opacity-0 hover:scale-105 transform"
              style={{
                animation: `slideUp 0.8s ease-out ${0.1 + idx * 0.08}s forwards`,
                borderColor: '#E2E8F0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1AA3FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full px-6 sm:px-8 py-5 text-left flex justify-between items-center transition duration-200"
                onMouseEnter={(e) => {
                  (e.currentTarget as any).style.backgroundColor = '#F0F9FF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as any).style.backgroundColor = 'transparent';
                }}
              >
                <span className="font-semibold text-base sm:text-lg text-slate-900 leading-tight">
                  {faq.question}
                </span>
                <span
                  className={`text-3xl transition duration-300 flex-shrink-0 ml-4 ${
                    openIndex === idx ? 'rotate-45' : ''
                  }`}
                  style={{ color: '#1AA3FF' }}
                >
                  +
                </span>
              </button>

              {openIndex === idx && (
                <div className="px-6 sm:px-8 py-5 border-t border-slate-200" style={{ backgroundColor: '#F0F9FF' }}>
                  <p className="text-slate-700 leading-relaxed font-light text-base">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
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
