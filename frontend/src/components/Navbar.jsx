function Navbar() {
  return (
    <div
      className="navbar fixed top-0 z-50 bg-transparent drop-shadow-3xl w-full h-20 rounded-t-3xl
                 flex items-center px-6"
      style={{ backdropFilter: "blur(4px)" }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <img 
          src="/NerdDocs.png"
          alt="Logo"
          className="h-14 w-auto object-contain"
        />

        <h1 className="text-2xl font-semibold tracking-wide select-none">
          <span className="text-orange-500">N</span>
          <span className="text-white">erd</span>
          <span className="text-orange-500">D</span>
          <span className="text-white">ocs</span>
        </h1>

      </div>
    </div>
  );
}

export default Navbar;
