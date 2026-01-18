    import React, { useRef, useState, Suspense } from 'react';
    import { Canvas, useFrame, useThree } from '@react-three/fiber';
    import { OrbitControls, Float, Html, ContactShadows, MeshReflectorMaterial, PerspectiveCamera, useGLTF, Environment, Center, Stage } from '@react-three/drei';
    import * as THREE from 'three';
    import gsap from 'gsap';
    import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
    import { Sparkles } from '@react-three/drei';
    import { useTexture } from '@react-three/drei';



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
        title: "<2025 TapTap GameJam> Hotel404",
        category: "Game Development",
        image: "/image/434f2cab678457d65590ea3b7cba20b2.png",
        description: "As a core programer, I participated in the development of 'Hotel404', a third-person exploration horror game created using Unity and C#. In this game, players take on the role of a detective investigating a mysterious hotel filled with supernatural occurrences. My responsibilities included implementing core gameplay mechanics, optimizing performance, and integrating audio elements using FL Studio to enhance the eerie atmosphere. The game was developed within a tight timeframe during the TapTap GameJam 2025 and has received positive feedback for its immersive experience and engaging storyline.",
        tech: ["Unity", "C#", "FL Studio"],
        date: "2025.11.04",       // 新增日期
        demoLink: "https://www.bilibili.com/video/BV1ptStBrEEV/?spm_id_from=333.337.search-card.all.click", // 新增视频/预览链接
        repoLink: "https://www.taptap.cn/app/779446"  // 新增仓库/证明链接
      },
      {
        id: 2,
        title: "<CVIP 2025> Yolov8-MAH : a vehicle detection model ",
        category: "Computer Visualization",
        image: "/api/placeholder/600/400",
        description: "交互式 3D 太空探索体验，使用 Three.js 构建。用户可以在粉色星球表面自由飞行，探索隐藏的彩蛋。",
        tech: ["Three.js", "GLSL", "React"],
        link: "#"
      },
      {
        id: 3,
        title: "卡比UI组件库",
        category: "前端开发",
        image: "/api/placeholder/600/400",
        description: "可爱风格的 React 组件库，包含 50+ 组件。支持主题定制、暗黑模式，完整的 TypeScript 类型支持。",
        tech: ["React", "TypeScript", "Styled Components"],
        link: "#"
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
        id: 5,
        title: "像素艺术生成器",
        category: "创意工具",
        image: "/api/placeholder/600/400",
        description: "在线像素画编辑器，支持多图层、动画预览、调色板管理。已被 1000+ 艺术家使用。",
        tech: ["Canvas API", "Vue.js", "WebSocket"],
        link: "#"
      },
    ];

    // ==================== 虚拟操作系统界面 ====================
    function VirtualOS({ view, setView }) {
      const [activeTab, setActiveTab] = useState('projects');
      const [selectedProject, setSelectedProject] = useState(null);
          // 邮件表单状态
      const [emailForm, setEmailForm] = useState({ subject: '', body: '' });

      if (view !== 'focus') return null;

      // 公共样式：复古发光按钮
      const PixelButton = ({ onClick, children, color = "#ff9ac2", href }) => {
  const isLink = !!href;
  const Tag = isLink ? 'a' : 'button';
  
  return (
    <Tag
      href={href}
      target={isLink ? "_blank" : undefined}
      rel={isLink ? "noopener noreferrer" : undefined}
      onClick={onClick}
      style={{
        padding: '12px 16px',
        background: 'transparent', // 默认透明
        border: `2px solid ${color}`,
        color: color, // 默认文字颜色
        fontFamily: '"Press Start 2P"',
        fontSize: '11px',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease', // 平滑过渡
      }}
      // 鼠标移入逻辑
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color; // 背景变色
        e.currentTarget.style.color = '#000';      // 文字变黑
        e.currentTarget.style.boxShadow = `0 0 20px ${color}`; // 增加发光
      }}
      // 鼠标移出逻辑
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = color;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
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
          transform: 'scale(1)',
          transformOrigin: 'center center',
          fontFamily: '"Press Start 2P", "Courier New", monospace',
          color: '#fff',
          userSelect: 'none'  
        }}>
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
              padding: '40px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '25px',
              alignItems: 'center',
              zIndex: 20
            }}>
              {[
                { id: 'projects', icon: '💾', label: 'PROJECTS' },
                { id: 'about', icon: '👤', label: 'ABOUT' },
                { id: 'contact', icon: '🌐', label: 'LINKS' },
                { id: 'email', icon: '✉️', label: 'EMAIL' } // 新增 EMAIL
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedProject(null); }}
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
                  <span style={{ fontSize: '24px' }}>{tab.icon}</span>
                  <span style={{ fontSize: '8px' }}>{tab.label}</span>
                </button>
              ))}

              <button 
                onClick={() => setView('room')}
                style={{
                  marginTop: 'auto',
                  background: 'none', border: '1px solid #87ceeb', color: '#87ceeb',
                  padding: '10px', cursor: 'pointer', fontSize: '10px'
                }}
              >
                &lt; RETURN_
              </button>
            </div>

            {/* ====== 右侧内容区 ====== */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative', zIndex: 5 }}>
              {/* 1. 项目列表视图 */}
{activeTab === 'projects' && !selectedProject && (
  <div className="fade-in">
    <h2 style={{ color: '#ff9ac2', fontSize: '24px', marginBottom: '30px', borderBottom: '2px solid #ff9ac2', paddingBottom: '10px' }}>
      &gt; SELECT_DATA_CORE
    </h2>
    {/* 调整：将 gap 从 20px 增加到 25px，让布局在大图下不显得拥挤 */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
      {PROJECTS_ARRAY.map(project => (
        <div 
          key={project.id}
          onClick={() => setSelectedProject(project)}
          style={{
            border: '2px solid #ff9ac2',
            padding: '12px', // 稍微收缩 padding，给图片留出更多空间
            cursor: 'pointer',
            background: 'rgba(255,154,194,0.05)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,154,194,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,154,194,0.05)'}
        >
          {/* 【关键修改】：height 从 120px 提升到 160px */}
          <img 
            src={project.image} 
            style={{ 
              width: '100%', 
              height: '160px', 
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
{activeTab === 'projects' && selectedProject && (
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
          {selectedProject.description}
        </p>
        
        {/* 按钮区域：通过 alignItems: 'flex-start' 防止按钮拉伸过长 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
          {selectedProject.demoLink && (
            <PixelButton href={selectedProject.demoLink} color="#00ffcc">
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

              {/* 3. 新增邮件撰写视图 */}
          {activeTab === 'email' && (
            <div className="fade-in">
              <h2 style={{ color: '#ff9ac2', fontSize: '20px', marginBottom: '25px' }}>&gt; COMPOSE_MAIL</h2>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', border: '1px solid #ff9ac2' }}>
                <div style={{ fontSize: '10px', marginBottom: '5px', color: '#ff9ac2' }}>TO: hello@yirong.site</div>
                <input 
                  type="text" 
                  placeholder="SUBJECT_" 
                  style={inputStyle}
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                />
                <textarea 
                  placeholder="ENTER_MESSAGE_HERE..." 
                  style={{ ...inputStyle, height: '180px', resize: 'none' }}
                  value={emailForm.body}
                  onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
                />
                <PixelButton 
                  color="#00ffcc" 
                  onClick={() => {
                    window.location.href = `mailto:hello@yirong.site?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailForm.body)}`;
                  }}
                >
                  SEND_MESSAGE.SH
                </PixelButton>
              </div>
            </div>
          )}

              {/* 4. 联系方式/链接视图 */}
              {activeTab === 'contact' && (
                <div className="fade-in" style={{ textAlign: 'center', paddingTop: '40px' }}>
                  <h2 style={{ color: '#87ceeb', marginBottom: '40px' }}>SIGNAL_STATION</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                    {[
                      { name: 'GITHUB', url: 'https://github.com/KardeniaPoyu', color: '#fff', icon: '🐙' },
                      { name: 'X/TWITTER', url: 'https://x.com/KardeniaPoyu', color: '#1DA1F2', icon: '🐦' },
                      { name: 'BLOG', url: 'https://yirong.site', color: '#ea4c89', icon: '📓' },
                      { name: 'EMAIL', url: 'mailto:hello@example.com', color: '#ff9ac2', icon: '✉️' }
                    ].map(link => (
                      <a key={link.name} href={link.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', width: '300px' }}>
                        <div style={{
                          padding: '15px', border: `2px solid ${link.color}`, color: link.color,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          transition: 'all 0.3s', cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = link.color;
                          e.currentTarget.style.color = '#000';
                          e.currentTarget.style.boxShadow = `0 0 20px ${link.color}`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = link.color;
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          <span>{link.icon} {link.name}</span>
                          <span>&gt;&gt;</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. 关于视图 */}
              {activeTab === 'about' && (
                <div className="fade-in">
                  <h2 style={{ color: '#ff9ac2', marginBottom: '20px' }}>&gt; IDENTIFY_USER</h2>
                  <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                    <div style={{ width: '120px', height: '120px', border: '4px solid #ff9ac2', padding: '5px' }}>
                      <div style={{ width: '100%', height: '100%', background: '#ff9ac2' }}>
                        {/* 放置头像图片 */}
                        <img src="/api/placeholder/120/120" alt="avatar" style={{width:'100%'}} />
                      </div>
                    </div>
                    <div style={{ flex: 1, fontSize: '12px', lineHeight: '2' }}>
                      <p style={{ color: '#00ffcc' }}>[ STATUS: ONLINE ]</p>
                      <p style={{ color: '#ff9ac2' }}>[ ROLE: UNDERGRADUATE_STUDENT ]</p>
                      <p style={{ marginTop: '15px' }}>
                         I am currently an undergraduate student majoring in Information and Computing Science from China, and I hope to study, work, and live in Japan someday.
My academic interests include computer graphics , AI , game development and every application of mathematics in computer science.
                      </p>
                      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderLeft: '4px solid #ff9ac2' }}>
                        "Every pixel tells a story."
                      </div>
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
      const controlsRef = useRef();
      const initialCameraPosition = useRef(new THREE.Vector3(0, 2, 5));
      const focusCameraPosition = useRef(new THREE.Vector3(0, 1.2, 2.5));

    const handleComputerClick = (e) => {
      if (isMoving || view === 'focus') return;
      e.stopPropagation();
      if (view === 'room') {
        setView('focus');
        
        // 1. 修复报错：通过禁用并重置状态来停止控制器惯性
        if (controlsRef.current) {
          controlsRef.current.enabled = false; 
          // 更新控制器内部状态，确保它不再计算之前的鼠标拖拽惯性
          controlsRef.current.update(); 
        }
        
        // 2. 将控制器的目标点平滑移动到屏幕中心
        // 这里的 position 是 SCREEN_CONFIG 的坐标
        gsap.to(controlsRef.current.target, {
          x: SCREEN_CONFIG.position[0],
          y: SCREEN_CONFIG.position[1],
          z: SCREEN_CONFIG.position[2],
          duration: 1.5,
          ease: "power3.inOut"
        });

        // 3. 移动相机到正对着屏幕的位置
        gsap.to(camera.position, {
          x: SCREEN_CONFIG.position[0], // 水平对齐
          y: SCREEN_CONFIG.position[1], // 高度对齐
          z: 0.7,                        // 距离屏幕的深度
          duration: 1.5,
          ease: "power3.inOut",
          onUpdate: () => {
            // 在每一帧动画中，强制相机盯着目标点，防止偏移
            camera.lookAt(controlsRef.current.target);
          },
          onComplete: () => setIsMoving(false) // 移动结束，解锁
        });
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


    
    const handleViewChange = (newView) => {
      if (isMoving) return; // 动画中禁止操作
      setIsMoving(true); // 开始移动，锁定交互
        if (newView === 'room' && view === 'focus') {
          setView('room');
          
          // 1. 先不要立刻开启 controls.enabled，等动画快结束再开
          
          // 2. 平滑恢复控制器目标点到场景中心 [0, 0, 0]
          gsap.to(controlsRef.current.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.5,
            ease: "power2.inOut"
          });
          
          // 3. 平滑恢复相机位置
          gsap.to(camera.position, {
            x: initialCameraPosition.current.x,
            y: initialCameraPosition.current.y,
            z: initialCameraPosition.current.z,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              camera.lookAt(controlsRef.current.target);
            },
            onComplete: () => {
              // 4. 动画彻底完成后再开启控制器，这样就不会跳变了
              if (controlsRef.current) {
                controlsRef.current.enabled = true;
                controlsRef.current.update(); // 强制同步一次状态
                setIsMoving(false); // 移动结束，解锁
              }
            }
          });
        }
      };

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
            occlude
            position={SCREEN_CONFIG.position}
            rotation={SCREEN_CONFIG.rotation}
            distanceFactor={SCREEN_CONFIG.distanceFactor}
            style={{ 
              pointerEvents: view === 'focus' ? 'auto' : 'none',
              opacity: view === 'focus' ? 1 : 0,
              transition: 'opacity 0.5s',
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
            }}
          >
            <VirtualOS view={view} setView={handleViewChange} />
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