      import React, { useRef, useState,useEffect, Suspense } from 'react';
      import { Canvas, useFrame, useThree } from '@react-three/fiber';
      import { OrbitControls, Float, Html, ContactShadows, MeshReflectorMaterial, PerspectiveCamera, useGLTF, Environment, Center, Stage } from '@react-three/drei';
      import * as THREE from 'three';
      import gsap from 'gsap';
      import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
      import { Sparkles } from '@react-three/drei';
      import { useTexture } from '@react-three/drei';
      import { Icon } from '@iconify/react';



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
          id: 1,
          type: "code", // 标志为代码作品
          title: "<TapTap Spotlight Game Jam 2025> Hotel404",
          category: "Game Development",
          image: "/images/434f2cab678457d65590ea3b7cba20b2.png",
          description: [
  "As a core programmer, I participated in the development of 'Hotel404', a third-person exploration horror game created using Unity and C#.",
  "In this game, players take on the role of a detective investigating a mysterious hotel filled with supernatural occurrences.",
  "My responsibilities included implementing core gameplay mechanics, optimizing performance, and integrating audio elements using FL Studio to enhance the eerie atmosphere.",
  "The game was developed within 21 days timeframe during the TapTap GameJam 2025 and has received positive feedback for its immersive experience and engaging storyline."
],
          tech: ["Unity", "C#", "FL Studio"],
          date: "2025.11.04",       // 新增日期
          demoLink: "https://www.bilibili.com/video/BV1jhyeBKExq?spm_id_from=333.788.recommend_more_video.-1&trackid=web_related_0.router-related-2206146-2vzpc.1768704626051.419&vd_source=be836a0d4ac529548a9c236733b602c9", // 新增视频/预览链接
          repoLink: "https://www.taptap.cn/app/779446"  // 新增仓库/证明链接
        },
        {
          id: 2,
          type: "research", // 标志为研究作品
          title: "<CVIP 2025> YOLOv8-MAH: A New Vehicle Detection Method",
          category: "Computer Vision / Deep Learning",
          image: "/images/output_8_0.png", // 建议替换为论文中的热力图(Heatmap)或模型架构图
          description: [
            "As the first author, I proposed YOLOv8-MAH, an enhanced vehicle detection model designed to address challenges like complex backgrounds and small object occlusion in urban traffic.",
            "The model integrates a Multi-Head Self-Attention (MHSA) mechanism into the backbone to capture global dependencies and a specialized decoupled head to accelerate convergence.",
            "I implemented an optimized Mosaic-9 data augmentation strategy, significantly improving the detection accuracy for small-scale vehicle objects in high-density scenarios.",
            "The research achieved a mAP@0.5 of 81.3% on the UA-DETRAC dataset and utilizes Grad-CAM heatmaps to provide visual interpretability of the model's decision-making process."
          ],
          tech: ["PyTorch", "YOLOv8", "Deep Learning", "Computer Vision"],
          date: "2025.10.17", 
          repoLink: "https://ieeexplore.ieee.org/document/11291274" // 建议放入你的仓库链接或论文下载链接
        },
        {
          id: 3,
          type: "code",
          title: "<thatgamecompany × COREBLAZER GAME JAM 2025> Psycho",
          category: "Game Development",
          image: "/images/1.12.JPG",
          description: [
            "As a core programmer, I participated in the development of 'Hotel404', a third-person exploration horror game created using Unity and C#.",
            "In this game, players take on the role of a detective investigating a mysterious hotel filled with supernatural occurrences.",
            "My responsibilities included implementing core gameplay mechanics, optimizing performance, and integrating audio elements using FL Studio to enhance the eerie atmosphere.",
            "The game was developed within 21 days timeframe during the TapTap GameJam 2025 and has received positive feedback for its immersive experience and engaging storyline."
          ],
          tech: ["Unity", "C#"],
          demoLink: "https://youtu.be/w_Qv93HVY08",
          repoLink: "https://github.com/KardeniaPoyu/dialogue-system"
        },
        {
          id: 4,
          title: "像素艺术生成器",
          category: "创意工具",
          image: "/api/placeholder/600/400",
          description: "在线像素画编辑器，支持多图层、动画预览、调色板管理。已被 1000+ 艺术家使用。",
          tech: ["Canvas API", "Vue.js", "WebSocket"],
          link: "#"
        },
        {
          id: 6,
          type: "research", 
          title: "Gender Disparities in Japan's Work-Life Balance",
          category: "Data Analysis / Statistics",
          image: "/images/Japan_worker.png", // 建议使用报告中的 ARIMA 预测图或季节性波动图
          description: [
            "In this comprehensive data analysis project, I decrypted the gender-based structural differences in the Japanese labor market using non-parametric statistical methods.",
            "The research involved deep-dive processing of large-scale survey data, applying Kruskal-Wallis tests and Spearman correlation to identify how family roles influence working hours.",
            "I constructed sophisticated ARIMA and SARIMA time-series models to predict future labor trends, successfully capturing the 'Shunto' (Spring Wage Offensive) seasonal fluctuations in Japan.",
            "The final report provides a mathematical foundation for understanding the disparate rates of reduction in working hours between genders, blending rigorous statistics with socio-economic insights."
          ],
          tech: ["Python", "SPSS","Time Series (ARIMA)", "Non-parametric Statistics", "Data Visualization"],
          date: "2025.01.10", 
          repoLink: "/files/Paper_01.pdf" // 如果有代码仓库或PDF在线链接可以放入
        },

        {
          id: 7,
          type: "research", 
          title: "Machine Learning for Eco-Sustainability in Ethnic Villages",
          category: "Machine Learning / Ecology / Remote Sensing",
          image: "/images/eco_viliage.png", // 建议使用论文中的“研究路线图”或“广西生态服务空间分布热力图”
          description: [
            "As a core member of the URTP (University Student Research Training Program), I developed an integrated framework to evaluate the ecological security and Sustainable Development Goals (SDGs) of ethnic villages in my hometown, Guangxi(广西).",
            "The project utilizes InVEST models to quantify ecosystem services and employs advanced machine learning algorithms, including Random Forest and CNN-LSTM, to model the spatiotemporal coupling between ecology and economy.",
            "I processed multi-source geospatial data (NDVI, precipitation, soil) to decode the complex relationship between 'Life on Land' (SDG 15) and local sustainable transitions in karst sensitive areas.",
            "This research provides a localized, micro-scale evaluation model for SDG implementation, achieving high-precision predictive performance for carbon storage and water yield across 1990–2020."
          ],
          tech: ["Python", "Random Forest", "CNN-LSTM", "InVEST Model", "Remote Sensing (GIS)"],
          date: "2025.05.20", 
          repoLink: "/files/基于机器学习的民族村寨生态环境可持续发展研究.pdf" // 建议放入你的结题论文或答辩PPT的预览链接
        },

        {
          id: 8,
          type: "research", 
          title: "Product Design Disparities in Regional Health Code Systems",
          category: "Data Analysis / Statistics",
          image: "/images/paper_heal_code.png", // 建议使用各省健康码对比图或研究框架图
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
    content: "Hi there ! If someone is reading this file, remember my name is Yirong Zhou (周 毅荣).I am currently an undergraduate student majoring in Information and Computing Science from China. My academic interests include computer graphics, AI, and game development."
  },
  {
    type: 'image',
    url: '你的照片1_URL',
    caption: 'Fig 1: Me when I was small, , China'
  },
  {
    type: 'text',
    content: "I have a strong passion for exploring how mathematics can be applied to create immersive digital experiences. Currently, I am focusing on real-time rendering and GPGPU programming."
  },
  {
    type: 'image',
    url: '/images/微信图片_20260118135147_1060_4.jpg',
    caption: 'Fig 2: Me when I finished my Junior high school, Liuzhou, China'
  },
  {
    type: 'text',
    content: "In my spare time, I enjoy Japanese culture and hope to live and work there in the future. I believe that every pixel tells a story."
  },
  {
    type: 'image',
    url: '/images/微信图片_20260118135146_1059_4.jpg',
    caption: 'Fig 3: Me in Disenyland, Shanghai, China'
  },
  {
    type: 'image',
    url: '/images/微信图片_20260118135147_1060_4.jpg',
    caption: 'Fig 4: Me with my friends in The Great Wall, Beijing, China'
  },
  {
    type: 'image',
    url: '/images/b16bd7b545148e8c0370a668e0b8f9e8.jpg',
    caption: 'Fig 5: Me in Shinsaibashi, Osaka, Japan'
  },
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

      // ==================== 虚拟操作系统界面 ====================
