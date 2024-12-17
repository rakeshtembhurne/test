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
      {
        href: "/admin/managers",
        icon: "manager",
        title: "Managers",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/users",
        icon: "users",
        title: "Users",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/games",
        icon: "game",
        title: "Games",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/charts",
        icon: "lineChart",
        title: "Charts",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/points`",
        icon: "points",
        title: "Points",
        authorizeOnly: UserRole.ADMIN,
      },

      {
        href: "/manager",
        icon: "laptop",
        title: "Manager Panel",
        authorizeOnly: UserRole.MANAGER,
      },
      {
        href: "/manager/users",
        icon: "users",
        title: "Users",
        authorizeOnly: UserRole.MANAGER,
      },
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
