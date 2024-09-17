"use client";

import PredictionForm from "@/components/PredicitonForm";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center pb-12 gap-16">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       <PredictionForm />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
    
      </footer>
    </div>
  );
}

