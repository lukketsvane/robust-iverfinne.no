"use client";

import { useState, useEffect } from "react";
import { Menu, X, Linkedin, Mail } from 'lucide-react';
import Image from "next/image";

// Banner Header Component
function BannerHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] flex">
        {/* Left Banner - Red */}
        <div className="flex-1 bg-[#e3160b] flex items-center justify-start px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-[#ffc2c2] transition-colors z-20"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Title */}
          <div className="flex-1 flex justify-center md:justify-start">
            <h1 className="font-['JetBrains_Mono',monospace] font-bold text-white text-[20px] md:text-[24px] tracking-tight">
              FORENINGEN ROBUST
            </h1>
          </div>
        </div>

        {/* Right Banner - Pink */}
        <div className="w-[120px] bg-[#ffc2c2] flex items-center justify-center relative">
          <Image
            src="/robust-logo-red-text.jpg"
            alt="ROBUST Logo"
            width={100}
            height={40}
            className="object-contain"
          />
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="fixed top-[60px] left-0 right-0 bg-[#e3160b] z-40 md:hidden">
          <div className="flex flex-col py-4">
            {["Om oss", "Prosjekter", "I media", "Kontakt"].map((item) => (
              <button
                key={item}
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-lg py-3 px-6 hover:bg-[#c41309] transition-colors text-left font-['JetBrains_Mono',monospace]"
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}

// Desktop Navigation Component
function DesktopNavigation({ activeItem }: { activeItem: string }) {
  const navItems = [
    { name: "Om oss", id: "om-oss" },
    { name: "Prosjekter", id: "prosjekter" },
    { name: "I media", id: "i-media" },
    { name: "Kontakt", id: "kontakt" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="hidden md:flex flex-col gap-8">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => scrollToSection(item.id)}
          className={`font-['JetBrains_Mono',monospace] text-white text-[20px] transition-all duration-300 hover:opacity-80 whitespace-nowrap relative text-left ${
            activeItem === item.name
              ? "font-bold"
              : "font-normal"
          }`}
        >
          {item.name}
        </button>
      ))}
    </nav>
  );
}

// Content Section 1: Image (Pink) + Text (Red)
function ContentSection1({ activeSection }: { activeSection: string }) {
  return (
    <section id="om-oss" className="flex flex-col md:flex-row min-h-screen">
      {/* Pink section with image */}
      <div className="flex-1 bg-[#ffc2c2] p-8 md:p-16 flex flex-col items-center justify-center">
        <div className="max-w-[600px] w-full">
          <div className="aspect-[559/481] w-full relative mb-8">
            <Image
              src="/sustainable-city-with-nature-and-buildings.jpg"
              alt="Sustainable city illustration"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <p className="font-['JetBrains_Mono',monospace] text-[#e3160b] text-[18px] md:text-[20px] leading-relaxed text-center">
            For å utvikle samfunnet til en post-kapitalistisk fremtid må vi holde minst to tanker i hodet samtidig
          </p>
        </div>
      </div>

      {/* Red section with navigation and text */}
      <div className="flex-1 bg-[#e3160b] p-8 md:p-16 flex flex-col">
        <div className="mb-12">
          <DesktopNavigation activeItem={activeSection} />
        </div>
        <div className="flex-1 flex items-center">
          <p className="font-['JetBrains_Mono',monospace] text-white text-[16px] md:text-[18px] leading-relaxed max-w-[500px]">
            The aim of ROBUST is to contribute to reaching a resilient economy within planetary boundaries, ensuring a good life for all. The collective will promote this through activities like spreading information on degrowth practices, producing eco-solidarity-based economic analyses, showcasing regenerative economy examples, fostering artistic engagement, and participating in activism.
          </p>
        </div>
      </div>
    </section>
  );
}

// Content Section 2: Text (Red) + Image (Pink)
function ContentSection2({ activeSection }: { activeSection: string }) {
  return (
    <section id="prosjekter" className="flex flex-col md:flex-row min-h-screen">
      {/* Red section with navigation */}
      <div className="flex-1 bg-[#e3160b] p-8 md:p-16 flex flex-col">
        <div className="mb-12">
          <DesktopNavigation activeItem={activeSection} />
        </div>
        <div className="flex-1 flex items-center">
          <div className="max-w-[500px]">
            <p className="font-['JetBrains_Mono',monospace] text-white text-[16px] md:text-[18px] leading-relaxed mb-6">
              Vi er et kunnskapskollektiv som jobber for å spre kunnskap om et postvekst samfunn.
            </p>
            <p className="font-['JetBrains_Mono',monospace] text-white text-[16px] md:text-[18px] leading-relaxed mb-4">
              Våre tre retningsstyrere for dette arbeidet er:
            </p>
            <ul className="font-['JetBrains_Mono',monospace] text-white text-[16px] md:text-[18px] leading-relaxed space-y-3">
              <li>• Å forankre arbeidet akademisk og teoretisk i degrowth.</li>
              <li>• Å jobbe for økt forestillingsevne om en fremtid vi kan glede oss til</li>
              <li>• Å bruke kunst og kreativ formidling til å gjøre oss forstått</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pink section with image */}
      <div className="flex-1 bg-[#ffc2c2] p-8 md:p-16 flex flex-col items-center justify-center">
        <div className="max-w-[600px] w-full">
          <div className="aspect-[559/481] w-full relative mb-8">
            <Image
              src="/people-collaborating-in-community-garden.jpg"
              alt="Community collaboration"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <p className="font-['JetBrains_Mono',monospace] text-[#e3160b] text-[18px] md:text-[20px] leading-relaxed text-center">
            For å utvikle samfunnet til en post-kapitalistisk fremtid må vi ha flere tanker i hodet samtidig
          </p>
        </div>
      </div>
    </section>
  );
}

