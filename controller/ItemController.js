$(document).ready(() => {
    $(".btn.save").prop("disabled", true);
    loadTable();
    
    $("#itemManagement #itemCode").on("keyup", () => {
        validItemCode();
        isSaveEnable();
    });
    
    $("#itemManagement #itemName").on("keyup", () => {
        validItemName();
        isSaveEnable();
    });
    
    $("#itemManagement #itemQty").on("keyup", () => {
        validItemQty();
        isSaveEnable();
    });
    
    $("#itemManagement #itemPrice").on("keyup", () => {
        validItemPrice();
        isSaveEnable();
    });
    
    $("#itemManagement .btn.get").on("click", () => {
        loadTable();
    });
    
    $("#itemManagement .btn.clear").on("click", () => {
        clearFields();
    });
    
    $("#itemManagement .btn.save").on("click", () => {
        if (!isValidated()) {
            alert("Fields are not validated!");
            return;
        }
        
        if (isItemCodeExists($("#itemManagement #itemCode").val())) {
            alert("Item Code already exists!");
            return;
        }
        
        let newItem = {
            code: $("#itemManagement #itemCode").val(),
            name: $("#itemManagement #itemName").val(),
            qty: parseInt($("#itemManagement #itemQty").val()),
            price: parseFloat($("#itemManagement #itemPrice").val())
        };
        
        items.push(newItem);
        loadTable();
        alert("Item Saved!");
        updateCounts();
        clearFields();
    });
    
    $("#itemManagement .btn.update").on("click", () => {
        if (!isValidated()) {
            alert("Fields are not validated!");
            return;
        }
        
        let code = $("#itemManagement #itemCode").val();
        let item = getItemObjectByCode(code);
        
        if (!item) {
            alert("Item not found!");
            return;
        }
        
        item.name = $("#itemManagement #itemName").val();
        item.qty = parseInt($("#itemManagement #itemQty").val());
        item.price = parseFloat($("#itemManagement #itemPrice").val());
        
        loadTable();
        alert("Item updated!");
        clearFields();
    });
    
    $("#itemManagement .btn.remove").on("click", () => {
        let code = $("#itemManagement #itemCode").val();
        
        if (!code) {
            alert("Please enter an Item Code to remove");
            return;
        }
        
        if (confirm("Are you sure you want to delete this item?")) {
            if (deleteItem(code)) {
                loadTable();
                alert("Item removed!");
                clearFields();
                updateCounts();
            } else {
                alert("Item not found!");
            }
        }
    });
    
    $("#itemManagement #itemTable tbody").on("click", "tr", function() {
        let code = $(this).find("td:eq(0)").text();
        let name = $(this).find("td:eq(1)").text();
        let qty = $(this).find("td:eq(2)").text();
        let price = $(this).find("td:eq(3)").text();
        
        $("#itemManagement #itemCode").val(code);
        $("#itemManagement #itemName").val(name);
        $("#itemManagement #itemQty").val(qty);
        $("#itemManagement #itemPrice").val(price);
    });
    
    function validItemCode() {
        const itemCodeRegex = /^\d{3}-\d{3}$/;
        let itemCode = $("#itemManagement #itemCode").val();
        let isValidCode = itemCodeRegex.test(itemCode);
        
        if (!itemCode || !isValidCode) {
            $("#itemManagement #itemCode").css("border-color", "red");
            $("#itemManagement #itemCodeError").text("Item Code is required (Pattern: 100-001)").css("color", "red");
            return false;
        } else {
            $("#itemManagement #itemCode").css("border-color", "green");
            $("#itemManagement #itemCodeError").text("");
            return true;
        }
    }
    
    function validItemName() {
        let itemName = $("#itemManagement #itemName").val();
        
        if (!itemName || itemName.length < 3) {
            $("#itemManagement #itemName").css("border-color", "red");
            $("#itemManagement #itemNameError").text("Item Name is required (Min 3 characters)").css("color", "red");
            return false;
        } else {
            $("#itemManagement #itemName").css("border-color", "green");
            $("#itemManagement #itemNameError").text("");
            return true;
        }
    }
    
    function validItemQty() {
        let itemQty = $("#itemManagement #itemQty").val();
        let qty = parseInt(itemQty);
        
        if (!itemQty || isNaN(qty) || qty <= 0) {
            $("#itemManagement #itemQty").css("border-color", "red");
            $("#itemManagement #itemQtyError").text("Quantity is required (Must be positive number)").css("color", "red");
            return false;
        } else {
            $("#itemManagement #itemQty").css("border-color", "green");
            $("#itemManagement #itemQtyError").text("");
            return true;
        }
    }
    
    function validItemPrice() {
        let itemPrice = $("#itemManagement #itemPrice").val();
        let price = parseFloat(itemPrice);
        
        if (!itemPrice || isNaN(price) || price <= 0) {
            $("#itemManagement #itemPrice").css("border-color", "red");
            $("#itemManagement #itemPriceError").text("Price is required (Must be positive number)").css("color", "red");
            return false;
        } else {
            $("#itemManagement #itemPrice").css("border-color", "green");
            $("#itemManagement #itemPriceError").text("");
            return true;
        }
    }
    
    function isValidated() {
        return validItemCode() && validItemName() && validItemQty() && validItemPrice();
    }
    
    function isSaveEnable() {
        $("#itemManagement .btn.save").prop("disabled", !isValidated());
    }
    
    function clearFields() {
        $("#itemManagement #itemCode").val("").css("border-color", "");
        $("#itemManagement #itemName").val("").css("border-color", "");
        $("#itemManagement #itemQty").val("").css("border-color", "");
        $("#itemManagement #itemPrice").val("").css("border-color", "");
        
        $("#itemManagement #itemCodeError").text("");
        $("#itemManagement #itemNameError").text("");
        $("#itemManagement #itemQtyError").text("");
        $("#itemManagement #itemPriceError").text("");
        
        $("#itemManagement .btn.save").prop("disabled", true);
    }
    
    function deleteItem(code) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].code === code) {
                items.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    
    function isItemCodeExists(code) {
        return items.some(item => item.code === code);
    }
    
    function getItemObjectByCode(code) {
        return items.find(item => item.code === code);
    }
    
    function loadTable() {
        let tableBody = $("#itemManagement #itemTable tbody");
        tableBody.empty();
        
        items.forEach(item => {
            let row = `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${item.price}</td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

    function updateCounts() {
        $("#itemCount").val(items.length);
    }
});