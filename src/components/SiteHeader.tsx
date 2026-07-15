import { Link, NavLink } from 'react-router-dom';
import { siteConfig } from '../config';

export function SiteHeader({ tone = 'auto' }: { tone?: 'auto' | 'light' | 'dark' }) {
  return <header className={`site-header site-header--${tone}`}>
    <Link className="site-brand" to="/" aria-label="李佳颖作品集首页">{siteConfig.brand}</Link>
    <nav aria-label="主要导航"><NavLink to="/">首页</NavLink><NavLink to="/projects">作品</NavLink><NavLink to="/profile">关于我</NavLink></nav>
  </header>;
}
