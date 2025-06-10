var maxPhoneSize = 768;
$(document).ready(function () {
    $('#submit-secure-panel').prop('disabled', true);
    checkWindowSize();
    // Configuration for SecurePanel
    var config = {
        oneTimeToken: $('#oneTimeToken').val(),
        fieldDivId: "secure-panel",
        layout: {
            rows: [{
                classes: "bg-primary text-white",
                cells: [{
                    colspan: 6,
                    label: {
                        text: "Card Number:",
                        fieldColspan: 5
                    },
                    field: {
                        fieldType: "number",
                        fieldColspan: 7
                    }
                }
                    , {
                    colspan: 6,
                    label: {
                        text: "Card Name:",
                        fieldColspan: 5
                    },
                    field: {
                        fieldType: "name",
                        fieldColspan: 7
                    }
                }
                ],
            },
            {
                classes: "bg-primary text-white",
                cells: [{
                    colspan: 6,
                    label: {
                        text: "Expiry:",
                        fieldColspan: 5
                    },
                    field: {
                        fieldType: "expiry",
                        fieldColspan: 7
                    }
                },
                {
                    colspan: 6,
                    label: {
                        text: "CVV Number:",
                        fieldColspan: 5
                    },
                    field: {
                        fieldType: "cvn",
                        fieldColspan: 7
                    }
                }
                ],
            },
            ],
        },
    };

    var initialiseModel = { amount: Number.parseFloat($('#amount').val()) * 100 };

    // Callback function for initialization
    function initializeCallback(response) {
        console.log("Initialization response:", response);
        $('#submit-secure-panel').prop('disabled', false);
    }

    // Callback function for surcharge
    function surchargeCallback(response, data) {
        console.log("Surcharge response:", response, data);
        if (response.result.status == "ok" && Number.parseInt(data?.surcharge) != Number.NaN) {
            // update surcharge and total amount:
            var surcharge = parseFloat(data.surcharge / 100);
            var totalAmount = surcharge + parseFloat($("#price").val()) * parseFloat($("#quantity").val());
            $("#lbl_surcharge").text(`$ ${surcharge.toFixed(2)}`);
            $("#surcharge").val(surcharge);
            $("#totalGST").text(`$ ${totalAmount.toFixed(2)}`);
            $("#amount").val(totalAmount);
        }
    }

    // Callback function for processing
    function processCallback(response, data) {
        console.log("Processing response:", response);
        console.log("Processing data:", data);
        if (data != null && data.canCreateTransaction) {
            $("#createTransactionForm").submit();
        } else {
            showPopUpWindow(response);
            $('#submit-secure-panel').html('Pay');
            $('#submit-secure-panel').prop('disabled', false);
        }
    }

    // Initialize SecurePanel on document ready (equivalent to window load)
    $(function () {
        GPAUNZ.SecurePanel.initialise(config, initialiseModel, initializeCallback, null, $("#lbl_surcharge").length > 0 ? surchargeCallback: undefined);
    });

    function showPopUpWindow(response) {
        console.log(response);
        if (response.result && (response.result.status === "ok" || response.result.status === "approved")) {
            Swal.fire({
                title: 'Processed Successfully!',
                text: 'Transaction id: ' + response.id,
                icon: 'success',
                heightAuto: false
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location = "/"; // Use "window.location" to redirect
                }
            });
        } else if (response.result && response.result.status === "validation_error") {
            var errorMessages = response.result.codes.map(function (code) {
                switch (code.id.toUpperCase()) {
                    case "V10086":
                        return "Invalid card name";
                    case "V10090":
                        return "Invalid card number";
                    case "V10089":
                        return "Invalid CVN";
                    case "V10087":
                    case "V10088":
                        return "Invalid expiry date";
                    default:
                        return "An error occurred with error ID " + code.id + ": " + code.message;
                }
            });
            Swal.fire({
                title: 'Error! Please Check',
                html: errorMessages.join('<br>'),
                icon: 'error',
                confirmButtonText: 'Okay',
                heightAuto: false
            });
        } else {
            Swal.fire({
                title: 'Error! Please Check',
                text: 'System Error',
                icon: 'error',
                confirmButtonText: 'Okay',
                heightAuto: false
            });
        }
    }

    $('#submit-secure-panel').click(function () {
        $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing');
        $(this).prop('disabled', true);
        GPAUNZ.SecurePanel.process(processCallback);
    });

    function checkWindowSize() {
        var windowWidth = $(window).width();
        if (windowWidth <= maxPhoneSize) {
            $('#footer').css("visibility", "hidden");
        } else {
            $('#footer').css("visibility", "visible");
        }
    };

    $(window).resize(function () {
        checkWindowSize();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    function displayCurrentYear() {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }
    displayCurrentYear();
});