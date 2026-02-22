        import React, { useRef, useState,useEffect, Suspense } from 'react';
        import { Canvas, useThree } from '@react-three/fiber';
        import { OrbitControls, Float, Html, ContactShadows,  PerspectiveCamera, useGLTF, Environment, Center } from '@react-three/drei';
        import * as THREE from 'three';
        import gsap from 'gsap';
        import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
        import { Sparkles } from '@react-three/drei';
        import { useTexture } from '@react-three/drei';
        import LocalIcon from './components/LocalIcon';
        




        // ==================== 配置参数 ====================
        // 屏幕位置和旋转 - 调整这些参数来对齐模型屏幕
        const SCREEN_CONFIG = {
          // 屏幕位置 [x, y, z] - 修改这些值移动网页位置
          // x: 左右移动 (负数=左, 正数=右)
          // y: 上下移动 (负数=下, 正数=上)  
          // z: 前后移动 (负数=后, 正数=前)
          position: [0.43, 1.27, -0.47],
          
          // 屏幕旋转 [x, y, z] 单位: 弧度
          // x: 上下倾斜 (正数=向下倾斜)
          // y: 左右旋转 (正数=向右转)
          // z: 翻滚旋转 (一般保持0)
          rotation: [0, 0, 0],
          
          // 缩放因子 - 控制网页在3D空间中的显示大小
          // 数值越小,网页在3D中显示越大
          distanceFactor: 0.60, // 稍微调大一点点，让网页更贴合边框
          
          // 内部网页容器宽度(像素)
          containerWidth: 1200
        };

        // 作品数据
        const PROJECTS_ARRAY = [
          {
            id: 9,
            type: "code",
            title: "MaskForced",
            category: "2D narrative-driven mask-crafting adventure game",
            images: [
              "/images/maskforced1.png",
              "/images/maskforced2.png",
              "/images/maskforced3.png"
            ],
            description: [
              "As the primary programmer, I led the core system development of MaskForced (少主的缚面), a narrative-driven mask-crafting adventure game developed in Unity.",
              "In this game, the player awakens as the 'Young Master' of a declining magical faction and must reconstruct a shattered enchanted mask before attending a decisive masquerade ball within a strict two-hour in-game limit.",
              "I designed and implemented the core 'forced adaptation' crafting system, where arbitrary environmental objects (e.g., crystal balls, wizard hats, spider webs) can be dragged onto a blueprint and algorithmically transformed into functional mask components regardless of logical compatibility.",
              "The system dynamically maps object attributes into mask abilities, triggering memory restoration events and branching narrative outcomes depending on the player’s constructed mask configuration.",
              "Beyond the crafting framework, I was responsible for gameplay logic architecture, event state management, interaction systems, and overall performance optimization, ensuring modular scalability for narrative expansion and future content iteration."
            ],
            tech: ["Unity", "C#", "Narrative System Design", "Gameplay Architecture"],
            date: "2025.02.01",
            demoLink: "https://www.bilibili.com/video/BV1nj6tB2ELv/?spm_id_from=333.1387.homepage.video_card.click&vd_source=be836a0d4ac529548a9c236733b602c9", 
            repoLink: "https://globalgamejam.org/games/2026/shaozhudefumian-maskforced-0"
          },
          {
            id: 1,
            type: "code", // 标志为代码作品
            title: "Hotel404",
            category: "2D third-person exploration horror game",
            images: ["/images/434f2cab678457d65590ea3b7cba20b2.png",
            "/images/hotel4042.png",
            "/images/7b805ce1197804596517ab03bef58838.png"
            ],
            description: [
    "As a core programmer, I contributed significantly to the development of Hotel404 during the TapTap Spotlight Game Jam 2025, a third-person exploration horror game created using Unity and C#.",
    "In this game, players take on the role of a detective investigating a mysterious hotel filled with supernatural occurrences.",
  "I was responsible for integrating player-related resources such as health and buffs, and independently implemented a JSON-based save and load system featuring save previews and basic data encryption.",
    "Based on this system, I further developed a flexible level structure using a two-dimensional array to represent an n-by-n room layout, allowing designers to freely configure rooms and insert narrative dialogue prompts into any room.",
    "My responsibilities also included implementing core gameplay mechanics, optimizing performance, and integrating audio elements using FL Studio to enhance the eerie atmosphere.",
    "The game was developed within a long term (21-day) timeframe during the TapTap GameJam 2025 and it ended up receiving positive feedback on TapTap."
  ],
            tech: ["Unity", "C#", "FL Studio"],
            date: "2025.11.04",       // 新增日期
            demoLink: "https://www.bilibili.com/video/BV1jhyeBKExq?spm_id_from=333.788.recommend_more_video.-1&trackid=web_related_0.router-related-2206146-2vzpc.1768704626051.419&vd_source=be836a0d4ac529548a9c236733b602c9", // 新增视频/预览链接
            repoLink: "https://www.taptap.cn/app/779446"  
          },
          {
            id: 2,
            type: "research", // 标志为研究作品
            title: "YOLOv8-MAH: A New Vehicle Detection Method",
            category: "Computer Vision / Deep Learning",
            images: ["/images/output_8_0.png",
            "/images/yolofig4.png",
            "/images/yolofig5.png",
            ], 
            description: [
  "As the first author, I proposed YOLOv8-MAH, an enhanced vehicle detection model addressing complex backgrounds and small-object occlusion in urban traffic scenarios, from a perception-centric decision support perspective.",
  "The research was presented at CVIP 2025 (IEEE Conference on Computer Vision and Image Processing) and published in the official proceedings.",
  "The model integrates a Multi-Head Self-Attention (MHSA) mechanism into the backbone to improve global feature reasoning, enabling more robust perception under cluttered and dynamic environments.",
  "An optimized Mosaic-9 data augmentation strategy was implemented to enhance the model’s generalization ability, especially for small-scale objects critical to downstream decision-making tasks.",
  "Grad-CAM–based visual explanations were employed to analyze model behavior, providing interpretability for perception modules used in safety-critical or decision-driven systems."
],
            tech: ["PyTorch", "YOLOv8", "Deep Learning", "Computer Vision"],
            date: "2025.10.17", 
            repoLink: "/files/YOLOv8-MAH_A_Vehicle_Detection_Method_Based_on_Mosaic_Augmentation_Attention_Mechanism_and_Heatmap-Based_Interpretability.pdf"
          },
          {
            id: 3,
            type: "code",
            title: "Psycho",
            category: "2D top-down game",
            images: ["/images/7ce21d297ac5a0790e5b046381783ef9.png",
            "/images/psyco1.png",
            ],
          description: [
              "As a sole programmer in a five-person team, I developed this 2D top-down exploration game featuring a modular and production-ready dialogue system during that gamecompany × COREBLAZER GAME JAM 2025.",
              "The dialogue framework supports Excel-based data configuration, enabling rapid content iteration without code modification, including branching narratives, portrait state control (grayscale/normal), and synchronized sound playback.",
              "The protagonist is accompanied by an AI-controlled pet dog whose behavior is driven by a custom A* pathfinding implementation, allowing autonomous navigation when summoned and stochastic roaming during idle states with stable runtime performance.",
              "Developed during my first Game Jam, I independently built the core systems from scratch; despite the project remaining unfinished due to team dissolution, the experience significantly strengthened my skills in system architecture, algorithm implementation, and high-pressure collaborative development."
            ],
            tech: ["Unity", "C#"],
            date: "2025.03.28", 
            demoLink: "https://youtu.be/w_Qv93HVY08",
            repoLink: "https://github.com/KardeniaPoyu/dialogue-system"
          },
          
          
          {
            id: 6,
            type: "research", 
            title: "Machine Learning for Eco-Sustainability in Ethnic Villages",
            category: "Machine Learning",
            images: ["/images/eco_viliage.png",
            "/images/guangxi1.png"
            ], 
            description: [
              "As a core member of the URTP (University Student Research Training Program), I developed an integrated framework to evaluate the ecological security and Sustainable Development Goals (SDGs) of ethnic villages in my hometown, Guangxi(广西).",
              "The project utilizes InVEST models to quantify ecosystem services and employs advanced machine learning algorithms, including Random Forest and CNN-LSTM, to model the spatiotemporal coupling between ecology and economy.",
              "I processed multi-source geospatial data (NDVI, precipitation, soil) to decode the complex relationship between 'Life on Land' (SDG 15) and local sustainable transitions in karst sensitive areas.",
              "This research provides a localized, micro-scale evaluation model for SDG implementation, achieving high-precision predictive performance for carbon storage and water yield across 1990–2020."
            ],
            tech: ["Python", "Random Forest", "CNN-LSTM", "InVEST Model", "Remote Sensing (GIS)"],
            date: "2025.05.20", 
            repoLink: "/files/基于机器学习的民族村寨生态环境可持续发展研究.pdf" 
          },

          {
            id: 7,
            type: "research", 
            title: "Gender Disparities in Japan's Work-Life Balance",
            category: "Data Analysis",
            images: ["/images/Japan_worker.png"],
            description: [
              "In this comprehensive data analysis project, I decrypted the gender-based structural differences in the Japanese labor market using non-parametric statistical methods.",
              "The research involved deep-dive processing of large-scale survey data, applying Kruskal-Wallis tests and Spearman correlation to identify how family roles influence working hours.",
              "I constructed sophisticated ARIMA and SARIMA time-series models to predict future labor trends, successfully capturing the 'Shunto' (Spring Wage Offensive) seasonal fluctuations in Japan.",
              "The final report provides a mathematical foundation for understanding the disparate rates of reduction in working hours between genders, blending rigorous statistics with socio-economic insights."
            ],
            tech: ["Python", "SPSS","Time Series (ARIMA)", "Non-parametric Statistics", "Data Visualization"],
            date: "2025.01.10", 
            repoLink: "/files/Paper_01.pdf" 
          },

          {
            id: 8,
            type: "research", 
            title: "Product Design Disparities in Regional Health Code Systems",
            category: "Data Analysis",
            images: ["/images/paper_heal_code.png"],
            description: [
              "As the group leader of the QMRP (Green Seedling Program), I conducted a comparative audit of digital health code architectures across multiple provinces including Guangxi, Jilin, and Hubei.",
              "The research decodes how regional policy variations influenced the UI/UX design and functional logic of digital governance tools during the 2022 pandemic period.",
              "I analyzed the systematic issues of 'Data Silos' and 'Interoperability Barriers' within the decentralized health code network, proposing a blockchain-based optimization framework for future crisis management.",
              "The project finalizes with a strategic blueprint for standardizing digital public health assets, focusing on balancing data privacy (Cyber-Security) with high-frequency administrative efficiency."
            ],
            tech: ["Comparative Analysis", "Product Logic Audit", "Blockchain Theory", "Data Privacy"],
            date: "2023.05.02", 
            repoLink: "/files/基于各省防疫政策下健康码产品设计的应用差异研究和对策分析.pdf" 
          },
          
        ];
