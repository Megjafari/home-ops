export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-6">About</h1>
      <div className="text-zinc-300 leading-relaxed flex flex-col gap-4">
        <p>
          This is where I document my homelab: a self-hosted Kubernetes cluster,
          networking setup, and the services I run day to day.
        </p>
        <p>
          The configurations shown here are the actual ones running in my cluster,
          not simplified examples. When something breaks, that's in here too.
        </p>
      </div>
    </div>
  );
}