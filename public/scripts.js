//We have used defer in the front end so we need not to use the ready callback function here

const socket = io()

//Initialliy the message box is hidden
$('#userVerifyBox').show()
$('#messageBox').hide()

//As soon as user login and we receive a success msg
$('#login').click(() => {

    //Send the login request ot the server with the username and password
    socket.emit('loginReq',{
        user : $('#userName').val(),
        password : $('#password').val()
    })

})

//Login success 
socket.on('loginRes',(data) => {
    if(data.succ == "Success"){
        $('#userVerifyBox').hide()
        $('#messageBox').show()
    }
    else{
        window.alert("Password don't match")
    }
})

//Messages send
$('#sendBtn').click(() => {
    
    socket.emit('msgReq',{
        user : $('#user').val(),
        msg : $('#msg').val()
    })

    $('#user').val('')
    $('#msg').val('')
})

socket.on('msgRes',(data) => {
    //Append the msg to the list
    const listmsg = $('#listMsg')

    const newMsg = $('<li>').addClass('list-group-item').text(data.userFrom + " : " + data.msg)
    listmsg.append(newMsg)
})