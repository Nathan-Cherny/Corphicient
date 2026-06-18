"use client";

import { PageMain } from "./components/layout/PageMain";

export default function Home() {
  return (
    <PageMain>
      <div className="m-20">
        <h1>What do I need to do?</h1>
        <p>tasks for today</p>
        <p>deadlines coming up soon</p>
        <p>maybe a fun fact</p>
      </div>
    </PageMain>
  );
}
