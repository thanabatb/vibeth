// OG image — Phase 3
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request, { params }: { params: { username: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#0f172a',
          color: '#f8fafc',
          fontSize: 48,
          fontWeight: 600,
        }}
      >
        VibeTH · @{params.username}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
