import React, { Fragment, useEffect } from "react";
import profileIcon from "@/assets/images/avatar.jpg";

import useDispatchAction from "@/hooks/useDispatchAction";
import { logOut } from "@/store/reducers/auth.slice";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import useNotification from "@/hooks/useNotification";
import classNames from "classnames";
import { IoNotifications } from "react-icons/io5";
import NotificationModal from "./Notification/NotificationModal";
import useSocket from "@/hooks/useSocket";
const userNavigation = [
  { name: "Profile", route: "profile" },
  { name: "Sign out", route: "logout" },
];

const NavMenus: React.FC = () => {
  const { notificationModal, onClose, openNotificationModal, getNotifications, notifications } = useNotification();
  const dispatch = useDispatchAction();
  const socket = useSocket()
  const navigate = useNavigate();


  const onPressMenu = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    route: string,
  ) => {
    e.preventDefault();
    
    if (route === "logout") {
      dispatch(logOut());
    } else {
      navigate(`/${route}`);
    }
  };

  useEffect(() => {
    getNotifications(notifications);
  }, []);


  


  useEffect(() => {
    if (socket) {
      socket.connect();
      socket.on("report-chat", () => {
           getNotifications(notifications)
      });
      return () => {
        socket.off();
        socket.disconnect();
      };
    }
  }, [socket, notificationModal]);



  return (
    <div className="w-[10%]  lg:w-[5%] flex items-center gap-x-4">
      <div
        onClick={openNotificationModal}
        className="relative cursor-pointer">
        <div
          className={classNames(
            "w-2 h-2 rounded-full bg-red-500 absolute right-0 animate-pulse text-center",
            notifications.length < 1 && "hidden",
          )}></div>
        <IoNotifications size={24} className="fill-gray-500" />
      </div>
      <Menu as="div" className="relative flex items-center ">
        <div>

          <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            <img className="h-8 w-8 rounded-full" src={profileIcon} alt="" />
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {userNavigation.map((item) => (
              <MenuItem key={item.name}>
                <a
                  href="#"
                  onClick={(e) => onPressMenu(e, item.route)}
                  className="bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                >
                  {item.name}
                </a>
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
      {notificationModal && (
        <NotificationModal open={notificationModal} onClose={onClose} />
      )}
    </div>
  );
};

export default NavMenus;
