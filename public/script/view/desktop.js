var notificationAlert = new Vue({
    el: '#notification-alert',
    data: {
      message: "new message",
      visible: "collapse",
      show: true,
      open: "20vw",
      color: "green"
    }
  })
  
  var notificationSign = new Vue({
    el: '#notification-sign',
    data: {
      unread: 20,
      color: "crimson"
    }
  })
  
  var profile = new Vue({
    el: '#profile-bar',
    data: {
      name: "รณกร ดวงจันทร์โชติ",
      position: "Admin"
  
    }
  })