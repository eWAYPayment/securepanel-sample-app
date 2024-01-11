$(document).ready(function () {
    checkWindowSize();
    // Configuration for SecurePanel
    var config = {
        oneTimeToken: oneTimeToken,
        fieldDivId: "secure-panel",
        layout: {
            rows: [{
                    classes: "bg-primary text-white",
                    cells: [{
                            colspan: 6,
                            label: {
                                text: "Card Name:",
                                fieldColspan: 5
                            },
                            field: {
                                fieldType: "name",
                                fieldColspan: 7
                            }
                        },
                        {
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

    // Callback function for initialization
    function initializeCallback(response) {
        console.log("Initialization response:", response);
    }

    // Callback function for processing
    function processCallback(response, data) {
        console.log("Processing response:", response);
        console.log("Processing data:", data);
        if(data != null && data.canCreateTransaction){
            $("#createTransactionForm").submit();
        }else{
            showPopUpWindow(response);            
            $('#submit-secure-panel').html('Pay');
            $('#submit-secure-panel').prop('disabled', false);            
        }
        
    }
    // Initialize SecurePanel on document ready (equivalent to window load)
    $(function () {
        GPAUNZ.SecurePanel.initialise(config, null, initializeCallback);
    });

    function showPopUpWindow(response) {
        console.log(response);
        if(response.result && (response.result.status === "ok" || response.result.status === "approved")) {
            Swal.fire({
                title: 'Processed Successfully!',
                text: 'Transaction id: '+ response.id,
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
                        return "Unknown error with ID " + code.id + ": " + code.message;
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
