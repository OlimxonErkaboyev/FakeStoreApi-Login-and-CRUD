import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import {
  deleteProduct,
  getAllCategories,
  getProducts,
} from "@/store/products/ProductsActions";
import {
  setSelectedProduct,
  setProducts,
  Product,
} from "@/store/products/ProductsSlice";
import { Button, buttonVariants } from "@/components/ui/button";
import { logout } from "@/store/auth/authSlice";
import AddProduct from "../addProduct";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CategoryBarChart from "./components/CategoryBarChart";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const Products = useSelector((state: RootState) => state.products.products);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      dispatch(setProducts(JSON.parse(storedProducts)));
    } else {
      dispatch(getProducts());
    }
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (Products?.length > 0) {
      localStorage.setItem("products", JSON.stringify(Products));
      dispatch(setProducts(Products));
    }
  }, [Products]);

  const updateProduct = async (product: Product) => {
    dispatch(setSelectedProduct(product));
    setIsOpen(true);
  };

  const deletedProduct = async (product: Product) => {
    try {
      const success = await dispatch(deleteProduct(product.id));
      if (success) {
        const updatedProducts = Products.filter((p) => p.id !== product.id);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        dispatch(setProducts(updatedProducts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="flex items-center px-4  md:px-12 py-4 justify-between fixed top-0 w-full z-50 shadow bg-white">
        <h1 className="text-2xl font-semibold ">Welcome!</h1>
        <div className="flex gap-5">
          <Button
            className={buttonVariants({ variant: "default" })}
            onClick={() => setIsOpen(true)}
          >
            Add
          </Button>
          <Button
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => dispatch(logout())}
          >
            Log out
          </Button>
        </div>
      </header>
      <main className="container grid h-screen pt-24">
        <CategoryBarChart products={Products} />
        {Products.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {Products.map((product, index) => (
              <Card key={index}>
                <CardHeader className="flex items-center justify-center w-full h-2/4 ">
                  <img
                    src={product.image}
                    alt={product.title}
                    width={110}
                    height={150}
                  />
                </CardHeader>
                <CardContent className="pb-0">
                  <CardTitle className="my-3 line-clamp-1">
                    {product.title}
                  </CardTitle>
                  <div className="flex justify-between">
                    <h4 className=" font-bold  mb-2">
                      Price: ${product.price}
                    </h4>
                    <h3 className=" font-bold italic text-blue-500 mb-2">
                      {product.category}
                    </h3>
                  </div>
                  <CardDescription className="line-clamp-2 mb-2">
                    {product.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="py-2 flex justify-between ">
                  <Button
                    className={buttonVariants({
                      size: "sm",
                      className: "px-3 py-0",
                    })}
                    onClick={() => updateProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    className={buttonVariants({
                      variant: "destructive",
                      size: "sm",
                      className: "px-3 py-0",
                    })}
                    onClick={() => deletedProduct(product)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <h2 className="text-center text-2xl font-semibold">
              No products found. Add some using the "Add" button above!
            </h2>
          </div>
        )}
        <AddProduct isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>
    </>
  );
};

export default Home;
