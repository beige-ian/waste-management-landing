export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );

  const LinkedinIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
    </svg>
  );

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 px-4 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-12">
          {/* 회사 정보 */}
          <div className="md:col-span-1 stagger-item">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#1AA3FF' }}>
              분리수거 관리
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed text-sm">
              건물주들이 매주 수거장 청소하지 않아도 되도록. 100만명 이상이 이미 사용하고 있는 서비스입니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 transition p-2 rounded-lg hover:bg-white hover:bg-opacity-5" style={{ '--hover-color': '#1AA3FF' } as any} onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                <FacebookIcon />
              </a>
              <a href="#" className="text-slate-400 transition p-2 rounded-lg hover:bg-white hover:bg-opacity-5" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                <TwitterIcon />
              </a>
              <a href="#" className="text-slate-400 transition p-2 rounded-lg hover:bg-white hover:bg-opacity-5" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* 제품 */}
          <div className="stagger-item">
            <h4 className="font-bold mb-6 text-white text-lg">서비스</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  주요 기능
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  고객 사례
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  자주 묻는 질문
                </a>
              </li>
            </ul>
          </div>

          {/* 회사 */}
          <div className="stagger-item">
            <h4 className="font-bold mb-6 text-white text-lg">회사</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  회사 소개
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  뉴스 & 블로그
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  채용정보
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  문의하기
                </a>
              </li>
            </ul>
          </div>

          {/* 지원 */}
          <div className="stagger-item">
            <h4 className="font-bold mb-6 text-white text-lg">지원</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  도움말 센터
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  API 문서
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  상태 페이지
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition text-sm" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                  연락처
                </a>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div className="bg-white bg-opacity-5 rounded-2xl p-6 backdrop-blur-sm border border-opacity-20 stagger-item" style={{ borderColor: '#1AA3FF' }}>
            <h4 className="font-bold mb-4 text-lg" style={{ color: '#1AA3FF' }}>연락처</h4>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">전화</div>
                <a
                  href="tel:02-1234-5678"
                  className="text-base sm:text-lg font-bold text-white transition"
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                >
                  02-1234-5678
                </a>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">이메일</div>
                <a
                  href="mailto:hello@waste-management.co.kr"
                  className="text-xs sm:text-sm text-slate-300 transition break-all"
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#CBD5E1'; }}
                >
                  hello@waste-management.co.kr
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-slate-700 pt-8">
          {/* 약관 */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            <p className="text-slate-400 text-sm order-2 sm:order-1">
              &copy; {currentYear} 분리수거 관리. 모든 권리 보유.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm order-1 sm:order-2 justify-center sm:justify-end">
              <a href="#" className="text-slate-400 transition" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                개인정보 처리방침
              </a>
              <a href="#" className="text-slate-400 transition" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                이용약관
              </a>
              <a href="#" className="text-slate-400 transition" onMouseEnter={(e) => { e.currentTarget.style.color = '#1AA3FF'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}>
                쿠키 정책
              </a>
            </div>
          </div>

          {/* 하단 배너 */}
          <div className="rounded-2xl p-6 text-center text-sm sm:text-base text-white font-medium" style={{ background: 'linear-gradient(to right, #1AA3FF 20%, #1680CC 50%, #0B7FD9 80%)' }}>
            건물주들이 매주 직접 청소하는 시간을 절약해줄 테니까 지금 바로 신청해봐요.
          </div>
        </div>
      </div>
    </footer>
  );
};
