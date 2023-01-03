import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "../components/SidebarMenu";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";

const Menus = ({ menus, setIsOpen, showAnimation, isOpen }) => {
  const router = useRouter();

  return (
    <>
      {menus.map((route, index) => {
        if (route.subRoutes) {
          return (
            <SidebarMenu
              key={index}
              setIsOpen={setIsOpen}
              route={route}
              showAnimation={showAnimation}
              isOpen={isOpen}
            />
          );
        }

        return (
          <Link
            href={route.path}
            key={index}
            className={`link ml-[2px] ${
              router.pathname === route.path ? "active" : ""
            }`}
          >
            <div className="text-xl">{route.icon}</div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="link_text"
                >
                  {route.name}
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </>
  );
};

export default Menus;
