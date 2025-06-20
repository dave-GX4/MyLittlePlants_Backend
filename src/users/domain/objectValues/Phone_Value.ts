export class PhoneValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.validatePhoneNumber();
    }

    private validatePhoneNumber() {
        // Elimina espacios y verifica longitud
        const cleanNumber = this.value.replace(/ /g, "");
        
        if (cleanNumber.length !== 10 && cleanNumber.length !== 12) {
            throw new Error("El número debe tener 10 dígitos (sin espacios) o 12 (con espacios).");
        }
        
        // Verifica que solo contenga números y posiblemente un "+"
        const digitsOnlyRegex = /^\+?\d+$/;
        if (!digitsOnlyRegex.test(cleanNumber)) {
            throw new Error("Solo se permiten números y un '+' opcional.");
        }
    }
}