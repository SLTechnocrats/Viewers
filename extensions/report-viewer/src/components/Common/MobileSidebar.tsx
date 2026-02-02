import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { menus } from "@/shared/Sidebar";
import logo from "../../assets/images/logo.png";
import RefreshIcon from "@mui/icons-material/Refresh"; // Import the Refresh icon
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { store } from "@/store/store";
import { logOut } from "@/store/reducers/auth.slice";

interface Props {
  open: boolean;
  setOpen: (arg: boolean) => void;
}

export default function MobileSidebar({ open, setOpen }: Props) {
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleNavigation = (route: string) => {
    

    const url = `${route.toLowerCase()}`;
    navigate(url);
    setOpen(false);
  };

  const handleReload = () => {
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href; // Forces a hard reload by navigating to the current URL.
    setOpen(false); // Close the drawer after reloading
  };

  const DrawerList = (
    <Box sx={{ width: 250, backgroundColor: "#45197F", height: "100%" }} role="presentation">
      <img src={logo} width={80} className="rounded-md mx-auto my-5" />
      <List>
        {menus.map((item, index) => (
          <ListItem key={index} disablePadding className={item.visible ? "" : "!hidden"}>
            <ListItemButton onClick={() => handleNavigation(item.route)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText className="font-semibold text-white" primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

       <ListItem disablePadding>
          <ListItemButton onClick={()=>store.dispatch(logOut())}> {/* Reload the page on click */}
            <ListItemIcon>
              <LogoutIcon sx={{ color: "white" }} /> {/* Reload icon */}
            </ListItemIcon>
            <ListItemText className="font-semibold text-white" primary="Sign Out" />
          </ListItemButton>
        </ListItem>

        {/* Add the reload menu item at the end */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleReload}> {/* Reload the page on click */}
            <ListItemIcon>
              <RefreshIcon sx={{ color: "white" }} /> {/* Reload icon */}
            </ListItemIcon>
            <ListItemText className="font-semibold text-white" primary="Hard Reload" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="relative z-[99999999999]">
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
