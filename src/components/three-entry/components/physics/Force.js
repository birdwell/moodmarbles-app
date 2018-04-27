/** 
 * Represents a force applied to an object
 * 
 * Each force has a name, a vector,
 * and whether it is permanently applied
 * or an object should just be "touched"
 * by it
*/
class Force {
    constructor(name, vec, perm) {
        this.name = name;
        this.vec = vec;
        this.perm = perm;
    }
}

export default Force;