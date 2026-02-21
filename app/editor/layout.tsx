import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Sidebar, SidebarContent, SidebarItem } from '@/components/sidebar';
import { CompilerProvider } from '@/context/compiler-context';

export const metadata: Metadata = {
  title: 'Editor - PromptOS',
  description: 'Prompt compiler and testing IDE',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompilerProvider>
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar>
          <SidebarContent>
            <h3 className="text-sm font-semibold text-foreground mb-4">Prompts</h3>
            <SidebarItem active>New Prompt</SidebarItem>
            <SidebarItem>Recent Prompt 1</SidebarItem>
            <SidebarItem>Recent Prompt 2</SidebarItem>
          </SidebarContent>
          <div className="border-t border-border/40 p-4">
            <SidebarContent className="p-0">
              <h3 className="text-sm font-semibold text-foreground mb-4">Models</h3>
              <SidebarItem>GPT-4</SidebarItem>
              <SidebarItem>GPT-3.5 Turbo</SidebarItem>
              <SidebarItem>Claude 3</SidebarItem>
            </SidebarContent>
          </div>
        </Sidebar>
        <main className="flex-1 overflow-hidden pl-64">
          {children}
        </main>
      </div>
    </CompilerProvider>
  );
}
