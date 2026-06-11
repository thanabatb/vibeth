// Public profile — Phase 3
export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <main className="min-h-screen">
      <p className="p-8 text-center text-gray-500">Profile @{params.username} — coming soon (Phase 3)</p>
    </main>
  )
}
