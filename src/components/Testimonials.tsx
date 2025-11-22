export const Testimonials = () => {
  const testimonials = [
    {
      name: '김철수',
      role: '서울 강남 원룸 5채 건물주',
      problem: '매주 목요일 수거장 청소',
      result: '월 4시간 시간 절감',
      quote: '이전엔 매주 목요일마다 가서 청소했어요. 지금은 앱 하나로 관리되니까 시간이 정말 남아요.',
      image: 'https://cdn.prod.website-files.com/651143d00678effa4a6803f1/6762608a21af81df70ce4993_%E1%84%87%E1%85%B5%E1%86%AF%E1%84%83%E1%85%B5%E1%86%BC1.png',
    },
    {
      name: '이영희',
      role: '부산 투룸 다가구 건물주',
      problem: '입주민 민원 폭증',
      result: '민원 80% 감소',
      quote: '세입자들이 계속 "냄새난다"고 문자 보내고, 청소업체도 안 간다고 했어요. 지금은 거의 안 온다.',
      image: 'https://cdn.prod.website-files.com/651143d00678effa4a6803f1/6762608a17383089e759b21e_%E1%84%87%E1%85%B5%E1%86%AF%E1%84%83%E1%85%B5%E1%86%BC2.png',
    },
    {
      name: '박준호',
      role: '대구 원룸빌라 건물주',
      problem: '수거업체 수거 거부',
      result: '수거 정상화, 비용 절감',
      quote: '관리 안 하니까 수거업체가 안 간다고 했어요. 이제 깔끔하게 유지되니 문제 없다.',
      image: 'https://cdn.prod.website-files.com/651143d00678effa4a6803f1/6762608b62bf301635a98b95_%E1%84%87%E1%85%B5%E1%86%AF%E1%84%83%E1%85%B5%E1%86%BC3.png',
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-slate-50 relative overflow-hidden scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            실제 건물주들이 어떻게 바뀌었는지
          </h2>
          <p className="text-lg text-slate-600 font-light">
            100만명 이상이 이미 경험하고 있습니다.
          </p>
        </div>

        {/* 고객사례 이미지 */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <img src="/고객사례.png" alt="고객 사례" className="w-full h-auto" />
        </div>

        {/* 사례들 */}
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md hover:shadow-xl border border-slate-200 overflow-hidden transition duration-300 stagger-item"
              style={{ borderColor: 'border-slate-200' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1AA3FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              {/* 이미지 */}
              <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 내용 */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>

                <div className="mb-4 pb-4 border-b border-slate-200">
                  <p className="text-sm text-slate-600 italic">"{testimonial.quote}"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Before</div>
                    <div className="text-sm font-semibold text-red-600">{testimonial.problem}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">After</div>
                    <div className="text-sm font-semibold text-emerald-600">{testimonial.result}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 통계 */}
        <div className="mt-16 bg-white rounded-2xl p-8 sm:p-12 border border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#1AA3FF' }}>100만+</div>
              <div className="text-slate-600 text-sm">활성 사용자</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#1AA3FF' }}>500+</div>
              <div className="text-slate-600 text-sm">건물 관리</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#1AA3FF' }}>4년</div>
              <div className="text-slate-600 text-sm">운영 경력</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#1AA3FF' }}>4.9★</div>
              <div className="text-slate-600 text-sm">평균 평점</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
