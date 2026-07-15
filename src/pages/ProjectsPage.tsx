import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { projects } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { SiteHeader } from '../components/SiteHeader';
import { navigateWithTransition } from '../lib/navigation';

gsap.registerPlugin(Flip);

export function ProjectsPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const navigate = useNavigate();

  const changeFocus = (next: number | null) => {
    const root = fieldRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (root && !reduced && !coarse) flipState.current = Flip.getState(root.querySelectorAll('[data-project-card]'));
    setActiveIndex(next);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    const root = fieldRef.current;
    if (!state || !root) return;
    flipState.current = null;
    const animation = Flip.from(state, { targets: root.querySelectorAll('[data-project-card]'), duration: .56, ease: 'power3.out', absolute: false, nested: true });
    return () => { animation.kill(); };
  }, [activeIndex]);

  return (
    <main id="main-content" className="projects-page">
      <SiteHeader tone="light" />
      <section className="projects-intro" aria-labelledby="projects-title">
        <div>
          <p className="eyebrow">完整作品 / {String(projects.length).padStart(2, '0')}</p>
          <h1 id="projects-title">作品<br />档案</h1>
          <p className="voice">从品牌策划、IP 与界面，到摄影和海报实验。每个项目保留自己的图像比例和阅读节奏。</p>
        </div>
        <div ref={fieldRef} className="project-field" data-has-active={activeIndex !== null}>
          {projects.map((project, index) => {
            const isCurrent = activeIndex === index;
            const state = selectedSlug === project.slug ? 'transitioning' : isCurrent ? 'focused' : activeIndex === null ? 'idle' : 'retreated';
            const relation = activeIndex === null ? 'current' : index < activeIndex ? 'before' : index > activeIndex ? 'after' : 'current';
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                state={state}
                relation={relation}
                onEnter={() => changeFocus(index)}
                onLeave={() => changeFocus(null)}
                onSelect={(event) => {
                  event.preventDefault();
                  setSelectedSlug(project.slug);
                  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  window.setTimeout(() => navigateWithTransition(navigate, `/projects/${project.slug}`), reduced ? 0 : 220);
                }}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
