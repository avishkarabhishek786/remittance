import React from "react";
import { useForm } from "react-hook-form";

export default function Exchangeform({onSubmit, fieldOne}) {
    // const { handleSubmit, handleSubmit1, pristine, reset, submitting, inputChangeHandler } = props
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    // const onSubmit = data => console.log(data);

  console.log(watch("example")); 

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input  type="text" placeholder={fieldOne} {...register("address", { required: true })} />
      
      <input  type="number" placeholder="Enter Amount" {...register("amount", { required: true })} />
      
      <input type="submit" />
    </form>
  );
}