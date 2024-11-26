// DOM Elements
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const addProductButton = document.getElementById("addProductButton");
const publishButton = document.getElementById("publishButton");
const productSection = document.getElementById("productSection");

// Event Listener for Adding Products
addProductButton.addEventListener("click", () => {
    const productName = document.getElementById("productName").value.trim();
    const productDescription = document.getElementById("productDescription").value.trim();
    const productPrice = document.getElementById("productPrice").value.trim();
    const productImages = document.getElementById("productImages").files;

    // Validation
    if (productName && productDescription && productPrice && productImages.length > 0) {
        const imagePreviews = Array.from(productImages).map((image) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            return new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
            });
        });

        Promise.all(imagePreviews).then((images) => {
            const productId = Date.now();

            const productHTML = `
                <li data-id="${productId}">
                    <div class="product-images">
                        ${images.map(img => `<img src="${img}" alt="${productName}" />`).join('')}
                    </div>
                    <div class="product-details">
                        <h3>${productName}</h3>
                        <p>${productDescription}</p>
                        <p><strong>Price:</strong> ₹${productPrice}</p>
                    </div>
                    <div class="product-actions">
                        <button class="edit-btn" onclick="editProduct(${productId})">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${productId})">Delete</button>
                    </div>
                </li>
            `;

            productList.insertAdjacentHTML("beforeend", productHTML);

            productSection.classList.remove("hidden");
            togglePublishButton();

            productForm.reset();
        });
    } else {
        alert("Please fill out all fields and upload at least one image!");
    }
});

// Function to Delete Product
function deleteProduct(productId) {
    const productItem = document.querySelector(`li[data-id="${productId}"]`);
    if (productItem) {
        productList.removeChild(productItem);
        togglePublishButton();
    }
}

// Function to Edit Product
function editProduct(productId) {
    const productItem = document.querySelector(`li[data-id="${productId}"]`);

    if (productItem) {
        const productName = productItem.querySelector("h3").textContent;
        const productDescription = productItem.querySelector("p:nth-of-type(1)").textContent;
        const productPrice = productItem.querySelector("p:nth-of-type(2)").textContent.replace("Price: ₹", "");

        // Populate the form with existing product values
        document.getElementById("productName").value = productName;
        document.getElementById("productDescription").value = productDescription;
        document.getElementById("productPrice").value = productPrice;

        // Remove the current product for editing and prompt for save/cancel
        deleteProduct(productId);

        // Add Save and Cancel buttons
        addSaveCancelButtons(productId);

        // Scroll to the top of the form to edit
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

// Function to Add Save and Cancel Buttons in Edit Mode
function addSaveCancelButtons(productId) {
    const productActions = document.querySelector(`li[data-id="${productId}"] .product-actions`);
    
    const saveButton = document.createElement("button");
    saveButton.classList.add("save-btn");
    saveButton.textContent = "Save";
    saveButton.onclick = () => saveProduct(productId);
    
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-btn");
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = () => cancelEdit(productId);

    productActions.appendChild(saveButton);
    productActions.appendChild(cancelButton);
}

// Function to Save Edited Product
function saveProduct(productId) {
    const productName = document.getElementById("productName").value.trim();
    const productDescription = document.getElementById("productDescription").value.trim();
    const productPrice = document.getElementById("productPrice").value.trim();
    const productImages = document.getElementById("productImages").files;

    if (productName && productDescription && productPrice && productImages.length > 0) {
        const imagePreviews = Array.from(productImages).map((image) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            return new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
            });
        });

        Promise.all(imagePreviews).then((images) => {
            const productItem = document.querySelector(`li[data-id="${productId}"]`);

            // Update the product details
            productItem.querySelector(".product-images").innerHTML = `${images.map(img => `<img src="${img}" alt="${productName}" />`).join('')}`;
            productItem.querySelector(".product-details h3").textContent = productName;
            productItem.querySelector(".product-details p:nth-of-type(1)").textContent = productDescription;
            productItem.querySelector(".product-details p:nth-of-type(2)").textContent = `Price: ₹${productPrice}`;

            // Remove Save/Cancel buttons after saving
            const productActions = productItem.querySelector(".product-actions");
            productActions.querySelector(".save-btn").remove();
            productActions.querySelector(".cancel-btn").remove();
        });
    } else {
        alert("Please fill out all fields and upload at least one image!");
    }
}

// Function to Cancel Edit
function cancelEdit(productId) {
    const productItem = document.querySelector(`li[data-id="${productId}"]`);

    // Remove Save/Cancel buttons
    const productActions = productItem.querySelector(".product-actions");
    productActions.querySelector(".save-btn").remove();
    productActions.querySelector(".cancel-btn").remove();

    // Reset the form values to their initial state
    const initialProductDetails = productItem.querySelector(".product-details");
    document.getElementById("productName").value = initialProductDetails.querySelector("h3").textContent;
    document.getElementById("productDescription").value = initialProductDetails.querySelector("p:nth-of-type(1)").textContent;
    document.getElementById("productPrice").value = initialProductDetails.querySelector("p:nth-of-type(2)").textContent.replace("Price: ₹", "");
}

// Toggle Publish Button Visibility
function togglePublishButton() {
    const productItems = productList.children.length;
    publishButton.classList.toggle("hidden", productItems === 0);
}
