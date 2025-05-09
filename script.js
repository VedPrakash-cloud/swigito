async function fetchData(){
    try{
        let response = await fetch ('data.json');
        console.log(response);
        if(!response.ok){
            throw new Error(`HTTP error! Status ${response.status}`);
        }
        const data = await response.json();
        renderData(data);
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

    Object.values(cart).forEach(item =>{
        let itemElement = document.createElement('div');
        itemElement.textContent = `${item.name}- ${item.quantity}`;
        cartContainer.appendChild(itemElement)
    })
}

function updateCart(item, change){
    if(!cart[item.category]){
        cart[item.category] = {name:item.name, quantity:0, price:item.price};
    }
    cart[item.category].quantity += change;

    if(cart[item.category].quantity < 1 && change > 0){
        cart[item.category].quantity = 1;
    }
    console.log(cart[item.category].name, cart[item.category].quantity);
    updateCartCount();
    renderCart();
}

function renderData(data){
    let container = document.querySelector('.row');

    data.forEach(item=>{
        let card = document.createElement('div');
        card.classList.add('col-4');

        let img = document.createElement('img');
        img.classList.add('pic');
        img.src = item.image.tablet;
        img.alt = item.name;

        // Add to cart Button//

        let addButton = document.createElement('button');
        addButton.classList.add('btn-light');

        let cartImg = document.createElement('img');
        cartImg.classList.add('basket-icon');
        cartImg.src = `assets/images/icon-add-to-cart.svg`;
        cartImg.alt = 'basket';
        cartImg.style.width='20px';
        cartImg.style.marginRight = '5px'

        let cartText = document.createElement('span');
        cartText.classList.add('Cart1-text');
        cartText.textContent = 'Add to Cart';

        addButton.onclick = ()=>{
            updateCart(item, 1);
            addButton.style.display='none';
            secondButton.style.display='block';
        }

        //add to cart button ends//

        //counter button starts//

        let count = 1;

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

            console.log(`relativeOffSetX: ${relativeOffSetX}, MiddlePoint: ${middlePoint}`);
            if(relativeOffSetX < middlePoint){
                count = Math.max(0, count-1);
                console.log("minus is clicked");
            }else{
                if(!cart[item.category]){
                    cart[item.category] = {name: item.name, quantity: 1, price: item.price};
                }else{
                    count += 1;
                }
                
                console.log("plus is clicked");
            }
            cart[item.category].quantity = count;
            updateCartCount();

            text.textContent = count;

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