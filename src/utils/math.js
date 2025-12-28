export const v2 = {
  create_: (x, y) => ({ x, y }),
  copy_: (v) => ({ x: v.x, y: v.y }),
  add_: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
  sub_: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
  mul_: (v, s) => ({ x: v.x * s, y: v.y * s }),
  dot_: (a, b) => a.x * b.x + a.y * b.y,
  length_: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
  lengthSqr_: (v) => v.x * v.x + v.y * v.y,
  distance_: (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  distanceSqr_: (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  },
  normalize_: (v) => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    return len > 1e-6 ? { x: v.x / len, y: v.y / len } : { x: 0, y: 0 }; // Return zero vector if length is too small
  },
  normalizeUnsafe_: (v) => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    return { x: v.x / len, y: v.y / len };
  },
  perp_: (v) => ({ x: -v.y, y: v.x }),
  angle_: (v) => Math.atan2(v.y, v.x),
  
  // Normalize angle to [-PI, PI] range
  normalizeAngle_: (angle) => {
    let a = angle;
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  },
  
  // Shortest angle difference between two angles
  angleDiff_: (a, b) => {
    const diff = v2.normalizeAngle_(a - b);
    return Math.abs(diff);
  },
  
  // Lerp between two angles (takes shortest path)
  lerpAngle_: (a, b, t) => {
    let start = a;
    let end = b;
    const diff = v2.normalizeAngle_(end - start);
    return start + diff * t;
  },
  
  fromAngle_: (angle, length = 1) => ({
    x: Math.cos(angle) * length,
    y: Math.sin(angle) * length,
  }),
  lerp_: (a, b, t) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  }),
  reflect_: (v, normal) => {
    const d = 2 * v2.dot_(v, normal);
    return { x: v.x - d * normal.x, y: v.y - d * normal.y };
  },
  cross_: (a, b) => a.x * b.y - a.y * b.x,

  easeOutCubic_: (t) => 1 - (1 - t) ** 3,
  easeInOutQuad_: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutQuad_: (t) => t * (2 - t),
  clamp01_: (value) => Math.max(0, Math.min(1, value)),
  clamp_: (value, min, max) => Math.max(min, Math.min(max, value)),
  lerp_: (a, b, t) => a + (b - a) * t,
  
  // High-precision vector operations for ballistic calculations
  distanceTo_: (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  },
  
  distanceToSqr_: (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  },
  
  // Weighted average for smoother velocity estimation
  weightedAverage_: (values, weights) => {
    let sum = 0;
    let weightSum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i] * weights[i];
      weightSum += weights[i];
    }
    return weightSum > 0 ? sum / weightSum : 0;
  },
  
  // Vector weighted average
  weightedVectorAverage_: (vectors, weights) => {
    let sumX = 0, sumY = 0, weightSum = 0;
    for (let i = 0; i < vectors.length; i++) {
      sumX += vectors[i].x * weights[i];
      sumY += vectors[i].y * weights[i];
      weightSum += weights[i];
    }
    return weightSum > 0 ? { x: sumX / weightSum, y: sumY / weightSum } : { x: 0, y: 0 };
  },
  
  
  // Exponential smoothing for velocity estimation
  expSmooth_: (current, previous, alpha = 0.3) => {
    return current * alpha + previous * (1 - alpha);
  },
  
  // Catmull-Rom interpolation for smoother trajectories
  catmullRom_: (p0, p1, p2, p3, t) => {
    const t2 = t * t;
    const t3 = t2 * t;
    return 0.5 * (
      (2 * p1) +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3
    );
  },
  
  // Fast inverse square root for normalization

  // Vector projection (component of a in direction of b)
  project_: (a, b) => {
    const bLenSqr = v2.lengthSqr_(b);
    if (bLenSqr < 1e-6) return { x: 0, y: 0 };
    const scale = v2.dot_(a, b) / bLenSqr;
    return { x: b.x * scale, y: b.y * scale };
  },
  
  // Smoothstep interpolation (better than linear)
  smoothstep_: (t) => {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  },
  
  // Smoother-step interpolation (even smoother curve)
  smootherstep_: (t) => {
    t = Math.max(0, Math.min(1, t));
    return t * t * t * (t * (t * 6 - 15) + 10);
  },
  
  // Fast approximate inverse square root (for normalization)
  invSqrt_: (x) => {
    if (x < 1e-10) return 0;
    // Use Newton-Raphson for better precision without bit manipulation
    let y = 1 / Math.sqrt(x);
    return y * (1.5 - 0.5 * x * y * y);
  },
};

