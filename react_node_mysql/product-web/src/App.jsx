import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function App() {

  const [isModelOpen,setIsModelOpen] = useState(false)
  const [products, setProducts]= useState([])
  const [filteredProducts, setfilteredProducts]= useState([])
  const [productData, setProductData] = useState({name:"",category:"",brand:""})
  const [errorMsg,setErrorMsg]=useState("")

  const handleSearchChange=(e)=>{

    const searchValue=e.target.value.toLowerCase();

    const filteredData=products.filter(product=>product.name.toLowerCase().includes(searchValue) || product.category.toLowerCase().includes(searchValue) || product.brand.toLowerCase().includes(searchValue) || product.productid.toString().includes(searchValue));
    
    setfilteredProducts(filteredData);
  }

  const openPopup=() =>{
    setProductData({name:"",category:"",brand:""});
    setIsModelOpen(true)

  }
  const handleClose=() =>{
    setErrorMsg("")
    getAllProducts();
    setIsModelOpen(false)

  }

  const getAllProducts=async()=>{
    await axios.get("http://localhost:3000/products").then((res)=>{
      setProducts(res.data);
      setfilteredProducts(res.data);
    })
  }

  const handleData=(e)=>{
    setProductData({...productData,[e.target.name]: e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    let errMsg="";
    if(!productData.name || !productData.category || !productData.brand){
      errMsg="All fields are required!"
      setErrorMsg(errMsg);
    }
    if((errMsg.length==0) && productData.productid){
      await axios.patch(`http://localhost:3000/products/${productData.productid}`,productData).then((res)=>{
        console.log(res.data);

      })
    }else if(errMsg.length==0) {
      await axios.post("http://localhost:3000/products",productData).then((res)=>{
        console.log(res.data);
    })
    }
    if(errMsg.length==0){
      handleClose();
    }
}
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:3000/products",productData).then((res)=>{
//       console.log(res.data);
//       handleClose();
//       setProductData({name:"",category:"",brand:""}); this line clears the form/removes the previous added entries in popup
//   });
// }

  const handleUpdate=(product)=>{
    setProductData(product);
    setIsModelOpen(true);
  }

  const handleDelete=async(productid)=>{
    const isConfirm = window.confirm("Are you sure you want to delete? ")
    if(isConfirm){
      await axios.delete(`http://localhost:3000/products/${productid}`).then((res)=>{
      setProducts(res.data);
      setfilteredProducts(res.data);
      })
    }
    window.location.reload();
  }

  useEffect(()=>{
    getAllProducts();
  },[])

  return (
    <>
      <div className="main-container">
        <h3>Full Stack : React as frontend & Backend with MySQL</h3>
        <div className="search-box">

          <input onChange={handleSearchChange} className="input-search" type="search" name="search-value" id="search-value" placeholder='Search Product Here..!'/>

          <button className="addBtn green" onClick={openPopup}>Add</button>

        </div>
        <div className="data-box">
          {isModelOpen && (<div className="addEditPopup">
            <span onClick={handleClose} className="closeBtn">&times;</span>
            <h4>Product Details</h4>
            {errorMsg && <p className="error">{errorMsg}</p>}
            <div className="popupdiv">
              <label htmlFor="name">Name</label><br />
              <input className='popup-input' value={productData.name} onChange={handleData} type="text" name="name" id="name" />
            </div>
            <div className="popupdiv">
              <label htmlFor="category">Category</label><br />
              <input className='popup-input' value={productData.category} onChange={handleData} type="text" name="category" id="category" />
            </div>
            <div className="popupdiv">
              <label htmlFor="brand">Brand</label><br />
              <input className='popup-input' value={productData.brand} onChange={handleData} type="text" name="brand" id="brand" />
            </div><br />
            <button className="addProductBtn green" onClick={handleSubmit}>{productData.productid?"Update Product":"Add Product"}</button>
          </div>)}
          <table className="table">
            <thead>
            <tr>
              <th>ProductId</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {filteredProducts && filteredProducts.map((product)=>{
              return (<tr key={product.productid}>
                <td>{product.productid}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td><button className="editBtn green" onClick={()=>handleUpdate(product)}>Edit</button></td>
                <td><button className="deleteBtn red" onClick={()=>handleDelete(product.productid)} >Delete</button></td>
              </tr>)
            })}
            </tbody>
          </table>
        </div>
        
      </div>

        
                 
    </>
  )
}

export default App
