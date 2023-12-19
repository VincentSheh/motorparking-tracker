import React, { useState } from "react";
import { Button, IconButton, Toolbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SecurityIcon from "@mui/icons-material/Security";
import ListIcon from "@mui/icons-material/List";
import ImageIcon from "@mui/icons-material/Image";
import AddParking from "./AddParking";
import IllegalParkers from "./IllegalParkers";
import ParkingList from "./ParkingList";
import Image from "./image";
import MenuIcon from "@mui/icons-material/Menu";

const AdminSidebar = () => {
  const [selectedTab, setSelectedTab] = useState("create");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabChange = (tabValue: string) => {
    setSelectedTab(tabValue);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <div className={`w-16 bg-gray-200 border-r border-black border-t-0 border-2`}>
      <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 1 , color: "black" }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
      </div>

      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-200 border-r border-black border-t-0 border-2 ${isSidebarOpen ? "" : "hidden"}`}
        style={{ boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="p-2">
          <div>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleTabChange("create")}
            >
              Add Parking Lot
            </Button>
          </div>
          <div>
            <Button
              startIcon={<SecurityIcon />}
              onClick={() => handleTabChange("password")}
            >
              See Illegally Parked Vehicle
            </Button>
          </div>
          <div>
            <Button
              startIcon={<ListIcon />}
              onClick={() => handleTabChange("parkings")}
            >
              Parking Lists
            </Button>
          </div>
          <div>
            <Button
              startIcon={<ImageIcon />}
              onClick={() => handleTabChange("image")}
            >
              Image
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-hidden">
        {selectedTab === "create" && <AddParking />}
        {selectedTab === "password" && <IllegalParkers />}
        {selectedTab === "parkings" && <ParkingList />}
        {selectedTab === "image" && (
          <Image folderPath="Illegal Parkings" alt="Latest Image"/>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
