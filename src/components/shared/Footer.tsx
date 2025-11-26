const Footer = () => (
  <footer className="border-t border-slate-200 dark:border-zinc-800">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-base text-zinc-500 dark:text-zinc-500">
        &copy; {new Date().getFullYear()} YOSA. All rights reserved.
      </p>
    </div>
  </footer>
);
export default Footer;