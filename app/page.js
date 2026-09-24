"use client";

import { useEffect, useState } from "react";
import api from "./lib/axios";

export default function home(){
  const [products, setProducts]=useState([])

  useEffect(()=> {
    api.get("/products").then((res)=> {
      console.log(res.data);
      setProducts(res.data.products);
    })
  },[]);
  return(
    <div className="p-8">
      <h1 className="text-2xl font-bold">Products: {products.length}</h1>
    </div>
  )
}
