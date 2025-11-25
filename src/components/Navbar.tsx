import { useState, useEffect } from 'react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition duration-500 ease-out ${
        isScrolled
          ? 'bg-white shadow-xl backdrop-blur-md bg-opacity-95'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5 flex justify-between items-center">
        {/* 로고 */}
        <div className="flex items-center gap-3">
          <img src="/covering-logo.png" alt="커버링 로고" className="h-10 w-auto" />
        </div>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => {
              const signupSection = document.getElementById('signup');
              signupSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2 rounded-lg font-semibold text-white transition duration-300 transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#1AA3FF' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1680CC')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1AA3FF')}
          >
            1달 무료 체험하기
          </button>
        </div>


        {/* 모바일 메뉴 버튼 */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden ml-2"
        >
          <svg
            className={`w-6 h-6 transition duration-300 ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden transition duration-300 ${
            isScrolled ? 'bg-white' : 'bg-slate-900'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button
              onClick={() => {
                const signupSection = document.getElementById('signup');
                signupSection?.scrollIntoView({ behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-6 py-3 rounded-lg font-semibold text-white transition duration-300 transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#1AA3FF' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1680CC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1AA3FF')}
            >
              1달 무료 체험하기
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
