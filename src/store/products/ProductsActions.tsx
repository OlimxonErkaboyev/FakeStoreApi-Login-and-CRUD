import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

export const getProducts = createAsyncThunk(
  "products/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const getAllCategories = createAsyncThunk(
  "category/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://fakestoreapi.com/products/categories`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/post",
  async (
    body: {
      title: string;
      price: number;
      description: string;
      image: string;
      category: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `https://fakestoreapi.com/products`,
        body
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/put",
  async (
    body: {
      title: string;
      price: number;
      description: string;
      image: string;
      category: string;
    },
    { rejectWithValue, getState }
  ) => {
    const state = getState() as RootState;
    const product = state.products.selectedProduct;
    try {
      const response = await axios.put(
        `https://fakestoreapi.com/products/${product?.id}`,
        body
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (Id: number | undefined, { rejectWithValue }) => {
    try {
      await axios.delete(`https://fakestoreapi.com/products/${Id}`);
      return Id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
