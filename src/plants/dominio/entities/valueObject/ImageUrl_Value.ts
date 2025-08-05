export class ImageUrlValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidUrl();
    }

    private isValidUrl(): void {
        // Validación básica de estructura URL
        // 1. Validar que sea una URL absoluta (esta validación es buena y debe quedarse)
        if (!this.value.startsWith('http://') && !this.value.startsWith('https://')) {
            throw new Error("La URL debe comenzar con http:// o https://");
        }

        // 2. Validación de extensiones de imagen (esta también es buena y se queda)
        const imageExtensions = /\.(jpeg|jpg|gif|png|webp|bmp|svg|tiff)(\?.*)?$/i;
        if (!imageExtensions.test(this.value)) {
            throw new Error("La URL no apunta a un archivo de imagen válido (extensiones permitidas: jpeg, jpg, gif, png, webp, bmp, svg, tiff).");
        }
    }
}