import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { addProduct, updateProduct } from "@/store/products/ProductsActions";
import {
  Product,
  setProducts,
  setSelectedProduct,
} from "@/store/products/ProductsSlice";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AddProduct: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const Products = useSelector((state: RootState) => state.products.products);
  const Categories = useSelector(
    (state: RootState) => state.products.categories
  );
  const selectProduct = useSelector(
    (state: RootState) => state.products.selectedProduct
  );

  const form = useForm<Product>({
    defaultValues: {
      title: selectProduct ? selectProduct.title : "",
      price: selectProduct ? selectProduct.price : 0,
      description: selectProduct ? selectProduct.description : "",
      category: selectProduct ? selectProduct.category : "",
      image: selectProduct ? selectProduct.image : "",
    },
  });
  const { handleSubmit, control, setValue, reset } = form;

  const dialogClose = () => {
    setIsOpen(false);
    dispatch(setSelectedProduct(null));
    reset();
  };

  useEffect(() => {
    if (selectProduct) {
      setValue("title", selectProduct.title);
      setValue("price", selectProduct.price);
      setValue("description", selectProduct.description);
      setValue("category", selectProduct.category);
      setValue("image", selectProduct.image);
    }
  }, [selectProduct, setValue]);

  const onSubmit = async (values: Product) => {
    const newTodo: Product = {
      title: values.title,
      price: +values?.price,
      description: values.description,
      image: values.image,
      category: values.category,
    };
    if (selectProduct) {
      const { payload } = await dispatch(updateProduct(newTodo));
      const updatedProduct = Products.map((product) =>
        product.id === payload.id ? { ...payload } : product
      );
      localStorage.setItem("products", JSON.stringify(updatedProduct));
      dispatch(setProducts(updatedProduct));
    } else {
      await dispatch(addProduct(newTodo));
      const updatedProducts = [
        ...Products,
        {
          id: Products.length > 0 ? Products[Products.length - 1].id! + 1 : 1,
          ...newTodo,
        },
      ];
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      dispatch(setProducts(updatedProducts));
    }
    reset();
    dialogClose();
  };

  return (
    <>
      <div>
        <Dialog open={isOpen} onOpenChange={dialogClose}>
          <DialogContent
            className="sm:max-w-[425px]"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle>
                {selectProduct ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title"
                          type="string"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Price"
                          type="number"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Description"
                          type="string"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Image url"
                          type="url"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Categories.map((category, index) => (
                            <SelectItem key={index} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full flex" type="submit">
                  {selectProduct ? "Update Product" : "Add Product"}
                </Button>
              </form>
            </Form>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AddProduct;
