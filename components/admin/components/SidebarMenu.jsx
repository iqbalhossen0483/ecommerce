import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { AiOutlineLine } from "react-icons/ai";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

export const menuAnimation = {
  hidden: {
    opacity: 0,
    height: 0,
    padding: 0,
    transition: { duration: 0.3, when: "afterChildren" },
  },
  show: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      when: "beforeChildren",
    },
  },
};

const SidebarMenu = ({ route, showAnimation, isOpen, setIsOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsMenuOpen(false);
    }
  }, [isOpen]);

  return (
    <>
      <div
        className={`menu ${
          route.highlight.includes(router.pathname)
            ? "active text-white"
            : "text-[#adb5bd]"
        }`}
        onClick={toggleMenu}
      >
        <div className={`menu_item `}>
          <div className="text-xl">{route.icon}</div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={`link_text`}
              >
                {route.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isOpen && (
          <motion.div>
            {!isMenuOpen ? <FaAngleDown /> : <FaAngleUp />}
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="menu_container"
          >
            {route.subRoutes.map((subRoute, i) => (
              <motion.div key={i} custom={i}>
                <Link
                  onClick={() => setIsOpen(false)}
                  href={subRoute.path}
                  className={`link ${
                    router.pathname === subRoute.path ? "active" : ""
                  }`}
                >
                  <div className="icon">
                    <AiOutlineLine />
                  </div>
                  <motion.div className="link_text">{subRoute.name}</motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMenu;
