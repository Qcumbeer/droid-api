export const generateNumbers = (): number[] => {
  // Sum of those numbers should be in range [0, 100]
  const first = Math.ceil(Math.random() * 100);
  const second = Math.ceil(Math.random() * (100 - first));

  return [first, second];
};
