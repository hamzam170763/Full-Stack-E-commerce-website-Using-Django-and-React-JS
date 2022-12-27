import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import {cartEmpty} from './helper/carthelper'
import {getmeToken, processPayment} from './helper/paymenthelper'
import {createOrder} from './helper/orderhelper'
import {isAuthenticated, signout} from '../auth/helper'
import DropIn from 'braintree-web-drop-in-react'

const PaymentB=(
    {
        products,
        reload=undefined,
        setRealod=f=>f,
    }
)=> {

    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: ''
    })
    const userId = isAuthenticated && isAuthenticated().user.id
    const token = isAuthenticated && isAuthenticated().token

    const getToken = (userId, token)=>{
        getmeToken(userId, token)
        .then((info)=>{
            console.log("INFO",info)
            if(info.error){
                setInfo({
                    ...info,
                    error: info.error,

                })
                signout(()=>{
                    return <Redirect to='/'/>
                })
            } else {
                const clientToken = info.clientToken
                setInfo({clientToken: clientToken}) // same as clientToken : clientToken
            }
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
      getToken(userId,token)
    }, [])

    const onPurchase = () =>{
        setInfo({loading: true})
        let nonce;
        let getNonce = info.instance.requestPaymentMethod()
        .then((data) => {
            nonce = data.nonce
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getAmount()
            }
            processPayment(userId, token, paymentData)
            .then((response) => {
                if(response.error){
                    if(response.code == '1'){
                        console.log("Payment Failed")
                        signout(()=>{
                            return <Redirect to='/'/>
                        })
                    }
                } else {
                    setInfo({...info,
                        success: response.success, loading:false
                    })
                    console.log("Payment Success")
                    let product_names = ""
                    products.forEach(function(item) {
                        product_names += item.name+", "
                    });
                    const orderData = {
                        products: product_names,
                        transaction_id: response.transaction_id,
                        amount: response.transaction.amount
                    }
                    createOrder(userId,token,orderData)
                    .then(response=>{
                        if(response.error){
                            if(response.code =="1"){
                                console.log("ORDER FAILED")
                            }
                            signout(()=>{
                                return <Redirect to='/'/>
                            })
                        } else {
                            if(response.success == true){
                                console.log("ORDER PLACED")
                            }
                        }
                    })
                    .catch(error=>{
                        setInfo({
                            loading: false,
                            success: false
                        })
                        console.log("ORDER FAILED",error)
                    })
                    cartEmpty(()=>{
                        console.log("CART IS EMPTIED OUT")
                    })
                    setRealod(!reload)
                }
            })
            .catch(e=>console.log(e))
        })
        .catch(err =>console.log("NONCE ERROR",err))
    }
    
    const showbtnDropIn =()=>{
        return(
            <div>
                
                {info.clientToken !== null && products.length > 0 ? 
                    (
                        <div>
                            {/* <DropIn
                                options={{ authorization: info.clientToken }}
                                onInstance={(instance) => (info.instance = instance)}
                            /> */}
                            <DropIn
                                options={{authorization: info.clientToken}}
                                onInstance={(instance)=>(info.instance=instance)}
                            />
                            <button onClick={onPurchase} className='btn btn-block btn-success'>Buy</button>
                            {/* </DropIn> */}
                        </div>
                    ) : (
                        <h2>Please login first</h2>
                    )
                }
            </div>
        )
    }


    const getAmount = ()=>{
        let amount = 0
        products.map(p=>{
            amount = amount + parseInt(p.price)
        })
        return amount
    }


  return (
    <div>
      <h3>Your Amount is ${getAmount()}</h3>
      {showbtnDropIn()}
    </div>
  )
}

export default PaymentB
