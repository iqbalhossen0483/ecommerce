import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import useStore from "../../context/useStore";
import { AiOutlineLogout } from "react-icons/ai";

const Header = ({ isOpen }) => {
  const [showController, setShowController] = useState(false);
  const store = useStore();
  const showAnimation = {
    hidden: {
      heigth: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      heigth: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  function singOut() {
    setShowController(false);
    store.setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <motion.div
      className="admin-header"
      animate={{
        paddingLeft: isOpen ? "260px" : "80px",
        transition: {
          duration: 0.5,
        },
      }}
    >
      <div className="header-wrapper">
        <div className="relative hidden md:block">
          <input type="text" placeholder="Search" />
          <div className="search-bar">
            <FaSearch />
          </div>
        </div>
        <div
          onClick={() => setShowController((prev) => !prev)}
          className="user-wrapper"
        >
          <p className="text-gray-500">{store.user?.name}</p>
          <div className="relative">
            <img
              className="h-10 w-10 rounded-full"
              src={
                store.user?.image
                  ? `/assets/${store.user.profile}`
                  : "/user.png"
              }
              alt=""
            />
            <div className="active-sign"></div>
          </div>
          <AnimatePresence>
            {showController && (
              <motion.div
                className="user-controller-wrapper"
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                <button
                  onClick={singOut}
                  className="btn w-full flex gap-1 items-center"
                >
                  <AiOutlineLogout /> <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
