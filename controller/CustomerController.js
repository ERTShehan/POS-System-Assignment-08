$(document).ready(() => {
    $("#customerManagement .btn.save").prop("disabled", true);
    loadTable();
    
    $("#customerManagement #customerID").on("keyup", () => {
        validCusID();
        isSaveEnable();
    });
    
    $("#customerManagement #customerName").on("keyup", () => {
        validCusName();
        isSaveEnable();
    });
    
    $("#customerManagement #customerAddress").on("keyup", () => {
        validCusAddress();
        isSaveEnable();
    });
    
    $("#customerManagement #customerSalary").on("keyup", () => {
        validCusSalary();
        isSaveEnable();
    });
    
    $("#customerManagement .btn.get").on("click", () => {
        console.table(customers);
    });
    
    $("#customerManagement .btn.clear").on("click", () => {
        clearFields();
    });
    
    $("#customerManagement .btn.save").on("click", () => {
        if (!isValidated()) {
            alert("Fields are not validated!");
            return;
        }
        
        if (isCustmerIDExists($("#customerManagement #customerID").val())) {
            alert("Customer ID already exists!");
            return;
        }
        
        let newCustomer = {
            id: $("#customerManagement #customerID").val(),
            name: $("#customerManagement #customerName").val(),
            address: $("#customerManagement #customerAddress").val(),
            salary: parseFloat($("#customerManagement #customerSalary").val())
        };
        
        customers.push(newCustomer);
        loadTable();
        alert("Customer Saved!");
        updateCounts();
        clearFields();
    });
    
    $("#customerManagement .btn.update").on("click", () => {
        if (!isValidated()) {
            alert("Fields are not validated!");
            return;
        }
        
        let id = $("#customerManagement #customerID").val();
        let customer = getCustomerObjectByID(id);
        
        if (!customer) {
            alert("Customer not found!");
            return;
        }
        
        customer.name = $("#customerManagement #customerName").val();
        customer.address = $("#customerManagement #customerAddress").val();
        customer.salary = parseFloat($("#customerManagement #customerSalary").val());
        
        loadTable();
        alert("Customer updated!");
        clearFields();
    });
    
    $("#customerManagement .btn.remove").on("click", () => {
        let id = $("#customerManagement #customerID").val();
        
        if (!id) {
            alert("Please enter a Customer ID to remove");
            return;
        }
        
        if (confirm("Are you sure you want to delete this customer?")) {
            if (deleteCustomer(id)) {
                loadTable();
                alert("Customer removed!");
                clearFields();
                updateCounts();
            } else {
                alert("Customer not found!");
            }
        }
    });
    
    $("#customerManagement #userTable tbody").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let name = $(this).find("td:eq(1)").text();
        let address = $(this).find("td:eq(2)").text();
        let salary = $(this).find("td:eq(3)").text();
        
        $("#customerManagement #customerID").val(id);
        $("#customerManagement #customerName").val(name);
        $("#customerManagement #customerAddress").val(address);
        $("#customerManagement #customerSalary").val(salary);
    });
    
    function validCusID() {
        const cusIDRegex = /^[A-Z]{3}-\d{3}$/;
        let cusId = $("#customerManagement #customerID").val();
        let isValidID = cusIDRegex.test(cusId);
        
        if (!cusId || !isValidID) {
            $("#customerManagement #customerID").css("border-color", "red");
            $("#customerManagement #customerIDError").text("Customer ID is required (Pattern: COD-001)").css("color", "red");
            return false;
        } else {
            $("#customerManagement #customerID").css("border-color", "green");
            $("#customerManagement #customerIDError").text("");
            return true;
        }
    }
    
    function validCusName() {
        let cusName = $("#customerManagement #customerName").val();
        
        if (!cusName || cusName.length < 3) {
            $("#customerManagement #customerName").css("border-color", "red");
            $("#customerManagement #customerNameError").text("Customer Name is required (Min 3 characters)").css("color", "red");
            return false;
        } else {
            $("#customerManagement #customerName").css("border-color", "green");
            $("#customerManagement #customerNameError").text("");
            return true;
        }
    }
    
    function validCusAddress() {
        let cusAddress = $("#customerManagement #customerAddress").val();
        
        if (!cusAddress || cusAddress.length < 5) {
            $("#customerManagement #customerAddress").css("border-color", "red");
            $("#customerManagement #customerAddressError").text("Address is required (Min 5 characters)").css("color", "red");
            return false;
        } else {
            $("#customerManagement #customerAddress").css("border-color", "green");
            $("#customerManagement #customerAddressError").text("");
            return true;
        }
    }
    
    function validCusSalary() {
        let cusSalary = $("#customerManagement #customerSalary").val();
        let salary = parseFloat(cusSalary);
        
        if (!cusSalary || isNaN(salary) || salary <= 0) {
            $("#customerManagement #customerSalary").css("border-color", "red");
            $("#customerManagement #customerSalaryError").text("Salary is required (Must be positive number)").css("color", "red");
            return false;
        } else {
            $("#customerManagement #customerSalary").css("border-color", "green");
            $("#customerManagement #customerSalaryError").text("");
            return true;
        }
    }
    
    function isValidated() {
        return validCusID() && validCusName() && validCusAddress() && validCusSalary();
    }
    
    function isSaveEnable() {
        $("#customerManagement .btn.save").prop("disabled", !isValidated());
    }
    
    function clearFields() {
        $("#customerManagement #customerID").val("").css("border-color", "");
        $("#customerManagement #customerName").val("").css("border-color", "");
        $("#customerManagement #customerAddress").val("").css("border-color", "");
        $("#customerManagement #customerSalary").val("").css("border-color", "");
        
        $("#customerManagement #customerIDError").text("");
        $("#customerManagement #customerNameError").text("");
        $("#customerManagement #customerAddressError").text("");
        $("#customerManagement #customerSalaryError").text("");
        
        $("#customerManagement .btn.save").prop("disabled", true);
    }
    
    function deleteCustomer(id) {
        for (let i = 0; i < customers.length; i++) {
            if (customers[i].id === id) {
                customers.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    
    function isCustmerIDExists(id) {
        return customers.some(customer => customer.id === id);
    }
    
    function getCustomerObjectByID(id) {
        return customers.find(customer => customer.id === id);
    }
    
    function loadTable() {
        let tableBody = $("#customerManagement #userTable tbody");
        tableBody.empty();
        
        customers.forEach(customer => {
            let row = `
                <tr>
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.address}</td>
                    <td>${customer.salary}</td>
                </tr>
            `;
            tableBody.append(row);
        });
    }
    
    function updateCounts() {
        $("#customerCount").val(customers.length);
    }
});