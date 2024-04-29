let cl = console.log;


const loader = document.getElementById("loader");
const productContainer = document.getElementById("productContainer");
const showModal = document.getElementById("showModal");
const closeModal = [...document.querySelectorAll(".closeModal")];
const backDrop = document.getElementById("backDrop");
const productModal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");
const nameControl = document.getElementById("name");
const imgUrlControl = document.getElementById("imgUrl");
const descriptionControl = document.getElementById("description");
const statusControl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

const loadertoggle =()=>{
    loader.classList.toggle("d-none");
}
const snackBar =(msg,icon,time)=>{
   Swal.fire({
      title: msg,
      icon: icon,
      timer: time
   })
}

const modalToggle = ()=>{
    backDrop.classList.toggle("active");
    productModal.classList.toggle("active");
}

const templating =(arr)=>{
    productContainer.innerHTML = arr.map(obj =>{
          return ` <div class="col-md-4">
                     <div class="card mb-4">
                        <figure class="productCard mb-0" id="${obj.id}">
                         <img src="${obj.imgUrl}" alt="${obj.name}" title="${obj.name}">
                         <figCaption>
                            <div class="status-sec">
                                <div class="row">
                                   <div class="col-md-8">
                                        <h3 class="productName mb-0">${obj.name}</h3>
                                    </div>
                                   <div class="col-md-4 align-self-center">
                                      ${obj.status === 'delivered' ?`<span class="bg-success">${obj.status}</span>`:
                                       obj.status === 'ordered' ?`<span class="bg-warning">${obj.status}</span>`:
                                       obj.status === 'dispatched' ? `<span class="bg-danger">${obj.status}</span>`:
                                      `<span class="bg-success">${obj.status}</span>`} 
                                    </div>
                                  </div>
                             </div>
                    
                                 <div class="description-sec">
                                        <h4>${obj.name}</h4>
                                        <em>Description</em>
                                        <p>${obj.description}</p>
                                        <div class="action">
                                             <button class="btn btn-info"onclick="onEdit(this)">Edit</button>
                                             <button class="btn btn-danger"onclick="onDelete(this)">Delete</button>
                                        </div>
                                 </div>
                      </figCaption>
                  </figure>
              </div>
          </div>`
    }).join('');
}


const baseUrl = `https://products-async-await-default-rtdb.asia-southeast1.firebasedatabase.app`;

let productUrl = `${baseUrl}/products.json`;


const makeApiCall = async (apiUrl,methodName,msgBody)=>{
    loadertoggle()
   try{
    msgBody = msgBody ? JSON.stringify(msgBody) : null
    let res = await fetch(apiUrl,{
        method: methodName,
        body: msgBody,
        headers:{
            'Content-Type':"Application/json"
        }
    })
    return res.json()
   }catch(err){
    cl(err)
   }finally{
    loadertoggle()
   }
}

const objToArr = (obj)=>{
    let productArr =[];
    for (const key in obj) {
          productArr.unshift({...obj[key],id:key})
     }
    return productArr 
} 

const fetchAPI =  async()=>{
  try{
    let res = await makeApiCall(productUrl,"GET")
    let productArr = objToArr(res);
    cl(productArr)
    templating(productArr)
  }catch(err){
    cl(err)
  }
}
fetchAPI()


const onEdit = async(e)=>{
    try{
    let editId = e.closest(".productCard").id;
    localStorage.setItem("editId",editId);
   // localStorage.removeItem("editId");
    let editUrl = `${baseUrl}/products/${editId}.json`;
    let res = await makeApiCall(editUrl,"GET",null)
    nameControl.value = res.name;
    imgUrlControl.value = res.imgUrl;
    descriptionControl.value = res.description;
    statusControl.value = res.status;
    updateBtn.classList.remove("d-none");
    submitBtn.classList.add("d-none");
    window.scrollTo(0,0);
    } catch(err){
        cl(err)
    }finally{
        modalToggle();
    }
}


const onDelete = async(e)=>{
  try{
    let getConfirmetion = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
   }) 
   if(getConfirmetion.isConfirmed){
    let deleteId = e.closest(".productCard").id;
    let deleteUrl = `${baseUrl}/products/${deleteId}.json`;
    let res = await makeApiCall(deleteUrl,"DELETE",null)
    e.closest(".col-md-4").remove();
    snackBar("Your File Has Been Deleted","success",2000)
  }
  } catch(err){
    cl(err)
  }
   }

