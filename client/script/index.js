document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');

  console.log(menuToggle);
  console.log(navbar);
  menuToggle.addEventListener('click', function () {
    console.log('Menu toggle clicado');
    navbar.classList.toggle('active');
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const pizzaCards = document.querySelectorAll('.pizza-card');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function addToCart(pizzaName, pizzaSize, pizzaPrice, quantity) {
    const existingPizza = cart.find(
      (item) => item.name === pizzaName && item.size === pizzaSize
    );

    if (existingPizza) {
      existingPizza.quantity = quantity;
      if (existingPizza.quantity === 0) {
        cart = cart.filter((item) => item !== existingPizza);
      }
    } else {
      cart.push({
        name: pizzaName,
        size: pizzaSize,
        price: pizzaPrice,
        quantity,
      });
    }

    cart = cart.filter((item) => item.quantity > 0);
    updateLocalStorage();
  }

  pizzaCards.forEach((card) => {
    const minusBtn = card.querySelector('.quantity-btn.minus');
    const plusBtn = card.querySelector('.quantity-btn.plus');
    const quantityElement = card.querySelector('.quantity');
    const priceElement = card.querySelector('.price-value');
    const sizeSelect = card.querySelector('.size-select');

    function updatePizzaPrice() {
      const quantity = parseInt(quantityElement.textContent);
      const selectedSizePrice = parseFloat(sizeSelect.value);
      const newPrice =
        quantity > 0
          ? (selectedSizePrice * quantity).toFixed(2)
          : selectedSizePrice.toFixed(2);
      priceElement.textContent = newPrice.replace('.', ',');
    }

    function handleQuantityChange() {
      const quantity = parseInt(quantityElement.textContent);
      const pizzaName = card.getAttribute('data-name');
      const pizzaPrice = parseFloat(sizeSelect.value);
      const pizzaSize = sizeSelect.options[sizeSelect.selectedIndex].text;

      addToCart(pizzaName, pizzaSize, pizzaPrice, quantity);
    }

    sizeSelect.addEventListener('change', () => {
      updatePizzaPrice();
      handleQuantityChange();
    });

    minusBtn.addEventListener('click', () => {
      let quantity = parseInt(quantityElement.textContent);
      if (quantity > 0) {
        quantity--;
        quantityElement.textContent = quantity;
        updatePizzaPrice();
        handleQuantityChange();
      }
    });

    plusBtn.addEventListener('click', () => {
      let quantity = parseInt(quantityElement.textContent);
      if (quantity === 0) {
        quantity = 1;
      } else {
        quantity++;
      }
      quantityElement.textContent = quantity;
      updatePizzaPrice();
      handleQuantityChange();
    });

    quantityElement.textContent = '0';
    updatePizzaPrice();
  });

  //página do carrinho
  if (document.body.classList.contains('cart-page')) {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('#cart-total-value');
    const checkoutButton = document.querySelector('.checkout');

    function renderCartItems() {
      cartItemsContainer.innerHTML = '';
      let totalPrice = 0;

      cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const itemName = document.createElement('p');
        itemName.textContent = `${item.name} (tamanho: ${item.size})`;

        const itemQuantity = document.createElement('p');
        itemQuantity.textContent = `Quantidade: ${item.quantity}`;

        const itemPrice = document.createElement('p');
        const itemTotalPrice = (item.price * item.quantity)
          .toFixed(2)
          .replace('.', ',');
        itemPrice.textContent = `Preço: R$${itemTotalPrice}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.addEventListener('click', () => {
          cart.splice(index, 1);
          updateLocalStorage();
          renderCartItems();
        });

        cartItem.appendChild(itemName);
        cartItem.appendChild(itemQuantity);
        cartItem.appendChild(itemPrice);
        cartItem.appendChild(removeBtn);

        cartItemsContainer.appendChild(cartItem);

        totalPrice += parseFloat(itemTotalPrice.replace(',', '.'));
      });

      totalPriceElement.textContent = totalPrice.toFixed(2).replace('.', ',');
    }

    function finalizePedido() {
      if (cart.length > 0) {
        alert('Pedido finalizado com sucesso!');
        cart = [];
        updateLocalStorage();
        renderCartItems();
        totalPriceElement.textContent = '0,00';
      } else {
        alert('Seu carrinho está vazio.');
      }
    }

    checkoutButton.addEventListener('click', finalizePedido);

    renderCartItems();
  }
});

//contato
document.addEventListener('DOMContentLoaded', function () {
  console.log('JavaScript carregado corretamente');
  document
    .getElementById('contact-form')
    .addEventListener('submit', function (event) {
      event.preventDefault();
      alert('Formulário enviado com sucesso!');
      this.submit();
    });
});

//profiLE

// Máscara para o campo de telefone e CEP
function aplicarMascaraTelefone(input) {
  input.value = input.value.replace(/\D/g, '');
  let phoneLength = input.value.length;
  if (phoneLength === 10) {
    input.value = input.value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (phoneLength === 8) {
    // Máscara para telefone sem DDD (8 caracteres)
    input.value = input.value.replace(/(\d{4})(\d{4})/, '$1-$2');
  } else {
    // Não aplica máscara se o tamanho estiver incorreto
    return;
  }
}

function aplicarMascaraCEP(input) {
  input.value = input.value.replace(/\D/g, '');
  if (input.value.length === 8) {
    input.value = input.value.replace(/(\d{5})(\d{3})/, '$1-$2');
  } else {
    return;
  }
}

document.getElementById('phone').addEventListener('input', function () {
  aplicarMascaraTelefone(this);
});

document.getElementById('cep').addEventListener('input', function () {
  aplicarMascaraCEP(this);
});

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || /^(.)\1*$/.test(cpf)) {
    return false;
  }

  function calcularDigito(cpf, peso) {
    let soma = 0;
    for (let i = 0; i < peso - 1; i++) {
      soma += parseInt(cpf.charAt(i)) * (peso - i);
    }
    let resto = 11 - (soma % 11);
    return resto === 10 || resto === 11 ? 0 : resto;
  }

  const digito1 = calcularDigito(cpf, 10);
  if (digito1 !== parseInt(cpf.charAt(9))) {
    return false;
  }

  const digito2 = calcularDigito(cpf, 11);
  if (digito2 !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

function formatarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

document
  .getElementById('profile-form')
  .addEventListener('submit', function (event) {
    var cpf = document.getElementById('cpf').value;
    if (!validarCPF(cpf)) {
      alert('CPF inválido!');
      event.preventDefault();
    }
  });

// Menu responsivo
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});
