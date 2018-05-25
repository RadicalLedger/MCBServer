$(document).ready(function() {
$( "#viewChallengeBtn" ).click(function() {
  
});

});


function initAttendedUserDataGrid()
{
$.fn.dataTable.ext.errMode = 'none';
var table = $("#userlistattended").dataTable({
  "pageLength": 50,
  columns: [
    { data: "uportId",title: "Action","render": function(data, type, row, meta){
      if(type === 'display' && data!=undefined ){
        if(row.isEntered)
        {
           data='<p style="color:red;margin:0">Registered</p>'
        }
        else{
          data = '<button type="button"  onClick="handleEnter(\''+data+'\')" class="btn btn-primary btn-sm">Enter</button>';
 
        }
       }
      return data;
   } },
      { data: "firstName",title: "First Name" },
      { data: "lastName",title: "Last Name" },
      { data: "email",title: "Email" },
      { data: "gender",title: "Gender" },
      { data: "birthday",title: "B'Day" },
      { data: "userCategory",title: "Job Role" },
      { data: "mobile",title: "Phone" },
      { data: "foodtype",title: "Food Type" },
      { data: "tShirtSize",title: "Shirt Size" },
      { data: "isEntered",title: "Has Entered" },
      { data: "contractAddress",title: "Contract Address","render": function(data, type, row, meta){
        if(type === 'display' && data!=undefined ){
            data = '<a target="_blank" href="https://rinkeby.etherscan.io/address/' + data + '">' + data + '</a>';
        }
        return data;
     } },
  ],
  "scrollX": true,
  ajax:{"url":'/api/user/attended',"dataSrc":""}
});
}

function initAllUserDataGrid()
{
$.fn.dataTable.ext.errMode = 'none';
var table = $("#userlist").dataTable({
  "pageLength": 50,
  columns: [
      { data: "firstName",title: "First Name" },
      { data: "lastName",title: "Last Name" },
      { data: "email",title: "Email" },
      { data: "gender",title: "Gender" },
      { data: "birthDay",title: "B'Day" },
      { data: "jobRole",title: "Job Role" },
      { data: "phone",title: "Phone" },
      { data: "foodtype",title: "Food Type" },
      { data: "tShirtSize",title: "Shirt Size" },
  ],
  "scrollX": true,
  ajax:{"url":'/api/user/all',"dataSrc":""}
});
}

function format ( d ) {
  // `d` is the original data object for the row
  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
      '<tr>'+
          '<td>Full name:</td>'+
          '<td>'+d.name+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>Extension number:</td>'+
          '<td>'+d.extn+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>Extra info:</td>'+
          '<td>And any further details here (images etc)...</td>'+
      '</tr>'+
  '</table>';
}
function initLeaderBoardGrid()
{
$.fn.dataTable.ext.errMode = 'none';
var table = $("#leaderBoard").dataTable({
  "pageLength": 100,
  "order": [[ 4, "desc" ]],
     columns: [
     
      { data: "uportId",title: "UPort  Id" },
      { data: "firstName",title: "First Name" },
      { data: "lastName",title: "Last Name" },
      { data: "email",title: "Email" },
    //  { data: "tokenBalance",title: "Claim Tokens" },
      ///{ data: "gameTokenBalance",title: "Game Tokens" },
      //{ data: "__v",title: "Game Transaction Count" },
      { data: "gender",title: "Token Total" },
    //   { title: "Total Tokens","render": function(data, type, row, meta){
    //     if(type === 'display' && row!=undefined ){
    //      if(row.email=='wvd.51461@gmail.com')
    //      {
    //       row['tokenBalance']=10
    //      }
    //      data=(row['tokenBalance']?row['tokenBalance']:0)+(row['gameTokenBalance']?row['gameTokenBalance']:0);
    //      }
    //     return data;
    //  } },
     
   //  { data: "mobile",title: "Mobile" },
  ],
  "scrollX": true,
  ajax:{"url":'/api/user/leaderboard',"dataSrc":""}
});
}
function openUportPopup()
{
var uportconnect = window.uportconnect;

    const uport = new uportconnect.Connect('Google I/O Sri Lanka', {
      clientId: '2ognhKvk9UmGBDFXtDiFHiWasVzdmFHWbDT',
      network: 'rinkeby',
      signer: uportconnect.SimpleSigner('c74a56676f1a79ef70066bcee87868e8c297e91d51efbb782065a29fb5ec9386')
    })

    // Request credentials to login
    uport.requestCredentials({
      requested: ['name', 'phone', 'country'],
      notifications: false
    },function(uri)
  {
    qr=kjua({
      text:uri,
      fill:'#000000',
      size:400,
      back:'rgba(255,255,255,1)'
    })
    $('#uportQrModal').modal('show');
    $('#uportQrModalBody').html('');
    $('#uportQrModalBody').append(qr);
  })
    .then((credentials) => {
      $('#uportQrModal').modal('hide');
      handleEnter(credentials.address);
    })


}

