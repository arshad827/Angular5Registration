
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $('#content').toggleClass('contentmove_left');
    console.log('hit!')
  });
});

