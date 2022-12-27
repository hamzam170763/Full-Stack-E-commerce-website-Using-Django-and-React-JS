import React from 'react'

 const Imagehelper =({product}) => {
    const imageurl = product ? product.image : `https://img.freepik.com/free-psd/isolated-white-t-shirt-front-view_125540-1194.jpg?w=826&t=st=1664521718~exp=1664522318~hmac=9b12fae18d4aa92bd3707a3c8460cf73540d5eb64950abda54e3c53ee81100d0`

  return (
    <div className='rounded border border-success p-2'>
        <img
            src={imageurl} 
            style={{maxHeight:"100%", maxWidth:"100%"}}
            className="mb-3 rounded"
            alt=""
        
        />
    </div>
  )
}
export default Imagehelper;