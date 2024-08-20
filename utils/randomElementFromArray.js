function getRandomElementsFromArray(arr, count) {
  // Create a copy of the original array to avoid modifying it
  const copyArray = arr.slice();

  // Check if the requested count is greater than the array length
  if (count > copyArray.length) {
    console.log("Error: Requested count exceeds array length.");
    return [];
  }

  const randomElements = [];
  for (let i = 0; i < count; i++) {
    // Generate a random index within the current array length
    const randomIndex = Math.floor(Math.random() * copyArray.length);

    // Retrieve the element at the random index and remove it from the array
    const randomElement = copyArray.splice(randomIndex, 1)[0];

    // Add the random element to the result array
    randomElements.push(randomElement);
  }

  return randomElements;
}

module.exports = getRandomElementsFromArray;
