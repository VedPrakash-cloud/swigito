async function fetchData(){
    try{
        let response = await fetch ('data.json');
        console.log(response);
        if(!response.ok){
            throw new Error(`HTTP error! Status ${response.status}`);
        }
        const data = await response.json();
        renderData(data);
        // confirmOrder(data);
    } catch(error){
        console.error('Error fetching JSON file', error);
        document.getElementById('content').innerHTML=`<p style="color:red;"> Failed to load data. Please try again later.</p>`;
    }
}

let cart = {};

function updateCartCount(){
    let totalCount = 0;
    Object.values(cart).forEach(item=>{
        totalCount += item.quantity;
    });
    document.querySelector('.cart-heading').textContent=`Your Cart (${totalCount})`;
}

function renderCart(){
    let cartContainer = document.querySelector('.cart-photo');
    cartContainer.innerHTML = '';


//-- cart item list start here--//
    Object.values(cart).forEach(item =>{
        let itemElement = document.createElement('div');
        itemElement.classList.add('cart-items');

        let itemName = document.createElement('h6');
        itemName.classList.add('item-cart');
        itemName.textContent = `${item.name}`;

        let itemCount = document.createElement('span');
        itemCount.classList.add('item-count');
        itemCount.textContent = `${item.quantity}x`;

        let perItemPrice = document.createElement('span');
        perItemPrice.classList.add('cart-price');
        perItemPrice.textContent = `@ $${item.price.toFixed(2)}`;

        let totalPrice = document.createElement('span');
        totalPrice.classList.add('cart-cost');
        totalPrice.textContent = `$${(item.price*item.quantity).toFixed(2)}`;

        let crossButton = document.createElement('img');
        crossButton.classList.add('cancel-item');
        crossButton.src = `assets/images/icon-remove-item.svg`;
        crossButton.alt = 'Cancel Item';
        crossButton.onclick = ()=>{
            itemElement.textContent = '';
        }

        itemElement.appendChild(itemName);
        // itemElement.appendChild(document.createElement('br'));
        itemElement.appendChild(itemCount);
        itemElement.appendChild(perItemPrice);
        itemElement.appendChild(totalPrice);
        itemElement.appendChild(crossButton);

        cartContainer.appendChild(itemElement);
    });

//-- total cost of order starts here --//

    let total = 0;
    Object.values(cart).forEach(item=>{
        total += item.quantity*item.price;
    })
    let totalAmount= document.createElement('p');
        totalAmount.classList.add('total-cost');
        totalAmount.innerHTML = `<span>Order Total</span> <strong>$${total.toFixed(2)}</strong>`;


//-- carbon confirm button starts here --//
    let carbon = document.createElement('div');
    carbon.classList.add('carbon-image');

    let carbonNeutral = document.createElement('img');
    carbonNeutral.classList.add('neutral');
    carbonNeutral.src = `assets/images/icon-carbon-neutral.svg`
    carbonNeutral.alt = 'carbon neutral';

    let deliveryMessage = document.createElement('p');
    deliveryMessage.classList.add('text-center','text');
    deliveryMessage.innerHTML = 'This is a <strong>carbon-neutral</strong> delivery';

    carbon.appendChild(carbonNeutral);
    carbon.appendChild(deliveryMessage);

        cartContainer.appendChild(totalAmount);
        cartContainer.appendChild(carbon);

    let confirm = document.createElement('button');
    confirm.classList.add('confirm-button');
    confirm.textContent = 'Confirm Order';
    confirm.onclick=()=>{
        let hideConfirmation = document.querySelector('.confirm-hidden');
        hideConfirmation.style.display = 'block';
        confirmOrder();
    };

    cartContainer.appendChild(confirm);

};

function confirmOrder(){
    let confirmOrder = document.getElementById('order-confirm');

    let greenTick = document.createElement('img');
    greenTick.classList.add('green');
    greenTick.src = `assets/images/icon-order-confirmed.svg`;
    greenTick.alt = 'confirmation';

    let confirmMessage = document.createElement('h1');
    confirmMessage.classList.add('msg');
    confirmMessage.textContent = 'Order Confirmed';

    let subMessage = document.createElement('p');
    subMessage.classList.add('sub-msg');
    subMessage.textContent = 'We hope you enjoy your food!';

    let itemBox = document.createElement('div');
    itemBox.classList.add('item-box');

    let totalPrice = 0;

    Object.values(cart).forEach(item =>{

        let itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');

        let itemImg = document.createElement('img');
        itemImg.classList.add('thumb');
        itemImg.src = item.image.thumbnail;
        itemImg.alt = item.name;
        console.log('cart item:',item);

        let itemDetail = document.createElement('div');
        itemDetail.classList.add('item-detail');
    
        let itemIdentifier = document.createElement('h6');
        itemIdentifier.classList.add('name-item');
        itemIdentifier.textContent = item.name;
    
        let numberOfItems = document.createElement('span');
        numberOfItems.classList.add('number');
        numberOfItems.textContent = `${item.quantity}x`;
    
        let priceOfItem = document.createElement('span');
        priceOfItem.classList.add('price');
        priceOfItem.textContent = `@ $${item.price.toFixed(2)}`;

        itemDetail.appendChild(itemIdentifier);
        itemDetail.appendChild(numberOfItems);
        itemDetail.appendChild(priceOfItem);
    
        let totalPriceOfItem = document.createElement('p');
        totalPriceOfItem.classList.add('total-price');
        totalPriceOfItem.textContent = `$ ${(item.quantity * item.price).toFixed(2)}`;

        totalPrice += item.quantity*item.price;
    
        itemContainer.appendChild(itemImg);
        itemContainer.appendChild(itemDetail);
        itemContainer.appendChild(totalPriceOfItem);

        itemBox.appendChild(itemContainer);
    });

    let totalAmount = document.createElement('div');
    totalAmount.classList.add('total-amount');

    let totalElement = document.createElement('span');
    totalElement.classList.add('order-total');
    totalElement.innerHTML = `Order Total`;
    totalAmount.appendChild(totalElement);

    let totalNumber = document.createElement('span')
    totalNumber.classList.add('total-number');
    totalNumber.innerHTML = `$${totalPrice.toFixed(2)}`
    totalAmount.appendChild(totalNumber);
    itemBox.appendChild(totalAmount);
    


    let newOrder = document.createElement('button');
    newOrder.classList.add('new-order');
    newOrder.textContent = 'Start New Order';
    newOrder.onclick = () => {
        let hideConfirmation = document.querySelector('.confirm-hidden');
        hideConfirmation.style.display = 'none';
        setTimeout(() => {
            location.reload();
        }, 100);
    }

    confirmOrder.appendChild(greenTick);
    confirmOrder.appendChild(confirmMessage);
    confirmOrder.appendChild(subMessage);
    confirmOrder.appendChild(itemBox);
    confirmOrder.appendChild(newOrder);
}


