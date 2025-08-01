import { EmailValue } from "./objectValues/Email_Value";
import { NameValue } from "./objectValues/Name_Value";
import { PasswordValue } from "./objectValues/Password_Value";
import { PhoneValue } from "./objectValues/Phone_Value";
import { RoleValue } from "./objectValues/Role_Value";

export class User {
    id?: number;
    name: NameValue;
    email: EmailValue;
    password: PasswordValue;
    role: RoleValue;
    wantsToBeSeller: boolean;
    phone?: PhoneValue;

    constructor(name: NameValue, email: EmailValue, password: PasswordValue, role: RoleValue,  wantsToBeSeller: boolean, phone?: PhoneValue, id?: number) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.wantsToBeSeller = wantsToBeSeller;
        this.phone = phone;
    }
}