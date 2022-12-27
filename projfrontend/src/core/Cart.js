import React, {useState, useEffect} from 'react'
import Base from './Base'
import Card from "./Card"
import { loadCart } from './helper/carthelper'
import PaymentB from './PaymentB'


const Cart = () => {

  const [reload, setReload] = useState(false)
  const [products, setProducts]= useState([])

  useEffect(()=>{
    setProducts(loadCart())
  }, [reload])

  const loadAllProducts = (products)=>{
    return(
      <div>
        {products.map((product, index) => (//eihter put return statement with "{}" or "()" to mount this component on page
          <Card
          key={index}
          product={product}
          removeFromCart={true}
          addtoCart={false}
          reload={reload}
          setReload={setReload}
          />
        ))}
      </div>
    )
  }
  const loadCheckout = ()=>{
    return(
      <div>
        <h1>Checkout</h1>
      </div>
    )
  }
  
  return (
    <Base title='Cart Page' description='Welcome to Checkout'>
        <div className="row text-center">
          <div className="col-6">
            {loadAllProducts(products)}
          </div>
          <div className="col-6">
            {products.length>0 ? 
            (
              <PaymentB products={products} setRealod={setReload}/>
            ): (
              <h3>Please Login Or add something to cart</h3>
            )}
          </div>
        </div>
    </Base>
  )
}
export default Cart