function updateCart(item, change){
    if(!cart[item.category]){
        cart[item.category] = {...item, quantity:change};
    }else{
        cart[item.category].quantity += change;
    }

    if(cart[item.category].quantity < 1 && change > 0){
        cart[item.category].quantity = 1;
    }
    updateCartCount();
    renderCart();
}

function renderData(data){
    let container = document.querySelector('.row');

    data.forEach(item=>{
        let card = document.createElement('div');
        card.classList.add('col-4');

        let hideConfirmation = document.querySelector('.confirm-hidden');
        hideConfirmation.style.display='none';

        let img = document.createElement('img');
        img.classList.add('img-fluid');
        img.src = item.image.desktop;
        img.alt = item.name;

        // Add to cart Button//

        let addButton = document.createElement('button');
        addButton.classList.add('btn','btn-light');

        let cartImg = document.createElement('img');
        cartImg.classList.add('img-fluid');
        cartImg.src = `assets/images/icon-add-to-cart.svg`;
        cartImg.alt = 'basket';

        let cartText = document.createElement('span');
        cartText.classList.add('text-center');
        cartText.textContent = 'Add to Cart';

        addButton.onclick = ()=>{
            updateCart(item, 1);

            count = cart[item.category]?.quantity || 1;
            text.textContent = count;

            addButton.style.display='none';
            secondButton.style.display='block';
        }

        //add to cart button ends//

        //counter button starts//

        let count = cart[item.category]?.quantity || 1;

        let secondButton = document.createElement('button');
        secondButton.id = 'hidden';
        secondButton.classList.add('btn1');

        let minusImg = document.createElement('img');
        minusImg.classList.add('minus-icon');
        minusImg.src =`assets/images/icon-decrement-quantity.svg`
        minusImg.alt = 'decrement';
        minusImg.style.width = '15px';

        let text = document.createElement('span');
        text.classList.add('counter');
        text.textContent = `${count}`;

        let plusImg = document.createElement('img');
        plusImg.classList.add('plus-icon');
        plusImg.src = `assets/images/icon-increment-quantity.svg`
        plusImg.alt = 'increment';

        secondButton.addEventListener('click', (event)=>{
            if(!secondButton.contains(event.target)) return;

            let rect = secondButton.getBoundingClientRect();
            let relativeOffSetX = event.clientX - rect.left;
            let middlePoint = secondButton.clientWidth/2;

            if(relativeOffSetX < middlePoint){
                count = Math.max(0, count-1);
            }else{
                if(!cart[item.category]){
                    cart[item.category] = {name: item.name, quantity: 0, price: item.price};
                }else{
                    count += 1;
                }
            }
            cart[item.category].quantity = count;
            updateCartCount();

            text.textContent = cart[item.category].quantity;

            if (cart[item.category].quantity === 0) {
                delete cart[item.category];
                secondButton.style.display='none';
                addButton.style.display = 'block';
            } else {
                text.textContent = cart[item.category].quantity;
            }        

            renderCart();
        })

        //counter button ends//

        addButton.appendChild(cartImg);
        addButton.appendChild(cartText);
        secondButton.appendChild(minusImg);
        secondButton.appendChild(text);
        secondButton.appendChild(plusImg)

        let category = document.createElement('p');
        category.classList.add('item-category')
        category.textContent = `${item.category}`;
        
        let name = document.createElement('h3');
        name.classList.add('item-name');
        name.textContent = item.name;

        let price = document.createElement('p');
        price.classList.add('item-price')
        price.textContent = `$${item.price.toFixed(2)}`;

        card.appendChild(img);
        card.appendChild(addButton);
        card.appendChild(secondButton)
        card.appendChild(category);
        card.appendChild(name);
        card.appendChild(price);
        container.appendChild(card);
    })
}

fetchData();