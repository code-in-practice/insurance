/**
 * Created by zsj on 16-6-13.
 */

function doLogin(thisDOM) {
    var username= document.getElementById('username').value;
    var password= document.getElementById('password').value;
    var captcha= document.getElementById('captcha').value;

    var url = "/login";

    var formData = {
        username: username,
        password: password,
        captcha: captcha
    };

    $.post(url, formData, function (data) {
        console.log(data);
        window.location.href='/user';
    })
};

function doSubmit(){
    var url = '/order';
    var formData = getFormInfo();
    formData['__EVENTTARGET'] = 'ctl00$BottomIssues$btnSave';
    console.log('formData: ', formData);

    $.post(url, formData, function (data) {
        console.log(data);
        alert(data.msg);
        // window.location.href='/order/success';
    })
}

// 重新获取保险相关的表单项
function reloadServiceId(){
    var url = '/order?';
    var formData = getFormInfo();
    formData['__EVENTTARGET'] = 'ctl00$TopIssues$ServiceId';
    var query = ''
    Object.keys(formData).forEach(function (key, index) {
        // console.log(key, index);
        if(index > 0){
            query += '&';
        }
        query += (encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]));
        
    })
    url += query;
    // console.log(url)

    window.location.href=url;
}

function getFormInfo(){
    var formData = {};
    formData['ctl00$TopIssues$ServiceId'] = $("select[name='ctl00$TopIssues$ServiceId']").val();
    formData['ctl00$TopIssues$ProductId'] = $("select[name='ctl00$TopIssues$ProductId']").val();
    formData['ctl00$MainIssues$InsureUser'] = $("input[name='ctl00$MainIssues$InsureUser']").val();
    formData['ctl00$MainIssues$InsureSex'] = $("input[name='ctl00$MainIssues$InsureSex']:checked").val();
    formData['ctl00$MainIssues$InsureIdType'] = $("select[name='ctl00$MainIssues$InsureIdType']").val();
    formData['ctl00$MainIssues$InsureIdNumber'] = $("input[name='ctl00$MainIssues$InsureIdNumber']").val();
    formData['ctl00$MainIssues$InsureDays'] = $("select[name='ctl00$MainIssues$InsureDays']").val();
    formData['ctl00$MainIssues$InsureBirthDate'] = $("input[name='ctl00$MainIssues$InsureBirthDate']").val();
    formData['ctl00$MainIssues$InsurePhone'] = $("input[name='ctl00$MainIssues$InsurePhone']").val();
    formData['ctl00$MainIssues$InsureMark'] = $("input[name='ctl00$MainIssues$InsureMark']").val();
    formData['ctl00$MainIssues$InsureBeginTime'] = $("input[name='ctl00$MainIssues$InsureBeginTime']").val() || '2016-07-30 22:32';
    return formData;
}

function  refreshPNG(thisDOM) {
    var t = new Date().getTime();
    thisDOM.src = "/login/png?"+t;
}

// 根据身份证号码确定性别和出生日期
function ParsePaperNO() {
    var year = "", month = "", day = "";
    var DocumentTypeDDL = document.getElementById("MainIssues_InsureIdType");
    var Document_Number = document.getElementById("MainIssues_InsureIdNumber");
    if (DocumentTypeDDL.value == null) { return false; }
    if (DocumentTypeDDL.value == "") { return false; }
    if (Document_Number.value == null) { return false; }
    if (Document_Number.value == "") { return false; }
    if (DocumentTypeDDL.options[DocumentTypeDDL.selectedIndex].text == "身份证") {
        if (Document_Number.value.length == 18) {
            temps = Document_Number.value.split("");
            year = temps[6] + temps[7] + temps[8] + temps[9];
            month = temps[10] + temps[11];
            day = temps[12] + temps[13];
            if (parseInt(Document_Number.value.charAt(16) / 2) * 2 == Document_Number.value.charAt(16)) {
                document.getElementById("MainIssues_InsureSex_1").checked = true;
            }
            else {
                document.getElementById("MainIssues_InsureSex_0").checked = true;
            }
        }
        if (Document_Number.value.length == 15) {
            temps = Document_Number.value.split("");
            year = parseInt("19", 10) + temps[6] + temps[7];
            month = temps[8] + temps[9];
            day = temps[10] + temps[11];
            if (parseInt(Document_Number.value.charAt(14) / 2) * 2 == Document_Number.value.charAt(14)) {
                document.getElementById("MainIssues_InsureSex_1").checked = true;
            }
            else {
                document.getElementById("MainIssues_InsureSex_0").checked = true;
            }
        }
        if (year != "" && month != "" && day != "") {
            document.getElementById("MainIssues_InsureBirthDate").value = year + "-" + month + "-" + day;
            //SetBeInsuredStyle();
        }
        document.getElementById("MainIssues_InsurePhone").focus();
    }

    return true;
}


 // 根据身份证号码确定性别和出生日期
