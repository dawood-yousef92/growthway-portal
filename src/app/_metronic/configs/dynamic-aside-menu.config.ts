export const DynamicAsideMenuConfig = {
  items: [
    {
      title: "Dashboard",
      root: true,
      icon: "flaticon2-architecture-and-city",
      svg: "./assets/media/svg/icons/Design/Layers.svg",
      page: "/dashboard",
      translate: "MENU.DASHBOARD",
      bullet: "dot",
      permission: "noPermission",
    },
    {
      title: "Users",
      root: true,
      svg: "./assets/media/svg/icons/General/User.svg",
      bullet: "dot",
      translate: "MENU.USERS",
      page: "/users",
      permission: "Users.",
    },
    // {
    //   title: "Customers",
    //   root: true,
    //   translate: "MENU.CUSTOMERS",
    //   svg: "./assets/media/svg/icons/General/User.svg",
    //   bullet: "dot",
    //   submenu: [
    //     {
    //       title: "List of Customers",
    //       translate: "MENU.CUSTOMERS_LIST",
    //       page: "/customers/customers-list",
    //     },
    //     {
    //       title: "Classifications",
    //       translate: "MENU.CLASSIFICATIONS",
    //       page: "/customers/classifications",
    //     },
    //   ],
    // },
    {
      title: "Groups",
      root: true,
      svg: "./assets/media/svg/icons/General/Lock.svg",
      bullet: "dot",
      translate: "MENU.ROLS",
      page: "/rols",
      permission: "Roles.",
    },
    {
      title: "Items",
      root: true,
      svg: "./assets/media/svg/icons/Shopping/Bag1.svg",
      bullet: "dot",
      translate: "MENU.ITEMS",
      page: "/items",
      permission: "Products.",
    },
    // {
    //   title: "Services",
    //   root: true,
    //   svg: "./assets/media/svg/icons/Shopping/Bag1.svg",
    //   bullet: "dot",
    //   translate: "MENU.SERVICES",
    //   page: "/services",
    //   permission: "noPermission",
    // },
    {
      title: "Branches",
      root: true,
      svg: "./assets/media/svg/icons/Map/Marker1.svg",
      bullet: "dot",
      translate: "MENU.BRANCHES",
      page: "/branches",
      permission: "Branches.",
    },
    {
      title: "Customers",
      root: true,
      svg: "./assets/media/svg/icons/Communication/Group.svg",
      bullet: "dot",
      translate: "MENU.CUSTOMERS",
      page: "/customers",
      permission: "Customers.",
    },
    {
      title: "Orders",
      root: true,
      svg: "./assets/media/svg/icons/Shopping/Box2.svg",
      bullet: "dot",
      translate: "MENU.ORDERS",
      page: "/orders",
      permission: "Orders.",
    },
    {
      title: "Settings",
      root: true,
      svg: "./assets/media/svg/icons/General/Settings-2.svg",
      bullet: "dot",
      translate: "MENU.SETTINGS",
      page: "/settings",
      permission: "AppSettings.",
    },
  ],
};
