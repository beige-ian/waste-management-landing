export const CaseStudy = () => {
  const testimonials = [
    {
      quote: "관리도 잘되고 비용도 저렴해 졌어요!",
      emoji: "😚",
      name: "00빌라 건물주",
      description: "폐기물차를 불러 처리하곤 했지만\n단순 수거만 해서 악취가 심했어요.\n그런데 커버링은 수거는 물론 관리까지\n해주고 비용도 저렴해서 정말 만족하며\n사용 중입니다.",
      beforeImage: "/casestudy-before1.png",
      afterImage: "/casestudy-after1.png"
    },
    {
      quote: "혼합 폐기물 처리에 더 이상 고생 안해요",
      emoji: "😇",
      name: "00오피스텔 건물주",
      description: "입주민 외 외부인이 분리수거를 엉망으로 해\n혼합 폐기물 처리에 힘들었어요.\n커버링은 어떤 쓰레기도 처리해 주고,\n처리 결과를 사진으로 공유해 줘서\n정말 편하고 만족스러워요.",
      beforeImage: "/casestudy-before2.png",
      afterImage: "/casestudy-after2.png"
    },
    {
      quote: "사람 1명 고용하는 것 보다 훨씬 저렴해요",
      emoji: "🤗",
      name: "00임대관리 업체",
      description: "원래 계단 청소 업체에서 분리수거를 맡았지만\n중단되어 고민이 많았어요.\n분리만 맡기는 건 비용 부담이 컸는데\n커버링 덕분에 문제 해결됐어요. \n관리부터 세팅까지 해줘서 너무 좋습니다!",
      beforeImage: "/casestudy-before3.png",
      afterImage: "/casestudy-after3.png"
    }
  ];

  return (
    <section className="bg-[#F7F7F8] py-16 md:py-[120px] px-4 flex flex-col items-center justify-center gap-8 md:gap-12">
      {/* Header */}
      <div className="flex flex-col gap-1 w-full max-w-[1032px]">
        <p className="font-bold text-lg md:text-xl leading-7 tracking-tight text-[#69A5FF] m-0">
          먼저 써본 건물주들의 후기
        </p>
        <h2 className="font-bold text-3xl md:text-[40px] leading-tight md:leading-[52px] tracking-tight text-[#171719]">
          쓰레기 처리 스트레스로 부터 벗어난
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>고객님들의 이야기를 들려드릴께요
        </h2>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-6 w-full max-w-[1032px]">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-full md:w-[328px] bg-white rounded-[40px] p-6 md:px-4 md:pt-6 md:pb-4 flex flex-col items-center gap-8 md:gap-10 shadow-[0px_8px_18px_-6px_rgba(24,39,75,0.12),0px_12px_42px_-4px_rgba(24,39,75,0.12)]"
          >
            {/* Speech Bubble */}
            <div className="bg-white rounded-2xl p-4 relative shadow-[0px_2px_8px_-6px_rgba(24,39,75,0.12),0px_8px_16px_-6px_rgba(24,39,75,0.08)]">
              <p className="font-bold text-base leading-6 tracking-tight text-[#5A5C63] m-0">
                {testimonial.quote}
              </p>
              {/* Triangle pointer */}
              <div className="absolute -bottom-[10px] left-[calc(50%+55px)] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white drop-shadow-[0px_2px_2px_rgba(24,39,75,0.08)]" />
            </div>

            {/* Emoji */}
            <div className="text-[60px] md:text-[80px] leading-[60px] md:leading-[80px]">
              {testimonial.emoji}
            </div>

            {/* Name and Description */}
            <div className="flex flex-col gap-3 items-center text-center w-full">
              <p className="font-bold text-xl md:text-2xl leading-8 tracking-tight text-[#46474C] m-0">
                {testimonial.name}
              </p>
              <p className="font-normal text-base leading-6 tracking-tight text-[#5A5C63] m-0 whitespace-pre-line">
                {testimonial.description}
              </p>
            </div>

            {/* Before/After Images */}
            <div className="flex flex-col gap-1 items-center w-full">
              {/* Before Image */}
              <img
                src={testimonial.beforeImage}
                alt="Before"
                className="w-full h-48 md:h-[200px] object-cover rounded-[32px]"
              />
              <p className="font-bold text-xs md:text-[13px] leading-[18px] tracking-tight text-[#C2C4C8] m-0 text-center">
                Before
              </p>

              {/* Arrow Icon */}
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10L12 15L17 10" stroke="#C2C4C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* After Image */}
              <img
                src={testimonial.afterImage}
                alt="After"
                className="w-full h-64 md:h-[280px] object-cover rounded-[32px]"
              />
              <p className="font-bold text-xs md:text-[13px] leading-[18px] tracking-tight text-[#23AFFF] m-0 text-center">
                After
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
