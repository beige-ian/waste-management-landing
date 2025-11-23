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
    <section style={{
      background: '#F7F7F8',
      padding: '120px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '48px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%',
        maxWidth: '1032px'
      }}>
        <p style={{
          fontFamily: 'Pretendard',
          fontWeight: 700,
          fontSize: '20px',
          lineHeight: '28px',
          letterSpacing: '-0.1px',
          color: '#69A5FF',
          margin: 0
        }}>
          먼저 써본 건물주들의 후기
        </p>
        <div style={{
          fontFamily: 'Pretendard',
          fontWeight: 700,
          fontSize: '40px',
          lineHeight: '52px',
          letterSpacing: '-0.2px',
          color: '#171719'
        }}>
          쓰레기 처리 스트레스로 부터 벗어난
          <br />
          고객님들의 이야기를 들려드릴께요
        </div>
      </div>

      {/* Cards Container */}
      <div style={{
        display: 'flex',
        gap: '24px',
        width: '100%',
        maxWidth: '1032px'
      }}>
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            style={{
              width: '328px',
              background: '#FFFFFF',
              borderRadius: '40px',
              padding: '24px 16px 16px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '40px',
              boxShadow: '0px 8px 18px -6px rgba(24,39,75,0.12), 0px 12px 42px -4px rgba(24,39,75,0.12)'
            }}
          >
            {/* Speech Bubble */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              position: 'relative',
              boxShadow: '0px 2px 8px -6px rgba(24,39,75,0.12), 0px 8px 16px -6px rgba(24,39,75,0.08)'
            }}>
              <p style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.08px',
                color: '#5A5C63',
                margin: 0
              }}>
                {testimonial.quote}
              </p>
              {/* Triangle pointer */}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: 'calc(50% + 55px)',
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '12px solid #FFFFFF',
                filter: 'drop-shadow(0px 2px 2px rgba(24,39,75,0.08))'
              }} />
            </div>

            {/* Emoji */}
            <div style={{
              fontSize: '80px',
              lineHeight: '80px'
            }}>
              {testimonial.emoji}
            </div>

            {/* Name and Description */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%'
            }}>
              <p style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '32px',
                letterSpacing: '-0.12px',
                color: '#46474C',
                margin: 0
              }}>
                {testimonial.name}
              </p>
              <p style={{
                fontFamily: 'Pretendard',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.08px',
                color: '#5A5C63',
                margin: 0,
                whiteSpace: 'pre-line'
              }}>
                {testimonial.description}
              </p>
            </div>

            {/* Before/After Images */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignItems: 'center',
              width: '100%'
            }}>
              {/* Before Image */}
              <img
                src={testimonial.beforeImage}
                alt="Before"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '32px'
                }}
              />
              <p style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '13px',
                lineHeight: '18px',
                letterSpacing: '-0.065px',
                color: '#C2C4C8',
                margin: 0,
                textAlign: 'center'
              }}>
                Before
              </p>

              {/* Arrow Icon */}
              <div style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10L12 15L17 10" stroke="#C2C4C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* After Image */}
              <img
                src={testimonial.afterImage}
                alt="After"
                style={{
                  width: '100%',
                  height: '280px',
                  objectFit: 'cover',
                  borderRadius: '32px'
                }}
              />
              <p style={{
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '13px',
                lineHeight: '18px',
                letterSpacing: '-0.065px',
                color: '#23AFFF',
                margin: 0,
                textAlign: 'center'
              }}>
                After
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
