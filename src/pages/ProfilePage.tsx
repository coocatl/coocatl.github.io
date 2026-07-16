import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { profile } from '../data/profile';
import { siteConfig } from '../config';
import { assetUrl } from '../lib/assetUrl';

export function ProfilePage() {
  return <main id="main-content" className="profile-page"><SiteHeader tone="dark"/>
    <section className="profile-hero"><header><p className="eyebrow">关于我 / Profile</p><p className="profile-name">{profile.name} / {profile.direction.replace('求职方向：','')}</p><h1>{profile.headline}</h1><p className="voice">{profile.intro}</p><p className="profile-direction">{profile.direction}</p></header>
      <aside><div><span>能力方向</span><ul>{profile.capabilities.map((item)=><li key={item}>{item}</li>)}</ul></div><div><span>教育背景</span><ul><li>{profile.education.school}</li><li>{profile.education.degree}</li><li>{profile.education.detail}</li></ul></div><div className="profile-hero__actions"><a className="profile-action profile-action--primary" href={assetUrl(siteConfig.cv.pdf)} download={siteConfig.cv.downloadName}>下载简历（PDF） ↓</a><a className="profile-action profile-action--secondary" href={`mailto:${siteConfig.email}`}>发送邮件 →</a><button className="profile-action profile-action--tertiary" onClick={()=>window.print()}>打印 / 另存为 PDF</button></div></aside>
    </section>
    <section className="profile-practice"><header><span className="eyebrow">经历与实践</span><h2>在策划、制作和现场之间建立连续工作方法。</h2></header>
      <h3 className="profile-section-title">实践经历</h3><div className="profile-history">{profile.experience.map((item)=><article key={item.year+item.title}><strong>{item.year}</strong><h3>{item.title}</h3><p>{item.detail}{item.project&&<> · <Link to={`/projects/${item.project}`}>查看相关项目 →</Link></>}</p></article>)}</div>
      <h3 className="profile-section-title">校园经历</h3><div className="profile-history profile-history--compact">{profile.campus.map((item)=><article key={item.title}><strong>{item.year}</strong><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div>
      <div className="profile-facts"><section><span>教育</span><h3>{profile.education.school}</h3><p>{profile.education.period}<br/>{profile.education.degree}<br/>{profile.education.detail}<br/>{profile.education.courses}</p></section><section><span>工具</span><h3>制作与运营工具</h3><p>{profile.tools}</p></section><section><span>奖项与证书</span><h3>已核实信息</h3><ul>{profile.recognition.map((item)=><li key={item}>{item}</li>)}</ul></section></div>
    </section><footer className="profile-footer"><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><span>公开联系方式仅保留电子邮箱。</span></footer>
  </main>;
}
