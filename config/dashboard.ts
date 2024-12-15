import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      // {
      //   href: "/dashboard/billing",
      //   icon: "billing",
      //   title: "Billing",
      //   authorizeOnly: UserRole.USER,
      // },
      {
        href: "/charts",
        icon: "lineChart",
        title: "Charts",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/games",
        icon: "game",
        title: "Games",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/points",
        icon: "points",
        title: "Points",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/admin/managers",
        icon: "manager",
        title: "Managers",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/games",
        icon: "game",
        title: "Games",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/users",
        icon: "users",
        title: "Users",
        // badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      // {
      //   href: "#/dashboard/posts",
      //   icon: "post",
      //   title: "User Posts",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      // { href: "/", icon: "home", title: "Homepage" },
      // { href: "/docs", icon: "bookOpen", title: "Documentation" },
      // {
      //   href: "#",
      //   icon: "messages",
      //   title: "Support",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
    ],
  },
];
