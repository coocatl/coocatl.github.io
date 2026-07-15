import { useEffect, useRef } from 'react';
import type { ProjectMedia } from '../types/content';

export function Lightbox({ images, index, onChange, onClose }: { images: ProjectMedia[]; index: number; onChange: (index: number) => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onChange((index + 1) % images.length);
      if (event.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
      if (event.key === 'Tab') {
        const controls = [...document.querySelectorAll<HTMLElement>('.lightbox button')];
        if (!controls.length) return;
        const first = controls[0]; const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; previous?.focus(); };
  }, [images.length, index, onChange, onClose]);
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label="作品大图查看">
    <button ref={closeRef} className="lightbox__close" onClick={onClose}>关闭</button>
    <button className="lightbox__previous" onClick={() => onChange((index - 1 + images.length) % images.length)} aria-label="上一张">←</button>
    <img src={image.zoomSrc ?? image.src} alt={image.alt} width={image.width} height={image.height} />
    <button className="lightbox__next" onClick={() => onChange((index + 1) % images.length)} aria-label="下一张">→</button>
    <p>{index + 1} / {images.length} · {image.alt}</p>
  </div>;
}
