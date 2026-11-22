export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.math.photo.scanner.equation.formula.calculator";
export const APP_STORE_URL =
  "https://apps.apple.com/us/app/ai-math-scanner-maths-solver/id6503691239";

/** In-page sections the header links scroll to (also the observed sections). */
export const NAV_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "screens", label: "Screens" },
  { id: "howitworks", label: "How to Use" },
  { id: "reviews", label: "Reviews" },
];

export const screenSlides = [1, 2, 3, 4, 5, 6, 7].map((id) => ({
  id,
  img: `/screen/${id}.png`,
  alt: "Awesome Interface",
}));

export const stepSlides = [
  {
    id: 1,
    img: "/screen/1.png",
    title: "Scan and Solve",
    description:
      "Just snap a picture of your equation, and get a solution within seconds. AI Math Scanner covers all types of math, from algebra to calculus.",
  },
  {
    id: 2,
    img: "/screen/3.png",
    title: "Use the Keyboard for Equations",
    description:
      "Type your math problems into AI Math Scanner and get detailed, step-by-step solutions instantly, making complex equations easy to solve.",
  },
  {
    id: 3,
    img: "/screen/4.png",
    title: "Enhance Learning",
    description:
      "Access a range of educational tools like flashcards, math symbols, and more. Practice math concepts through fun and interactive games.",
  },
  {
    id: 4,
    img: "/screen/3.png",
    title: "Visual Learning",
    description:
      "See math in a new light with graphing and tables, helping you better understand complex concepts.",
  },
  {
    id: 5,
    img: "/screen/5.png",
    title: "Practice Logical Games",
    description:
      "Sharpen your problem-solving skills with interactive puzzles in AI Math Scanner, designed to challenge your thinking and boost your logic.",
  },
];

export const features = [
  {
    id: 1,
    img: "/features/1.svg",
    alt: "Calculator",
    title: "Calculator",
    description:
      "Visualize math problems using advanced graphs and tables in AI Math Scanner, simplifying complex calculations.",
  },
  {
    id: 2,
    img: "/features/2.svg",
    alt: "Convertor",
    title: "Convertor",
    description:
      "Quickly convert units, currencies, and more with AI Math Scanner's easy-to-use converter for instant results.",
  },
  {
    id: 3,
    img: "/features/3.svg",
    alt: "Maths Formula",
    title: "Maths Formula",
    description:
      "Access a wide range of advanced math formulas in AI Math Scanner to solve problems quickly and efficiently.",
  },
  {
    id: 4,
    img: "/features/4.svg",
    alt: "Math Table",
    title: "Math Table",
    description:
      "Use interactive math tables in AI Math Scanner to make calculations, and math concepts clearer and more memorable.",
  },
  {
    id: 5,
    img: "/features/5.svg",
    alt: "Geometry",
    title: "Geometry",
    description:
      "Explore geometry problems and solutions with AI Math Scanner's tools for precise calculations and visualizations.",
  },
  {
    id: 6,
    img: "/features/6.svg",
    alt: "Calculations",
    title: "Calculations",
    description:
      "Perform quick and precise mathematical calculations with AI Math Scanner, ensuring fast accurate results for any math problem.",
  },
];

export const steps = [
  {
    id: 1,
    number: "01",
    title: "Instant Solutions",
    description:
      "Get accurate math solutions instantly by simply scanning or typing your problem. No more frustration with complex calculations. AI Math Scanner makes learning math effortless, providing fast answers to help you progress quickly.",
  },
  {
    id: 2,
    number: "02",
    title: "Comprehensive Learning",
    description:
      "AI Math Scanner is more than just a problem solver. It provides access to essential formulas, math symbols, and interactive games that make mastering math concepts both enjoyable and effective for learners of all levels.",
  },
  {
    id: 3,
    number: "03",
    title: "Advanced Smart Learning",
    description:
      "Visualize math problems like never before with AI Math Scanner! Use graphing, tables, and step-by-step breakdowns to gain a deeper understanding and better retention of complex concepts, making learning smarter and easier.",
  },
];

export const reviews = [
  {
    id: 1,
    rating: 5,
    title: "Essential Tool for Students!",
    description:
      "This app has been a game-changer for my algebra and calculus. The step-by-step solutions really helped me understand complex concepts. Highly recommend it for anyone struggling with math! It's like having a personal tutor in your pocket.",
    userImg: "/review/1.png",
    userName: "Emily Turner",
    date: "06 Nov 2024",
  },
  {
    id: 2,
    rating: 5,
    title: "Perfect for Teachers and Parents",
    description:
      "I use it to help my students with their homework. The explanations are clear, and they love the instant solutions. It's a perfect tool for reinforcing math lessons and providing extra support! A must-have resource for every teacher and parent.",
    userImg: "/review/2.png",
    userName: "David Johnson",
    date: "15 Oct 2024",
  },
  {
    id: 3,
    rating: 5,
    title: "Made Calculus So Much Easier!",
    description:
      "I struggled with calculus before, but this app makes everything so much easier. Snap a photo of the problem, and I get detailed solutions instantly. It's a lifesaver for tackling complex math! It's truly a game-changer for calculus learners.",
    userImg: "/review/3.png",
    userName: "Jane Cooper",
    date: "04 July 2024",
  },
];
