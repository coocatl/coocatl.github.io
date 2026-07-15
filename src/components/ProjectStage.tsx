import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { featuredProjects } from '../data/projects';
import { siteConfig } from '../config';
import { SiteHeader } from './SiteHeader';
const modulo = (value: number, length: number) => (value + length) % length;

export function ProjectStage() {
  const [index, setIndex] = useState(0); const current = featuredProjects[index]; const stageMedia = current.stage ?? current.detail; const stageRef = useRef<HTMLElement>(null); const touchStart = useRef<number | null>(null);
  const move = useCallback((direction: number) => setIndex((previous) => modulo(previous + direction, featuredProjects.length)), []);
  useLayoutEffect(() => { const root = stageRef.current; if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return; const context = gsap.context(() => { gsap.fromTo('[data-stage-enter]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .72, stagger: .055, ease: 'power3.out' }); gsap.fromTo('[data-stage-image]', { opacity: .45, scale: .965 }, { opacity: 1, scale: 1, duration: .9, ease: 'power3.out' }); }, root); return () => context.revert(); }, [index]);
  return <main id="main-content" ref={stageRef} className="stage" style={{ '--project-accent': current.theme.accent, '--project-signal': current.theme.signal } as React.CSSProperties}
    onKeyDown={(event) => { if (['ArrowRight','ArrowDown'].includes(event.key)) { event.preventDefault(); move(1); } if (['ArrowLeft','ArrowUp'].includes(event.key)) { event.preventDefault(); move(-1); } const digit=Number(event.key); if(digit>=1&&digit<=featuredProjects.length)setIndex(digit-1); }}
    onTouchStart={(event)=>{touchStart.current=event.touches[0]?.clientX??null;}} onTouchEnd={(event)=>{if(touchStart.current===null)return;const delta=touchStart.current-(event.changedTouches[0]?.clientX??touchStart.current);if(Math.abs(delta)>45)move(delta>0?1:-1);touchStart.current=null;}}>
    <SiteHeader tone="dark" />
    <section className="stage-layout" aria-labelledby="stage-title">
      <header className="stage-copy"><p className="eyebrow" data-stage-enter>传播学 / 品牌策划 / 视觉内容</p><h1 id="stage-title"><span>把内容从</span><span className="voice">创意推进</span><span>到真实落地。</span></h1><p data-stage-enter>{siteConfig.intro}</p></header>
      <div className="stage-showcase" key={current.slug}>
        <figure className="stage-media" data-stage-image data-fit={stageMedia.fit ?? 'contain'} data-frame={stageMedia.frame ?? 'presentation'}><span className="stage-artwork" style={{ '--media-ratio': stageMedia.width / stageMedia.height } as React.CSSProperties}><img src={stageMedia.src} alt={stageMedia.alt} width={stageMedia.width} height={stageMedia.height} fetchPriority="high" /></span></figure>
        <aside className="stage-ticket" data-stage-enter aria-label="当前精选项目"><span>精选作品 / {String(index+1).padStart(2,'0')}</span><strong>{current.title}</strong><span>{current.category} / {current.year}</span><Link to={`/projects/${current.slug}`}>查看项目 →</Link></aside>
      </div>
      <div className="stage-bottom"><p>李佳颖个人作品集</p><div className="stage-controls" aria-label="项目切换"><button onClick={()=>move(-1)} aria-label="上一个项目">←</button><span aria-live="polite">{String(index+1).padStart(2,'0')} / 04</span><button onClick={()=>move(1)} aria-label="下一个项目">→</button></div><Link to="/projects">查看全部作品 →</Link></div>
      <nav className="stage-project-tabs" aria-label="选择精选项目">{featuredProjects.map((project,i)=><button key={project.slug} aria-pressed={i===index} onClick={()=>setIndex(i)}><span>{String(i+1).padStart(2,'0')}</span>{project.title}</button>)}</nav>
    </section>
  </main>;
}
