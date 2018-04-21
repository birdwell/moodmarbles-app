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
}

export default Vector;