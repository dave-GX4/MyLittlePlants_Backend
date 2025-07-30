export class UserResponse {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly email: string,
        public readonly admins: boolean | undefined,
        public readonly phone?: string
    ) {}
}