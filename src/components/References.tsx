export const References = () => {
  const partners = [
    { name: '대학내일', logo: '/대학내일.png' },
    { name: '스파크플러스', logo: '/스파크플러스.png' },
    { name: '패스트파이브', logo: '/패스트파이브.png' },
    { name: '위워크', logo: '/위워크.png' },
    { name: '르호봇', logo: '/르호봇.png' },
    { name: '카카오벤처스', logo: '/카카오벤처스.png' },
    { name: '마이리얼트립', logo: '/마이리얼트립.png' },
    { name: '야놀자', logo: '/야놀자.png' },
    { name: '직방', logo: '/직방.png' },
    { name: '오늘의집', logo: '/오늘의집.png' },
    { name: '클래스101', logo: '/클래스101.png' },
    { name: '숨고', logo: '/숨고.png' },
    { name: '토스', logo: '/토스.png' },
    { name: '뱅크샐러드', logo: '/뱅크샐러드.png' },
    { name: '리디', logo: '/리디.png' },
    { name: '왓챠', logo: '/왓챠.png' },
    { name: '컬리', logo: '/컬리.png' },
    { name: '오픈서베이', logo: '/오픈서베이.png' },
    { name: '센드버드', logo: '/센드버드.png' },
    { name: '채널톡', logo: '/채널톡.png' },
    { name: '스포카', logo: '/스포카.png' },
    { name: '두나무', logo: '/두나무.png' },
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
