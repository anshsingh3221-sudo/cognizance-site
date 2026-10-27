import { ImageResponse } from 'next/og';

export const alt = 'Cognizance registration site';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #070a14 0%, #121a35 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700 }}>
          <span>Cogni</span>
          <span style={{ color: '#c9a96a' }}>zance</span>
        </div>
        <div style={{ fontSize: 48, marginTop: 24, color: '#d8dbe6' }}>
          Where ideas leave orbit
        </div>
        <div style={{ fontSize: 34, marginTop: 48, color: '#c9a96a' }}>
          13 to 15 March 2027 · IIT Roorkee
        </div>
        <div style={{ fontSize: 26, marginTop: 16, color: '#8b91a8' }}>
          Event registration · practice build
        </div>
      </div>
    ),
    size
  );
}