const aboutContent = [
  {
    type: 'text',
    content: (
      <div className="content-wrapper">
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff9ac2', marginBottom: '10px' }}>
          Yirong Zhou (周毅荣)
        </div>

        <div style={{ marginTop: '10px', marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderLeft: '4px solid #ff9ac2', color: '#eee' }}>
          <strong>Undergraduate Student in Information and Computing Science</strong><br/>
          Minzu University of China<br/>
          <span style={{ fontSize: '13px', color: '#bbb' }}>
            Research Assistant, Institute of Automation, Chinese Academy of Sciences
          </span>
        </div>

        <p style={{ marginBottom: '15px' }}>
          I am an undergraduate student majoring in <strong>Information and Computing Science</strong>,
          with a solid mathematical foundation in numerical analysis and linear algebra.
          My current research interests focus on <strong>large language models (LLMs)</strong>,
          <strong>reinforcement learning</strong>, and their integration into <strong>intelligent and multimodal agents</strong>.
        </p>

        <p style={{ marginBottom: '15px' }}>
  My early research experience included <strong>computer vision</strong> and multimodal perception tasks,
  which provided a foundation in modeling and system implementation.
  Building upon this, I am now focused on <strong>agent-centric research</strong>,
  emphasizing the integration of perception, reasoning, and action
  through <strong>LLM- and RL-based frameworks</strong> for adaptive decision-making
  in complex, multimodal environments.
</p>

      </div>
    )
  },
  {
    type: 'image',
    url: '/images/微信图片_20260118135146_1059_4.jpg',
    caption: 'Fig. 1. Experience at Disneyland, Shanghai.'
  },
{
  type: 'text',
  content: (
    <div>
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9ac2', marginTop: '20px', marginBottom: '10px' }}>
        Research Interest & Experience
      </div>
      <p>
        My research interests focus on designing <strong>intelligent agents</strong> that integrate <strong>perception, reasoning, and action</strong> using <strong>large language models (LLMs)</strong> and <strong>reinforcement learning (RL)</strong>. I am particularly interested in <strong>multimodal agent architectures</strong> that process visual, language, and environmental information for adaptive decision-making in complex scenarios.
      </p>
      <ul style={{ paddingLeft: '18px', margin: '15px 0', listStyleType: 'circle' }}>
        <li>
          <strong>LLM-based Decision Reasoning</strong>: Leveraging large language models to interpret multimodal inputs and guide agent actions.
        </li>
        <li>
          <strong>Reinforcement Learning</strong>: Designing policy learning algorithms for adaptive and robust behavior generation in dynamic environments.
        </li>
        <li>
          <strong>Multimodal Agent Design</strong>: Integrating vision, language, and external tools/modules for complex task completion.
        </li>
       
      </ul>
      <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
        *Note: Bold items indicate research topics where I have practical experience.*
      </p>
    </div>
  )
},
  {
    type: 'image',
    url: '/images/7b28bef731babe7c3fd436f307f24b6c.png',
    caption: 'Fig. 2. Field study in Shinsaibashi, Osaka, Japan.'
  },
  {
    type: 'timeline',
    events: [
      { year: '2026', title: 'B.S. in Info & Computing Science', desc: 'Minzu University of China. Thesis focus: Visual Computing.' },
      { 
        year: '2025', 
        title: 'IEEE Conference Publication', 
        desc: 'First-author: Enhanced YOLOv8-based vehicle detection model.' 
      },
      { 
        year: '2003', 
        title: 'Birth', 
        desc: 'Born in Guangxi, China.' 
      },
    ]
  },
  {
    type: 'text',
    content: (
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9ac2', marginBottom: '10px' }}> Long-term Research Goal </div>
        <p>
          Building on my hands-on experience in game development and visual computing, I aim to explore the design and learning mechanisms of <strong>intelligent agents</strong> that integrate perception, reasoning, and action. My focus is on combining <strong>reinforcement learning, large language models (LLMs), and multimodal information</strong> to develop agents capable of adaptive decision-making and robust behavior generation in complex environments.
        </p>
        <p style={{ marginTop: '15px' }}>
          <strong>Languages:</strong> Mandarin (Native), English (Professional), Japanese (Conversational & Highly Motivated).
        </p>
      </div>
    )
}
];
        // ===== 视频链接转 iframe =====
        function convertToEmbed(url) {
          if (!url) return ''

          // Bilibili
          if (url.includes('bilibili.com')) {
            const bvid = url.match(/BV[a-zA-Z0-9]+/)?.[0]
            if (bvid) {
              return `//player.bilibili.com/player.html?bvid=${bvid}&autoplay=1&danmaku=0`
            }
          }

          // YouTube
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const id =
              url.split('v=')[1]?.split('&')[0] ||
              url.split('youtu.be/')[1]
            if (id) {
              return `https://www.youtube.com/embed/${id}?autoplay=1`
            }
          }

          return url
        }
