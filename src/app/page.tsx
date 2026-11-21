import { AppProvider } from "@/components/app-state";
import { ChatProvider } from "@/components/chat/chat-context";
import { CommandPalette } from "@/components/command-palette";
import { Flagship } from "@/components/flagship";
import { Glance } from "@/components/glance";
import { Hero } from "@/components/hero";
import { Lately } from "@/components/lately";
import { Nav } from "@/components/nav";
import { PrismaStory } from "@/components/prisma-story";
import { ModeSwitch } from "@/components/recruiter-mode";
import { RoleFitDrawer } from "@/components/role-fit-drawer";
import { SectionIndex } from "@/components/section-index";
import { Contact, Experience, Footer } from "@/components/sections";
import { SelectedWork } from "@/components/selected-work";
import { Stack } from "@/components/stack";
import { Testimonials } from "@/components/testimonials";
import { Websites } from "@/components/websites";

export default function Home() {
  return (
    <AppProvider>
      <ChatProvider>
        <Nav />
        <SectionIndex />
        <ModeSwitch footer={<Footer />}>
          <Hero />
          {/* 01–08, in the order of lib/sections.ts */}
          <Glance />
          <Flagship />
          <SelectedWork />
          <Lately />
          <Websites />
          <Testimonials />
          <Experience />
          <Stack />
          <Contact />
        </ModeSwitch>
        {/* overlays: native <dialog>s, Esc to close */}
        <RoleFitDrawer />
        <CommandPalette />
        <PrismaStory />
      </ChatProvider>
    </AppProvider>
  );
}
