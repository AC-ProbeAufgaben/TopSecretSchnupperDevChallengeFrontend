import { FavFoods } from "./FavFoods";

export class UserModel {
    id: number = 0;
    name: string = '';
    lastName: string = '';
    password: string = '';
    email: string = '';
    active: boolean = true;
    role: string = '';
    favFoods?: FavFoods[];
  }