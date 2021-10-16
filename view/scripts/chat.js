const socket = io();

//Random ID that our questions will have
let myid = Math.floor(Math.random() * 10000);

// Object that saves all messages the user has sent and havent recieved a confirmation
let idTable = {}

//Current chat open on-screen
let currentUser ="";

let onlineFriends =0;
let chatCount=0;

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

socket.on("disconnect", () => {
    window.location.href = "/disconnected";
  });

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
                if(idTable[""+id]){
                    $('#'+id).remove();
                    delete idTable[""+id];
                    newMsg(1,result);
                    return
                }

            newMsg(0,result);
        },
        complete:function(result){
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

    // We generate an ID, using a random number, the message's last digit and putting
    // the chat index at the last digit
    myid = CryptoJS.MD5(msg.slice(msg.length-1)+Math.floor(Math.random() * 10000));
    while(idTable[""+myid]){
        myid = CryptoJS.MD5(msg+Math.floor(Math.random() * 10000));
    }
    let thisID = myid+""+$("#"+currentUser).attr("value");
    idTable[""+thisID] = true

    $('#textBox').val("")
    newMsg(1,{"msg":msg,"user":currentUser},1,thisID);

    $.ajax({
        url:"/sendMessage",
        dataType:"text",
        type: "post",
        data:{
            msg,
            reciever: currentUser,
            id: thisID
        },error:()=>{
            // If the message could not be sent for any reason, show an error
            let message = $("#chat_"+currentUser).find("#"+thisID)
            message.css("background-color","red")
            message.css("opacity","1")
            message.append('<svg version="1.1" id="icons_1_" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128;width: 30px; margin: 3%;" class="filter-white" xml:space="preserve"><style>.st0{display:none}.st1{display:inline}.st2{fill:#0a0a0a}</style><g id="row1_1_"><g id="_x33__2_"><path class="st2" d="M64 32.2c-4.4 0-8 3.3-8 7.3v24.8c0 4.1 3.6 7.3 8 7.3s8-3.3 8-7.3V39.5c0-4.1-3.6-7.3-8-7.3zM64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7s57.6 25.7 57.6 57.3c0 31.7-25.8 57.3-57.6 57.3zm0-40.1c-4.4 0-8 3.3-8 7.3s3.6 7.3 8 7.3 8-3.3 8-7.3-3.6-7.3-8-7.3z" id="alert_transparent"/></g></g></svg>')
            delete idTable[""+thisID];
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

     let search = $(".chatBody").find("#chat_"+data["user"])
     if(!search.length){
         createChat(data["user"]);
     }

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

function logout(){
    $.ajax({
        url:"/logout",
        type:"post",
        success:()=>{
            window.location.href = "/disconnected";
        }
    })
}
// Creates the chat rectangle
function genNewChat(relation, onlineStatus){
    let rectangle =$("#baseChat").clone();
    rectangle.click(() => loadChat(relation))
    rectangle.attr("id",""+relation);
    rectangle.css("display","flex")
    
    rectangle.find(".text").text("");
    rectangle.attr("value",chatCount++);

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
        chat = createChat(user);
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

    return newChat;

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

// Sends message on enter press
$("#textBox").keydown(function(e){
    if (e.keyCode == 13 && !e.shiftKey){   
        e.preventDefault();
        sendMsg();
    }
});