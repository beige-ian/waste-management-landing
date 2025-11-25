export const References = () => {
  const partners = [
    { name: '대학내일', logo: '/대학내일.png' },
    { name: '스파크플러스', logo: '/스파크플러스.png' },
    { name: '위펀', logo: '/위펀.png' },
    { name: '로카101', logo: '/로카101.png' },
    { name: '가우디오랩', logo: '/가우디오랩.png' },
    { name: '벳칭', logo: '/벳칭.jpg' },
    { name: '블루시그넘', logo: '/블루시그넘.png' },
    { name: '라이크 스튜디오', logo: '/라이크 스튜디오.png' },
    { name: '비하베스트', logo: '/비하베스트.png' },
    { name: '슈니하우스', logo: '/슈니하우스.png' },
    { name: '스튜디오 조커', logo: '/스튜디오 조커.png' },
    { name: '한국출판문화재단', logo: '/한국출판문화재단.jpg' },
    { name: '스포피드', logo: '/스포피드.png' },
    { name: '시드웨일', logo: '/시드웨일.png' },
    { name: '아이리스브라이트', logo: '/아이리스브라이트.png' },
    { name: '엔코드', logo: '/엔코드.png' },
    { name: '위너스앤파트너스', logo: '/위너스앤파트너스.png' },
    { name: '핸디즈', logo: '/핸디즈.png' },
    { name: '크라우드웍스', logo: '/크라우드웍스.jpg' },
    { name: '팀타운', logo: '/팀타운.png' },
    { name: '페르미', logo: '/페르미.jpg' },
    { name: '하우드엔지니어링', logo: '/하우드엔지니어링.png' },
  ];

  return (
    <section className="bg-[#F7F7F8] py-16 px-4">
      <div className="max-w-[1032px] mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <p className="font-bold text-lg md:text-xl leading-7 tracking-tight text-[#69A5FF] mb-2">
            함께하는 파트너사
          </p>
          <h2 className="font-bold text-2xl md:text-3xl leading-tight tracking-tight text-[#171719]">
            700개 이상의 건물이 커버링과 함께합니다
          </h2>
        </div>

        {/* 로고 그리드 */}
        <div
          className="flex flex-wrap justify-center items-center gap-x-4 gap-y-0"
          style={{ maxWidth: '1032px' }}
        >
          {partners.map((partner, index) => (
            <div
              key={index}
              className="w-[140px] h-[96px] p-2 flex items-center justify-center"
              style={{ mixBlendMode: 'darken' }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  // 이미지가 없으면 숨김
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-sm text-slate-400 font-medium">${partner.name}</span>`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
