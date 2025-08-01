export interface UserResponse {
    id: number,
    name: string,
    email: string,
    role: string,
    wantsToBeSeller: boolean, //<- se puede agregar ? para que no sea obligatoreo, como en phone
    phone?: string
}