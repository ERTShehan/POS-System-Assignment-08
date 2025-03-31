$(document).ready(() => {
    generateOrderId();
    setCurrentDate();
    loadCustomersForOrder();
    loadItemsForOrder();
    
    $("#orderManagement #searchOrder").on("click", function() {
        let orderId = $("#orderID").val();
        if (!orderId) {
            alert("Please enter an Order ID to search");
            return;
        }
        
        let foundOrder = orders.find(order => order.id === orderId);
        if (!foundOrder) {
            alert("Order not found");
            return;
        }
        
        loadOrderDetails(foundOrder);
    });
    
    $("#orderManagement #select-customer").on("change", function() {
        let customerId = $(this).val();
        if (customerId) {
            let customer = getCustomerObjectByID(customerId);
            if (customer) {
                $("#customerID").val(customer.id);
                $("#name").val(customer.name);
                $("#address").val(customer.address);
                $("#salary").val(customer.salary);
            }
        }
    });
    
    $("#orderManagement #item-code").on("change", function() {
        let itemCode = $(this).val();
        if (itemCode) {
            let item = getItemObjectByCode(itemCode);
            if (item) {
                $("#itemCode").val(item.code);
                $("#itemName").val(item.name);
                $("#price").val(item.price);
                $("#qty").val(item.qty);
            }
        }
    });
    
    $("#orderManagement #orderQty").on("keyup", function() {
        let orderQty = parseInt($(this).val());
        let availableQty = parseInt($("#qty").val());
        
        if (isNaN(orderQty)) {
            $("#orderQtyError").text("Please enter a valid quantity").css("color", "red");
            return;
        }
        
        if (orderQty > availableQty) {
            $("#orderQtyError").text("Order quantity exceeds available quantity").css("color", "red");
        } else {
            $("#orderQtyError").text("");
        }
    });
    
    $("#orderManagement #orderItemForm").on("submit", function(e) {
        e.preventDefault();
        
        let itemCode = $("#itemCode").val();
        let itemName = $("#itemName").val();
        let price = parseFloat($("#price").val());
        let orderQty = parseInt($("#orderQty").val());
        let availableQty = parseInt($("#qty").val());
        
        if (!itemCode || !itemName || isNaN(price) || isNaN(orderQty)) {
            alert("Please select an item and enter valid quantity");
            return;
        }
        
        if (orderQty > availableQty) {
            alert("Order quantity exceeds available quantity");
            return;
        }
        
        let orderId = $("#orderID").val();
        let currentOrder = orders.find(order => order.id === orderId);
        
        if (!currentOrder) {
            currentOrder = {
                id: orderId,
                date: $("#date").val(),
                customerId: $("#customerID").val(),
                items: [],
                total: 0,
                discount: 0,
                subTotal: 0
            };
            orders.push(currentOrder);
        }
        
        let existingItemIndex = currentOrder.items.findIndex(item => item.itemCode === itemCode);
        
        if (existingItemIndex >= 0) {
            let newTotalQty = currentOrder.items[existingItemIndex].qty + orderQty;
            
            if (newTotalQty > availableQty) {
                alert("Total ordered quantity exceeds available quantity");
                return;
            }
            
            currentOrder.items[existingItemIndex].qty = newTotalQty;
            currentOrder.items[existingItemIndex].total = newTotalQty * price;
        } else {
            currentOrder.items.push({
                itemCode: itemCode,
                itemName: itemName,
                price: price,
                qty: orderQty,
                total: price * orderQty
            });
        }
        
        let dbItem = getItemObjectByCode(itemCode);
        if (dbItem) {
            dbItem.qty -= orderQty;
            $("#qty").val(dbItem.qty);
        }
        
        loadOrderTable(currentOrder);
        calculateTotals(currentOrder);
        
        $("#item-code").val("").trigger("change");
        $("#orderQty").val("");
    });
    
    $("#orderManagement #cash").on("keyup", function() {
        let cash = parseFloat($(this).val());
        let total = parseFloat($("#totalRs").text().replace("Rs/=", ""));
        
        if (isNaN(cash)) {
            $("#cashError").text("Please enter a valid amount").css("color", "red");
            return;
        }
        
        if (cash < total) {
            $("#cashError").text("Insufficient credit").css("color", "red");
        } else {
            $("#cashError").text("");
            calculateBalance();
        }
    });
    
    $("#orderManagement #discount").on("keyup", function() {
        let orderId = $("#orderID").val();
        let currentOrder = orders.find(order => order.id === orderId);
        if (currentOrder) {
            let discountPercentage = parseFloat($(this).val()) || 0;
            
            if (discountPercentage < 0) discountPercentage = 0;
            if (discountPercentage > 100) discountPercentage = 100;
            
            currentOrder.discount = discountPercentage;
            
            calculateTotals(currentOrder);
            calculateBalance();
        }
    });
    
    $("#orderManagement #purchase-form").on("submit", function(e) {
        e.preventDefault();
        
        let orderId = $("#orderID").val();
        let currentOrder = orders.find(order => order.id === orderId);
        
        if (!currentOrder) {
            alert("Please add at least one item to the order");
            return;
        }
        
        let cash = parseFloat($("#cash").val());
        let discount = parseFloat($("#discount").val()) || 0;
        
        if (isNaN(cash) || cash < currentOrder.total) {
            alert("Please enter sufficient cash amount");
            return;
        }
        
        currentOrder.discount = discount;
        currentOrder.cash = cash;
        currentOrder.balance = cash - currentOrder.total;
        
        alert("Order placed successfully!");
        
        $("#purchase-form")[0].reset();
        $("#orderTable tbody").empty();
        $("#subTotalRs").text("00.0Rs/=");
        $("#totalRs").text("00.0Rs/=");
        generateOrderId();
        setCurrentDate();
        updateCounts();
    });
    
    function loadOrderDetails(order) {
        let customer = getCustomerObjectByID(order.customerId);
        if (customer) {
            $("#customerID").val(customer.id);
            $("#name").val(customer.name);
            $("#address").val(customer.address);
            $("#salary").val(customer.salary);
        }
        
        $("#date").val(order.date);
        $("#discount").val(order.discount);
        $("#cash").val(order.cash || "");
        $("#balance").val(order.balance || "");
        
        loadOrderTable(order);
        
        $("#subTotalRs").text(order.subTotal.toFixed(2) + "Rs/=");
        $("#totalRs").text(order.total.toFixed(2) + "Rs/=");
    }
    
    function generateOrderId() {
        let orderId = "OD" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        $("#orderID").val(orderId);
    }
    
    function setCurrentDate() {
        let today = new Date();
        let dateStr = today.toISOString().substr(0, 10);
        $("#date").val(dateStr);
    }
    
    function loadCustomersForOrder() {
        let select = $("#select-customer");
        select.empty();
        select.append('<option value="">Select Customer</option>');
        
        customers.forEach(customer => {
            select.append(`<option value="${customer.id}">${customer.name}</option>`);
        });
    }
    
    function loadItemsForOrder() {
        let select = $("#item-code");
        select.empty();
        select.append('<option value="">Select Item Code</option>');
        
        items.forEach(item => {
            select.append(`<option value="${item.code}">${item.code}</option>`);
        });
    }
    
    function loadOrderTable(order) {
        let tableBody = $("#orderTable tbody");
        tableBody.empty();
        
        order.items.forEach(item => {
            let row = `
                <tr>
                    <td>${item.itemCode}</td>
                    <td>${item.itemName}</td>
                    <td>${item.price}</td>
                    <td>${item.qty}</td>
                    <td>${item.total}</td>
                </tr>
            `;
            tableBody.append(row);
        });
    }
    
    function calculateTotals(order) {
        order.subTotal = order.items.reduce((sum, item) => sum + item.total, 0);
        
        order.total = order.subTotal - (order.subTotal * order.discount / 100);
        
        $("#subTotalRs").text(order.subTotal.toFixed(2) + "Rs/=");
        $("#totalRs").text(order.total.toFixed(2) + "Rs/=");
    }
    
    function calculateBalance() {
        let cash = parseFloat($("#cash").val()) || 0;
        let total = parseFloat($("#totalRs").text().replace("Rs/=", ""));
        
        if (!isNaN(cash) && !isNaN(total)) {
            let balance = cash - total;
            $("#balance").val(balance.toFixed(2));
        }
    }
    
    function getCustomerObjectByID(id) {
        return customers.find(customer => customer.id === id);
    }
    
    function getItemObjectByCode(code) {
        return items.find(item => item.code === code);
    }
});