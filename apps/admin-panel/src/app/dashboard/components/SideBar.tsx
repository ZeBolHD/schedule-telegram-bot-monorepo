"use client";

import Link from "next/link";

import useRoutes from "@/hooks/useRoutes";

const SideBar = () => {
  const routes = useRoutes();

  return (
    <aside className="w-1/6 py-10 px-5 border-r-2 border-zinc-700 box-border">
      <ul className="">
        {routes.map(({ label, href, icon: Icon, active }) => (
          <li
            className="
						w-full mt-2 first:mt-0 "
            key={label}
          >
            <Link
              href={href}
              className={`text-lg flex items-center rounded-md w-full py-4 px-5 transition duration-200
							${
                active
                  ? "text-black bg-white"
                  : "text-gray-400 hover:bg-gray-200 hover:text-black"
              }`}
            >
              <Icon size={18} className="" />
              <h3 className="ml-4">{label}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
