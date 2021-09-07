const socket = io();
//Random ID that our questions will have
let myid = Math.floor(Math.random() * 10000);

//Current chat open on-screen
let currentUser ="";

socket.on('identification', () =>{

    $.ajax({
        url:"/identification",
        dataType:'json',
        type:'post',
        data:{
            id: socket.id
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
                if(id==myid){
                    $('#'+id).remove();
                    newMsg(1,result);
                    return
                }

            newMsg(0,result);
        },
        complete:function(result){
            console.log(result)
        }
    })

    
})

socket.on('recieveFriends', (relations) => {
    relations.forEach( relation => genNewChat(relation));
    loadChat(relations[0])
})

function sendMsg(){
    let msg = $('#textBox').val();
    if(!msg.trim().length)
        return;

    $('#textBox').val("")
    newMsg(1,{"msg":msg},1,myid);

    $.ajax({
        url:"/sendMessage",
        dataType:"text",
        type: "post",
        data:{
            msg,
            reciever: currentUser,
            id: myid
        }
    })
}

//Creates a new message in the chat
function newMsg(user, data, valor, id){

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
    lbl.text(data["msg"])
    text.append(lbl);

    let chat = $("#chat_"+data["user"]);
    let chatBox = $("#"+data["user"]);

    // TODO: add a notification appearence to the rectangle
    chatBox.insertBefore($(".chatRectangle").first());

    //TODO: change this length based on the screen size
    if(data["msg"].length>25)
        data["msg"] = data["msg"].substr(0,25)+"...";
    chatBox.find(".text").text(data["msg"]);

    chat.find(".messagesDiv").append(text);

    chat.find(".messagesDiv").scrollTop(chat.find(".messagesDiv").prop("scrollHeight"));
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
    rectangle.click(() => loadChat(relation))
    rectangle.attr("id",""+relation);
    rectangle.css("display","inline-flex")

    let text = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    rectangle.find(".text").text(text.substr(0,30)+"...");

    rectangle.find(".nameUser").text(""+relation);
    rectangle.appendTo(".chatList");
}

function loadChat(user){

    let rectangle =$("#baseChat").find(".nameUser").text();
    currentUser=user;

    let chat = $(".chatBody").find("#chat_"+user)
    if(!chat.length){
        createChat(user);
        return;
    }

    $(".chatBody").find(".currentChat").css("display","none");
    chat.css("display","block");
}

function createChat(user){

    let newChat = $("#baseCurrChat").clone();
    newChat.attr("id", "chat_"+user);
    newChat.appendTo(".chatBody");

    loadChat(user);

}