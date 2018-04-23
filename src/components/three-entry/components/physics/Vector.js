
import math from 'mathjs';

class Vector {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.magnitude
    }

    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    scale(delta) {
        this.x *= delta;
        this.y *= delta;
        this.z *= delta;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    asArray () {
        return [this.x, this.y, this.z];
    }

    normalize() {
        var results = new Vector(this.x, this.y, this.z);
        results.x /= this.getMagnitude();
        results.y /= this.getMagnitude();
        results.z /= this.getMagnitude();
        return results;
    }

    becomeZero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    static subtract(to, from) {
        const results = new Vector(0, 0, 0);
        results.x = from.x - to.x;
        results.y = from.y - to.y;
        results.x = from.z - to.z;
        return results;
    }

    static cross(one, two) {
        const oneA = one.asArray();
        const twoA = two.asArray();
        const result = math.cross(oneA, twoA);
        return new Vector(result[0], result[1], result[2]);
    }

    static dot(one, two) {
        const x = one.x * two.x;
        const y = one.y * two.y;
        const z = one.z * two.z;
        return x + y + z;
    }
}

export default Vector;