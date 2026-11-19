import { ChatDock } from "@/components/chat/ask-amar";
import { ChatProvider } from "@/components/chat/chat-context";
import { Flagship } from "@/components/flagship";
import { Glance } from "@/components/glance";
import { Hero } from "@/components/hero";
import { Lately } from "@/components/lately";
import { Nav } from "@/components/nav";
import { Contact, Experience, Footer } from "@/components/sections";
import { SelectedWork } from "@/components/selected-work";
import { Statement } from "@/components/statement";
import { Websites } from "@/components/websites";

export default function Home() {
  return (
    <ChatProvider>
      <Nav />
      <main id="main">
        <Hero />
        <Statement />
        <Glance />
        <Flagship />
        <SelectedWork />
        <Lately />
        <Websites />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ChatDock />
    </ChatProvider>
  );
}