function VirtualOS({ view, setView }) {
  const [activeTab, setActiveTab] = useState('contact'); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [emailForm, setEmailForm] = useState({ subject: '', body: '' });
  const [isReturnHover, setIsReturnHover] = useState(false);

  // 监听退出动作，清理状态
  useEffect(() => {
    if (view === 'room') {
      setSelectedProject(null);
      setVideoUrl(null);
    }
  }, [view]);

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
        onClick={() => { setActiveTab(tab.id); setSelectedProject(null);setVideoUrl(null); }}
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
        <Icon 
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
  <Icon icon="pixelarticons:chevron-left" /> RETURN_
</button>
  </div>

              {/* ====== 右侧内容区 ====== */}
  <div style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative', zIndex: 5 }}>
    
    {/* 1. 项目/研究列表视图 - 共享同一个 UI 结构 */}
    {(activeTab === 'projects' || activeTab === 'research') && !selectedProject && (
      <div className="fade-in">
        <h2 style={{ color: '#ff9ac2', fontSize: '24px', marginBottom: '30px', borderBottom: '2px solid #ff9ac2', paddingBottom: '10px' }}>
          &gt; {activeTab === 'projects' ? 'CODE_DATA_CORE' : 'PAPER_STREAM_BUFFER'}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {PROJECTS_ARRAY
            // 核心逻辑：根据当前选中的 tab 过滤显示的数据
            .filter(item => activeTab === 'projects' ? item.type === 'code' : item.type === 'research')
            .map(project => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                style={{
                  border: '2px solid #ff9ac2',
                  padding: '12px',
                  cursor: 'pointer',
                  background: 'rgba(255,154,194,0.05)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,154,194,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,154,194,0.05)'}
              >
                <img 
                  src={project.image} 
                  style={{ 
                    width: '100%', 
                    height: '160px', // 使用了你要求的增大后的尺寸
                    objectFit: 'cover', 
                    marginBottom: '12px', 
                    border: '1px solid #ff9ac2' 
                  }} 
                  alt="" 
                />
                <div style={{ fontSize: '12px', color: '#fff' }}>{project.title}</div>
                <div style={{ fontSize: '8px', color: '#ff9ac2', marginTop: '5px' }}>{project.category}</div>
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
        onClick={() => setSelectedProject(null)}
        style={{ background: 'none', border: 'none', color: '#ff9ac2', cursor: 'pointer', marginBottom: '20px', fontFamily: '"Press Start 2P"', fontSize: '10px' }}
      >
        [ BACK_TO_LIST ]
      </button>
      
      <div style={{ display: 'flex', gap: '30px' }}>
        {/* 左侧：预览图与技术栈 */}
        <div style={{ flex: 1 }}>
          <img src={selectedProject.image} style={{ width: '100%', border: '3px solid #ff9ac2', boxShadow: '0 0 20px rgba(255,154,194,0.3)' }} alt="" />
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {selectedProject.tech.map(t => (
              <span key={t} style={{ fontSize: '8px', padding: '4px 8px', background: '#3d253a', border: '1px solid #ff9ac2' }}>{t}</span>
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
                🔗 SOURCE_CODE.URL
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
              <Icon icon="pixelarticons:mail-arrow-right" /> SEND_MESSAGE.SH
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
          { name: 'BLOG', url: 'https://yirong.site', color: '#ea4c89', icon: 'pixelarticons:article' },
          { name: 'BILIBILI', url: 'https://space.bilibili.com/393165089', color: '#fb7299', icon: 'ri:bilibili-fill' }
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
                <Icon icon={link.icon} style={{ fontSize: '20px' }} /> 
                {link.name}
              </span>
              <Icon icon="pixelarticons:arrow-right" />
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

      {/* 底部点缀 */}
      <div style={{ height: '50px', borderTop: '1px solid rgba(255,154,194,0.2)', marginTop: '20px' }} />
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
                scale={[20, 20, 20]} // 根据你的模型大小调整，保持一致
              />
            </Center>
          </group>
        );
      }

      // 必须在文件末尾或组件外部预加载模型，提高性能
      useGLTF.preload('/models/device.glb');

      // ==================== 场景管理 ====================
      RectAreaLightUniformsLib.init();
      function Scene() {
  const [isMoving, setIsMoving] = useState(false);
  const { camera } = useThree();
  const [view, setView] = useState('room');
  const [uiVisible, setUiVisible] = useState(false);
  const controlsRef = useRef();
  const initialCameraPosition = useRef(new THREE.Vector3(0, 2, 5));
  // 建议：移除 animationTimeouts，改用 GSAP 自带的清理

  // ✅ 修复1：组件卸载或重渲染时的安全阀
  // 确保引入 useEffect
useEffect(() => {
  // 只有当正在移动时才开启计时器
  if (isMoving) {
    // 设置一个比动画时长(1.2s)稍长的强制解锁时间 (比如 2秒)
    const safetyTimer = setTimeout(() => {
      if (isMoving) {
        console.warn('⚠️ 动画状态超时，强制解锁');
        setIsMoving(false);
        // 如果卡在 focus 状态，强制显示 UI
        if (view === 'focus') setUiVisible(true);
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
          setUiVisible(true);
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
      setUiVisible(false); // 先隐藏 UI

      // ✅ 修复3：强力清理
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
            
            // ✅ 修复4：必须在这里恢复控制器，否则用户无法操作
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
            {/* 在电脑周围散布粒子 */}
            <Sparkles count={50} scale={10} size={2} speed={0.4} color="#ffb7d5" />
            
            {/* 几个大的发光几何体 */}
            <Float speed={4} rotationIntensity={1} floatIntensity={2}>
              <mesh position={[-4, 3, -3]}>
                <octahedronGeometry args={[0.3]} />
                <meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={1} />
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
              textureUrl="https://picsum.photos/600/800" // 先用测试图，确保能跑通
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
      // ==================== 主应用 ====================
      export default function App() {
        return (
          <div style={{ width: '100vw', height: '100vh', background: '#ffe4f5', position: 'relative' }}>
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
              <color attach="background" args={['#ffe4f5']} />
              <fog attach="fog" args={['#ffe4f5', 8, 20]} />
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
            
            {/* 顶部的提示文字容器 */}
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
              border: '2px solid #ffb7d5'
            }}>
              ✨ Turn on the PC ✨
            </div>
          </div>
        );
      }