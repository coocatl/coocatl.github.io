import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titles: Record<string, string> = { '/': '李佳颖｜品牌策划、视觉内容与新媒体运营作品集', '/projects': '作品｜李佳颖个人作品集', '/profile': '关于李佳颖｜经历与简历' };
export function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (!normalizedPath.startsWith('/projects/')) document.title = titles[normalizedPath] ?? '李佳颖个人作品集';
    window.requestAnimationFrame(() => { const main = document.querySelector('main'); if (main instanceof HTMLElement) { main.tabIndex = -1; main.focus({ preventScroll: true }); } });
  }, [pathname]);
  return null;
}
