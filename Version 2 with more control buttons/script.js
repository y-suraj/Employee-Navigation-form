var conn_token = "90938056|-31949266042455593|90953420";
var db = "Employee";
var rel = "emp-rel";
var baseUrl = "http://api.login2explore.com:5577";
var iml_url = "/api/iml";
var irl_url = "/api/irl";


// LOCAL STORAGE

//FORM INITIALIZE
function intEmpForm() {
    localStorage.removeItem("first_rec_no");
    localStorage.removeItem("rec_no");
    localStorage.removeItem("last_rec_no");
    console.log('Done. Emp Form Initialize')
}


//Set Method

//Store First Record in Local Storage
function setFirstRecNo2LS(resObj) {
    var data = JSON.parse(resObj.data).rec_no;
    localStorage.setItem("first_rec_no", data);
}

//Store Current Record in Local Storage
function setCurRecNo2LS(resObj) {
    var data = JSON.parse(resObj.data).rec_no;
    localStorage.setItem("rec_no", data);
}

//Store Last Record in Local Storage
function setLastRecNo2LS(resObj) {
    var data = JSON.parse(resObj.data).rec_no;
    localStorage.setItem("last_rec_no", data);
}


//Get Method

//Return First Record from Local Storage
function getFirstRecNoFromLS() {
    return localStorage.getItem('first_rec_no');
}

//Return Current Record from Local Storage
function getCurRecNoFromLS(resObj) {
    return localStorage.getItem('rec_no');
}

//Return Last Record from Local Storage
function getLastRecNoFromLS(resObj) {
    return localStorage.getItem('last_rec_no');
}


// CHECK FOR NO RECORD FOUND
function isNoRecordinLS() {

    if (localStorage.length) {
        return false
    }
    else {
        return true
    }

}

// CHECK FOR ONE RECORD ONLY
function isOneRecordInLS() {
    if (isNoRecordinLS()) {
        return false
    }

    if (getFirstRecNoFromLS() == getLastRecNoFromLS()) {
        return true
    }

    return false
}

//CHECK FOR NO RECORD
function checkForNoOrOneRecord() {

    if (isNoRecordinLS()) {
        disableNav(true);
        disableForm(true);
        disableCtrl(true);
        $("#new").prop("disabled", false);
        return
    }

    if (isOneRecordInLS()) {
        disableNav(true);
        disableForm(true);
        disableCtrl(true);

        $("#new").prop("disabled", false);
        $("#edit").prop("disabled", false);

        return
    }
}


// Disable Buttons

//Disable Ctrl
function disableCtrl(val) {
    $("#new").prop('disabled', val);
    $("#save").prop('disabled', val);
    $("#edit").prop('disabled', val);
    $("#change").prop('disabled', val);
    $("#reset").prop('disabled', val);
}

//Disable NAV
function disableNav(val) {
    $("#first").prop('disabled', val);
    $("#prev").prop('disabled', val);
    $("#next").prop('disabled', val);
    $("#last").prop('disabled', val);
}

//Disable Form
function disableForm(val) {
    $("#empid").prop('disabled', val);
    $("#name").prop('disabled', val);
    $("#salary").prop('disabled', val);
    $("#hra").prop('disabled', val);
    $("#da").prop('disabled', val);
    $("#deduct").prop('disabled', val);
}

//  DISPLAY METHODS

//DISPLAY DATA ON FORM
function showData(resObj) {

    if (resObj.status == 400) {
        return "";
    }

    var data = (JSON.parse(resObj.data)).record;
    setCurRecNo2LS(resObj);

    $("#empid").val(data.empid);
    $("#name").val(data.name);
    $("#salary").val(data.salary);
    $("#hra").val(data.hra);
    $("#da").val(data.da);
    $("#deduct").val(data.deduct);
    $("#empname").focus();

    disableNav(false);
    disableForm(true);

    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);


    if (getCurRecNoFromLS() == getLastRecNoFromLS()) {
        $("#next").prop("disabled", true);
        $("#last").prop("disabled", true);
    }

    if (getCurRecNoFromLS() == getFirstRecNoFromLS()) {
        $("#prev").prop("disabled", true);
        $("#first").prop("disabled", true);
    }

}

//GET FIRST RECORD
function getFirst() {
    var request = createFIRST_RECORDRequest(conn_token, db, rel);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
    showData(resultObj);
    setFirstRecNo2LS(resultObj);
    jQuery.ajaxSetup({ async: true });


    $("#first").prop("disabled", true);
    $("#prev").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#next").prop("disabled", false);

}