export const collisionHelpers = {
  intersectSegmentAABB_: (a, b, min, max) => {
    const dir = v2.sub_(b, a);
    
    // Avoid division by zero
    const invDir = {
      x: Math.abs(dir.x) > 0.0001 ? 1 / dir.x : 1e10,
      y: Math.abs(dir.y) > 0.0001 ? 1 / dir.y : 1e10,
    };

    const t1 = (min.x - a.x) * invDir.x;
    const t2 = (max.x - a.x) * invDir.x;
    const t3 = (min.y - a.y) * invDir.y;
    const t4 = (max.y - a.y) * invDir.y;

    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    if (tmax < 0 || tmin > tmax || tmin > 1) return null;

    const t = Math.max(0, Math.min(1, tmin));
    const point = v2.add_(a, v2.mul_(dir, t));

    const center = v2.mul_(v2.add_(min, max), 0.5);
    const extent = v2.mul_(v2.sub_(max, min), 0.5);
    const localPt = v2.sub_(point, center);

    let normal;
    const dx = Math.abs(Math.abs(localPt.x) - extent.x);
    const dy = Math.abs(Math.abs(localPt.y) - extent.y);

    if (dx < dy) {
      normal = { x: localPt.x > 0 ? 1 : -1, y: 0 };
    } else {
      normal = { x: 0, y: localPt.y > 0 ? 1 : -1 };
    }

    return { point, normal, t };
  },

  intersectSegmentCircle_: (a, b, pos, rad) => {
    const d = v2.sub_(b, a);
    const f = v2.sub_(a, pos);

    const aa = v2.dot_(d, d);
    const bb = 2 * v2.dot_(f, d);
    const c = v2.dot_(f, f) - rad * rad;

    let discriminant = bb * bb - 4 * aa * c;
    if (discriminant < 0) return null;

    discriminant = Math.sqrt(discriminant);
    const t1 = (-bb - discriminant) / (2 * aa);
    const t2 = (-bb + discriminant) / (2 * aa);

    let t = -1;
    if (t1 >= 0 && t1 <= 1) t = t1;
    else if (t2 >= 0 && t2 <= 1) t = t2;

    if (t < 0) return null;

    const point = v2.add_(a, v2.mul_(d, t));
    const normal = v2.normalize_(v2.sub_(point, pos));

    return { point, normal, t };
  },

  intersectSegment_: (collider, a, b) => {
    if (!collider) return null;

    if (collider.type === 1) {
      return collisionHelpers.intersectSegmentAABB_(a, b, collider.min, collider.max);
    } else if (collider.type === 0) {
      return collisionHelpers.intersectSegmentCircle_(a, b, collider.pos, collider.rad);
    }

    return null;
  },

  pointInCircle_: (point, center, radius) => {
    return v2.distanceSqr_(point, center) <= radius * radius;
  },

  pointInAABB_: (point, min, max) => {
    return point.x >= min.x && point.x <= max.x && point.y >= min.y && point.y <= max.y;
  },

  closestPointOnSegment_: (point, a, b) => {
    const ab = v2.sub_(b, a);
    const ap = v2.sub_(point, a);
    const abLenSqr = v2.lengthSqr_(ab);
    
    if (abLenSqr === 0) return a;
    
    const t = v2.clamp01_(v2.dot_(ap, ab) / abLenSqr);
    return v2.add_(a, v2.mul_(ab, t));
  },
};

export const sameLayer = (a, b) => {
  return (a & 0x1) === (b & 0x1) || (a & 0x2 && b & 0x2);
};

// Ballistic calculation helpers
export const ballistics = {
  // Solve for time when bullet reaches moving target
  // Returns time t where ||playerPos + bulletDir * vb * t - (targetPos + targetVel * t)|| = 0
  // Uses iterative approach for numerical stability
  predictLeadTime_: (playerPos, targetPos, targetVel, bulletSpeed, maxIterations = 4) => {
    let t = 0.016; // Start with one frame
    const maxTime = 5;
    
    for (let i = 0; i < maxIterations; i++) {
      // Predicted enemy position
      const px = targetPos.x + targetVel.x * t;
      const py = targetPos.y + targetVel.y * t;
      
      // Distance bullet needs to travel
      const dx = px - playerPos.x;
      const dy = py - playerPos.y;
      const distNeeded = Math.hypot(dx, dy);
      
      // New time for bullet to reach this position
      const tNew = distNeeded / bulletSpeed;
      
      // Check convergence
      if (Math.abs(tNew - t) < 0.0001) {
        return Math.max(0.001, Math.min(tNew, maxTime));
      }
      
      // Damped update for stability
      t = tNew * 0.6 + t * 0.4;
    }
    
    return Math.max(0.001, Math.min(t, maxTime));
  },
  
  // Calculate lead position with acceleration prediction
  predictPosition_: (targetPos, targetVel, targetAccel, bulletSpeed, playerPos) => {
    const t = ballistics.predictLeadTime_(playerPos, targetPos, targetVel, bulletSpeed);
    
    return {
      x: targetPos.x + targetVel.x * t + 0.5 * targetAccel.x * t * t,
      y: targetPos.y + targetVel.y * t + 0.5 * targetAccel.y * t * t,
    };
  },
  
  // Estimate acceleration from velocity history (3-sample linear regression)
  estimateAcceleration_: (velocityHistory) => {
    if (velocityHistory.length < 2) return { x: 0, y: 0 };
    
    let sumAccelX = 0, sumAccelY = 0, count = 0;
    const samples = Math.min(velocityHistory.length - 1, 6);
    const dt = 0.016; // Assume 60fps
    
    for (let i = 1; i < samples; i++) {
      const curr = velocityHistory[velocityHistory.length - i];
      const prev = velocityHistory[velocityHistory.length - i - 1];
      sumAccelX += (curr.x - prev.x) / dt;
      sumAccelY += (curr.y - prev.y) / dt;
      count++;
    }
    
    return count > 0 ? { x: sumAccelX / count, y: sumAccelY / count } : { x: 0, y: 0 };
  },
  
  // Filter velocity spikes from lag/teleportation
  isValidVelocity_: (newVel, prevVel, maxChangeRatio = 3) => {
    const newMag = Math.hypot(newVel.x, newVel.y);
    const prevMag = Math.hypot(prevVel.x, prevVel.y);
    
    // Skip if velocity is unreasonably high
    if (newMag > 2500) return false;
    
    // Skip if change is > 300% of previous magnitude
    if (prevMag > 0.1) {
      const changeMag = Math.hypot(newVel.x - prevVel.x, newVel.y - prevVel.y);
      const ratio = changeMag / (prevMag + 0.1);
      if (ratio > maxChangeRatio) return false;
    }
    
    return true;
  },
};
