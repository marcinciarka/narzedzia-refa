export function TopBar() {
  return (
    <header className="relative z-10 h-20 w-full items-center bg-slate-700">
      <div className="relative mx-auto flex h-full flex-col justify-center px-3">
        <div className="relative flex w-full items-center pl-1 sm:ml-0 sm:pr-2">
          <div className="relative left-0 flex w-3/4">
            <div className="group relative flex h-full w-12 items-center">
              <button
                type="button"
                aria-expanded="false"
                aria-label="Toggle sidenav"
                onClick={void 0}
                className="text-4xl text-white focus:outline-none lg:hidden"
              >
                &#8801;
              </button>
            </div>
          </div>
          <div className="relative ml-5 flex w-full items-center justify-end p-1 sm:right-auto sm:mr-0">
            &nbsp;
          </div>
        </div>
      </div>
    </header>
  );
}
