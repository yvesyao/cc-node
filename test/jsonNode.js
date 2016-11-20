
const db = require('../public/javascripts/db');
var getChartData = require('../public/javascripts/getChartData');

//db.query('select * from computer limit 0,50', (result) => {
//    if(result.success) {
//        console.log(JSON.stringify(getChartData.getComputer(result.data)));
//    }
//});

//db.query('select * from user limit 0,50', (result) => {
//    if(result.success) {
//        console.log(JSON.stringify(getChartData.getUser(result.data)));
//    }
//});

db.query("select * from groupData where name in ('paicdom.local', 'RAS and IAS Servers', 'GS_Forest_IAS_Server_Groups', 'Cert Publishers', 'Terminal Server License Servers', 'WlanComputers', 'Terminal Server Computers', 'PC_Computer_PowerSave_Exclude', 'USB_RO_MachineGroup', 'Exchange Domain Servers', 'USB_RO_Life_Machinegroup', 'Exchange Install Domain Servers', 'USB_RW_Life_Machinegroup')", (result) => {
    if(result.success) {
        console.log(JSON.stringify(getChartData.getGroup(result.data)));
    }
});