// Profile Card Component
function ProfileCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="w-20 h-20 bg-[#e3160b] rounded-full mb-4 mx-auto" />
      <h3 className="font-['JetBrains_Mono',monospace] font-bold text-[#e3160b] text-center text-lg mb-3">
        {name}
      </h3>
      <p className="font-['JetBrains_Mono',monospace] text-gray-700 text-sm leading-relaxed text-center">
        {description}
      </p>
    </div>
  );
}

// Team Section
function TeamSection({ activeSection }: { activeSection: string }) {
  const teamMembers = [
    { name: "Christina Lund", description: "Aula er en digital plattform som forenkler deltakelse i lokaldemokratiet. Innbyggere kan dele sine tanker og kunnskap når det passer dem." },
    { name: "Eline Mannino", description: "Aula er en digital plattform som gjør det lett å engasjere seg i lokaldemokratiet. Innbyggere kan bidra med innspill og kunnskap når det passer dem." },
    { name: "Thomas Røkås", description: "Aula er en digital plattform som gjør det enkelt å være med i lokaldemokratiet. Innbyggere kan dele sine meninger og kunnskap når det passer dem." },
    { name: "Sigrid Løvlie", description: "Aula er en digital plattform som gjør det lett å delta i lokaldemokratiet. Innbyggere kan dele innspill og kunnskap når det passer dem." },
    { name: "Anna Nordahl Carlsen", description: "Aula er en digital plattform som forenkler deltakelse i lokaldemokratiet. Innbyggere kan dele sine tanker og kunnskap når det passer dem." },
  ];

  return (
    <section id="i-media" className="flex flex-col md:flex-row min-h-screen">
      {/* Pink section with profiles */}
      <div className="flex-1 bg-[#ffc2c2] p-8 md:p-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
          {teamMembers.map((member, index) => (
            <ProfileCard key={index} name={member.name} description={member.description} />
          ))}
        </div>
      </div>

      {/* Red section with navigation */}
      <div className="w-full md:w-[300px] bg-[#e3160b] p-8 md:p-16 flex flex-col">
        <div className="mb-12">
          <DesktopNavigation activeItem={activeSection} />
        </div>
        <div className="flex-1 flex items-center">
          <div className="max-w-[500px]">
            <p className="font-['JetBrains_Mono',monospace] text-white text-[16px] md:text-[18px] leading-relaxed mb-6">
              Vi er et kunnskapskollektiv som jobber for å spre kunnskap om et postvekst samfunn.
            </p>
            <p className="font-['JetBrains_Mono',monospace] text-white text-[16px] md:text-[18px] leading-relaxed mb-4">
              Våre tre retningsstyrere for dette arbeidet er:
            </p>
            <ul className="font-['JetBrains_Mono',monospace] text-white text-[16px] md:text-[18px] leading-relaxed space-y-3">
              <li>• Å forankre arbeidet akademisk og teoretisk i degrowth.</li>
              <li>• Å jobbe for økt forestillingsevne om en fremtid vi kan glede oss til</li>
              <li>• Å bruke kunst og kreativ formidling til å gjøre oss forstått</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// Inspirational Background Section
function InspirationSection({ activeSection }: { activeSection: string }) {
  return (
    <section className="relative min-h-[400px] flex items-center justify-center bg-[#ffc2c2]">
      <div className="absolute inset-0">
        <Image
          src="/snail-shell-spiral-pattern-natural-background.jpg"
          alt="Snail shell pattern"
          fill
          className="object-cover opacity-30"
        />
      </div>
      <div className="relative z-10 max-w-[800px] mx-auto px-8 py-16 text-center">
        <p className="font-['JetBrains_Mono',monospace] text-[#e3160b] text-[20px] md:text-[24px] leading-relaxed mb-6 font-bold">
          Sneglhuset er perfekt konstruert for at sneglen skal kunne bære det med sin egen muskelkraft.
        </p>
        <p className="font-['JetBrains_Mono',monospace] text-[#e3160b] text-[16px] md:text-[18px] leading-relaxed">
          Gjennom de siste tiårene har det blitt et internasjonalt symbol for nedvekst-bevegelsen til inspirasjon for oss mennesker om å ikke bære mer enn det jorden vår - hjemmet vårt - klarer
        </p>
      </div>
    </section>
  );
}

// Footer Component
function Footer({ activeSection }: { activeSection: string }) {
  return (
    <footer id="kontakt" className="bg-[#e3160b] text-white py-12 px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex items-center gap-3">
          <Linkedin className="w-6 h-6" />
          <span className="font-['JetBrains_Mono',monospace] text-lg">
            Følg oss på LinkedIn
          </span>
        </div>
        <div className="font-['JetBrains_Mono',monospace] text-center md:text-right space-y-2">
          <p className="flex items-center gap-2 justify-center md:justify-end">
            <Mail className="w-5 h-5" />
            E-post: kontakt@foreningenrobust.no
          </p>
          <p>Org.nummer: 123 456 789</p>
        </div>
      </div>
    </footer>
  );
}

// Main Component
export default function ResponsiveSinglepage() {
  const [activeSection, setActiveSection] = useState("Om oss");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "om-oss", name: "Om oss" },
        { id: "prosjekter", name: "Prosjekter" },
        { id: "i-media", name: "I media" },
        { id: "kontakt", name: "Kontakt" }
      ];

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i].name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <BannerHeader />
      <main className="mt-[60px]">
        <ContentSection1 activeSection={activeSection} />
        <ContentSection2 activeSection={activeSection} />
        <TeamSection activeSection={activeSection} />
        <InspirationSection activeSection={activeSection} />
        <Footer activeSection={activeSection} />
      </main>
    </div>
  );
}
