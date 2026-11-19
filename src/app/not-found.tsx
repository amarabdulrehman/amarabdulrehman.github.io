import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="headline-lg mt-3">This page took a day off.</h1>
        <p className="lede mx-auto mt-4 max-w-md">The link may be old, or the page has moved.</p>
        <Link href="/" className="btn-primary mt-8">Back to the portfolio</Link>
      </div>
    </main>
  );
}
