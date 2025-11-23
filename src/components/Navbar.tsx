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
          <span
            className={`hidden sm:block font-bold text-lg transition duration-300 ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}
          >
            분리수거 관리
          </span>
        </div>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className={`transition duration-300 font-medium ${
              isScrolled
                ? 'text-slate-700 hover:text-emerald-600'
                : 'text-white text-opacity-90 hover:text-opacity-100'
            }`}
          >
            기능
          </a>
          <a
            href="#faq"
            className={`transition duration-300 font-medium ${
              isScrolled
                ? 'text-slate-700 hover:text-emerald-600'
                : 'text-white text-opacity-90 hover:text-opacity-100'
            }`}
          >
            FAQ
          </a>
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
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
            <a
              href="#features"
              className={`block py-2 font-medium transition duration-300 ${
                isScrolled
                  ? 'text-slate-700 hover:text-emerald-600'
                  : 'text-white hover:text-emerald-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              기능
            </a>
            <a
              href="#faq"
              className={`block py-2 font-medium transition duration-300 ${
                isScrolled
                  ? 'text-slate-700 hover:text-emerald-600'
                  : 'text-white hover:text-emerald-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
