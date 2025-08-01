const VALID_ROLES = ["Usuario", "Vendedor"];

export class RoleValue {
    readonly value: string;

    constructor(value: string) {
        this.value = value;
        // La validación se llama inmediatamente al crear el objeto.
        this.validateRole();
    }

    /**
     * Valida que el rol proporcionado esté dentro de nuestra lista de roles permitidos.
     * Si no es válido, lanza un error, deteniendo la creación del usuario.
     */
    private validateRole() {
        if (!VALID_ROLES.includes(this.value)) {
            throw new Error(`El rol '${this.value}' no es un rol válido. Roles permitidos: ${VALID_ROLES.join(', ')}`);
        }
    }
}