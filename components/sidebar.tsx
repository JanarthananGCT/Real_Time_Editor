"use client";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusIcon, EditIcon } from "lucide-react";
import { NavUser } from "./nav-user";
import { Input } from "@/components/ui/input";

export function AppSidebar({
  displayName,
  email,
  docs,
  photoURL,
  setGlobalItem,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  displayName: string | null;
  email: string | null;
  docs: any;
  setGlobalItem: any;
  photoURL: string | null;
}) {
  const [data, setData] = React.useState({
    navMain: [
      {
        title: "My Documents",
        items: docs,
      },
    ],
    user: {
      name: displayName,
      email: email,
      avatar: photoURL,
    },
  });

  const [editingItem, setEditingItem] = React.useState<{
    id: string | null;
    title: string;
  }>({ id: null, title: "" });
  const [currentItem, setCurrentItem] = React.useState<string | null>(null);

  const editingRef = React.useRef<HTMLDivElement | null>(null);

  const handleNewDoc = () => {
    setData({
      ...data,
      navMain: [
        {
          ...data.navMain[0],
          items: [
            ...data.navMain[0].items,
            {
              id: uuidv4(),
              title: "Untitled Doc",
              isActive: false,
              content: {}
            },
          ],
        },
      ],
    });
  };

  const handleEditClick = (id: string, currentTitle: string) => {
    setEditingItem({ id, title: currentTitle });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingItem((prev) => ({ ...prev, title: event.target.value }));
  };

  const handleSaveTitle = () => {
    if (editingItem.id) {
      setData((prevData) => {
        const updatedNavMain = prevData.navMain.map((nav) => ({
          ...nav,
          items: nav.items.map((item: any) =>
            item.id === editingItem.id
              ? { ...item, title: editingItem.title }
              : item
          ),
        }));
        return { ...prevData, navMain: updatedNavMain };
      });
      setEditingItem({ id: null, title: "" });
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveTitle(); 
    }
  
  }
  React.useEffect(() => {
    setGlobalItem(data.navMain[0].items[0])
    const handleClickOutside = (event: MouseEvent) => {
      if (editingRef.current && !editingRef.current.contains(event.target as Node)) {
        if (editingItem.id) {
          setEditingItem({ id: null, title: "" });
        }
      }
    };


    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.title}</p>
                      <Button variant="ghost" size="icon" onClick={handleNewDoc}>
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((item: any) => (
                        <div className="py-1" key={item.id}>
                          <SidebarMenuSubItem onMouseOver={() => setCurrentItem(item.id)}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                              onClick={()=> setGlobalItem(item)}
                            >
                              <div
                                className="w-[100%] flex justify-between items-center"
                                ref={editingItem.id === item.id ? editingRef : null}
                              >
                                {editingItem.id === item.id ? (
                                  <Input
                                    type="text"
                                    value={editingItem.title}
                                    onChange={handleTitleChange}
                                    onKeyDown={handleKeyDown}
                                    className="font-medium p-1 border h-6 border-gray-200 rounded"
                                  />
                                ) : (
                                  <p className="font-medium cursor-pointer truncate ">
                                    {item.title}
                                  </p>
                                )}
                                {currentItem === item.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(item.id, item.title)}
                                >
                                  <EditIcon className="w-2 h-2" />
                                </Button>
                                )}
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </div>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
