const socket = io();

socket.on('identification', () =>{

    $.ajax({
        url:"/identification",
        dataType:'json',
        type:'post',
        data:{
            id: socket.id
        },
        success: () =>{
            //  TODO: Load other chats
        },
        complete: () =>{

        }
    })
})

socket.on('recieveMsg', (msg,id,room) =>{
    $.ajax({
        url:"/decodeMessage",
        dataType:"json",
        type:"post",
        data:{
            encMessage: msg,
            room: room
        },
        success:function(result){
            // TODO: find out if the message sent was the user's
            newMsg(0,result+'');
        },
        complete:function(result){
            console.log(result)
        }
    })

    
})


//Creates a new message in the chat
function newMsg(user, msg, valor){

    if(valor==undefined)
        valor=''
    else
        valor='opacity:0.25'
    let type=""
    switch(user){
        case 0:
            type="messageServer"
            break;
        case 1:
            type="messageClient"
            break;
        default:
            return;
    }
    var text = $("<div class='"+type+"' style='"+valor+"'><div>");
    var lbl = $("<label class='lblText'></label>");
    lbl.text(msg)
    text.append(lbl);

    $(".messagesDiv").append(text);
}

//Placeholder login function
function postLogin(){

    let user = $('#login').val()
    let pwd = $('#pass').val()

    $.ajax({
        url:"/login",
        dataType:"json",
        type:"post",
        data:{
            nome: user,
            senha: pwd
        },
        success:function(result){

        },
        complete:function(result){
            console.log(result)
        }
    })
}