function ParsePaperNO2() {
    var year = "", month = "", day = "";
    var DocumentTypeDDL = document.getElementById("MainIssues_BeInsureIdType");
    var Document_Number = document.getElementById("MainIssues_BeInsureIdNumber");
    if (DocumentTypeDDL.value == null) { return false; }
    if (DocumentTypeDDL.value == "") { return false; }
    if (Document_Number.value == null) { return false; }
    if (Document_Number.value == "") { return false; }
    if (DocumentTypeDDL.options[DocumentTypeDDL.selectedIndex].text == "身份证") {
        if (Document_Number.value.length == 18) {
            temps = Document_Number.value.split("");
            year = temps[6] + temps[7] + temps[8] + temps[9];
            month = temps[10] + temps[11];
            day = temps[12] + temps[13];
            if (parseInt(Document_Number.value.charAt(16) / 2) * 2 == Document_Number.value.charAt(16)) {
                document.getElementById("MainIssues_BeInsureSex_1").checked = true;
            }
            else {
                document.getElementById("MainIssues_BeInsureSex_0").checked = true;
            }
        }
        if (Document_Number.value.length == 15) {
            temps = Document_Number.value.split("");
            year = parseInt("19", 10) + temps[6] + temps[7];
            month = temps[8] + temps[9];
            day = temps[10] + temps[11];
            if (parseInt(Document_Number.value.charAt(14) / 2) * 2 == Document_Number.value.charAt(14)) {
                document.getElementById("MainIssues_BeInsureSex_1").checked = true;
            }
            else {
                document.getElementById("MainIssues_BeInsureSex_0").checked = true;
            }
        }
        if (year != "" && month != "" && day != "") { 
            document.getElementById("MainIssues_BeInsureBirthDate").value = year + "-" + month + "-" + day; 
        }
        document.getElementById("MainIssues_Relationship").focus();
    }
    return true;
}

 function PromptTodayAsingleNumber() {
    var memberId = document.getElementById("MainIssues_CurrentMemberId").value;
    var servicesId = document.getElementById("MainIssues_CurrentServiceId").value;
    var userName = document.getElementById("MainIssues_InsureUser").value;
    var idNumber = document.getElementById("MainIssues_InsureIdNumber").value;

    if (memberId == "" || servicesId == "" || userName == "" || idNumber == "") return;

    var WCF_CommonService = new CommonService();

    WCF_CommonService.PromptTodayAsingleNumber(memberId, servicesId, userName, idNumber, OnPromptTodayAsingleNumber);
}
function OnPromptTodayAsingleNumber(result) {
    document.getElementById("MainIssues_labPrompt").innerText = result;
}
function Submiting(obj) {
    var val = confirm('确定要提交吗？');

    if (val) {
        setTimeout("document.getElementById('" + obj.id + "').setAttribute('disabled','disabled');", 1);
        setTimeout("document.getElementById('" + obj.id + "').setAttribute('innerText','正在提交，请稍候...');", 1);
        setTimeout("document.getElementById('BottomIssues_btnReset').setAttribute('disabled','disabled');", 1);
    }

    return val;
}
function Extracting(obj) {
    setTimeout("document.getElementById('" + obj.id + "').setAttribute('disabled','disabled');", 1);
    setTimeout("document.getElementById('" + obj.id + "').setAttribute('innerText','正在提取，请稍候...');", 1);
}
function SetBeInsuredStyle() {
    var BirthDate = document.getElementById("MainIssues_InsureBirthDate").value;
    var NeedBeInsured = document.getElementById("MainIssues_NeedBeInsured").value;
    var InsuredAge = GetAges(BirthDate);
    if (NeedBeInsured == "1" && InsuredAge < 18) {
        if (document.getElementById("BeInsureInfo").style.display == "none") {
            document.getElementById("BeInsureInfo").style.display = "block";
        }
    } else {

        if (document.getElementById("BeInsureInfo").style.display == "block") {
            document.getElementById("BeInsureInfo").style.display = "none";
            document.getElementById("MainIssues_BeInsureUser").value = "";
            document.getElementById("MainIssues_BeInsureIdNumber").value = "";
            document.getElementById("MainIssues_BeInsureBirthDate").value = "";
        }
    }
}


function ParseDate(str) {
    if (str == null || str == "") return;
    if(str.match(/^\d{4}[\-\/\s+]\d{1,2}[\-\/\s+]\d{1,2}$/)){
        return new Date(str.replace(/[\-\/\s+]/i,'/'))
    }else if(str.match(/^\d{8}$/)){
        return new Date(str.substring(0,4)+'/'+str.substring(4,6)+'/'+str.substring(6))
    }
}
function GetAges(str) {
    var age;
    var aDate=new Date();
    var thisYear=aDate.getFullYear();
    var thisMonth=aDate.getMonth()+1;
    var thisDay=aDate.getDate();
    var brith = ParseDate(str);
    brithy=brith.getFullYear();
    brithm=brith.getMonth()+1;
    brithd=brith.getDate();
    if(thisYear-brithy<0)
    {
        return 18;
    }
    else
    {
        if(thisMonth-brithm<0)
        {
            age = thisYear-brithy-1;
        }
        else
        {
            if(thisDay-brithd>=0)
            {
                age = thisYear-brithy;
            }
            else
            {
                age = thisYear-brithy-1;
            }
        }
    }
    return age;
}


