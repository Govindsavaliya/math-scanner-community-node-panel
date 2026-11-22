/** Single source of truth for every URL in the app. */
export const paths = {
  website: "/",
  websiteContact: "/contact-us",
  login: "/login",

  home: "/home",
  users: "/users",
  contactUsData: "/contact-us-data",
  adminUsers: "/admin-users",
  trash: "/trash",

  mathsCommunity: {
    list: "/maths-community",
    add: "/maths-community/add",
    view: (id = ":id") => `/maths-community/view/${id}`,
  },
};
