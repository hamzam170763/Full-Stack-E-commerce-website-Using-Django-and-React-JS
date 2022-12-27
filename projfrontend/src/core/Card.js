import React from 'react'
import ImageHelper from "./helper/imagehelper"
import {Redirect} from "react-router-dom"
// import { addItemToCart } from './helper/carthelper'
import { addItemToCart, removeItemFromCart } from './helper/carthelper'
import { isAuthenticated } from '../auth/helper'
import { useState } from 'react'


const Card=({
    product,
    addtoCart=true,
    removeFromCart=false,
    reload = undefined,
    setReload = f => f
    //Creating a simple funtion which
    // recieve a value and then
    // return the value as it is.

})=> {
    //TODO 
    // const isAuthenticated = true
    const [redirect, setRedirect] = useState(false)

    const cartTitle = product ? product.name : "A photo from the other side"
    const cartDescription = product ? product.description : "Default Description"
    const cartPrice = product ? product.price : "Default Price"

    const addToCart = () => {
        if(isAuthenticated()){
            addItemToCart(product, () =>{setRedirect(true)})
            console.log("Added to cart");
        } else {
            console.log("Login Please!");
        }
    }
//Display Button
    const showAddtoCart = addToCart => {
        return (
            addtoCart && (
                <button 
                    onClick={addToCart} 
                    className='btn btn-block btn-outline-success mt-2 mb-2'>
                        Add to Cart
                </button>
            )
        )
    }

    const getRedirect = redirect => {
        if (redirect) {
            return <Redirect to="/cart"/>
        }
    }

    const showRemoveFromCart = removeFromCart =>{
        return(
            removeFromCart && (
                <button 
                 onClick={()=>{
                    //TODO handle this
                    removeItemFromCart(product.id)
                    setReload(!reload)
                    console.log("Product Removed from Cart");
                 }} 
                 className='btn btn-block btn-outline-danger mt-2 mb-2'>
                    Remove from Cart
                </button>
            )
        )
    }

  return (
    <div className='card text-white bg-dark border border-info'>
        <div className='card-header lead'>
            {cartTitle}
        </div>
        <div className='card-body'>
        { getRedirect(redirect) }
            <ImageHelper product={product}/>
            <p className='lead bg-success font-weight-normal text-wrap'>
                {cartDescription}
            </p>
            <p className='btn btn-success rounded btn-sm px-4'>$ {cartPrice}</p>
            <div className='row'>
                <div className='col-12'>
                    {showAddtoCart(addToCart)}
                </div>
                <div className='col-12'>
                    {showRemoveFromCart(removeFromCart)}
                </div>
            </div>
        </div>
    </div>
  )
}
export default Card;
