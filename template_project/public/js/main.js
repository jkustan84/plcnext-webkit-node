const socket = io();

socket.on('welcomeMessage', message => {
    console.log(message);
});

socket.on('sparkplugConnection', sparkplugStatus => {
    let sparkplugIcon = document.querySelector('.sparkplug-icon');
    
    if(sparkplugStatus.driver.connecting){
        sparkplugIcon.src = "/assets/cloud-question.svg";
    } else if (!sparkplugStatus.driver.connecting && sparkplugStatus.driver.connected) {
        sparkplugIcon.src = "/assets/cloud-check.svg";
    } else {
        sparkplugIcon.src = "/assets/cloud-alert.svg";
    }
});

socket.on('apiConnection', apiStatus => {    
    let apiIcon = document.querySelector('.api-icon');

    if(apiStatus){
        apiIcon.src = "/assets/api-available.svg";
    } else {
        apiIcon.src = "/assets/api-unavailable.svg";
    }
});

socket.on('data', dataValues => {
    let dataTableBody = document.getElementById('data-table-body');

    async function deleteTable(){
        dataTableBody.innerHTML = "";
    }
    
    async function createTable(){
        await deleteTable();

        dataValues.metrics.forEach((metric) => {
            let row = dataTableBody.insertRow();
            let cell_0 = row.insertCell(0);
            cell_0.innerHTML= metric.name;
            let cell_1 = row.insertCell(1);
            cell_1.innerHTML = metric.value;
            let cell_2 = row.insertCell(2);
            cell_2.innerHTML = metric.type;
        });
    }

    deleteTable();
    createTable();
});