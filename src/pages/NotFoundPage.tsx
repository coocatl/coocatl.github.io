import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
export function NotFoundPage(){return <main id="main-content" className="not-found"><SiteHeader/><p>404</p><h1>这个页面暂时不存在。</h1><Link to="/">返回首页</Link></main>}
