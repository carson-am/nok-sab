interface LogoProps {
  size?: 'large' | 'small';
}

export default function Logo({ size = 'large' }: LogoProps) {
  const nokFontSize = size === 'large' ? '4rem' : '1.5rem';
  const recommerceFontSize = size === 'large' ? '1.4rem' : '0.525rem';
  
  return (
    <div className="flex flex-col items-center" style={{ background: 'transparent' }}>
      <h1 
        className="font-extrabold text-white"
        style={{ 
          color: '#FFFFFF', 
          letterSpacing: '-0.02em',
          fontSize: nokFontSize,
          lineHeight: '1'
        }}
      >
        nok
      </h1>
      <p 
        className="font-bold uppercase"
        style={{ 
          color: '#ff5a1f',
          fontSize: recommerceFontSize,
          lineHeight: '1',
          marginTop: '0.25rem'
        }}
      >
        RECOMMERCE
      </p>
    </div>
  );
}
