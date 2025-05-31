export interface AddDishData {
  name: string;
  description?: string;
  calories?: number;
  prep_time?: number;
  rating?: number;
  image?: string;
  instructions?: string;
  fat?: number;
  saturatedFat?: number;
  cholesterol?: number;
  sodium?: number;
  carbohydrate?: number;
  fiber?: number;
  sugar?: number;
  protein?: number;
  ingredients?: {
    ingredientId: string;
    quantity?: number;
    unit?: string;
  }[];
}

export interface UpdateDishData {
  name?: string;
  description?: string;
  calories?: number;
  prep_time?: number;
  rating?: number;
  image?: string;
  instructions?: string;
  fat?: number;
  saturatedFat?: number;
  cholesterol?: number;
  sodium?: number;
  carbohydrate?: number;
  fiber?: number;
  sugar?: number;
  protein?: number;
}

export interface AddUpdateDishIngredientData {
  ingredientId: string;
  quantity?: number;
  unit?: string;
}

export interface Dish {
  _id: string;
  name: string;
  description?: string;
  calories?: number;
  prep_time?: number;
  rating?: number;
  image?: string;
  instructions?: string;
  fat?: number;
  saturatedFat?: number;
  cholesterol?: number;
  sodium?: number;
  carbohydrate?: number;
  fiber?: number;
  sugar?: number;
  protein?: number;
  created_at?: string;
  updated_at?: string;
  ingredients?: {
    _id: string;
    name: string;
    ingredientId: string;
    quantity?: number;
    unit?: string;
    created_at?: string;
    updated_at?: string;
  }[];
  [key: string]: any;
}
