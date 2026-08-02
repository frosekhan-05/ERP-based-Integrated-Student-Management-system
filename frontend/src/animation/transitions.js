export const transitions = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
  smooth: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  },
  snappy: {
    type: "tween",
    ease: "easeOut",
    duration: 0.2,
  }
};
