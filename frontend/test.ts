// Unused variable, bad formatting, and lint errors
let unusedVar = 42;

function addNumbers(a: number, b: number): number {
  return a + b;
}

// Line too long for most linters
const veryLongString =
  "This is a very long string that should trigger a line length warning from most TypeScript linters and formatters because it exceeds the default limit.";

// Missing semicolon, extra spaces, and unused function
function foo() {
  console.log("Hello world");
}

addNumbers(1, 2);
