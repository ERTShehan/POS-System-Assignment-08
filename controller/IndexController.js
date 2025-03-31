$(document).ready(() => {
    $("#customerManagement").hide();
    $("#itemManagement").hide();
    $("#orderManagement").hide();

    $("#homeLink").click(() => {
        $("#dashboardContent").show();
        $("#customerManagement").hide();
        $("#itemManagement").hide();
        $("#orderManagement").hide();
        $("#pageTitle").text("Dashboard");
    });

    $("#customerLink").click(() => {
        $("#dashboardContent").hide();
        $("#customerManagement").show();
        $("#itemManagement").hide();
        $("#orderManagement").hide();
        $("#pageTitle").text("Customer Management");
    });

    $("#itemLink").click(() => {
        $("#dashboardContent").hide();
        $("#customerManagement").hide();
        $("#itemManagement").show();
        $("#orderManagement").hide();
        $("#pageTitle").text("Item Management");
    });

    $("#orderLink").click(() => {
        $("#dashboardContent").hide();
        $("#customerManagement").hide();
        $("#itemManagement").hide();
        $("#orderManagement").show();
        $("#pageTitle").text("Order Management");
        $("#date").val(new Date().toISOString().substr(0, 10));
        loadCustomersForOrder();
        loadItemsForOrder();
    });

    updateCounts();

    function updateCounts() {
        $("#customerCount").val(customers.length);
        $("#itemCount").val(items.length);
        $("#orderCount").val(orders.length);
    }

    function loadCustomersForOrder() {
        $("#select-customer").empty();
        $("#select-customer").append('<option value="">Select Customer</option>');
        customers.forEach(customer => {
            $("#select-customer").append(`<option value="${customer.id}">${customer.name}</option>`);
        });
    }

    function loadItemsForOrder() {
        $("#item-code").empty();
        $("#item-code").append('<option value="">Select Item Code</option>');
        items.forEach(item => {
            $("#item-code").append(`<option value="${item.code}">${item.code} - ${item.name}</option>`);
        });
    }
});