import ProfileMenu from "@/components/ProfileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08090b]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <a
          href="/"
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[11px] font-black text-black transition-transform duration-200 group-hover:scale-105">
            S
          </div>

          <span className="text-[14px] font-semibold tracking-[-0.02em] text-white">
            Shortly
          </span>
        </a>

  

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden h-4 w-px bg-white/[0.08] sm:block" />

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
