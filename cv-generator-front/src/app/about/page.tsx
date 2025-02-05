import Link from 'next/link';

export default function About() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <p>This is the about page.</p>
      <Link href="/" className="text-blue-500 underline">
        Back to Home
      </Link>
    </main>
  );
}