function getPrev() {
    var rec_no = getCurRecNoFromLS();


    var request = createPREV_RECORDRequest(conn_token, db, rel, rec_no);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
    showData(resultObj);
    jQuery.ajaxSetup({ async: true });

    var new_rec_no = getCurRecNoFromLS();

    if (new_rec_no == getFirstRecNoFromLS()) {
        $("#first").prop("disabled", true);
        $("prev").prop("disabled", true);
    }


}

function getNext() {
    var rec_no = getCurRecNoFromLS();


    var request = createNEXT_RECORDRequest(conn_token, db, rel, rec_no);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
    showData(resultObj);
    jQuery.ajaxSetup({ async: true });

    var new_rec_no = getCurRecNoFromLS();

    if (new_rec_no == getLastRecNoFromLS()) {
        $("#last").prop("disabled", true);
        $("next").prop("disabled", true);
    }


}


//GET LAST RECORD
function getLast() {

    var request = createLAST_RECORDRequest(conn_token, db, rel);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
    setLastRecNo2LS(resultObj);
    showData(resultObj);
    jQuery.ajaxSetup({ async: true });


    $("#first").prop("disabled", false);
    $("#prev").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#next").prop("disabled", true);
    $("#last").prop("disabled", true);
}

// CONTROL METHODS     

function clearForm() {
    $("#empid").val("");
    $("#name").val("");
    $("#salary").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");
}

//FORM VALIDATION
function validatedData() {

    var empid = $("#empid").val();
    var name = $("#name").val();
    var salary = $("#salary").val();
    var hra = $("#hra").val();
    var da = $("#da").val();
    var deduct = $("#deduct").val();

    if (empid === "") {
        alert("Employee ID required");
        $("#empid").focus();
        return "";
    }

    if (name === "") {
        alert("Employee Name required");
        $("#name").focus();
        return "";
    }

    if (salary === "") {
        alert("Employee Salary required");
        $("#salary").focus();
        return "";
    }

    if (hra === "") {
        alert("Employee HRA required");
        $("#hra").focus();
        return "";
    }

    if (da === "") {
        alert("Employee DA required");
        $("#da").focus();
        return "";
    }

    if (deduct === "") {
        alert("Employee Deduction required");
        $("#deduct").focus();
        return "";
    }

    var jsonObj = {
        empid: empid,
        name: name,
        salary: salary,
        hra: hra,
        da: da,
        deduct: deduct,

    };

    return JSON.stringify(jsonObj);
}


function newForm() {

    clearForm();
    disableForm(false);
    disableNav(true);
    disableCtrl(true);

    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);

    $("#empid").focus();

}


function saveForm() {
    var jsonStrObj = validatedData();
    if (jsonStrObj === "") {
        return "";
    }

    var putReqStr = createPUTRequest(conn_token, jsonStrObj, db, rel);



    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, baseUrl, iml_url);
    jQuery.ajaxSetup({ async: true });
    if (isNoRecordinLS()) {
        setFirstRecNo2LS(resultObj);
    }
    setLastRecNo2LS(resultObj);
    setCurRecNo2LS(resultObj);

    resetForm();
}


function editForm() {
    disableForm(false);
    $("#empid").prop("disabled", true);
    $("#empname").focus();
    disableNav(true);
    disableCtrl(true);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);


}

function changeForm() {

    var jsonStrObj = validatedData();
    var updateRequest = createUPDATERecordRequest(conn_token, jsonStrObj, db, rel, getCurRecNoFromLS());
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(updateRequest, baseUrl, iml_url);
    jQuery.ajaxSetup({ async: true });

    resetForm();
}



function resetForm() {

    disableCtrl(true);
    disableNav(false);
    var getRequest = createGET_BY_RECORDRequest(conn_token, db, rel, getCurRecNoFromLS());

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(getRequest, baseUrl, irl_url);
    showData(resultObj);
    jQuery.ajaxSetup({ async: true });

    if (isOneRecordInLS() || isNoRecordinLS()) {
        disableNav(true);
    }

    $("#new").prop("disabled", false);
    if (isNoRecordinLS()) {
        clearForm();
        $("#edit").prop("disabled", true);
    }
    else {
        $("#edit").prop("disabled", false);
    }

    disableForm(true);
}


intEmpForm();
getFirst();
getLast();
checkForNoOrOneRecord();