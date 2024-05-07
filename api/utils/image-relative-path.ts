export const imageRelativePath = (imagePath: string) => {
  return `images/${imagePath.substring(imagePath.lastIndexOf("\\") + 1)}`;
};
