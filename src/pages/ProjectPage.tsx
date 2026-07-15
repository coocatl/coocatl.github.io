import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { getProject, projects } from '../data/projects';
import { SiteHeader } from '../components/SiteHeader';
import { Lightbox } from '../components/Lightbox';
import { navigateWithTransition } from '../lib/navigation';
import type { ProjectMedia } from '../types/content';

export function ProjectPage() {
  const { slug='' }=useParams(); const project=getProject(slug); const navigate=useNavigate(); const heroRef=useRef<HTMLElement>(null); const [lightbox,setLightbox]=useState<{images:ProjectMedia[];index:number}|null>(null);
  useEffect(()=>{if(project)document.title=`${project.title}｜李佳颖作品集`;},[project]);
  useLayoutEffect(()=>{const root=heroRef.current;if(!project||!root||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const context=gsap.context(()=>{gsap.fromTo('[data-detail-media]',{opacity:.35,scale:.96,y:32},{opacity:1,scale:1,y:0,duration:.95,ease:'power3.out'});gsap.fromTo('[data-detail-enter]',{opacity:0,y:18},{opacity:1,y:0,duration:.72,stagger:.06,ease:'power3.out'});},root);return()=>context.revert();},[project]);
  const close=useCallback(()=>setLightbox(null),[]); const change=useCallback((index:number)=>setLightbox((current)=>current?{...current,index}:null),[]);
  if(!project)return <main id="main-content" className="not-found"><SiteHeader/><h1>未找到这个项目</h1><Link to="/projects">返回作品</Link></main>;
  const currentIndex=projects.findIndex((item)=>item.slug===project.slug); const next=projects[(currentIndex+1)%projects.length];
  return <main id="main-content" className="project-page"><SiteHeader tone="dark"/>
    <section ref={heroRef} className="project-hero" style={{'--project-canvas':project.theme.canvas,'--project-ink':project.theme.ink,'--project-signal':project.theme.signal} as React.CSSProperties}>
      <div className="project-hero__media" data-detail-media><img src={project.detail.src} alt={project.detail.alt} width={project.detail.width} height={project.detail.height} fetchPriority="high"/></div>
      <header className="project-hero__copy"><p className="eyebrow" data-detail-enter>{String(currentIndex+1).padStart(2,'0')} / {project.category} / {project.year}</p><h1 data-detail-enter>{project.title}</h1><p className="voice" data-detail-enter>{project.statement}</p><dl data-detail-enter><div><dt>参与说明</dt><dd>{project.role}</dd></div><div><dt>项目属性</dt><dd>{project.agency}</dd></div></dl></header><span className="project-hero__number" aria-hidden="true">{String(currentIndex+1).padStart(2,'0')}</span>
    </section>
    <section id="project-content" className="project-story"><header className="story-lead"><span className="eyebrow">项目概述</span><p>{project.description}</p></header>
      <div className="story-columns"><div><span>背景</span><p>{project.context}</p></div><div><span>参与</span><p>{project.contribution}</p></div><div><span>呈现</span><p>{project.outcome}</p></div></div>
      <div className="project-sections">{project.sections.map((section,sectionIndex)=>section.type==='text'?<section className="content-text" key={section.title}><span>{String(sectionIndex+1).padStart(2,'0')}</span><h2>{section.title}</h2><p>{section.body}</p></section>:<section className="content-gallery" data-presentation={section.presentation || undefined} key={section.title}><header><span>{String(sectionIndex+1).padStart(2,'0')}</span><h2>{section.title}</h2>{section.description&&<p>{section.description}</p>}</header><div>{section.images.map((image,index)=><button key={image.src} data-media-frame={image.frame} data-media-fit={image.fit} onClick={()=>setLightbox({images:section.images,index})}><img loading="lazy" decoding="async" src={image.src} alt={image.alt} width={image.width} height={image.height}/><span>放大查看</span></button>)}</div></section>)}</div>
    </section>
    <section className="next-project" style={{'--next-canvas':next.theme.canvas,'--next-ink':next.theme.ink} as React.CSSProperties}><p className="eyebrow">下一个项目</p><button onClick={()=>navigateWithTransition(navigate,`/projects/${next.slug}`)}><span>{next.title}</span><span>→</span></button><div className="next-project__image"><img src={next.cover.src} alt="" width={next.cover.width} height={next.cover.height} loading="lazy"/></div></section>
    {lightbox&&<Lightbox images={lightbox.images} index={lightbox.index} onChange={change} onClose={close}/>}</main>;
}
