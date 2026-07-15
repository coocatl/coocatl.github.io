import { assetUrl } from '../lib/assetUrl';
import type { MediaFit, MediaFrame, Project, ProjectMedia } from '../types/content';

const mediaTreatment = (project: string): { fit: MediaFit; frame: MediaFrame } => {
  if (project === 'portrait-photography') return { fit: 'cover', frame: 'photography' };
  if (['speaking-world', 'poster-experiments'].includes(project)) return { fit: 'contain', frame: 'poster' };
  return { fit: 'contain', frame: 'presentation' };
};

const media = (project: string, slug: string, alt: string, width: number, height: number, variant: 'thumbnail' | 'detail' = 'detail'): ProjectMedia => ({
  src: assetUrl(`media/projects/${project}/${slug}-${variant}.webp`),
  zoomSrc: assetUrl(`media/projects/${project}/${slug}-zoom.webp`),
  alt,
  width,
  height,
  ...mediaTreatment(project)
});

const gallery = (project: string, items: Array<[string, string, number, number]>): ProjectMedia[] => items.map(([slug, alt, width, height]) => media(project, slug, alt, width, height));

const projectData: Project[] = [
  {
    slug: 'tailo', title: '尾焰 TAILO', subtitle: '从角色形象到产品界面的完整视觉提案', agency: '个人作品素材', year: '时间未注明',
    description: '围绕“尾焰”建立 IP 形象、视觉规范与产品界面，让角色识别和使用场景形成连续体验。', statement: '让一个角色从形象设定出发，进入真实的界面与产品语境。',
    role: '作品内容涵盖 IP 形象与 UI；具体个人职责待补充', category: 'IP 形象设计 / UI 设计', context: '现有素材包括两张 IP 形象板与三张 UI 方案板。', contribution: '作品素材未注明团队分工，页面仅陈列可确认的设计成果。', outcome: '形成从角色形象、视觉语言到界面应用的案例阅读顺序。', featured: true, order: 1,
    theme: { canvas: '#f1eee6', ink: '#161514', accent: '#d7272d', signal: '#ff5860' }, layout: { x: 1, y: 5, rotation: -2, width: 29, height: 83 },
    cover: media('tailo', 'tailo-brand-board-01', '尾焰 IP 形象总览板', 760, 538, 'thumbnail'), stage: media('tailo', 'tailo-brand-board-01', '尾焰 IP 形象完整展示板', 1491, 1055), detail: media('tailo', 'tailo-brand-board-02', '尾焰 IP 形象细节与衍生展示', 1800, 1273),
    frames: gallery('tailo', [['tailo-ui-research', '尾焰用户洞察与界面研究板', 1491, 1055], ['tailo-ui-screens', '尾焰产品界面设计展示', 1491, 1055]]),
    sections: [{ type: 'text', title: '项目概览', body: '案例依照“IP 形象—视觉规范—产品界面”的顺序组织，避免把五张方案板压缩为同权重网格。' }, { type: 'gallery', title: 'IP 形象与视觉规范', presentation: true, images: gallery('tailo', [['tailo-brand-board-01', '尾焰 IP 形象总览板', 1491, 1055], ['tailo-brand-board-02', '尾焰 IP 形象细节与衍生展示', 1800, 1273]]) }, { type: 'gallery', title: '产品界面', presentation: true, images: gallery('tailo', [['tailo-ui-research', '尾焰用户洞察与界面研究板', 1491, 1055], ['tailo-ui-system', '尾焰界面视觉规范板', 1491, 1055], ['tailo-ui-screens', '尾焰产品界面设计展示', 1491, 1055]]) }]
  },
  {
    slug: 'kebike', title: '可比克品牌线下快闪', agency: '团队项目', year: '2026.05', description: '从方案策划、物资采购到现场落地和自媒体复盘的品牌快闪实践。', statement: '把传播方案推进到真实现场，再把现场经验转化为可复盘的内容。', role: '参与方案策划、物资采购、前期宣发与现场落地；主导活动后自媒体复盘宣传', category: '品牌策划 / 线下活动 / 新媒体传播', context: '简历记录活动参与 200+ 人。', contribution: '参与全流程统筹，并负责活动结束后的自媒体复盘宣传。', outcome: '页面以两张方案总览板呈现现有策划内容，不补写未确认商业数据。', featured: true, order: 2,
    theme: { canvas: '#eaf2f7', ink: '#10233f', accent: '#176bc0', signal: '#ff8b3d' }, layout: { x: 25, y: 0, rotation: 1, width: 30, height: 91 },
    cover: media('kebike', 'kebike-strategy-01', '可比克品牌线下快闪策划方案第一页', 760, 451, 'thumbnail'), stage: media('kebike', 'kebike-strategy-01', '可比克品牌快闪完整横向策略板', 1540, 914), detail: media('kebike', 'kebike-strategy-02', '可比克品牌线下快闪策划方案第二页', 1539, 911), frames: gallery('kebike', [['kebike-strategy-01', '可比克品牌快闪完整方案板一', 1540, 914], ['kebike-strategy-02', '可比克品牌快闪完整方案板二', 1539, 911]]),
    sections: [{ type: 'text', title: '职责与现场', body: '参与方案策划、物资采购、前期宣发和现场落地全流程；活动结束后主导自媒体复盘宣传。' }, { type: 'gallery', title: '策划方案', description: '点击方案板可放大阅读文字细节。', presentation: true, images: gallery('kebike', [['kebike-strategy-01', '可比克品牌快闪完整方案板一', 1540, 914], ['kebike-strategy-02', '可比克品牌快闪完整方案板二', 1539, 911]]) }]
  },
  {
    slug: 'bamboo-dream', title: '竹梦百千万', agency: '项目素材未注明合作信息', year: '时间未注明', description: '以竹文化与乡村传播为线索展开的品牌策划方案。', statement: '从文化线索出发，建立产品、品牌与传播路径之间的联系。', role: '具体个人职责待补充', category: '品牌策划 / 乡村与文化传播', context: '现有素材为三张完整策划板。', contribution: '不对未确认的合作单位、成果或个人职责作推断。', outcome: '按背景、方案与传播路径顺序呈现现有内容。', featured: false, order: 5,
    theme: { canvas: '#ece9dc', ink: '#16372d', accent: '#34705b', signal: '#b7d8c4' }, layout: { x: 52, y: 7, rotation: -1, width: 26, height: 75 },
    cover: media('bamboo-dream', 'bamboo-dream-01', '竹梦百千万策划方案第一页', 760, 490, 'thumbnail'), detail: media('bamboo-dream', 'bamboo-dream-02', '竹梦百千万策划方案第二页', 1362, 882), frames: gallery('bamboo-dream', [['bamboo-dream-01', '竹梦百千万方案板一', 1361, 877], ['bamboo-dream-03', '竹梦百千万方案板三', 1361, 884]]),
    sections: [{ type: 'gallery', title: '方案阅读', presentation: true, images: gallery('bamboo-dream', [['bamboo-dream-01', '竹梦百千万方案板一', 1361, 877], ['bamboo-dream-02', '竹梦百千万方案板二', 1362, 882], ['bamboo-dream-03', '竹梦百千万方案板三', 1361, 884]]) }]
  },
  {
    slug: 'haoshi', title: '豪士品牌策划案', agency: '项目素材未注明合作信息', year: '时间未注明', description: '围绕消费人群、品牌产品与营销传播展开的策划练习。', statement: '将市场观察压缩为清晰的品牌判断和传播动作。', role: '具体个人职责待补充', category: '品牌策划 / 市场分析 / 营销传播', context: '现有素材为三张高分辨率策划板。', contribution: '页面仅整理素材中可以确认的分析与方案结构。', outcome: '保留大图阅读入口，不虚构执行结果。', featured: false, order: 6,
    theme: { canvas: '#eee5d2', ink: '#132d4d', accent: '#b46a28', signal: '#f1c88e' }, layout: { x: 75, y: 2, rotation: 2, width: 24, height: 80 },
    cover: media('haoshi', 'haoshi-strategy-01', '豪士品牌策划案第一页', 760, 653, 'thumbnail'), detail: media('haoshi', 'haoshi-strategy-02', '豪士品牌策划案第二页', 982, 849), frames: gallery('haoshi', [['haoshi-strategy-01', '豪士品牌策划板一', 982, 844], ['haoshi-strategy-03', '豪士品牌策划板三', 977, 846]]),
    sections: [{ type: 'gallery', title: '策划方案', presentation: true, images: gallery('haoshi', [['haoshi-strategy-01', '豪士品牌策划板一', 982, 844], ['haoshi-strategy-02', '豪士品牌策划板二', 982, 849], ['haoshi-strategy-03', '豪士品牌策划板三', 977, 846]]) }]
  },
  {
    slug: 'speaking-world', title: '用说话，造世界', subtitle: '阿里云 × 千问大模型视觉提案', agency: '视觉作品', year: '时间未注明', description: '围绕“用说话，造世界”主题展开的系列海报视觉提案。', statement: '把语言的生成能力转译为具有空间感与叙事性的视觉系列。', role: '作品内容涵盖品牌视觉与海报；具体个人职责待补充', category: '品牌视觉 / AI 传播 / 海报设计', context: '素材本身明确包含阿里云与千问相关视觉信息。', contribution: '页面仅呈现四张系列作品及其视觉关系，不绑定未确认奖项。', outcome: '形成一组色彩、信息层级和主题表达连续的海报系列。', featured: true, order: 3,
    theme: { canvas: '#eee9df', ink: '#2c1936', accent: '#8d5dd7', signal: '#ff812f' }, layout: { x: 8, y: 14, rotation: -2, width: 23, height: 80 },
    cover: media('speaking-world', 'speaking-world-01', '用说话造世界系列主海报', 760, 1075, 'thumbnail'), stage: media('speaking-world', 'speaking-world-01', '用说话造世界完整竖版主海报', 1800, 2546), detail: media('speaking-world', 'speaking-world-04', '用说话造世界系列视觉总览', 1434, 1097), frames: gallery('speaking-world', [['speaking-world-02', '用说话造世界系列海报二', 1055, 1491], ['speaking-world-03', '用说话造世界系列海报三', 1800, 2546]]),
    sections: [{ type: 'gallery', title: '系列海报', images: gallery('speaking-world', [['speaking-world-01', '用说话造世界系列海报一', 1800, 2546], ['speaking-world-02', '用说话造世界系列海报二', 1055, 1491], ['speaking-world-03', '用说话造世界系列海报三', 1800, 2546], ['speaking-world-04', '用说话造世界系列视觉总览', 1434, 1097]]) }]
  },
  {
    slug: 'portrait-photography', title: '创意人像摄影', agency: '摄影作品', year: '时间未注明', description: '从概念人像、造型妆发到户外情绪与商业练习的摄影选辑。', statement: '让光线、造型与环境共同承担人物叙事。', role: '作品内容涵盖摄影、造型与后期；具体个人职责待补充', category: '摄影 / 造型 / 后期', context: '从八张原始摄影素材中策展七张，不强制裁切为同一比例。', contribution: '页面按图片方向与视觉关系组织；具体团队分工未在素材中注明。', outcome: '保留横图、竖图与拼贴图各自适合的版式。', featured: true, order: 4,
    theme: { canvas: '#e9e5dc', ink: '#24211f', accent: '#a74b3f', signal: '#d8c2a5' }, layout: { x: 35, y: 5, rotation: 1, width: 28, height: 91 },
    cover: media('portrait-photography', 'portrait-concept-01', '创意人像摄影作品一', 760, 1140, 'thumbnail'), stage: media('portrait-photography', 'portrait-concept-02', '创意人像摄影精选作品', 1672, 2508), detail: media('portrait-photography', 'portrait-concept-02', '创意人像摄影作品二', 1672, 2508), frames: gallery('portrait-photography', [['portrait-concept-03', '创意人像摄影作品三', 1800, 2833], ['portrait-concept-04', '创意人像摄影作品四', 1800, 2700]]),
    sections: [{ type: 'gallery', title: '概念、造型与情绪', images: gallery('portrait-photography', [['portrait-concept-01', '创意人像摄影作品一', 1800, 2700], ['portrait-concept-02', '创意人像摄影作品二', 1672, 2508], ['portrait-concept-03', '创意人像摄影作品三', 1800, 2833], ['portrait-concept-04', '创意人像摄影作品四', 1800, 2700], ['portrait-concept-05', '创意人像摄影作品五', 1800, 2700], ['portrait-concept-06', '创意人像摄影作品六', 1800, 2700], ['portrait-concept-07', '创意人像摄影作品七', 1773, 2364]]) }]
  },
  {
    slug: 'poster-experiments', title: '平面与海报实验', agency: '视觉练习 / 课程作品 / 个人实验', year: '时间未注明', description: '围绕形状、字体、图像和信息层级展开的平面视觉练习。', statement: '把每张海报当成独立的视觉命题，而不是统一模板的变体。', role: '海报设计 / 字体实验 / 视觉练习', category: '平面设计 / 海报实验', context: '从十二张素材中选择具有代表性的形状与海报作品。', contribution: '明确标记为视觉练习、课程作品或个人实验，不包装为商业项目。', outcome: '以中性画布保留每张作品自身的色彩关系。', featured: false, order: 7,
    theme: { canvas: '#f0eee9', ink: '#181817', accent: '#2e6b55', signal: '#f3ca4b' }, layout: { x: 65, y: 10, rotation: -1, width: 28, height: 78 },
    cover: media('poster-experiments', 'poster-study-04', '平面与海报实验作品四', 760, 1013, 'thumbnail'), detail: media('poster-experiments', 'shape-study-01', '形状视觉实验一', 652, 492), frames: gallery('poster-experiments', [['poster-study-01', '海报视觉实验一', 595, 842], ['poster-study-08', '海报视觉实验八', 768, 1376]]),
    sections: [{ type: 'gallery', title: '精选实验', images: gallery('poster-experiments', [['shape-study-01', '形状视觉实验一', 652, 492], ['shape-study-02', '形状视觉实验二', 419, 408], ['poster-study-01', '海报视觉实验一', 595, 842], ['poster-study-03', '海报视觉实验三', 608, 1003], ['poster-study-04', '海报视觉实验四', 1086, 1448], ['poster-study-06', '海报视觉实验六', 911, 885], ['poster-study-07', '海报视觉实验七', 1024, 1792], ['poster-study-08', '海报视觉实验八', 768, 1376]]) }]
  }
];

export const projects = projectData.sort((a, b) => a.order - b.order);

export const featuredProjects = projects.filter((project) => project.featured);
export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
