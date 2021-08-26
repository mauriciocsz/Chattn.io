const socket = io();

let myid = Math.floor(Math.random() * 10000);

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
                //alert(id+" "+myid)
                if(id==myid){
                    $('#'+id).remove();
                    newMsg(1,result+'');
                    return
                }

            newMsg(0,result+'');
        },
        complete:function(result){
            console.log(result)
        }
    })

    
})

socket.on('recieveFriends', (relations) => {
    relations.forEach( relation => genNewChat(relation));
})

function sendMsg(){
    let msg = $('#textBox').val();



    if(!msg.trim().length)
        return;
    let user = $('#user').val();

    $('#textBox').val("")

    newMsg(1,msg,1,myid);

    $.ajax({
        url:"/sendMessage",
        dataType:"text",
        type: "post",
        data:{
            msg,
            reciever: user,
            id: myid
        }
    })
}


//Creates a new message in the chat
function newMsg(user, msg, valor, id){

    if (id==undefined){
        id = " " 
    }

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
    var text = $("<div id='"+id+"'class='"+type+"' style='"+valor+"'><div>");
    var lbl = $("<label class='lblText'></label>");
    lbl.text(msg)
    text.append(lbl);

    $(".messagesDiv").append(text);

    var div = $('.messagesDiv');
    div.scrollTop(div.prop("scrollHeight"));
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

function logout(){
    $.ajax({
        url:"/logout",
        dataType:"json",
        type:"post"
    })
}

function genNewChat(relation){
    let rectangle =$("#baseChat").clone();
    rectangle.click(() => alert('Placeholder action'))
    rectangle.attr("id",""+relation);
    rectangle.css("display","inline-flex")

    let text = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    rectangle.find(".text").text(text.substr(0,30)+"...");

    rectangle.find(".nameUser").text(""+relation);
    rectangle.appendTo(".chatList");
}