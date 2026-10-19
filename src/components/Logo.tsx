export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
        <circle cx="20" cy="20" r="19" fill={light ? '#fff' : '#14502B'} />
        <path d="M12 9c6-1 10 2 10 6-5 .5-9-1-10-6Z" fill="#7CC94B" />
        <path d="M13 17h14l-9 10h10" fill="none" stroke={light ? '#14502B' : '#fff'} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`font-display text-xl font-black leading-none ${light ? 'text-white' : 'text-forest-900'}`}>
        Zee&rsquo;s <span className="text-leaf-600">Kitchen</span>
      </span>
    </span>
  );
}
