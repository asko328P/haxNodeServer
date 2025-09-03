export const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

export function angle(cx: number, cy: number, ex: number, ey: number) {
  let dy = ey - cy;
  let dx = ex - cx;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  // if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

type Point = {
  x: number;
  y: number;
};

export function checkIntersection(
  p1: Point,
  angle: number,
  p3: Point,
  p4: Point,
) {
  const x1 = p1.x;
  const y1 = p1.y;
  const x3 = p3.x;
  const y3 = p3.y;
  const x4 = p4.x;
  const y4 = p4.y;

  const m1 = Math.tan(angle); // Slope of the ray
  const m2 = (y4 - y3) / (x4 - x3); // Slope of the segment

  // Handle parallel lines
  if (m1 === m2) {
    // They are parallel or collinear. If collinear, check if ray overlaps segment.
    // For simplicity, assuming distinct parallel lines don't intersect.
    return null;
  }

  // Calculate intersection point
  const intersectX = (y3 - y1 + m1 * x1 - m2 * x3) / (m1 - m2);
  const intersectY = m1 * (intersectX - x1) + y1;

  console.log("intersect", intersectX, " ", intersectY);

  // Check if intersection point is on the line segment
  const onSegment =
    intersectX >= Math.min(x3, x4) &&
    intersectX <= Math.max(x3, x4) &&
    intersectY >= Math.min(y3, y4) &&
    intersectY <= Math.max(y3, y4);

  // Check if intersection point is in the direction of the ray
  const dx = intersectX - x1;
  const dy = intersectY - y1;
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);

  // Check if the sign of dx and dy matches the sign of cos(angle) and sin(angle)
  const inRayDirection =
    (Math.sign(dx) === Math.sign(cosAngle) || Math.abs(cosAngle) < 0.0001) &&
    (Math.sign(dy) === Math.sign(sinAngle) || Math.abs(sinAngle) < 0.0001);

  if (onSegment && inRayDirection) {
    return { x: intersectX, y: intersectY };
  } else {
    return null;
  }
}

export function rayIntersectsSegment(
  rayOrigin: Point,
  rayAngle: number,
  segmentP1: Point,
  segmentP2: Point,
) {
  // Ray direction vector
  const d = {
    x: Math.cos(rayAngle),
    y: Math.sin(rayAngle),
  };
  // Segment vector
  const s = {
    x: segmentP2.x - segmentP1.x,
    y: segmentP2.y - segmentP1.y,
  };

  const denominator = d.x * s.y - d.y * s.x;

  // Parallel lines check
  if (Math.abs(denominator) < 1e-9) {
    return null;
  }

  const p1ToOrigin = {
    x: segmentP1.x - rayOrigin.x,
    y: segmentP1.y - rayOrigin.y,
  };

  const t = (p1ToOrigin.x * s.y - p1ToOrigin.y * s.x) / denominator;
  const u = -(d.x * p1ToOrigin.y - d.y * p1ToOrigin.x) / denominator;

  if (t >= 0 && u >= 0 && u <= 1) {
    return {
      point: {
        x: rayOrigin.x + t * d.x,
        y: rayOrigin.y + t * d.y,
      },
      t: t,
      u: u,
    };
  }

  return { t, u }; // Return params even if no intersection
}
