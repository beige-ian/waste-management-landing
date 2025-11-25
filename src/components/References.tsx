export const References = () => {
  const partners = [
    { name: '대학내일', logo: '/대학내일.png' },
    { name: '스파크플러스', logo: '/스파크플러스.png' },
    { name: '위펀', logo: '/위펀.png' },
    { name: '픽셀하우스', logo: '/픽셀하우스.png' },
    { name: '가우디오', logo: '/가우디오.png' },
    { name: '벳칭', logo: '/벳칭.png' },
    { name: '블루시그넘', logo: '/블루시그넘.png' },
    { name: '라이크스튜디오', logo: '/라이크스튜디오.png' },
    { name: '비하베스트', logo: '/비하베스트.png' },
    { name: '슈니하우스', logo: '/슈니하우스.png' },
    { name: '스튜디오조커', logo: '/스튜디오조커.png' },
    { name: '한국출판문화진흥재단', logo: '/한국출판문화진흥재단.png' },
    { name: '스포피드', logo: '/스포피드.png' },
    { name: '시드웨일', logo: '/시드웨일.png' },
    { name: '아이리스브라이트', logo: '/아이리스브라이트.png' },
    { name: '디코드', logo: '/디코드.png' },
    { name: '위너스앤파트너스', logo: '/위너스앤파트너스.png' },
    { name: '핸디즈', logo: '/핸디즈.png' },
    { name: '크라우드웍스', logo: '/크라우드웍스.png' },
    { name: '팀타운', logo: '/팀타운.png' },
    { name: '페르미', logo: '/페르미.png' },
    { name: '하우드', logo: '/하우드.png' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            REFERENCES
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            커버링 빌딩을 믿고 선택한 기업들
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            대한민국 대표 기업들이 커버링 빌딩과 함께합니다
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 md:gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-16 px-2 grayscale hover:grayscale-0 transition-all duration-300"
              style={{ mixBlendMode: 'darken' }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-10 max-w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('span')) {
                    const span = document.createElement('span');
                    span.textContent = partner.name;
                    span.className = 'text-sm font-medium text-gray-500';
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