const prependProduct =(obj)=>{
      let card =  document.createElement("div");
      card.className = "col-md-4";
      card.id = obj.name;
      card.innerHTML = `<div class="card mb-4">
                            <figure class="productCard mb-0" id="${obj.id}">
                               <img src="${obj.imgUrl}" alt="${obj.name}" title="${obj.name}">
                               <figCaption>
                               <div class="status-sec">
                                  <div class="row">
                                     <div class="col-md-8">
                                        <h3 class="productName mb-0">${obj.name}</h3>
                                     </div>
                                     <div class="col-md-4 align-self-center">
                                         ${obj.status === 'delivered' ?`<span class="bg-success">${obj.status}</span>`:
                                          obj.status === 'ordered'? `<span class="bg-warning">${obj.status}</span>`:
                                          obj.status === 'dispatched' ? `<span class="bg-danger">${obj.status}</span>`:
                                          `<span class="bg-success">${obj.status}</span>`} 
                                      </div>
                                   </div>
                                </div>
                                <div class="description-sec">
                                   <h4>${obj.name}</h4>
                                   <em>Description</em>
                                   <p>${obj.description}</p>
                                   <div class="action">
                                       <button class="btn btn-info"onclick="onEdit(this)">Edit</button>
                                       <button class="btn btn-danger"onclick="onDelete(this)">Delete</button>
                                   </div>
                                </div>
                               </figCaption>
                           </figure>
                        </div>`;
productContainer.prepend(card);
}


const onProductCreate = async(e)=>{
  try{
    e.preventDefault();
    let newProduct ={
      name:nameControl.value,
      description:descriptionControl.value,
      imgUrl: imgUrlControl.value,
      status: statusControl.value
  }
  let res = await  makeApiCall(productUrl,"POST",newProduct);
     newProduct.id = res.name;
     prependProduct(newProduct);
     snackBar(`Product is ${newProduct.name} added is Added Successfully!!!`,"success",2000)
  } catch(err){
    cl(err)
  } finally{
    productForm.reset();
    modalToggle();
  }

}



const onUpdateProduct =async()=>{
   try{
    let updateId = localStorage.getItem("editId");
    let updateUrl = `${baseUrl}/products/${updateId}.json`;
    let updateObj = {
      name:nameControl.value,
      description:descriptionControl.value,
      imgUrl: imgUrlControl.value,
      status: statusControl.value,
      id: updateId
    }
    let res = await  makeApiCall(updateUrl,"PATCH",updateObj);
    let card = document.getElementById(updateId);
    card.innerHTML= ` <img src="${updateObj.imgUrl}" alt="${updateObj.name}" title="${updateObj.name}">
                      <figCaption>
                         <div class="status-sec">
                            <div class="row">
                               <div class="col-md-8">
                                  <h3 class="productName mb-0">${updateObj.name}</h3>
                               </div>
                               <div class="col-md-4 align-self-center">
                                     ${updateObj.status === 'delivered' ?`<span class="bg-success">${updateObj.status}</span>`:
                                    updateObj.status === 'ordered' ? `<span class="bg-warning">${updateObj.status}</span>`:
                                     updateObj.status === 'dispatched' ? `<span class="bg-danger">${updateObj.status}</span>`:
                                    `<span class="bg-success">${updateObj.status}</span>`} 
                               </div>
                             </div>
                          </div>
                          <div class="description-sec">
                               <h4>${updateObj.name}</h4>
                               <em>Description</em>
                               <p>${updateObj.description}</p>
                               <div class="action">
                                  <button class="btn btn-info"onclick="onEdit(this)">Edit</button>
                                  <button class="btn btn-danger"onclick="onDelete(this)">Delete</button>
                               </div>
                           </div>
                        </figCaption>
                    </figure>
                </div>
             </div>`;
                snackBar(`Product is ${updateObj.name} Updated successfully`,"success",2000)
   }catch(err){
    cl(err)
   }finally{
    productForm.reset();
    updateBtn.classList.add("d-none");
    submitBtn.classList.remove("d-none");
    modalToggle();
   }
}



showModal.addEventListener("click",modalToggle);
closeModal.forEach(btn =>{
    btn.addEventListener("click",modalToggle);
})



productForm.addEventListener("submit",onProductCreate);
updateBtn.addEventListener("click",onUpdateProduct);







