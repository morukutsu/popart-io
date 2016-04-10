export default class MUX {
    constructor(A, B, reference, selectorVariableName) {
        this.A = A;
        this.B = B;
        this.reference = reference;
        this.selectorVariableName = selectorVariableName;
    }

    set(value) {
        // No op
    }

    read() {
        return this.reference[this.selectorVariableName] ? this.A.read() : this.B.read();
    }
}
