'use client';

import AllProjects from '@/components/projects/AllProjects';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen apple-tech-bg">
      <div className="container mx-auto px-4 py-8">
        <AllProjects />
      </div>
    </div>
  );
}