const navArrowStyle = (dir) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [dir]: '10px',
  background: 'none',
  border: 'none',
  color: 'rgba(255, 154, 194, 0.85)', // 🔥 提高不透明度
  cursor: 'pointer',
  fontSize: '26px',                 // 🔥 微微放大
  zIndex: 10,
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  padding: '0',
  textShadow: '0 0 6px rgba(255,154,194,0.6)' // 🔥 轻微霓虹
});



        // ==================== 虚拟操作系统界面 ====================
  function VirtualOS({ view, setView }) {
    const [activeTab, setActiveTab] = useState('about'); 
    const [selectedProject, setSelectedProject] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [emailForm, setEmailForm] = useState({ subject: '', body: '' });
    const [isReturnHover, setIsReturnHover] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // 监听退出动作，清理状态
    useEffect(() => {
      if (view === 'room') {
        setSelectedProject(null);
         setCurrentImgIndex(0);
        setVideoUrl(null);
      }
    }, [view]);

    // 切换逻辑
  const nextImg = (e) => {
    e.stopPropagation();
    if (selectedProject?.images) {
      setCurrentImgIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevImg = (e) => {
    e.stopPropagation();
    if (selectedProject?.images) {
      setCurrentImgIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    }
  };

    // 内部辅助组件
    const PixelButton = ({ onClick, children, color = "#ff9ac2", href }) => {
      const isLink = !!href;
      const Tag = isLink ? 'a' : 'button';
      return (
        <Tag
          href={href}
          target={isLink ? "_blank" : undefined}
          rel={isLink ? "noopener noreferrer" : undefined}
          onClick={onClick}
          className="pixel-button"
          style={{
            padding: '12px 16px',
            background: 'transparent',
            border: `2px solid ${color}`,
            color: color,
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            position: 'relative' 
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = color;
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = `0 0 20px ${color}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = color;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {children}
          {/* 🔥 此处原本的 videoUrl 弹窗代码已被移除 */}
        </Tag>
      );
    };

          // 邮件输入框通用样式
          const inputStyle = {
            width: '100%',
            background: 'rgba(0,0,0,0.3)',
            border: '2px solid #ff9ac2',
            color: '#fff',
            fontFamily: '"Courier New", monospace',
            padding: '10px',
            marginBottom: '15px',
            outline: 'none',
          };

          return (
            <div style={{
              width: `${SCREEN_CONFIG.containerWidth}px`,
              position: 'relative', // 确保弹窗相对于此定位
              transform: 'scale(1)',
              transformOrigin: 'center center',
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              color: '#fff',
              userSelect: 'none'  
            }}>

            {/* ====== 弹窗移到这里（全局唯一） ====== */}
        {videoUrl && (
          <div
            onClick={(e) => e.stopPropagation()} // 防止点击穿透
            style={{
              position: 'absolute', // 相对于屏幕根部
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '860px',
              height: '520px',
              background: '#1a0f1f',
              border: '4px solid #00ffcc',
              zIndex: 9999, // 确保最高层级
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 50px rgba(0,0,0,0.9)'
            }}
          >
            {/* 顶部栏 */}
            <div style={{
              height: '36px', background: '#00ffcc', color: '#000',
              fontSize: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '0 12px', fontFamily: '"Press Start 2P"'
            }}>
              <span>▶ VIDEO_PLAYER.EXE</span>
              <button
                onClick={() => setVideoUrl(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
              >
                ✖
              </button>
            </div>

            {/* 视频区域 */}
            <div style={{ flex: 1, background: '#000' }}>
              <iframe
                src={convertToEmbed(videoUrl)}
                title="video-preview"
                allow="autoplay; fullscreen"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        )}


              {/* ====== 复古终端外壳 ====== */}
              <div style={{
                width: '100%',
                height: '600px',
                background: '#2a1a2f',
                backgroundImage: `
                  linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                  linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
                `,
                backgroundSize: '100% 4px, 3px 100%',
                borderRadius: '26px',
                border: '6px double #ff9ac2',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 0 50px rgba(255,107,157,0.4)',
                display: 'flex',
                overflow: 'hidden',
                position: 'relative'
              }}>
                
                {/* 屏幕扫描线效果叠加层 */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)',
                  backgroundSize: '100% 4px',
                  pointerEvents: 'none',
                  zIndex: 10
                }} />

              {/* ====== 左侧导航栏 ====== */}
    <div style={{
      width: '160px',
      background: 'rgba(0,0,0,0.4)',
      borderRight: '4px solid #ff9ac2',
      padding: '20px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px', 
      alignItems: 'center',
      zIndex: 20
    }}>
      {[
        { id: 'research', icon: 'pixelarticons:book-open', label: 'RESEARCH' },
        { id: 'projects', icon: 'pixelarticons:code', label: 'PROJECTS' },
        { id: 'about', icon: 'pixelarticons:user', label: 'ABOUT' },
        { id: 'contact', icon: 'pixelarticons:external-link', label: 'LINKS' },
        { id: 'email', icon: 'pixelarticons:mail', label: 'CONTACT' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => { setActiveTab(tab.id); setSelectedProject(null);setVideoUrl(null);setCurrentImgIndex(0); }}
          style={{
            width: '120px',
            height: '80px',
            background: activeTab === tab.id ? '#ff9ac2' : 'transparent',
            border: '2px solid #ff9ac2',
            borderRadius: '8px',
            color: activeTab === tab.id ? '#000' : '#ff9ac2',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === tab.id ? '0 0 20px #ff9ac2' : 'none',
            transition: 'all 0.3s'
          }}
        >
          {/* 替换这里的 Emoji 渲染 */}
          <LocalIcon 
            icon={tab.icon} 
            style={{ fontSize: '28px' }} // 像素图标可以稍微大一点，视觉更清晰
          />
          <span style={{ fontSize: '8px', fontWeight: 'bold' }}>{tab.label}</span>
        </button>
      ))}

    <button 
    onClick={() => setView('room')}
    onMouseEnter={() => setIsReturnHover(true)}
    onMouseLeave={() => setIsReturnHover(false)}
    style={{
      marginTop: 'auto',
      // 🔥 根据 Hover 状态切换背景和文字颜色
      background: isReturnHover ? '#87ceeb' : 'none', 
      color: isReturnHover ? '#000' : '#87ceeb',
      
      border: '1px solid #87ceeb', 
      padding: '8px', 
      cursor: 'pointer', 
      fontSize: '10px', 
      width: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      // 添加过渡动画，让高亮更平滑
      transition: 'all 0.2s ease',
      boxShadow: isReturnHover ? '0 0 10px rgba(135, 206, 235, 0.5)' : 'none'
    }}
  >
    <LocalIcon icon="pixelarticons:chevron-left" /> RETURN_
  </button>
    </div>

                {/* ====== 右侧内容区 ====== */}
    <div style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative', zIndex: 5 }}>
      
      {/* 1. 项目/研究列表视图 - 共享同一个 UI 结构 */}
{(activeTab === 'projects' || activeTab === 'research') && !selectedProject && (
  <div className="fade-in">
    <h2
      style={{
        color: '#ff9ac2',
        fontSize: '24px',              
        marginBottom: '30px',
        borderBottom: '2px solid #ff9ac2',
        paddingBottom: '10px'
      }}
    >
      &gt; {activeTab === 'projects' ? 'CODE_DATA_CORE' : 'PAPER_STREAM_BUFFER'}
    </h2>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px'
      }}
    >
      {PROJECTS_ARRAY
        .filter(item =>
          activeTab === 'projects' ? item.type === 'code' : item.type === 'research'
        )
        .map(project => (
          <div
            key={project.id}
            onClick={() => {
    setSelectedProject(project);
    setCurrentImgIndex(0);
  }}
            style={{
              border: '2px solid #ff9ac2',
              padding: '16px',               
              cursor: 'pointer',
              background: 'rgba(255,154,194,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e =>
              (e.currentTarget.style.background = 'rgba(255,154,194,0.2)')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.background = 'rgba(255,154,194,0.05)')
            }
          >
            <img
              src={
    // 逻辑：优先找 images 数组的第 0 项，找不到就找旧的 image 字符串，最后给占位图
    (project.images && Array.isArray(project.images)) 
      ? project.images[0] 
      : (project.images || project.image || "/api/placeholder/600/400")
  }
               loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
                marginBottom: '14px',
                border: '1px solid #ff9ac2'
              }}
              alt=""
            />

            {/* 项目标题 */}
            <div
              style={{
                fontSize: '14px',             
                color: '#fff',
                lineHeight: '1.4'
              }}
            >
              {project.title}
            </div>

            {/* 分类 */}
            <div
              style={{
                fontSize: '10px',             
                color: '#ff9ac2',
                marginTop: '6px',
                letterSpacing: '0.5px'
              }}
            >
              {project.category}
            </div>
          </div>
        ))}
    </div>
  </div>
)}


                  {/* 2. 项目详情视图 */}
    {(activeTab === 'projects' || activeTab === 'research') && selectedProject && (
      <div className="fade-in">
        {/* 返回按钮 */}
        <button 
  onClick={() => {
    setSelectedProject(null);
    if (typeof setCurrentImgIndex === 'function') {
      setCurrentImgIndex(0); 
    }
  }}
          
          style={{ background: 'none', border: 'none', color: '#ff9ac2', cursor: 'pointer', marginBottom: '20px', fontFamily: '"Press Start 2P"', fontSize: '10px' }}
        >
          [ BACK_TO_LIST ]
        </button>
        
        <div style={{ display: 'flex', gap: '30px' }}>
          {/* 左侧：预览图与技术栈 */}
          <div style={{ flex: 1 }}>
                <div style={{ 
  position: 'relative', 
  border: '3px solid #ff9ac2', 
  background: '#000',
  boxShadow: '0 0 20px rgba(255,154,194,0.3)',
  // --- 新增：固定高度和溢出隐藏 ---
  height: '300px', // 你可以根据需要调整这个高度像素值
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  <img 
    src={
    Array.isArray(selectedProject.images) 
      ? selectedProject.images[currentImgIndex] 
      : (selectedProject.images || selectedProject.image)
      
  }
  loading="lazy"
  decoding="async"
    style={{ 
      width: '100%', 
      height: '100%',    // 撑满容器高度
      display: 'block',
      objectFit: 'contain'  // 
    }} 
    alt="" 
  />

                  {/* 左右三角按键：极简设计 */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <button onClick={prevImg} style={navArrowStyle('left')}>
                        <LocalIcon icon="pixelarticons:chevron-left" />
                      </button>
                      <button onClick={nextImg} style={navArrowStyle('right')}>
                        <LocalIcon icon="pixelarticons:chevron-right" />
                      </button>

                      {/* 圆点指示器 (Dots Indicator) */}
                      <div style={{
                        position: 'absolute', bottom: '15px', left: '50%',
                        transform: 'translateX(-50%)', display: 'flex', gap: '8px',
                        background: 'rgba(0,0,0,0.4)', padding: '5px 10px', borderRadius: '10px'
                      }}>
                        {selectedProject.images.map((_, index) => (
                          <div key={index} style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: index === currentImgIndex ? '#ff9ac2' : 'rgba(255,154,194,0.3)',
                            boxShadow: index === currentImgIndex ? '0 0 8px #ff9ac2' : 'none',
                            transition: 'all 0.3s'
                          }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {selectedProject.tech.map(t => (
                <span key={t} style={{ fontSize: ' 10px', padding: '4px 8px', background: '#3d253a', border: '1px solid #ff9ac2' }}>{t}</span>
              ))}
            </div>
          </div>
          
          {/* 右侧：详情介绍与操作 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* 标题与日期行：解决Title重复展示问题 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '18px', color: '#ff9ac2', margin: 0 }}>{selectedProject.title}</h3>
              <span style={{ fontSize: '10px', color: '#87ceeb', border: '1px solid #87ceeb', padding: '2px 6px' }}>
                {selectedProject.date || "2025.11.04"}
              </span>
            </div>

            {/* 项目描述 */}
            <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#ddd', marginBottom: '25px', margin: '0 0 25px 0' }}>
              <div style={{ fontSize: '12px', lineHeight: '1.8', color: '#ddd' }}>
    {selectedProject.description.map((line, idx) => (
      <p key={idx} style={{ marginBottom: '12px' }}>
        {line}
      </p>
    ))}
  </div>

            </p>
            
            {/* 按钮区域：通过 alignItems: 'flex-start' 防止按钮拉伸过长 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
              {selectedProject.demoLink && (
              <PixelButton  color="#00ffcc"
                onClick={() => setVideoUrl(selectedProject.demoLink)}
              >
                ▶ VIDEO_PREVIEW.EXE
              </PixelButton>


              )}
              
              {selectedProject.repoLink && (
                <PixelButton href={selectedProject.repoLink} color="#ff9ac2">
                  🔗 MORE_DETAILS.URL
                </PixelButton>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

                {activeTab === 'email' && (
      <div className="fade-in" style={{ 
        width: '100%',
        height: '100%', // 确保占满高度以辅助对齐
        display: 'flex', 
        justifyContent: 'center', // 水平居中
        paddingTop: '20px'
      }}>
        {/* 内部容器，限制宽度 */}
        <div style={{ width: '100%', maxWidth: '700px' }}>
          
          {/* 标题：现在会和下方的框对齐 */}
          <h2 style={{ 
            color: '#ff9ac2', 
            fontSize: '20px', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>&gt;</span> ENCRYPTED_MESSAGE_EXE
          </h2>
          
          {/* 表单主框 */}
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '30px', 
            border: '1px solid rgba(255,154,194,0.5)', // 细边框，匹配图片质感
            position: 'relative'
          }}>
            
            <div style={{ 
              fontSize: '10px', 
              marginBottom: '20px', 
              color: 'rgba(255,154,194,0.8)',
              fontFamily: '"Courier New", monospace'
            }}>
              TO: yirongyiburong@gmail.com
            </div>
            
            {/* 主题输入框 */}
            <input 
              type="text" 
              placeholder="SUBJECT_" 
              style={{
                ...inputStyle,
                width: '100%',
                boxSizing: 'border-box', // 确保 padding 不撑破宽度
                border: '1px solid #ff9ac2',
                background: 'transparent',
                marginBottom: '20px'
              }}
              value={emailForm.subject}
              onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
            />
            
            {/* 内容输入框 */}
            <textarea 
              placeholder="ENTER_MESSAGE_HERE..." 
              style={{ 
                ...inputStyle, 
                width: '100%',
                boxSizing: 'border-box',
                height: '220px', 
                resize: 'none',
                border: '1px solid #ff9ac2',
                background: 'transparent',
                marginBottom: '25px'
              }}
              value={emailForm.body}
              onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
            />
            
            {/* 按钮容器：靠右对齐 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <PixelButton 
                color="#00ffcc" 
                onClick={() => {
                  window.location.href = `mailto:yirongyiburong@gmail.com?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailForm.body)}`;
                }}
              >
                <LocalIcon icon="pixelarticons:mail-arrow-right" /> SEND_MESSAGE.SH
              </PixelButton>
            </div>
          </div>

        </div>
      </div>
    )}
                  {/* 4. 联系方式/链接视图 */}
    {activeTab === 'contact' && (
      <div className="fade-in" style={{ textAlign: 'center', paddingTop: '20px' }}>
        <h2 style={{ color: '#87ceeb', marginBottom: '30px', fontSize: '18px' }}>&gt; SIGNAL_STATION</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          {[
            { name: 'GITHUB', url: 'https://github.com/KardeniaPoyu', color: '#fff', icon: 'pixelarticons:github' },
            { name: 'X/TWITTER', url: 'https://x.com/KardeniaPoyu', color: '#1DA1F2', icon: 'pixelarticons:contact' },
            { name: 'BLOG', url: 'https://blog.yirong.site', color: '#8B5CF6', icon: 'pixelarticons:article' },
            { name: 'BILIBILI', url: 'https://space.bilibili.com/15095535', color: '#fb7299', icon: 'ri:bilibili-fill' }
          ].map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', width: '320px' }}>
              <div style={{
                padding: '12px 20px', border: `2px solid ${link.color}`, color: link.color,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.3s', cursor: 'pointer', background: 'rgba(0,0,0,0.3)',
                fontFamily: '"Press Start 2P"', fontSize: '10px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = link.color;
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.boxShadow = `0 0 20px ${link.color}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                e.currentTarget.style.color = link.color;
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LocalIcon icon={link.icon} style={{ fontSize: '20px' }} /> 
                  {link.name}
                </span>
                <LocalIcon icon="pixelarticons:arrow-right" />
              </div>
            </a>
          ))}
        </div>
      </div>
    )}

                  {/* 5. 关于视图 */}
                {activeTab === 'about' && (
    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ color: '#ff9ac2', marginBottom: '20px', borderBottom: '1px solid #ff9ac2', paddingBottom: '10px' }}>
        &gt; USER_PROFILE_DOCUMENT == Yirong Zhou
      </h2>

      <div className="custom-scrollbar" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        paddingRight: '15px',
        fontSize: '13px',
        lineHeight: '1.8',
        color: '#eee'
      }}>
            
        {aboutContent.map((item, index) => {
          if (item.type === 'text') {
            return (
              <p key={index} style={{ marginBottom: '20px', textAlign: 'justify' }}>
                {item.content}
              </p>
            );
          }
          if (item.type === 'timeline') {
    // 自动排序：确保时间从上往下（最新到最旧）
    const sortedEvents = [...item.events].sort((a, b) => parseInt(b.year) - parseInt(a.year));

    return (
      <div key={index} style={{ 
        position: 'relative', 
        width: '100%', 
        margin: '60px 0',
        padding: '0' 
      }}>
        {/* --- 闭合线段核心逻辑 --- */}
        <div style={{
          position: 'absolute',
          left: '50%',
          /* 从第一个圆点的中心开始，到最后一个圆点的中心结束 */
          top: '12px', 
          bottom: '70px', // 这个数值通常等于最后一个节点 marginBottom 的一半左右
          width: '1px',
          background: '#ff9ac2',
          boxShadow: '0 0 5px rgba(255,154,194,0.5)',
          transform: 'translateX(-50%)',
          zIndex: 1
        }} />

        {sortedEvents.map((event, idx) => {
          const isLeft = idx % 2 !== 0; 
          const isLast = idx === sortedEvents.length - 1;

          return (
            <div key={idx} style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: isLeft ? 'flex-end' : 'flex-start',
              /* 最后一个节点不需要底部间距，方便线条闭合 */
              marginBottom: isLast ? '0' : '80px', 
              minHeight: '60px'
            }}>
              
              {/* 居中圆点 */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '6px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#1a1a1a',
                border: '2px solid #ff9ac2',
                boxShadow: '0 0 10px #ff9ac2',
                transform: 'translateX(-50%)',
                zIndex: 2
              }} />

              {/* 内容区域 */}
              <div style={{
                width: '45%',
                textAlign: isLeft ? 'right' : 'left',
                padding: isLeft ? '0 30px 0 0' : '0 0 0 30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isLeft ? 'flex-end' : 'flex-start'
              }}>
                <div style={{ color: '#ff9ac2', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold' }}>
                  {event.year}
                </div>
                <div style={{ color: '#ffffff', fontSize: '18px', margin: '4px 0', fontWeight: '500' }}>
                  {event.title}
                </div>
                <div style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6', maxWidth: '240px' }}>
                  {event.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
          if (item.type === 'image') {
            return (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                margin: '30px 0' 
              }}>
                {/* 图片框 */}
                <div style={{ 
                  border: '2px solid #ff9ac2', 
                  padding: '4px', 
                  background: 'rgba(255,154,194,0.05)'
                }}>
                  <img src={item.url} alt="profile" style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }} />
                </div>
                {/* 图片下方的字 */}
                <p style={{ 
                  color: '#ff9ac2', 
                  fontSize: '11px', 
                  marginTop: '10px', 
                  opacity: 0.8,
                  fontStyle: 'italic'
                }}>
                  {item.caption}
                </p>
              </div>
            );
          }

          if (item.type === 'signature') {
            return (
              <div key={index} style={{ 
                marginTop: '40px', 
                paddingTop: '20px',
                borderTop: '1px dashed rgba(255,154,194,0.3)',
                textAlign: 'right' // 署名右对齐
              }}>
                <p style={{ color: '#ff9ac2', fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {item.name}
                </p>
                <p style={{ fontSize: '10px', opacity: 0.6, margin: 0 }}>
                  {item.date}
                </p>
                <p style={{ fontSize: '10px', opacity: 0.6, margin: 0 }}>
                  {item.location}
                </p>
              </div>
            );
          }
          return null;
        })}

        {/* 底部点缀 - 版权声明与构造方法 */}
<div style={{ 
  marginTop: '40px', 
  paddingTop: '20px', 
  borderTop: '1px solid rgba(255,154,194,0.3)',
  fontSize: '9px',
  color: 'rgba(255,154,194,0.6)',
  fontFamily: '"Courier New", monospace',
  lineHeight: '1.5'
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
    {/* 左侧：构造方法 */}
    <div>
      <p style={{ margin: '0 0 5px 0', color: '#ff9ac2', fontWeight: 'bold' }}>[ SYSTEM_MANIFEST ]</p>
      <p style={{ margin: 0 }}>ENGINE: React 18 + Three.js / Fiber</p>
      <p style={{ margin: 0 }}>VISUAL: Scanned-line CRT Emulation (CSS/GLSL)</p>
      <p style={{ margin: 0 }}>MOTION: GSAP Integrated Camera Controller</p>
    </div>

    {/* 右侧：版权声明 */}
    <div style={{ textAlign: 'right' }}>
      <p style={{ margin: '0 0 5px 0' }}>DESIGNED & DEVELOPED BY YIRONG ZHOU</p>
      <p style={{ margin: 0, letterSpacing: '1px' }}>
        © 2026 <span style={{ color: '#ff9ac2' }}></span> ALL RIGHTS RESERVED.
      </p>
      <p style={{ margin: 0, opacity: 0.4 }}>FILE_STATUS: ENCRYPTED_AND_VERIFIED</p>
    </div>
  </div>

            {/* 底部装饰条 */}
            <div style={{ 
              marginTop: '15px', 
              height: '4px', 
              background: 'repeating-linear-gradient(90deg, #ff9ac2 0px, #ff9ac2 2px, transparent 2px, transparent 4px)',
              opacity: 0.3 
            }} />
          </div>
      </div>
    </div>
  )}
                </div>
              </div>
            </div>
          );
        }


        // ==================== 3D 模型加载 ====================
        function ComputerModel({ onClick, view }) {
          const { scene } = useGLTF('/models/device.glb');
          
          return (
            <group onClick={onClick} dispose={null}>
              {/* 关键修改：添加 top 属性，并手动向上移动 position */}
              <Center top position={[0, 0.5, 0]}> 
                <primitive 
                  object={scene} 
                  scale={[20, 20, 20]} // 根据模型大小调整，保持一致
                />
              </Center>
            </group>
          );
        }

        // 必须在文件末尾或组件外部预加载模型，提高性能
        useGLTF.preload('/models/device.glb');

        // ==================== 场景管理 ====================
        function Scene({ onViewChange }) {
    const [isMoving, setIsMoving] = useState(false);
    const { camera } = useThree();
    const [view, setView] = useState('room');
    const controlsRef = useRef();
    const initialCameraPosition = useRef(new THREE.Vector3(0, 2, 5));

useEffect(() => {
    if (onViewChange) {
      onViewChange(view);
    }
  }, [view, onViewChange]);
    // 移除 animationTimeouts，改用 GSAP 自带的清理

    // 确保引入 useEffect
  useEffect(() => {
     RectAreaLightUniformsLib.init();
    // 只有当正在移动时才开启计时器
    if (isMoving) {
      // 设置一个比动画时长(1.2s)稍长的强制解锁时间 (比如 2秒)
      const safetyTimer = setTimeout(() => {
        if (isMoving) {
          console.warn('⚠️ 动画状态超时，强制解锁');
          setIsMoving(false);
          // 如果卡在 focus 状态，强制显示 UI
        }
      }, 2000);

      return () => clearTimeout(safetyTimer);
    }
  }, [isMoving, view]);

    const handleComputerClick = (e) => {
      e.stopPropagation();
      // 只要在移动，或者已经是 focus 状态，绝对禁止再次触发
      if (isMoving || view === 'focus') return;

      setIsMoving(true);

      // 1. 立刻清理旧动画
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(camera.rotation); // 甚至加上 rotation 清理
      if (controlsRef.current) {
        gsap.killTweensOf(controlsRef.current.target);
        controlsRef.current.enabled = false;
      }

      // 2. 只有当确实存在控制器时才执行
      if (controlsRef.current) {
        // 移动 Target
        gsap.to(controlsRef.current.target, {
          x: SCREEN_CONFIG.position[0],
          y: SCREEN_CONFIG.position[1],
          z: SCREEN_CONFIG.position[2],
          duration: 1.2,
          ease: "power3.inOut"
        });

        // 3. 移动 Camera
        gsap.to(camera.position, {
          x: SCREEN_CONFIG.position[0],
          y: SCREEN_CONFIG.position[1],
          z: 0.7, // 确保这个距离不小于 camera.near (默认0.1)，否则会穿模导致黑屏
          duration: 1.2,
          ease: "power3.inOut",
          onUpdate: () => {
            // 再次检查 ref 是否存在，防止组件卸载报错
            if(controlsRef.current) camera.lookAt(controlsRef.current.target);
          },
          onComplete: () => {
            // 动画结束，状态落位
            setView('focus');
            setIsMoving(false);
          }
        });
      } else {
        // 如果没有控制器（极其罕见的情况），直接强制结束
        setIsMoving(false);
      }
    };

    const handleViewChange = (newView) => {
      if (isMoving) return;

      if (newView === 'room' && view === 'focus') {
        setIsMoving(true);

        // 强力清理
        gsap.killTweensOf(camera.position);
        if (controlsRef.current) {
          gsap.killTweensOf(controlsRef.current.target);
          // 此时不要急着 enabled = true，等回到原位再说
        }

        // 延迟一点点执行动画，让 React 有机会渲染 UI 的隐藏状态
        // 这里不需要 requestAnimationFrame 的嵌套，setTimeout 0 足够了
        setTimeout(() => {
          // 恢复控制器目标点
          if (controlsRef.current) {
            gsap.to(controlsRef.current.target, {
              x: 0, y: 0, z: 0,
              duration: 1.2,
              ease: "power2.inOut"
            });
          }

          // 恢复相机位置
          gsap.to(camera.position, {
            x: initialCameraPosition.current.x,
            y: initialCameraPosition.current.y,
            z: initialCameraPosition.current.z,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => {
              if (controlsRef.current) {
                camera.lookAt(controlsRef.current.target);
              }
            },
            onComplete: () => {
              setView('room');
              setIsMoving(false);
              
              // 必须在这里恢复控制器，否则用户无法操作
              if (controlsRef.current) {
                controlsRef.current.enabled = true;
                controlsRef.current.update(); // 强制刷新一下控制器状态
              }
            }
          });
        }, 50);
      }
    };

        function Poster({ position, rotation, textureUrl }) {
        // 注意：useTexture 必须在 Suspense 内部或带有 fallback 的组件中使用
        const texture = useTexture(textureUrl);

        return (
          <group position={position} rotation={rotation}>
            {/* 海报外框 */}
            <mesh castShadow>
              <planeGeometry args={[1.6, 2.1]} />
              <meshStandardMaterial color="#333" roughness={0.5} />
            </mesh>
            {/* 海报贴图层 */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[1.5, 2]} />
              <meshStandardMaterial 
                map={texture} 
                roughness={0.2} 
                metalness={0.1}
                emissive="#ffffff"
                emissiveIntensity={0.05}
              />
            </mesh>
          </group>
        );
      }

        function FloatingStars() {
  return (
    <group>
      {/* 主要粒子群 - 电脑周围 */}
      <Sparkles count={50} scale={10} size={2} speed={0.4} color="#ffb7d5" />
      
      {/* 额外粒子层 - 房间上方漂浮 */}
      <Sparkles 
        count={80} 
        scale={[15, 8, 15]} 
        size={1.5} 
        speed={0.2} 
        opacity={0.6}
        color="#ffffff" 
        position={[0, 3, -2]}
      />
      
      {/* 彩色粒子 - 左侧区域 */}
      <Sparkles 
        count={30} 
        scale={8} 
        size={2.5} 
        speed={0.3} 
        color="#87ceeb" 
        position={[-3, 2, -3]}
      />
      
      {/* 粉色粒子 - 右侧区域 */}
      <Sparkles 
        count={30} 
        scale={8} 
        size={2.5} 
        speed={0.35} 
        color="#ff9ac2" 
        position={[3, 2, -3]}
      />
      
      {/* 微小粒子 - 地面附近漂浮 */}
      <Sparkles 
        count={40} 
        scale={[12, 2, 12]} 
        size={1} 
        speed={0.15} 
        opacity={0.4}
        color="#ffd6e8" 
        position={[0, 0.5, 0]}
      />
      
      {/* 发光几何体 1 */}
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-4, 3, -3]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={1} />
        </mesh>
      </Float>
      
      {/* 发光几何体 2 - 右上角 */}
      <Float speed={3} rotationIntensity={0.8} floatIntensity={1.5}>
        <mesh position={[4, 3.5, -4]}>
          <icosahedronGeometry args={[0.25]} />
          <meshStandardMaterial color="#ff9ac2" emissive="#ff9ac2" emissiveIntensity={1.2} />
        </mesh>
      </Float>
      
      {/* 发光几何体 3 - 中央上方 */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.8}>
        <mesh position={[0, 4, -5]}>
          <tetrahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} />
        </mesh>
      </Float>
      
      {/* 发光几何体 4 - 左前方 */}
      <Float speed={3.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh position={[-2, 2, -1]}>
          <dodecahedronGeometry args={[0.18]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

      // 外部装饰模型组件
      function Decoration({ url, position, scale = [1, 1, 1], rotation = [0, 0, 0] }) {
        const { scene } = useGLTF(url);
        return (
          <primitive 
            object={scene} 
            position={position} 
            scale={scale} 
            rotation={rotation} 
            castShadow 
            receiveShadow 
          />
        );
      }

          return (
            <>
              <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
              <OrbitControls 
                ref={controlsRef}
                enablePan={false}
                maxPolarAngle={Math.PI / 2.2}
                minPolarAngle={Math.PI / 6}
                maxDistance={8}
                minDistance={0.1}
              />

              {/* 稳定的光照系统 */}
              <ambientLight intensity={0.4} />
              <directionalLight
              position={[10, 20, 10]}
              intensity={1.5}
              castShadow
              // 增加 bias 到 -0.002，防止阴影贴图和模型表面过于贴合产生闪烁
              shadow-bias={-0.002} 
              shadow-mapSize={[2048, 2048]} 
              // 必须固定 shadow-camera 范围，不要让它动态更新
              shadow-camera-left={-25}
              shadow-camera-right={25}
              shadow-camera-top={25}
              shadow-camera-bottom={-25}
              shadow-camera-near={0.5}
              shadow-camera-far={50}
            />

            {/* 增加一个弱补光，可以冲淡阴影错误产生的黑影 */}
            <ambientLight intensity={0.5} />
              <pointLight position={[-3, 2, 3]} intensity={0.6} color="#ffb7d5" />
              <pointLight position={[3, 2, 3]} intensity={0.6} color="#87ceeb" />
              
              {/* 中性环境光 - 避免彩虹闪烁 */}
              <Environment preset="city" background={false} intensity={0.5} />
              
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} /> {/* 放大地板范围 */}
              <meshStandardMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.6} 
                roughness={1} 
                metalness={0} // 调低金属度能显著减少反光频闪
              />
            </mesh>

              {/* 添加这个组件来提供柔和的阴影，这比镜面反射更自然，且绝不会有彩虹光 */}
              <ContactShadows 
              position={[0, -0.02, 0]} 
              opacity={0.4} 
              scale={40} 
              blur={2} 
              far={5} 
              frames={1} // 关键：设置为 1，只渲染一次，不再每帧更新，彻底解决频闪
            />

          
              {/* 后墙 */}
              <mesh position={[0, 5, -8]} receiveShadow>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#ffd6e8" roughness={0.8} />
              </mesh>
              
              {/* 电脑模型 */}
              <Suspense fallback={null}>
                <ComputerModel onClick={handleComputerClick} view={view} />
              </Suspense>
              
              {/* 虚拟屏幕 UI - 使用配置参数 */}
              <Html
                transform
                // 修复点 1：只在 'room' 模式下计算遮挡。
                // 一旦进入 'focus' 模式，强制取消遮挡检测，防止因为相机距离过近被误判为"被背面遮挡"
              occlude={false} 
                position={SCREEN_CONFIG.position}

                rotation={SCREEN_CONFIG.rotation}
                distanceFactor={SCREEN_CONFIG.distanceFactor}
                
                // 修复点 2：添加 zIndexRange。
                // 确保当 focused 时，这个 HTML 永远在最上层 (z-index 100)，不会被错误的 3D 遮挡剔除
                zIndexRange={view === 'focus' ? [100, 0] : [0, 0]}
                
                // 修复点 3：移除 pointerEvents 的动态切换，改用 CSS 类名控制
                // 这里的 style 只负责简单的透明度
                style={{
                  opacity: view === 'focus' ? 1 : 0,
                  transition: 'opacity 0.5s',
                  // 加上这个 transform 修正，防止某些浏览器渲染层级丢失
                  transform: 'translate3d(0,0,0)', 
                }}
              >
                {/* 传递 isMoving 状态进去，防止动画过程中误触 */}
                <div style={{ pointerEvents: view === 'focus' && !isMoving ? 'auto' : 'none' }}>
                  <VirtualOS view={view} setView={handleViewChange} />
                </div>
              </Html>
              
              {/* 装饰元素 */}
              <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
                <mesh position={[-2.5, 1, -2]} castShadow>
                  <sphereGeometry args={[0.2, 32, 32]} />
                  <meshStandardMaterial 
                    color="#ffb7d5" 
                    emissive="#ffb7d5" 
                    emissiveIntensity={0.2}
                    roughness={0.3}
                  />
                </mesh>
              </Float>

              {/* 2. 左侧墙壁海报 */}
              <Suspense fallback={null}>
              {/* 海报 */}
              <Poster 
                position={[-4.5, 2.5, -7.9]} 
                rotation={[0, 0, 0]} 
                textureUrl="images/kabi1.png" // 先用测试图，确保能跑通
                onError={(e) => {
    e.target.src = '/kabi11.png';
  }}
              />
              </Suspense>
              
              {/* 3. 氛围粒子与星星 */}
              <FloatingStars />

              {/* 4. 环境补光：给房间角落加一点微弱的霓虹色点光源 */}
              <pointLight position={[-5, 4, -2]} color="#ff00ff" intensity={0.5} />
              <pointLight position={[5, 4, -2]} color="#00ffff" intensity={0.5} />

              {/* 5. 外部模型占位符（如果你有文件了就解开注释） */}
            { <Suspense fallback={null}>
              <Decoration url="/models/kirby_plush.glb" position={[-1.40, 1.93, 0]} scale={[2.5, 2.5, 2.5]} />
              <Decoration url="/models/kirby_head.glb" position={[8, 3, -7]} scale={[0.5, 0.5, 0.5]} />
            </Suspense>}

            
              
              <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
                <mesh position={[2.5, 1.5, -2]} castShadow>
                  <sphereGeometry args={[0.18, 32, 32]} />
                  <meshStandardMaterial 
                    color="#ffd700" 
                    emissive="#ffd700" 
                    emissiveIntensity={0.3}
                    roughness={0.3}
                  />
                </mesh>
              </Float>
            </>
          );
        }
        // ==================== 首次访问介绍UI ====================
        function IntroOverlay({ onClose }) {
          const [step, setStep] = useState(0);
          
          const steps = [
            {
              title: "YIRONG_PORTFOLIO_INTRO",
              content: "Hi! I am Yirong Zhou. This is my interactive portfolio.Thank you for visiting! :) " + "※ 本ポートフォリオは英語版のみとなっています。",
              icon: "pixelarticons:user"
            },
            {
              title: "HOW_TO_NAVIGATE",
              content: "Use your mouse to rotate the camera and explore this kirby style room and click on the computer screen to access my portfolio interface.",
              icon: "pixelarticons:laptop"
            },
            {
              title: "READY_TO_START",
              content: "Feel free to explore my projects, research papers, and know more about me. Enjoy your visit!",
              icon: "pixelarticons:handsup"
            }
          ];

          const currentStep = steps[step];

          return (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: `
  radial-gradient(circle at center, rgba(60,30,70,0.85), rgba(10,5,15,0.98)),
  repeating-linear-gradient(
    45deg,
    rgba(255,255,255,0.02),
    rgba(255,255,255,0.02) 1px,
    transparent 1px,
    transparent 4px
  )
`,
backdropFilter: 'blur(12px)',

              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.5s ease'
            }}>
              {/* 中心卡片 */}
              <div style={{
                background: '#2a1a2f',
                border: '4px solid #ff9ac2',
                borderRadius: '20px',
                padding: '50px 60px',
                maxWidth: '600px',
                boxShadow: '0 0 60px rgba(255, 154, 194, 0.5), inset 0 0 30px rgba(0,0,0,0.5)',
                position: 'relative',
                animation: 'slideUp 0.6s ease, float 4s ease-in-out infinite',

              }}>
                
                {/* 顶部装饰线 */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #ff9ac2, transparent)'
                }} />

                {/* 图标 */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '30px'
                }}>
                  <div style={{
  display: 'inline-block',
  padding: '22px',
  borderRadius: '50%',
  border: '2px solid #ff9ac2',
  boxShadow: `
    0 0 20px rgba(255,154,194,0.6),
    inset 0 0 15px rgba(255,154,194,0.3)
  `,
  position: 'relative'
}}>
<div style={{
  position: 'absolute',
  inset: '-6px',
  borderRadius: '50%',
  border: '1px dashed rgba(255,154,194,0.5)',
  animation: 'spin 12s linear infinite'
}} />

                    <LocalIcon icon={currentStep.icon} style={{ fontSize: '48px', color: '#ff9ac2' }} />
                  </div>
                </div>

                {/* 标题 */}
                <h2 style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '18px',
                  color: '#ff9ac2',
                  textAlign: 'center',
                  marginBottom: '25px',
                  letterSpacing: '2px'
                }}>
                  {currentStep.title}
                </h2>

                {/* 内容 */}
                <p style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '16px',
                  color: '#fff',
                  lineHeight: '1.8',
                  textAlign: 'center',
                  marginBottom: '40px',
                  opacity: 0.9
                }}>
                  {currentStep.content}
                </p>

                {/* 进度指示器 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '30px'
                }}>
                  {steps.map((_, idx) => (
                    <div key={idx} style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: idx === step ? '#ff9ac2' : 'rgba(255, 154, 194, 0.3)',
                      boxShadow: idx === step ? '0 0 10px #ff9ac2' : 'none',
                      transition: 'all 0.3s'
                    }} />
                  ))}
                </div>

                {/* 按钮区域 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px'
                }}>
                  {step < steps.length - 1 ? (
                    <>
                      <button
                        onClick={onClose}
                        style={{
                          padding: '12px 24px',
                          background: 'transparent',
                          border: '2px solid #87ceeb',
                          color: '#87ceeb',
                          fontFamily: '"Press Start 2P"',
                          fontSize: '10px',
                          cursor: 'pointer',
                          borderRadius: '5px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = '#87ceeb';
                          e.target.style.color = '#000';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#87ceeb';
                        }}
                      >
                        SKIP
                      </button>
                      <button
                        onClick={() => setStep(step + 1)}
                        style={{
                          padding: '12px 30px',
                          background: '#ff9ac2',
                          border: '2px solid #ff9ac2',
                          color: '#000',
                          fontFamily: '"Press Start 2P"',
                          fontSize: '10px',
                          cursor: 'pointer',
                          borderRadius: '5px',
                          boxShadow: '0 0 20px rgba(255, 154, 194, 0.5)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 0 30px rgba(255, 154, 194, 0.8)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 0 20px rgba(255, 154, 194, 0.5)';
                        }}
                      >
                        NEXT →
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onClose}
                      style={{
                        padding: '12px 40px',
                        background: '#ff9ac2',
                        border: '2px solid #ff9ac2',
                        color: '#000',
                        fontFamily: '"Press Start 2P"',
                        fontSize: '10px',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        boxShadow: '0 0 20px rgba(255, 154, 194, 0.5)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 0 30px rgba(255, 154, 194, 0.8)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 0 20px rgba(255, 154, 194, 0.5)';
                      }}
                    >
                      START EXPLORING!
                    </button>
                  )}
                </div>

                {/* 底部装饰线 */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #ff9ac2, transparent)'
                }} />
              </div>

              {/* CSS动画 */}
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes slideUp {
                  from { 
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  to { 
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
          );
        }

        // ==================== 主应用 ====================
        const DEBUG_INTRO = false; // 调试阶段打开

        export default function App() {
          const [showIntro, setShowIntro] = useState(() => {
            if (DEBUG_INTRO) return true;
            // 检查localStorage，如果已访问过则不显示
            const hasVisited = localStorage.getItem('portfolio_visited');
            return !hasVisited;
          });
          const [currentView, setCurrentView] = useState('room');

          const handleCloseIntro = () => {
            localStorage.setItem('portfolio_visited', 'true');
            setShowIntro(false);
          };

          return (
            <div style={{ width: '100vw', height: '100vh', background: '#ffe4f5', position: 'relative' }}>
              {/* 首次访问介绍UI */}
              {showIntro && <IntroOverlay onClose={handleCloseIntro} />}
              
              <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                <color attach="background" args={['#ffe4f5']} />
                <fog attach="fog" args={['#ffe4f5', 8, 20]} />
                <Suspense fallback={null}>
                  <Scene onViewChange={setCurrentView} />
                </Suspense>
              </Canvas>
              
              {/* 顶部的提示文字容器 - 只在 room 视图时显示 */}
<div style={{
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(255, 255, 255, 0.95)',
  padding: '12px 30px',
  borderRadius: '30px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '14px',
  color: '#ff6b9d',
  fontWeight: 'bold',
  boxShadow: '0 4px 20px rgba(255, 107, 157, 0.3)',
  pointerEvents: 'none',
  zIndex: 10,
  whiteSpace: 'nowrap',
  border: '2px solid #ffb7d5',
  opacity: currentView === 'room' ? 1 : 0,
  transition: 'opacity 0.5s ease, visibility 0.5s ease',  // 👈 给 visibility 也加上过渡
  visibility: currentView === 'room' ? 'visible' : 'hidden'
}}>
  CLICK THE PC TO BEGIN
</div>
            </div>
          );
        }