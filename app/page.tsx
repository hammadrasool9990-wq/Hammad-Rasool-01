import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Atmosphere from "@/components/Atmosphere";
import ChapterHUD from "@/components/ChapterHUD";
import Cursor from "@/components/Cursor";
import Terminal from "@/components/Terminal";
import Footer from "@/components/Footer";
import Hero from "@/components/chapters/Hero";
import Origin from "@/components/chapters/Origin";
import Lantern from "@/components/chapters/Lantern";
import Work from "@/components/chapters/Work";
import Toolkit from "@/components/chapters/Toolkit";
import Transmission from "@/components/chapters/Transmission";

export default function Page() {
  return (
    <>
      <a
        href="#origin"
        className="label fixed left-4 top-4 z-[100] -translate-y-24 rounded bg-signal px-3 py-2 text-void focus:translate-y-0"
      >
        Skip to content
      </a>
      <Loader />
      <SmoothScroll />
      <Atmosphere />
      <ChapterHUD />
      <Cursor />
      <Terminal />
      <main>
        <Hero />
        <Origin />
        <Lantern />
        <Work />
        <Toolkit />
        <Transmission />
      </main>
      <Footer />
    </>
  );
}