function handleEnter(userCode)
{
  $('#successModalBody').html('');
  //$('#successModalBody').append('<i">loading your data..</i>') 
  $('#enterbutton').hide()
    $('#detailenterlabel').hide()
  
  $('body').loading();
  $.ajax({
    url: "/eventuser/entered?usercode="+userCode+"&codetype=uport",
    cache: false,
    success: function(resultData){
      $('#successModal').modal('show');
      onEnterResult(resultData);
      $('body').loading('stop');
    },
    error:function(data)
    {
      $('body').loading('stop');
      showServerMessage('Error',data.responseText)
    }
  });
}
function showServerMessage(title,message)
{
 
 $('#serverMessageModalTitle').html('');
 $('#serverMessageModalBody').html('');
 $('#serverMessageModalTitle').append(title);
 $('#serverMessageModalBody').append(message);
 $('#serverMessageModal').modal('show');
}
function onEnterResult(resultData)
{
  console.log(resultData);
  $('#successModalBody').html('');
  popupHtml='<div class="row"><div class="col-sm-6" style="padding-top:10%;padding-bottom:10%"> '+
  '<h1 id="detail-fields" style="font-size:50px;font-style:bold" class="display-4">'+toTitleCase(resultData.firstName+' '+resultData.lastName)+'</h1>'
 // +'<h1 id="detail-fields"><span id="detail-id">'+resultData.mobile+'</span></h1>'
 + '<h1 id="detail-fields" class="display-4">'+toGender(resultData.gender)+'</h1></div>'
// + (resultData.isEntered?'<h1 id="detail-fields" style="color:green" class="display-4">Entered</h1></div>':'</div>')

  +'<div class="col-sm-6" ><div class="detail-tshirt">'
     + '<img id="tshirt" height="250px" src="/images/tshirt.png" alt="tshirt">'

     + '<h1 id="detail-fields" >'+toShirtSize(resultData.tShirtSize)+'</h1>'
   +' </div> </div> </div>';
   if(resultData.isEntered)
   {
    $('#enterbutton').hide()
    $('#detailenterlabel').show()
    $( "#enterbutton").unbind( "click" );
   }
   else{
    $('#enterbutton').show()
    $('#detailenterlabel').hide()
    $( "#enterbutton").unbind( "click" );
    $('#enterbutton').on('click',function(){
      $('body').loading();
      $.ajax({
        url: "/eventuser/markentered?usercode="+resultData.uportId+"&codetype=uport",
        cache: false,
        success: function(resultData){
          onEnterResult(resultData);
          $('body').loading('stop');
        },
        error:function(err)
        {
          $('body').loading('stop');
        }
      });

    });
   }

  $('#successModalBody').append(popupHtml)
}
function toShirtSize(size)
{
  size=size?size.toLowerCase():'N/A';
  result=size;
  switch(size)
  {
    case 'm':
    result='Medium';
    break;
    case 'l':
    result='Large';
    break;
    case 's':
    case 'sm':
    result='Small';
    break;
  }
  return result;
}
function toGender(gender)
{
  gender=gender?gender.toLowerCase():'N/A';
  result=gender;
  switch(gender)
  {
    case 'm':
    result='Male';
    break;
    case 'f':
    result='Female';
    break;
  }
  return result;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function initQRScan()
{
  let scanner = new Instascan.Scanner({ video: document.getElementById('preview') ,mirror:false});
      scanner.addListener('scan', function (content) {
        console.log('USER MNID:'+content);
        handleEnter(content);
        scanner.stop();
        $('#videoPreviewModal').modal('hide');
      });
      Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
          $('#videoPreviewModal').modal('show');
          scanner.start(cameras.length==2?cameras[1]:cameras[0]);
          $('#videoPreviewModal').unbind('hidden');
          $('#videoPreviewModal').on('hide.bs.modal', function () {
            scanner.stop();
        })
        } else {
          console.error('No cameras found.');
        }
      }).catch(function (e) {
        console.error(e);
      });



}