import { AskAmar, ChatLauncher } from "@/components/chat/ask-amar";
import { ChatProvider } from "@/components/chat/chat-context";
import { Flagship } from "@/components/flagship";
import { Hero } from "@/components/hero";
import { Lately } from "@/components/lately";
import { Nav } from "@/components/nav";
import { Contact, Experience, Footer, Stack } from "@/components/sections";
import { SelectedWork } from "@/components/selected-work";
import { Stats } from "@/components/stats";
import { Websites } from "@/components/websites";

export default function Home() {
  return (
    <ChatProvider>
      <Nav />
      <main id="main">
        <Hero />
        <Stats />
        <Flagship />
        <Lately />
        <SelectedWork />
        <AskAmar />
        <Websites />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <ChatLauncher />
    </ChatProvider>
  );
}
