export interface AddUpdateIngredientData {
  name: string;
  description?: string;
  calories?: number;
  image?: string;
  cab?: number;
  sodium?: number;
  sugar?: number;
  cholesterol?: number;
  fat?: number;
  protein?: number;
}

export interface Ingredient {
  _id: string;
  name: string;
  description?: string;
  calories?: number;
  image?: string;
  cab?: number;
  sodium?: number;
  sugar?: number;
  cholesterol?: number;
  fat?: number;
  protein?: number;
}
