export const NavbarLinks = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Catalog",
    // path: '/catalog',
  },
  {
    title: "Explore",
    // No direct path as this will be a dropdown
    dropdown: true,
    links: [
      {
        title: "Learning Paths",
        path: "/learning-paths",
        description: "Follow structured learning journeys designed by experts",
        icon: "path",
      },
      {
        title: "Code Playground",
        path: "/code-playground",
        description:
          "Practice coding in an interactive environment with real-time execution",
        icon: "code",
      },
      {
        title: "AI Study Assistant",
        path: "/ai-chat",
        description:
          "Get personalized help with your studies from our AI assistant",
        icon: "ai",
      },
      {
        title: "LeetCode Practice",
        path: "/leetcode",
        description:
          "Practice coding problems and track your progress with LeetCode integration",
        icon: "leetcode",
      },
      {
        title: "CSS Flexbox Game",
        path: "/fruitbox-flex",
        description:
          "Master CSS Flexbox layout with our interactive fruit-themed game",
        icon: "game",
      },
    ],
  },
  {
    title: "About Us",
    path: "/about",
  },
  {
    title: "Contact Us",
    path: "/contact",
  },
];
