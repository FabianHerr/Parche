import NavLogo from "@/app/components/NavLogo";
import ProfileMenu from "@/app/components/ProfileMenu";
import CreateEventButton from "@/app/components/CreateEventButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-neutral-950/80 backdrop-blur-md">
      <div className="w-full h-14 px-4 sm:px-5 lg:px-8 flex items-center justify-between">
        <NavLogo />

        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-neutral-400"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <CreateEventButton />

          <div className="w-px h-4 bg-white/10" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
