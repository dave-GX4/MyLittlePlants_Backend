export class ImageUrlValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidUrl();
    }

    private isValidUrl(): void {
        // Validación básica de estructura URL
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
        if (!urlPattern.test(this.value)) {
            throw new Error("La URL de la imagen no tiene un formato válido.");
        }

        // Validación de extensiones de imagen comunes
        const imageExtensions = /\.(jpeg|jpg|gif|png|webp|bmp|svg|tiff)(\?.*)?$/i;
        if (!imageExtensions.test(this.value)) {
            throw new Error("La URL no apunta a un archivo de imagen válido (extensiones permitidas: jpeg, jpg, gif, png, webp, bmp, svg, tiff).");
        }

        // Opcional: Validar que sea una URL absoluta
        if (!this.value.startsWith('http://') && !this.value.startsWith('https://')) {
            throw new Error("La URL debe comenzar con http:// o https://");
        }
    }
}