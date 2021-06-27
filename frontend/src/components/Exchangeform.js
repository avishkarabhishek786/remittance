import React from "react";
import { useForm } from "react-hook-form";

export default function Exchangeform({onSubmit}) {
    // const { handleSubmit, handleSubmit1, pristine, reset, submitting, inputChangeHandler } = props
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    // const onSubmit = data => console.log(data);

  console.log(watch("example")); 

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="address" type="text" {...register("address", { required: true })} />
      
      <input defaultValue="amount" type="number" {...register("amount", { required: true })} />
      
      <input type="submit" />
    </form>
  );
}