import type { NavigateFunction } from 'react-router-dom';

type ViewTransitionDocument = Document & { startViewTransition?: (callback:()=>void)=>void };

export function navigateWithTransition(navigate:NavigateFunction,to:string){
  const doc=document as ViewTransitionDocument;
  if(doc.startViewTransition){doc.startViewTransition(()=>navigate(to));}else{navigate(to);}
}
