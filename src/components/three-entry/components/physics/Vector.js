
import math from 'mathjs';

/** 
 * Represents a generic 3D vector
*/
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Get the magnitude
    getMagnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    // Scale the vector by a constant
    scale(delta) {
        this.x *= delta;
        this.y *= delta;
        this.z *= delta;
    }

    // Add this vector to another one
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    // Return the vector as an array
    asArray() {
        return [this.x, this.y, this.z];
    }

    // Normalize the vector to its magnitude
    normalize() {
        const results = new Vector(this.x, this.y, this.z);
        results.x /= this.getMagnitude();
        results.y /= this.getMagnitude();
        results.z /= this.getMagnitude();
        return results;
    }

    // Check if it is the zero vector
    isZero() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    // Force this vector to the zero vector
    becomeZero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    // Subtract two vectors and return the result
    static subtract(to, from) {
        const results = new Vector(0, 0, 0);
        results.x = from.x - to.x;
        results.y = from.y - to.y;
        results.z = from.z - to.z;
        return results;
    }

    // Cross product of two vectors
    static cross(one, two) {
        const oneA = one.asArray();
        const twoA = two.asArray();
        const result = math.cross(oneA, twoA);
        return new Vector(result[0], result[1], result[2]);
    }

    // Dot product of two vectors
    static dot(one, two) {
        const x = one.x * two.x;
        const y = one.y * two.y;
        const z = one.z * two.z;
        return x + y + z;
    }
}

export default Vector;
