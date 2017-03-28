export const add = function (a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

export const subtract = function (a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

export const multiply = function (a, b) {
  return {
    x: a.x * b.x,
    y: a.y * b.y
  };
}

export const multiplyScalar = function (a, scalar) {
  return {
    x: a.x * scalar,
    y: a.y * scalar
  };
}

export const divide = function (a, b) {
  return {
    x: a.x / b.x,
    y: a.y / b.y
  };
}

export const divideScalar = function (a, scalar) {
  return {
    x: a.x / scalar,
    y: a.y / scalar
  };
}

export const length = function (a) {
  return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
}

export const normalize = function (a) {
  return divideScalar(a, length(a))
}