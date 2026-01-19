import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to llm-corp Web App</h1>
      <p className="mt-4 text-lg">This is the main page of the llm-corp web application.</p>
      <div className="mt-8">
        <Image
          src="/logo.png"
          alt="llm-corp Logo"
          width={200}
          height={200}
        />
      </div>
    </main>
    
  );
}
