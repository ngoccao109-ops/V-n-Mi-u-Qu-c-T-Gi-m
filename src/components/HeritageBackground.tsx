import React from 'react';

export const HeritageBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-b from-[#f9f3e5] via-[#f7eed8] to-[#eedfc2]">
      {/* Sunbeam / Golden Warm Light Ambient */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-300/35 via-yellow-200/20 to-transparent blur-3xl" />
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-amber-400/20 via-orange-300/15 to-transparent blur-3xl" />

      {/* Traditional Watermark Cloud Motifs (Họa tiết Mây Triều Nguyễn & Giấy Sắc) */}
      <svg
        className="absolute top-12 left-10 w-96 h-48 opacity-[0.07] text-[#8b5a2b]"
        viewBox="0 0 400 200"
        fill="currentColor"
      >
        <path d="M50,150 C30,130 30,90 60,80 C70,50 110,40 140,60 C160,30 210,30 230,60 C260,45 300,60 305,95 C330,105 340,140 315,160 C270,165 100,165 50,150 Z" />
        <path d="M120,130 C110,110 130,90 150,95 C160,80 185,80 195,95 C210,90 225,105 220,120 Z" />
      </svg>
      <svg
        className="absolute bottom-16 right-12 w-[480px] h-64 opacity-[0.06] text-[#8b5a2b]"
        viewBox="0 0 400 200"
        fill="currentColor"
      >
        <path d="M50,150 C30,130 30,90 60,80 C70,50 110,40 140,60 C160,30 210,30 230,60 C260,45 300,60 305,95 C330,105 340,140 315,160 C270,165 100,165 50,150 Z" />
      </svg>

      {/* Stylized Architectural Backdrop: Nhà thờ họ Lại - Nghĩa Đô courtyard */}
      <div className="absolute inset-x-0 bottom-0 h-[62vh] opacity-[0.22] flex items-end justify-center mix-blend-multiply filter blur-[1px]">
        <svg
          viewBox="0 0 1440 600"
          className="w-full h-full object-cover object-bottom"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Courtyard Floor */}
          <rect y="480" width="1440" height="120" fill="#d9c29e" />
          
          {/* Ancestral Hall Facade with Archways (Đường nét Nhà thờ họ Lại) */}
          <rect x="220" y="240" width="1000" height="260" fill="#edd9b6" stroke="#b08a55" strokeWidth="2" />
          
          {/* Tile Roof Layer 1 */}
          <polygon points="180,240 720,140 1260,240" fill="#9e3b26" />
          <polygon points="200,240 720,155 1240,240" fill="#b94a32" />
          
          {/* Upper Roof Pavilion */}
          <rect x="520" y="90" width="400" height="70" fill="#edd9b6" stroke="#b08a55" strokeWidth="2" />
          <polygon points="460,95 720,25 980,95" fill="#882e1d" />

          {/* Roof Ridge Curve with Dragon Eaves */}
          <path d="M460,95 Q420,70 410,50" stroke="#7a2616" strokeWidth="6" strokeLinecap="round" />
          <path d="M980,95 Q1020,70 1030,50" stroke="#7a2616" strokeWidth="6" strokeLinecap="round" />

          {/* Triple Arched Doorways (Cổng Tam Quan / Cửa Vòm Truyền Thống) */}
          {/* Center Arch */}
          <path d="M640,500 L640,360 Q720,300 800,360 L800,500 Z" fill="#5c3821" />
          {/* Left Arch */}
          <path d="M360,500 L360,380 Q430,325 500,380 L500,500 Z" fill="#5c3821" />
          {/* Right Arch */}
          <path d="M940,500 L940,380 Q1010,325 1080,380 L1080,500 Z" fill="#5c3821" />

          {/* Plaque Area (Hoành Phi) */}
          <rect x="620" y="260" width="200" height="50" rx="4" fill="#882218" stroke="#d4af37" strokeWidth="3" />

          {/* Surrounding Trees / Greenery */}
          <circle cx="160" cy="380" r="140" fill="#9da372" opacity="0.4" />
          <circle cx="1280" cy="380" r="150" fill="#9da372" opacity="0.4" />
        </svg>
      </div>

      {/* Sắc Phong Paper Fibers & Golden Flecks Texture */}
      <div 
        className="absolute inset-0 opacity-[0.38] mix-blend-color-burn"
        style={{
          backgroundImage: `radial-gradient(#c29742 0.75px, transparent 0.75px), radial-gradient(#a3722e 0.75px, #faf6ed 0.75px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}
      />
    </div>
  );
};
