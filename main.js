// 3.變數宣告
const menu = document.getElementById('menu')
const cart = document.getElementById('cart')
const totalAmount = document.getElementById('total-amount')
const submitButton = document.getElementById('submit-button')
const resetButton = document.getElementById('reset-button')

let productData = [];
let cartItems = []
let total = 0

// 4.GET API 菜單產品資料
axios.get('https://ac-w3-dom-pos.firebaseio.com/products.json')
  .then(function (response) {
    productData = response.data
    displayProduct(productData);
  })
  .catch(function (error) {
    console.log(error);
  })

// 5.將產品資料加入菜單區塊
function displayProduct(products) {
  products.forEach(product => menu.innerHTML += `
    <div class="col-3">
       <div class="card">
          <img src=${product.imgUrl} class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">$${product.price}</p>
            <a id="${product.id}" href="#" class="btn btn-primary">Add</a>
            <a id="${product.id}" href="#" class="btn btn-secondary">Delete</a>
          </div>
        </div>
      </div>
  `)
}

// 6.加入＆刪除購物車
function addToCart(event) {
  // 找到觸發button
  const addButton = event.target.matches('.btn-primary')
  const deleteButton = event.target.matches('.btn-secondary')

  // 找到觸發event的node元素，並得到其產品id
  const id = event.target.id

  // 在productData的資料裡，找到點擊的產品資訊，加入 cartItems
  const product = productData.find(product => product.id === id)
  const name = product.name
  const price = product.price

  // 加入購物車變數cartItems 分：有按過、沒按過
  const targetItem = cartItems.find(item => item.id === id)

  if (addButton && targetItem) {
    targetItem.quantity += 1
  } else if (addButton) {
    cartItems.push({
      id,  // id: id
      name,  // name: name
      price,  // price: price
      quantity: 1
    })
  } else if (deleteButton && targetItem && (targetItem.quantity > 1)) {
    targetItem.quantity -= 1
  } else if (deleteButton && (targetItem.quantity = 1)) {
    cartItems.pop()
  }

  // 畫面顯示購物車清單
  cart.innerHTML = cartItems.map(item => `<li class="list-group-item">${item.name} X ${item.quantity}  小計：$${item.price * item.quantity}</li>`).join('')

  // 計算總金額
  function calculateTotal(amount) {
    if (addButton) {
      total += amount
    } else if (deleteButton) {
      total -= amount
    }
    totalAmount.textContent = '$' + total
  }
  calculateTotal(price)
}


// 7.計算總金額
// function calculateTotal(amount) {
//   if(addButton) {
//     total += amount
//   } else if(deleteButton) {
//     total -= amount
//   }
//   totalAmount.textContent = '$'+total
// }


// 8.送出訂單
function submit() {
  window.alert(`
感謝購買

${cart.innerText}

共${totalAmount.textContent}元
  `);
}

// 9.重置資料
function reset() {
  cartItems.splice(0, cartItems.length);
  cart.innerHTML = ''
  total = 0
  totalAmount.textContent = '$' + total
  return cartItems
}

// 10. 加入事件監聽
menu.addEventListener('click', addToCart)
submitButton.addEventListener('click', submit)
resetButton.addEventListener('click', reset)