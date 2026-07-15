import type { CSSProperties, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types/content';

type CardState = 'idle' | 'focused' | 'retreated' | 'selected' | 'transitioning';

type ProjectCardProps = {
  project: Project;
  index: number;
  state: CardState;
  relation: 'before' | 'current' | 'after';
  onEnter: () => void;
  onLeave: () => void;
  onSelect: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function ProjectCard({ project, index, state, relation, onEnter, onLeave, onSelect }: ProjectCardProps) {
  const style = {
    '--card-x': `${project.layout.x}%`,
    '--card-y': `${project.layout.y}%`,
    '--card-width': `${project.layout.width}%`,
    '--card-height': `${project.layout.height}%`,
    '--card-rotation': `${project.layout.rotation}deg`,
    '--card-accent': project.theme.accent,
    viewTransitionName: `project-${project.slug}`
  } as CSSProperties;

  return (
    <article
      className={`project-card project-card--${relation}`}
      data-project-card
      data-state={state}
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <Link to={`/projects/${project.slug}`} onClick={onSelect} aria-label={`查看项目：${project.title}`}>
        <div className="project-card__image" data-media-frame={project.cover.frame} data-media-fit={project.cover.fit}>
          <img src={project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} loading="lazy" decoding="async" style={{ objectPosition: project.cover.objectPosition }} />
        </div>
        <div className="project-card__caption">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h2>{project.title}</h2>
          <p>{project.category} / {project.year}</p>
        </div>
      </Link>
    </article>
  );
}
