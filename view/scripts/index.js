const socket = io();

// TODO: somehow change this ID so I can more accurately know who
// sent the message
//Random ID that our questions will have
let myid = Math.floor(Math.random() * 10000);

//Current chat open on-screen
let currentUser ="";

let onlineFriends =0;

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


// Messages responsible for checking if an user is
// online or not, they are notified as soon as a person
// enters or leaves the chat
socket.on('roomJoined', (user)=>{
    $("#"+user).find(".dot").css("display","flex");
    $("#conversasBtn").text('Conversas ('+(++onlineFriends)+')')
})

socket.on('roomLeft', (user)=>{
    $("#"+user).find(".dot").css("display","none");
    $("#conversasBtn").text('Conversas ('+(--onlineFriends)+')')
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

// Recieves all friends and generate the chat for each one of them
socket.on('recieveFriends', (relations, onlineStatus, requests) => {
    relations.forEach( (relation, index) => genNewChat(relation,onlineStatus[index]));
    requests.forEach(request => genNewRequest(request))
    loadChat(relations[0])
    $("#conversasBtn").text('Conversas ('+(onlineFriends)+')')
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

// Creates a new message in the chat and puts the rectangle on the left
// at the top of the list (since it's the newest message)
function newMsg(user, data, valor, id){

    if (id==undefined){
        id = " " 
    }

    if(valor==undefined)
        valor=''
    else
        valor='opacity:0.25'

    let type=""
    let prefix = ""
    switch(user){
        case 0:
            type="messageServer"
            break;
        case 1:
            type="messageClient"
            prefix = "Você: "
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
    chatBox.insertBefore($("#chats").find(".chatRectangle").first());

    //TODO: change this length based on the screen size
    data["msg"]= prefix+data["msg"]
    if(data["msg"].length>22)
        data["msg"] = (data["msg"]).substr(0,22)+"...";
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
// Creates the chat rectangle
function genNewChat(relation, onlineStatus){
    let rectangle =$("#baseChat").clone();
    rectangle.click(() => loadChat(relation))
    rectangle.attr("id",""+relation);
    rectangle.css("display","flex")
    
    rectangle.find(".text").text("");

    rectangle.find(".nameUser").text(""+relation);

    if(onlineStatus){
        rectangle.find(".dot").css("display","flex");
        onlineFriends++;
    }
        
    rectangle.appendTo("#chats");
}

function genNewRequest(request){
    let rectangle =$("#baseRequest").clone();
    rectangle.attr("id",""+request);
    rectangle.css("display","flex")
    rectangle.find(".text").text("Deseja conversar!");
    rectangle.find(".nameUser").text(""+request);
    rectangle.find("#confirmBtn").attr("onclick","acceptFriendRequest('"+request+"')")
    rectangle.find("#denyBtn").attr("onclick","denyFriendRequest('"+request+"')")
    rectangle.appendTo("#requests");
}

function loadChat(user){

    let rectangle = $("#"+user);
    currentUser=user;

    let chat = $(".chatBody").find("#chat_"+user)
    if(!chat.length){
        createChat(user);
        return;
    }

    $(".chatBody").find(".currentChat").css("display","none");
    $(".chatRectangle").css("background-color","white")
    rectangle.css("background-color","rgb(226, 226, 226)")
    chat.css("display","block");
}

function acceptFriendRequest(user){
    
    // POST
    $.ajax({
        url:"/acceptRequest",
        type:'post',
        data:{
            sender:user
        },
        success: () => {
            alert("Convite aceito!")
            $("#requests").find("#"+user).remove()
        },
        error: ()=>{
            alert('Um erro ocorreu! Tente novamente mais tarde.')
        }

    })
    
}

function denyFriendRequest(user){
    
    $.ajax({
        url:"/denyRequest",
        type:'post',
        data:{
            sender:user
        },
        success: () => {
            $("#requests").find("#"+user).remove()
        },
        error: ()=>{
            alert('Um erro ocorreu! Tente novamente mais tarde.')
        }

    })
    
}

//Creates the chat where all the messages will reside
function createChat(user){

    let newChat = $("#baseCurrChat").clone();
    newChat.attr("id", "chat_"+user);
    newChat.appendTo(".chatBody");

    loadChat(user);

}

// Switches the menu on the left side
function switchMenu(menu){
    if(menu){
        $("#requests").css("display","none");
        $("#chats").css("display","block");
        $("#conversasBtn").css("background-color","rgb(70, 82, 107)");
        $("#requestsBtn").css("background-color","rgb(85,101,132)");
    }else{
        $("#chats").css("display","none");
        $("#requests").css("display","block");
        $("#requestsBtn").css("background-color","rgb(70, 82, 107)");
        $("#conversasBtn").css("background-color","rgb(85,101,132)");
    }
        
}

function sendFriendRequest(event){

    event.stopPropagation();
    if($("#addInput").val()!=''){
        // POST
        $.ajax({
            url:"/friendRequest",
            type:'post',
            data:{
                reciever: $("#addInput").val()
            },
            success: () => {
                alert("Pedido de amizade enviado!")
                $("#addInput").val('');
                $("#addInput").css("display","none");
                $("#addBtn").css("display","none");
                $("#addText").css("display","block");
            },
            error: ()=>{
                alert('Um erro ocorreu! Tente novamente mais tarde.')
            }

        })
    }
}