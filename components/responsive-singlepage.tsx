"use client";

import { useState, useEffect } from "react";
import { Menu, X, Linkedin, Mail } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

// Banner Header Component
function BannerHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Om oss", href: "/om-oss" },
    { name: "Prosjekter", href: "/prosjekter" },
    { name: "I media", href: "/i-media" },
    { name: "Kontakt", href: "/kontakt" }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#e3160b]">
        <div className="h-[72px] flex items-center justify-between px-4 md:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-[#ffc2c2] transition-colors z-20 p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Title - centered on mobile */}
          <Link href="/" className="font-['JetBrains_Mono',monospace] font-bold text-white text-[18px] md:text-[24px] tracking-tight absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:ml-4 hover:text-[#ffc2c2] transition-colors">
            FORENINGEN ROBUST
          </Link>

          <Link href="/" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 md:ml-auto shrink-0">
            <Image
              src="/robust-logo.png"
              alt="ROBUST Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="fixed top-[72px] left-0 right-0 bg-[#e3160b] z-40 shadow-lg">
          <div className="flex flex-col py-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-[16px] py-4 px-6 hover:bg-[#c41309] transition-colors text-left font-['JetBrains_Mono',monospace]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}

function DesktopNavigation({ activeItem }: { activeItem: string }) {
  const navItems = [
    { name: "Om oss", href: "#om-oss" },
    { name: "Prosjekter", href: "#prosjekter" },
    { name: "I media", href: "#i-media" },
    { name: "Kontakt", href: "#kontakt" }
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="hidden md:flex flex-row gap-8 items-center">
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          className={`font-['JetBrains_Mono',monospace] text-white text-[16px] transition-all duration-300 hover:opacity-80 whitespace-nowrap relative ${
            activeItem === item.name
              ? "font-bold after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-4px] after:h-[2px] after:bg-white"
              : "font-normal"
          }`}
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
}

function DesktopHeader({ activeSection }: { activeSection: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#e3160b]">
      <div className="h-[72px] flex items-center justify-between px-6">
        <DesktopNavigation activeItem={activeSection} />
        
        <Link href="/" className="flex items-center justify-center w-12 h-12 shrink-0">
          <Image
            src="/robust-logo.png"
            alt="ROBUST Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </Link>
      </div>
    </header>
  );
}

function ContentSection1() {
  return (
    <section id="om-oss" className="flex flex-col md:flex-row min-h-screen">
      {/* Pink section - Left on desktop, equal width */}
      <div className="md:flex-none md:w-1/2 md:basis-1/2 md:max-w-[50%] bg-[#ffc2c2] flex flex-col">
        {/* Mobile layout */}
        <div className="md:hidden flex flex-col">
          <div className="px-6 py-12">
            <p className="font-['JetBrains_Mono',monospace] text-[#000000] text-[18px] leading-relaxed text-left">
              For å utvikle samfunnet til en post-kapitalistisk fremtid må vi holde minst to tanker i hodet samtidig
            </p>
          </div>
          
          <div className="w-full aspect-[3/4] relative">
            <Image
              src="/penguins.jpeg"
              alt="Two penguins together"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:p-16">
          <div className="max-w-[500px]">
            <p className="font-['JetBrains_Mono',monospace] text-[#000000] text-[18px] leading-relaxed mb-12 text-left">
              For å utvikle samfunnet til en post-kapitalistisk fremtid må vi holde minst to tanker i hodet samtidig
            </p>
            <div className="aspect-[3/4] w-full max-w-[400px] mx-auto relative">
              <Image
                src="/penguins.jpeg"
                alt="Two penguins together"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:flex-none md:w-1/2 md:basis-1/2 md:max-w-[50%] bg-[#e3160b] p-16 flex-col relative">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-['JetBrains_Mono',monospace] text-white text-[32px] leading-relaxed mb-8 font-bold">
            Vi er et kunnskapskollektiv som jobber for å spre kunnskap om et postvekst samfunn.
          </h2>
          <p className="font-['JetBrains_Mono',monospace] text-white text-[20px] leading-relaxed mb-6">
            Våre tre retningsstyrere for dette arbeidet er
          </p>
          <ul className="font-['JetBrains_Mono',monospace] text-white text-[18px] leading-relaxed space-y-4">
            <li>Å forankre arbeidet akademisk og teoretisk i degrowth.</li>
            <li>Å jobbe for økt forestillingsevne om en fremtid vi kan glede oss til</li>
            <li>Å bruke kunst og kreativ formidling til å gjøre oss forstått</li>
          </ul>
          
          <Link 
            href="/om-oss"
            className="mt-8 text-white font-['JetBrains_Mono',monospace] font-normal text-[18px] underline hover:opacity-80 transition-opacity w-fit"
          >
            Les mer
          </Link>
        </div>

        {/* Image in bottom right */}
        
      </div>
    </section>
  );
}

function ContentSection2() {
  return (
    <section id="prosjekter" className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:flex md:flex-none md:w-1/2 md:basis-1/2 md:max-w-[50%] bg-[#e3160b] p-16 flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-['JetBrains_Mono',monospace] text-white text-[32px] leading-relaxed mb-8 font-bold">
            Våre prosjekter
          </h2>
          <p className="font-['JetBrains_Mono',monospace] text-white text-[20px] leading-relaxed mb-6">
            Vi jobber aktivt med ulike prosjekter for å spre kunnskap om postvekst samfunn gjennom:
          </p>
          <ul className="font-['JetBrains_Mono',monospace] text-white text-[18px] leading-relaxed space-y-4">
            <li>Forskningsbasert analyse og formidling</li>
            <li>Kreative verksteder og arrangementer</li>
            <li>Samarbeid med organisasjoner og institusjoner</li>
          </ul>
          
          <Link 
            href="/prosjekter"
            className="mt-8 text-white font-['JetBrains_Mono',monospace] font-normal text-[18px] underline hover:opacity-80 transition-opacity w-fit"
          >
            Les mer
          </Link>
        </div>
      </div>

      {/* Pink section - Right on desktop, equal width */}
      <div className="hidden md:flex md:flex-none md:w-1/2 md:basis-1/2 md:max-w-[50%] bg-[#ffc2c2] p-16 flex-col items-center justify-center">
        <div className="max-w-[500px]">
          <p className="font-['JetBrains_Mono',monospace] text-[#000000] text-[18px] leading-relaxed mb-12 text-left">
            For å utvikle samfunnet til en post-kapitalistisk fremtid må vi ha flere tanker i hodet samtidig
          </p>
          <div className="aspect-square w-full max-w-[450px] mx-auto relative">
            <Image
              src="/white-shell.jpeg"
              alt="Shell on green background"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Profile Card Component
function ProfileCard({ name, description, hasPhoto }: { name: string; description: string; hasPhoto?: boolean }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {hasPhoto && (
        <div className="w-20 h-20 rounded-full mb-4 mx-auto overflow-hidden relative">
          <Image
            src="/profile-photo.png"
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h3 className="font-['JetBrains_Mono',monospace] font-bold text-[#e3160b] text-left text-lg mb-3">
        {name}
      </h3>
      <p className="font-['JetBrains_Mono',monospace] text-gray-700 text-sm leading-relaxed text-left">
        {description}
      </p>
    </div>
  );
}

function TeamSection() {
  const teamMembers = [
    { name: "Christina Lund", description: "Aula er en digital plattform som forenkler deltakelse i lokaldemokratiet. Innbyggere kan dele sine tanker og kunnskap når det passer dem.", hasPhoto: true },
    { name: "Eline Mannino", description: "Aula er en digital plattform som gjør det lett å engasjere seg i lokaldemokratiet. Innbyggere kan bidra med innspill og kunnskap når det passer dem." },
    { name: "Thomas Røkås", description: "Aula er en digital plattform som gjør det enkelt å være med i lokaldemokratiet. Innbyggere kan dele sine meninger og kunnskap når det passer dem." },
    { name: "Sigrid Løvlie", description: "Aula er en digital plattform som gjør det lett å delta i lokaldemokratiet. Innbyggere kan dele innspill og kunnskap når det passer dem." },
    { name: "Anna Nordahl Carlsen", description: "Aula er en digital plattform som forenkler deltakelse i lokaldemokratiet. Innbyggere kan dele sine tanker og kunnskap når det passer dem." },
  ];

  return (
    <section id="i-media" className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:flex md:flex-none md:w-1/2 md:basis-1/2 md:max-w-[50%] bg-[#e3160b] p-16 flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-['JetBrains_Mono',monospace] text-white text-[28px] leading-relaxed mb-8 font-bold">
            ROBUST i media
          </h2>
          <p className="font-['JetBrains_Mono',monospace] text-white text-[18px] leading-relaxed mb-6">
            Se hvor vi har vært omtalt og våre egne bidrag i mediebildet.
          </p>
          
          <Link 
            href="/i-media"
            className="mt-8 text-white font-['JetBrains_Mono',monospace] font-normal text-[18px] underline hover:opacity-80 transition-opacity w-fit"
          >
            Les mer
          </Link>
        </div>
      </div>

      {/* Pink section with profiles - Right on desktop, equal width */}
      <div className="md:flex-none md:w-1/2 md:basis-1/2 md:max-w-[50%] bg-[#ffc2c2] p-6 md:p-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-[1200px] mx-auto">
          {teamMembers.map((member, index) => (
            <ProfileCard key={index} name={member.name} description={member.description} hasPhoto={member.hasPhoto} />
          ))}
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
          src="/nautilus-shell.jpeg"
          alt="Nautilus shell cross-section"
          fill
          className="object-cover opacity-40"
        />
      </div>
      <div className="relative z-10 max-w-[800px] mx-auto px-8 py-16 text-left">
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
    <footer id="kontakt" className="bg-[#e3160b] text-white py-12 px-8 bg-[rgba(63,0,0,1)]">
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

export default function ResponsiveSinglepage() {
  const [activeSection, setActiveSection] = useState("Om oss");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      {isMobile ? <BannerHeader /> : <DesktopHeader activeSection={activeSection} />}
      <main className="mt-[72px]">
        <ContentSection1 />
        <ContentSection2 />
        <TeamSection />
        <InspirationSection activeSection={activeSection} />
        <Footer activeSection={activeSection} />
      </main>
    </div>
  );
}
