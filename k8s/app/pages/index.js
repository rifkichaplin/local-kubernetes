export default function Home() {
  return (
    <main style={{fontFamily: 'system-ui', padding: 24}}>
      <h1>Next.js on Kubernetes (kind)</h1>
      <p>Backed by Postgres + Redis via NGINX Ingress.</p>
      <p>Try <a href="/api/healthz">/api/healthz</a> to check connectivity.</p>
    </main>
  );
}
