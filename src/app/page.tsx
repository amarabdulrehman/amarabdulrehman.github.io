import { ChatDock } from "@/components/chat/ask-amar";
import { ChatProvider } from "@/components/chat/chat-context";
import { Flagship } from "@/components/flagship";
import { Glance } from "@/components/glance";
import { Hero } from "@/components/hero";
import { Lately } from "@/components/lately";
import { Nav } from "@/components/nav";
import { SectionIndex } from "@/components/section-index";
import { Contact, Experience, Footer, Skills } from "@/components/sections";
import { SelectedWork } from "@/components/selected-work";
import { Websites } from "@/components/websites";

export default function Home() {
  return (
    <ChatProvider>
      <Nav />
      <SectionIndex />
      <main id="main">
        <Hero />
        {/* 01–08, in the order of lib/sections.ts */}
        <Glance />
        <Flagship />
        <SelectedWork />
        <Lately />
        <Websites />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <ChatDock />
    </ChatProvider>
  );
}
