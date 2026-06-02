export default function StarfieldBg({ variant = 'dark' }) {
  const gradients = {
    dark: 'radial-gradient(ellipse at 30% 50%, rgba(0,30,60,0.8) 0%, #050A0F 60%)',
    green: 'radial-gradient(ellipse at 70% 30%, rgba(0,60,30,0.6) 0%, #050A0F 60%)',
    red: 'radial-gradient(ellipse at 30% 70%, rgba(60,0,0,0.6) 0%, #050A0F 60%)',
    split: `
      radial-gradient(ellipse at 20% 50%, rgba(255,40,40,0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 50%, rgba(0,255,135,0.12) 0%, transparent 50%),
      #050A0F
    `,
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: gradients[variant] || gradients.dark, zIndex: 0 }}
    >
      {/* Static star dots via CSS */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 15%, white, transparent),
            radial-gradient(1px 1px at 25% 40%, white, transparent),
            radial-gradient(1px 1px at 40% 10%, white, transparent),
            radial-gradient(1px 1px at 55% 60%, white, transparent),
            radial-gradient(1px 1px at 70% 25%, white, transparent),
            radial-gradient(1px 1px at 85% 70%, white, transparent),
            radial-gradient(1px 1px at 15% 80%, white, transparent),
            radial-gradient(1px 1px at 90% 15%, white, transparent),
            radial-gradient(1px 1px at 35% 90%, white, transparent),
            radial-gradient(1px 1px at 60% 45%, white, transparent),
            radial-gradient(2px 2px at 5% 55%, rgba(0,255,135,0.6), transparent),
            radial-gradient(2px 2px at 95% 35%, rgba(0,194,255,0.6), transparent),
            radial-gradient(1.5px 1.5px at 50% 75%, rgba(255,215,0,0.4), transparent)
          `,
        }}
      />

      {/* Nebula blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
        style={{ background: 'radial-gradient(circle, #00FF87, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{ background: 'radial-gradient(circle, #FF3C3C, transparent)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-1"
        style={{ background: 'radial-gradient(ellipse, #00C2FF, transparent)' }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  )
}
